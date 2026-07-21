"use server"

import { z } from "zod"
import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const AttributeSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  order: z.number().int().default(0),
})

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
  isHandmade: z.boolean().default(false),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  imageUrl: z.string().optional().nullable(),
  attributes: z.array(AttributeSchema).default([]),
})

function revalidateAll() {
  revalidatePath("/admin/products")
  revalidatePath("/produtos")
  revalidatePath("/artesanal")
}

export async function getProducts() {
  await requireAdmin()
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, alt: true }, take: 1 },
        attributes: { orderBy: [{ key: "asc" }, { order: "asc" }] },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      data: products.map((p) => ({
        ...p,
        price: Number(p.price),
        oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
        imageUrl: p.images && p.images.length > 0 ? p.images[0].url : null,
      })),
    }
  } catch (error) {
    console.error("[getProducts]", error)
    return { success: false, error: "Falha ao buscar produtos" }
  }
}

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  const session = await requireAdmin()

  const parsed = ProductSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const { imageUrl, attributes, ...productData } = parsed.data

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: productData })

      if (imageUrl) {
        await tx.image.create({ data: { url: imageUrl, productId: product.id } })
      }

      if (attributes.length > 0) {
        await tx.productAttribute.createMany({
          data: attributes.map((attr, idx) => ({
            productId: product.id,
            key: attr.key,
            value: attr.value,
            order: attr.order ?? idx,
          })),
        })
      }

      return product
    })


    await prisma.log.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Product",
        entityId: result.id,
        details: `Criou o produto "${result.name}"`,
      }
    })

    revalidateAll()

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
  const session = await requireAdmin()

  const parsed = ProductSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() }
  }

  try {
    const { imageUrl, attributes, ...productData } = parsed.data

    const oldProduct = await prisma.product.findUnique({ where: { id } })

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({ where: { id }, data: productData })

      if (imageUrl) {
        await tx.image.deleteMany({ where: { productId: id } })
        await tx.image.create({ data: { url: imageUrl, productId: id } })
      }

      // Substitui todos os atributos — delete + recreate dentro da transação
      await tx.productAttribute.deleteMany({ where: { productId: id } })

      if (attributes.length > 0) {
        await tx.productAttribute.createMany({
          data: attributes.map((attr, idx) => ({
            productId: id,
            key: attr.key,
            value: attr.value,
            order: attr.order ?? idx,
          })),
        })
      }

      return product
    })

    let diffStr = ""
    if (oldProduct) {
      const changes: string[] = []
      for (const [key, newVal] of Object.entries(productData)) {
        let oldVal = (oldProduct as any)[key]
        
        // Conversão segura para comparação (incluindo Decimals do Prisma)
        const strOld = oldVal !== null && oldVal !== undefined ? oldVal.toString() : "vazio"
        const strNew = newVal !== null && newVal !== undefined ? newVal.toString() : "vazio"
        
        if (strOld !== strNew && oldVal !== undefined) {
          changes.push(`[${key}: ${strOld} ➔ ${strNew}]`)
        }
      }
      if (changes.length > 0) diffStr = `\nAlterações: ${changes.join(', ')}`
    }

    await prisma.log.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Product",
        entityId: result.id,
        details: `Atualizou o produto "${result.name}"${diffStr}`,
      }
    })

    revalidateAll()

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
  const session = await requireAdmin()

  try {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    await prisma.log.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Product",
        entityId: id,
        details: `Excluiu um produto do catálogo`,
      }
    })

    revalidateAll()
    return { success: true }
  } catch (error) {
    console.error("[deleteProduct]", error)
    return { success: false, error: "Falha ao excluir o produto" }
  }
}
