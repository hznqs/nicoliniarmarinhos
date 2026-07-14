"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  oldPrice: z.number().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, "Category is required"),
})

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")) {
    throw new Error("Unauthorized")
  }

  const parsed = ProductSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Invalid data")
  }

  try {
    const product = await prisma.product.create({
      data: parsed.data
    })
    revalidatePath("/admin/products")
    return { success: true, product }
  } catch (error) {
    return { success: false, error: "Failed to create product" }
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, images: true },
      orderBy: { createdAt: "desc" }
    })
    return products
  } catch (error) {
    return []
  }
}
