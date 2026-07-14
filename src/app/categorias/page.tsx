import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export const metadata = {
  title: "Categorias - Armarinho Premium",
  description: "Explore nossa seleção curada de materiais de alta qualidade.",
}

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  // Para garantir o grid, usamos a imagem real da categoria (imageUrl) ou um placeholder padrão caso não tenha.
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-24">
        {/* Page Header */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-on-surface mb-6">Nossas Categorias</h1>
          <p className="font-sans text-lg text-on-surface-variant">
            Explore nossa seleção curada de materiais de alta qualidade para seus projetos mais refinados. Do algodão mais suave às pedrarias mais raras.
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {categories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-sans">
              Nenhuma categoria encontrada.
            </div>
          ) : (
            categories.map((cat, index) => {
              // Alternar um pouco as cores/layout para dar charme
              const isLarge = index === 0 // A primeira fica maior se quisermos (opcional)
              
              return (
                <Link 
                  key={cat.id} 
                  href={`/produtos?category=${cat.slug}`} 
                  className={`group relative block overflow-hidden bg-surface-container-low rounded-lg shadow-[0px_10px_30px_rgba(0,0,0,0.04)] h-64 md:h-80 ${isLarge ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                >
                  <div className="absolute inset-0 bg-black/10 z-20 group-hover:bg-black/30 transition-colors duration-500"></div>
                  {/* Imagem Real ou Placeholder */}
                  {cat.imageUrl ? (
                    <Image 
                      src={cat.imageUrl} 
                      alt={cat.name} 
                      fill
                      className="object-cover object-center transition-all duration-700 group-hover:scale-105 blur-[2px] group-hover:blur-sm"
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-surface-variant flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                       <span className="text-on-surface-variant/50 font-sans text-xl opacity-20">Armarinho Premium</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 z-30 p-8 flex flex-col justify-end pointer-events-none">
                    <div className="bg-surface/90 backdrop-blur-sm p-6 inline-block self-start rounded-DEFAULT w-full shadow-lg pointer-events-auto">
                      <h2 className="font-heading text-2xl font-bold text-on-surface mb-1">{cat.name}</h2>
                      <span className="font-sans text-sm text-primary font-medium tracking-widest uppercase mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explorar <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
