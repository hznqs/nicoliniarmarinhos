"use server"

import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function syncGoogleReviews() {
  await requireAdmin()

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return {
      success: false,
      error: "Credenciais da API do Google não configuradas no servidor.",
    }
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&language=pt-BR&key=${apiKey}`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // "Referer": "http://localhost:3000",
      }
    })

    const data = await response.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("[syncGoogleReviews] Erro da API do Google:", data)
      return { success: false, error: `Erro na API do Google: ${data.status} - ${data.error_message || ""}` }
    }

    const reviews = data.result?.reviews || []
    
    // Filtrar avaliações de 4 estrelas ou mais e que tenham texto
    const bestReviews = reviews.filter((r: any) => r.rating >= 4 && r.text && r.text.trim().length > 0)

    let addedCount = 0

    for (const review of bestReviews) {
      const existing = await prisma.testimonial.findFirst({
        where: {
          name: review.author_name,
          content: review.text,
        }
      })

      if (!existing) {
        await prisma.testimonial.create({
          data: {
            name: review.author_name,
            role: "Cliente Google",
            content: review.text,
            rating: review.rating,
            isApproved: true,
            createdAt: new Date(review.time * 1000) 
          }
        })
        addedCount++
      }
    }

    revalidatePath("/admin/testimonials")
    revalidatePath("/")

    return { 
      success: true, 
      message: `Sincronização concluída! ${addedCount} nova(s) avaliação(ões) importada(s).` 
    }

  } catch (error) {
    console.error("[syncGoogleReviews]", error)
    return { success: false, error: "Falha interna ao sincronizar avaliações." }
  }
}
