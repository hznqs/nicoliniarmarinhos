"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const CompanySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome da empresa é obrigatório"),
  document: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable().or(z.literal('')),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  aboutText: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable().or(z.literal('')),
  faviconUrl: z.string().optional().nullable().or(z.literal('')),
})

export async function getCompanySettings() {
  try {
    const company = await prisma.company.findFirst()
    return { success: true, data: company }
  } catch (error) {
    console.error("[getCompanySettings]", error)
    return { success: false, error: "Falha ao buscar configurações da empresa" }
  }
}

export async function saveCompanySettings(data: z.infer<typeof CompanySchema>) {
  await requireAdmin()

  const parsed = CompanySchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  // Sanitiza strings vazias para o Prisma
  const payload = { ...parsed.data }
  Object.keys(payload).forEach(key => {
    if ((payload as any)[key] === "") {
      (payload as any)[key] = null
    }
  })

  try {
    let result
    if (payload.id) {
      result = await prisma.company.update({
        where: { id: payload.id },
        data: payload
      })
    } else {
      // Cria o primeiro registro
      result = await prisma.company.create({
        data: payload
      })
    }
    
    revalidatePath("/", "layout") // Invalida o cache do Header em todo o site
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[saveCompanySettings]", error)
    return { success: false, error: "Falha ao salvar configurações" }
  }
}
