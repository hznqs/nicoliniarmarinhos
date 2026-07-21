"use server"

import { prisma } from "@/lib/prisma"

/**
 * Incrementa de forma assíncrona o número de visualizações de um produto sem bloquear
 * a renderização SSR/SSG da página principal.
 */
export async function trackProductView(slug: string) {
  try {
    await prisma.product.update({
      where: { slug, isActive: true },
      data: { views: { increment: 1 } },
      select: { id: true } // Seleciona apenas o ID para ser leve
    })
    return { success: true }
  } catch (error) {
    // Falhas silenciosas para não prejudicar a experiência do cliente
    return { success: false }
  }
}
