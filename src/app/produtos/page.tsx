import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Search } from "lucide-react"
import { ProductCard } from "@/components/store/ProductCard"

export const metadata = {
  title: "Produtos - Armarinho Premium",
  description: "Catálogo completo de fios, tecidos orgânicos e agulhas especiais.",
}

// Next.js 15 requires searchParams to be treated as a Promise in Server Components
export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.q || ""
  const categorySlug = resolvedSearchParams?.category || ""

  // Fetch categories for sidebar
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  // Build where clause
  const where: any = { isActive: true }
  if (query) {
    where.name = { contains: query, mode: "insensitive" }
  }
  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-[var(--spacing-container-max)] mx-auto w-full px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-gutter)] flex flex-col md:flex-row gap-[var(--spacing-margin-desktop)]">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-[var(--spacing-gutter)]">
          <div>
            <h2 className="font-heading text-2xl text-on-surface mb-4">Filtros</h2>
            <div className="h-px bg-surface-variant w-full mb-6"></div>
          </div>
          
          {/* Search form */}
          <form className="relative" method="GET" action="/produtos">
            <input 
              name="q"
              defaultValue={query}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary-container focus:ring-0 px-0 py-2 font-sans text-on-surface placeholder:text-on-surface-variant" 
              placeholder="Buscar em produtos..." 
              type="text"
            />
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <button type="submit" className="absolute right-0 top-2 text-on-surface-variant">
              <Search className="w-5 h-5" />
            </button>
          </form>
          
          {/* Categories */}
          <div>
            <h3 className="font-sans font-bold text-sm text-on-surface mb-4 uppercase tracking-widest">Categorias</h3>
            <div className="flex flex-col gap-2">
              <Link 
                href="/produtos" 
                className={`font-sans text-sm ${!categorySlug ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
              >
                Todas as Categorias
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id}
                  href={`/produtos?category=${cat.slug}${query ? `&q=${query}` : ''}`} 
                  className={`font-sans text-sm ${categorySlug === cat.slug ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'} transition-colors`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-grow flex flex-col gap-[var(--spacing-gutter)]">
          
          <div className="flex justify-between items-end pb-4 border-b border-surface-variant">
            <span className="font-sans text-sm text-on-surface-variant">Mostrando {products.length} produtos</span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
            {products.length === 0 ? (
              <div className="col-span-full py-12 text-center text-on-surface-variant">
                Nenhum produto encontrado para os filtros selecionados.
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
