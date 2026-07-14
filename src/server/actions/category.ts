"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const CategorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(1, "O slug é obrigatório"),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
})

export async function getCategories() {
  await requireAdmin()
  try {
    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        parent: {
          select: { name: true }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return { success: true, data: categories }
  } catch (error) {
    console.error("[getCategories]", error)
    return { success: false, error: "Falha ao buscar categorias" }
  }
}

export async function createCategory(data: z.infer<typeof CategorySchema>) {
  await requireAdmin()

  const parsed = CategorySchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const parentIdToSave = parsed.data.parentId === "none" ? null : parsed.data.parentId
    const { parentId, ...restData } = parsed.data

    const result = await prisma.category.create({ 
      data: {
        ...restData,
        ...(parentIdToSave ? { parent: { connect: { id: parentIdToSave } } } : {})
      }
    })
    revalidatePath("/admin/categories")
    revalidatePath("/categorias")
    
    return { success: true, data: result }
  } catch (error: any) {
    console.error("[createCategory]", error)
    return { success: false, error: "Falha ao criar a categoria: " + (error?.message || String(error)) }
  }
}

export async function updateCategory(id: string, data: z.infer<typeof CategorySchema>) {
  await requireAdmin()
  
  const parsed = CategorySchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const parentIdToSave = parsed.data.parentId === "none" ? null : parsed.data.parentId
    const { parentId, ...restData } = parsed.data

    const result = await prisma.category.update({ 
      where: { id },
      data: {
        ...restData,
        ...(parentIdToSave 
             ? { parent: { connect: { id: parentIdToSave } } } 
             : { parent: { disconnect: true } }
           )
      }
    })
    revalidatePath("/admin/categories")
    revalidatePath("/categorias")
    
    return { success: true, data: result }
  } catch (error: any) {
    console.error("[updateCategory]", error)
    return { success: false, error: "Falha ao atualizar a categoria: " + (error?.message || String(error)) }
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin()

  try {
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    revalidatePath("/admin/categories")
    revalidatePath("/categorias")
    return { success: true }
  } catch (error) {
    console.error("[deleteCategory]", error)
    return { success: false, error: "Falha ao remover a categoria" }
  }
}
