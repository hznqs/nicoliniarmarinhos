"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const BannerSchema = z.object({
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().min(1, "URL de imagem obrigatória"),
  linkUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
})

export async function getBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
    })
    
    return { success: true, data: banners }
  } catch (error) {
    console.error("[getBanners]", error)
    return { success: false, error: "Falha ao buscar banners" }
  }
}

export async function createBanner(data: z.infer<typeof BannerSchema>) {
  await requireAdmin()

  const parsed = BannerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const result = await prisma.banner.create({ 
      data: parsed.data 
    })
    revalidatePath("/admin/banners")
    revalidatePath("/")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[createBanner]", error)
    return { success: false, error: "Falha ao criar banner" }
  }
}

export async function updateBanner(id: string, data: z.infer<typeof BannerSchema>) {
  await requireAdmin()
  
  const parsed = BannerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const result = await prisma.banner.update({ 
      where: { id },
      data: parsed.data 
    })
    revalidatePath("/admin/banners")
    revalidatePath("/")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[updateBanner]", error)
    return { success: false, error: "Falha ao atualizar banner" }
  }
}

export async function deleteBanner(id: string) {
  await requireAdmin()

  try {
    await prisma.banner.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath("/admin/banners")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("[deleteBanner]", error)
    return { success: false, error: "Falha ao remover o banner" }
  }
}
