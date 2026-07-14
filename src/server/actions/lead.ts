"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { LeadStatus } from "@prisma/client"

const LeadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
})

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" }
    })
    
    return { success: true, data: leads }
  } catch (error) {
    console.error("[getLeads]", error)
    return { success: false, error: "Falha ao buscar leads" }
  }
}

export async function createLead(data: z.infer<typeof LeadSchema>) {
  await requireAdmin()

  const parsed = LeadSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const result = await prisma.lead.create({ 
      data: parsed.data 
    })
    revalidatePath("/admin/leads")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[createLead]", error)
    return { success: false, error: "Falha ao criar lead" }
  }
}

export async function updateLead(id: string, data: z.infer<typeof LeadSchema>) {
  await requireAdmin()
  
  const parsed = LeadSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const result = await prisma.lead.update({ 
      where: { id },
      data: parsed.data 
    })
    revalidatePath("/admin/leads")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[updateLead]", error)
    return { success: false, error: "Falha ao atualizar lead" }
  }
}

export async function deleteLead(id: string) {
  await requireAdmin()

  try {
    await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[deleteLead]", error)
    return { success: false, error: "Falha ao remover o lead" }
  }
}
