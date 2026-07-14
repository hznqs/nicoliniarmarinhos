"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const ProductSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  slug: z.string().min(1, "O slug é obrigatório"),
  description: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
  price: z.coerce.number().min(0, "O preço deve ser positivo"),
  oldPrice: z.coerce.number().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Estoque inválido"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  imageUrl: z.string().optional().nullable(),
})

export async function getProducts() {
  await requireAdmin()
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, alt: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    })
    
    return { 
      success: true, 
      data: products.map(p => ({
        ...p,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        imageUrl: p.images && p.images.length > 0 ? p.images[0].url : null
      })) 
    }
  } catch (error) {
    console.error("[getProducts]", error)
    return { success: false, error: "Falha ao buscar produtos" }
  }
}

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  await requireAdmin()
  
  const parsed = ProductSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const { imageUrl, ...productData } = parsed.data

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: productData })
      if (imageUrl) {
        await tx.image.create({ data: { url: imageUrl, productId: product.id } })
      }
      return product
    })

    revalidatePath("/admin/products")
    revalidatePath("/produtos")

    return {
      success: true,
      data: {
        ...result,
        price: Number(result.price),
        oldPrice: result.oldPrice ? Number(result.oldPrice) : null,
        imageUrl,
      },
    }
  } catch (error) {
    console.error("[createProduct]", error)
    return { success: false, error: "Falha ao criar o produto" }
  }
}

export async function updateProduct(id: string, data: z.infer<typeof ProductSchema>) {
  await requireAdmin()
  
  const parsed = ProductSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const { imageUrl, ...productData } = parsed.data

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({ where: { id }, data: productData })
      if (imageUrl) {
        // Deletar imagem anterior e criar nova — dentro da mesma transação
        await tx.image.deleteMany({ where: { productId: id } })
        await tx.image.create({ data: { url: imageUrl, productId: id } })
      }
      return product
    })

    revalidatePath("/admin/products")
    revalidatePath("/produtos")

    return {
      success: true,
      data: {
        ...result,
        price: Number(result.price),
        oldPrice: result.oldPrice ? Number(result.oldPrice) : null,
        imageUrl,
      },
    }
  } catch (error) {
    console.error("[updateProduct]", error)
    return { success: false, error: "Falha ao atualizar o produto" }
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  try {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
    revalidatePath("/admin/products")
    revalidatePath("/produtos")
    return { success: true }
  } catch (error) {
    console.error("[deleteProduct]", error)
    return { success: false, error: "Falha ao excluir o produto" }
  }
}
