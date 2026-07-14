"use client"

import { useState } from "react"
import { submitContact } from "@/server/actions/contact"
import { toast } from "sonner"

export function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const message = formData.get("message") as string
    
    const result = await submitContact({
      name,
      email,
      phone,
      message
    })

    setLoading(false)

    if (result.success) {
      toast.success("Mensagem enviada com sucesso!")
      const form = document.getElementById("contact-form") as HTMLFormElement
      if (form) form.reset()
    } else {
      toast.error(result.error || "Ocorreu um erro ao enviar sua mensagem.")
    }
  }

  return (
    <form id="contact-form" action={handleSubmit} className="space-y-8">
      <div>
        <input 
          name="name"
          required
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-sans text-base text-on-surface placeholder:text-on-surface-variant/50 transition-colors" 
          placeholder="Seu Nome" 
          type="text"
        />
      </div>
      <div>
        <input 
          name="email"
          required
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-sans text-base text-on-surface placeholder:text-on-surface-variant/50 transition-colors" 
          placeholder="Seu E-mail" 
          type="email"
        />
      </div>
      <div>
        <input 
          name="phone"
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-sans text-base text-on-surface placeholder:text-on-surface-variant/50 transition-colors" 
          placeholder="Seu Telefone / WhatsApp (Opcional)" 
          type="tel"
        />
      </div>
      <div>
        <textarea 
          name="message"
          required
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-sans text-base text-on-surface placeholder:text-on-surface-variant/50 transition-colors resize-none" 
          placeholder="Sua Mensagem" 
          rows={4}
        ></textarea>
      </div>
      <button 
        disabled={loading}
        className="w-full bg-[#0D0D0D] text-[#FFFFFF] font-sans text-base font-bold py-4 rounded-lg hover:bg-primary-container transition-colors duration-300 disabled:opacity-50" 
        type="submit"
      >
        {loading ? "Enviando..." : "Enviar Mensagem"}
      </button>
    </form>
  )
}
