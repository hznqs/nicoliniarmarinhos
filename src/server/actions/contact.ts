"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { checkRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { LeadStatus } from "@prisma/client"

const ContactSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres"),
})

export async function submitContact(data: z.infer<typeof ContactSchema>) {
  // 1. Rate Limiting (anti-spam)
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "unknown_ip"
  
  // Limita a 3 envios por hora por IP
  const rateLimitResult = await checkRateLimit(`contact_${ip}`, 3, 3600)
  
  if (!rateLimitResult.success) {
    return { 
      success: false, 
      error: "Muitas tentativas. Por favor, tente novamente mais tarde." 
    }
  }

  // 2. Validação de dados
  const parsed = ContactSchema.safeParse(data)
  if (!parsed.success) {
    return { 
      success: false, 
      error: "Dados inválidos", 
      details: parsed.error.flatten() 
    }
  }

  // 3. Salva no banco de dados como Lead
  try {
    await prisma.lead.create({ 
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        source: "Contato via Site: " + parsed.data.message.substring(0, 500),
        status: LeadStatus.NEW
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error("[submitContact]", error)
    return { success: false, error: "Falha ao enviar mensagem. Tente novamente." }
  }
}
