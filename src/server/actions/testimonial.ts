"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const TestimonialSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  role: z.string().optional().nullable(),
  content: z.string().min(5, "O depoimento deve ter no mínimo 5 caracteres"),
  avatarUrl: z.string().optional().or(z.literal('')),
  rating: z.coerce.number().min(1).max(5).default(5),
  isApproved: z.boolean().default(false),
})

export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" }
    })
    
    return { success: true, data: testimonials }
  } catch (error) {
    console.error("[getTestimonials]", error)
    return { success: false, error: "Falha ao buscar depoimentos" }
  }
}

export async function createTestimonial(data: z.infer<typeof TestimonialSchema>) {
  await requireAdmin()

  // Converte string vazia para undefined para avatarUrl
  const parsed = TestimonialSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  const payload = {
    ...parsed.data,
    avatarUrl: parsed.data.avatarUrl === "" ? undefined : parsed.data.avatarUrl
  }

  try {
    const result = await prisma.testimonial.create({ 
      data: payload 
    })
    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[createTestimonial]", error)
    return { success: false, error: "Falha ao criar depoimento" }
  }
}

export async function updateTestimonial(id: string, data: z.infer<typeof TestimonialSchema>) {
  await requireAdmin()
  
  const parsed = TestimonialSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  const payload = {
    ...parsed.data,
    avatarUrl: parsed.data.avatarUrl === "" ? undefined : parsed.data.avatarUrl
  }

  try {
    const result = await prisma.testimonial.update({ 
      where: { id },
      data: payload 
    })
    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("[updateTestimonial]", error)
    return { success: false, error: "Falha ao atualizar depoimento" }
  }
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath("/admin/testimonials")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("[deleteTestimonial]", error)
    return { success: false, error: "Falha ao remover o depoimento" }
  }
}
