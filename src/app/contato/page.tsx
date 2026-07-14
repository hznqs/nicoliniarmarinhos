import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ContactForm } from "./_components/contact-form"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Contato - Armarinho Premium",
  description: "Entre em contato para tirar dúvidas ou fazer um orçamento.",
}

export default async function ContatoPage() {
  const company = await prisma.company.findFirst()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Contact Section */}
        <section className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto" id="contato">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-[#0D0D0D] mb-4">Entre em Contato</h2>
            <p className="font-sans text-base text-on-surface-variant max-w-2xl mx-auto">
              Estamos à disposição para auxiliar em seus projetos, tirar dúvidas ou apresentar nossas coleções exclusivas.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-surface p-8 md:p-12 rounded-lg shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
              <ContactForm />
            </div>
            
            {/* Map and Quick Contacts */}
            <div className="flex flex-col justify-between space-y-8">
              {/* Quick Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {company?.whatsapp && (
                  <div className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl mb-3">chat</span>
                    <span className="font-sans font-bold text-sm text-[#0D0D0D]">WhatsApp</span>
                    <span className="font-sans text-xs text-on-surface-variant mt-1">{company.whatsapp}</span>
                  </div>
                )}
                {company?.phone && (
                  <div className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl mb-3">call</span>
                    <span className="font-sans font-bold text-sm text-[#0D0D0D]">Telefone</span>
                    <span className="font-sans text-xs text-on-surface-variant mt-1">{company.phone}</span>
                  </div>
                )}
                {company?.email && (
                  <div className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl mb-3">mail</span>
                    <span className="font-sans font-bold text-sm text-[#0D0D0D]">E-mail</span>
                    <span className="font-sans text-xs text-on-surface-variant mt-1">{company.email}</span>
                  </div>
                )}
              </div>
              {/* Interactive Map */}
              <div className="w-full h-64 md:h-full min-h-[250px] rounded-lg overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.04)] relative">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(company?.address || company?.name || "Armarinhos")}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
