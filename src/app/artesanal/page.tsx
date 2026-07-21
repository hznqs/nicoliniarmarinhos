import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { Scissors } from "lucide-react"

export const metadata = {
  title: "Artesanal — Nicolini Armarinhos",
  description:
    "Peças únicas produzidas pela própria Nicolini Armarinhos: bolsas, cocares, acessórios e muito mais. Artesanato feito com amor e materiais premium.",
}

export default async function ArtesanalPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      isHandmade: true,
    },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-surface-container-low border-b border-outline-variant py-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="max-w-[var(--spacing-container-max)] mx-auto flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-full">
              <Scissors className="w-4 h-4" />
              <span className="font-sans text-sm font-bold uppercase tracking-wider">
                Feito por Nós
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-on-surface">
              Coleção Artesanal
            </h1>
            <p className="font-sans text-base text-on-surface-variant max-w-xl">
              Peças únicas produzidas pela própria Nicolini Armarinhos. Bolsas,
              cocares, acessórios e muito mais — artesanato com alma e materiais
              de primeira qualidade.
            </p>
          </div>
        </section>

        {/* Grid de produtos */}
        <section className="py-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <Scissors className="w-12 h-12 text-outline-variant" />
              <h2 className="font-heading text-xl font-semibold text-on-surface">
                Em breve, novas peças artesanais
              </h2>
              <p className="font-sans text-on-surface-variant">
                Estamos preparando nossa coleção exclusiva. Volte em breve!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans text-sm text-on-surface-variant">
                  {products.length}{" "}
                  {products.length === 1 ? "peça disponível" : "peças disponíveis"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--spacing-gutter)]">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
