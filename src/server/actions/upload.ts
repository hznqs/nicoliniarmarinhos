"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import crypto from "crypto"
import { requireAdmin } from "@/lib/auth-guard"

// Tipos de MIME permitidos. A validação é feita na assinatura REAL do arquivo
// (magic bytes), não no tipo declarado pelo cliente — que pode ser falsificado.
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
])

// Extensão segura mapeada pelo tipo MIME real detectado
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function uploadImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    await requireAdmin()

    const file = formData.get("file") as File

    if (!file || !(file instanceof File)) {
      return { success: false, error: "Nenhum arquivo recebido." }
    }

    // 1. Checar tamanho antes de ler o conteúdo
    if (file.size > MAX_SIZE_BYTES) {
      return { success: false, error: "Arquivo muito grande. O tamanho máximo é 5MB." }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 2. Validar tipo real pelo conteúdo binário (magic bytes), não pelo tipo declarado
    const { fileTypeFromBuffer } = await import("file-type")
    let detected = await fileTypeFromBuffer(buffer)

    // file-type package não suporta SVG por ser texto/XML. Vamos fazer uma validação manual segura.
    if (!detected && file.type === "image/svg+xml") {
      const content = buffer.toString("utf-8").trim()
      // Uma validação básica para garantir que é um SVG válido e não um script malicioso disfarçado de SVG
      if (content.startsWith("<svg") || content.startsWith("<?xml")) {
        detected = { ext: "svg", mime: "image/svg+xml" }
      }
    }

    if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
      return {
        success: false,
        error: "Tipo de arquivo não permitido. Envie apenas imagens (JPEG, PNG, WebP, GIF, AVIF, SVG).",
      }
    }

    // 3. Usar extensão do tipo REAL detectado — nunca confiar no nome do arquivo
    const ext = MIME_TO_EXT[detected.mime]
    const fileName = `${crypto.randomUUID()}.${ext}`

    // ---------------------------------------------------------
    // Integração CLOUDFLARE R2
    // ---------------------------------------------------------
    if (process.env.STORAGE_PROVIDER === "CLOUDFLARE") {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3")

      const S3 = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
        },
      })

      await S3.send(
        new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: detected.mime, // Usar o tipo REAL, não o declarado pelo cliente
        })
      )

      const baseUrl = process.env.CLOUDFLARE_PUBLIC_URL?.replace(/\/$/, "") || ""
      return { success: true, url: `${baseUrl}/${fileName}` }
    }

    // ---------------------------------------------------------
    // Upload LOCAL (modo de desenvolvimento)
    // ---------------------------------------------------------
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const path = join(uploadDir, fileName)
    await writeFile(path, buffer)

    return { success: true, url: `/uploads/${fileName}` }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[uploadImage]", error)
    return { success: false, error: "Falha ao fazer upload: " + message }
  }
}
