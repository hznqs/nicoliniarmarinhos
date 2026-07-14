import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Sobre Nós - Armarinho Premium",
  description: "Conheça a história e os valores da nossa empresa.",
}

export default async function SobrePage() {
  const company = await prisma.company.findFirst()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-surface-container-low">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-multiply" 
            style={{ 
              backgroundImage: `url('${company?.logoUrl || "https://images.unsplash.com/photo-1550541783-a9d7008da0d7"}')` 
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          <div className="relative z-10 text-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Sobre a Empresa</h1>
            <p className="font-sans text-lg text-white/90">Conheça mais sobre a história do {company?.name || "nosso negócio"}.</p>
          </div>
        </section>

        {/* History Narrative */}
        <section className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="font-heading text-3xl font-bold text-primary">Nossa História</h2>
              {company?.aboutText ? (
                <div className="font-sans text-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                  {company.aboutText}
                </div>
              ) : (
                <p className="font-sans text-lg text-on-surface leading-relaxed">
                  História da empresa não cadastrada. Por favor, acesse o painel administrativo para preencher estas informações.
                </p>
              )}
            </div>
            
            {company?.logoUrl && (
              <div className="relative h-[500px] rounded-lg overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.04)] flex items-center justify-center bg-surface-container-low p-8">
                <img 
                  className="object-contain w-full h-full" 
                  alt={`Logo ${company.name}`} 
                  src={company.logoUrl}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
