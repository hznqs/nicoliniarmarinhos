import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/store/ProductCard"
import { SortSelect } from "@/components/store/SortSelect"

export const metadata = {
  title: "Produtos",
  description: "Catálogo completo de fios, tecidos orgânicos e agulhas especiais.",
}

const ITEMS_PER_PAGE = 12

type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc"

const sortLabels: Record<SortOption, string> = {
  newest: "Mais Recentes",
  price_asc: "Menor Preço",
  price_desc: "Maior Preço",
  name_asc: "Nome A–Z",
}

function buildOrderBy(sort: SortOption) {
  switch (sort) {
    case "price_asc":  return { price: "asc" as const }
    case "price_desc": return { price: "desc" as const }
    case "name_asc":   return { name: "asc" as const }
    default:           return { createdAt: "desc" as const }
  }
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>
}) {
  const params = await searchParams
  const query        = params.q        || ""
  const categorySlug = params.category || ""
  const sort         = (params.sort || "newest") as SortOption
  const page         = Math.max(1, parseInt(params.page || "1", 10))

  // Busca todas as categorias para a sidebar
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })

  // Monta o filtro
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    deletedAt: null,
  }
  if (query)        where.name     = { contains: query, mode: "insensitive" }
  if (categorySlug) where.category = { slug: categorySlug }

  // Conta o total para a paginação
  const totalCount = await prisma.product.count({ where })
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // Busca a página atual
  const products = await prisma.product.findMany({
    where,
    include: { category: true, images: true },
    orderBy: buildOrderBy(sort),
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  })

  // Monta a URL base preservando os outros filtros
  function buildUrl(overrides: Record<string, string | undefined>) {
    const p: Record<string, string> = {}
    if (query)        p.q        = query
    if (categorySlug) p.category = categorySlug
    if (sort !== "newest") p.sort = sort
    if (page > 1)     p.page     = String(page)
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === undefined) delete p[k]
      else p[k] = v
    })
    const qs = new URLSearchParams(p).toString()
    return `/produtos${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-[var(--spacing-container-max)] mx-auto w-full px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-gutter)] flex flex-col md:flex-row gap-[var(--spacing-margin-desktop)]">

        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0 flex flex-col gap-8">
          <div>
            <h2 className="font-heading text-xl text-on-surface mb-4">Filtros</h2>
            <div className="h-px bg-surface-variant w-full mb-6" />
          </div>

          {/* Campo de busca */}
          <form className="relative" method="GET" action="/produtos">
            <input
              name="q"
              defaultValue={query}
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-sans text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
              placeholder="Buscar produtos..."
              type="text"
            />
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
            <button type="submit" className="absolute right-0 top-2 text-on-surface-variant hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Categorias */}
          <div>
            <h3 className="font-sans font-bold text-xs text-on-surface mb-3 uppercase tracking-widest">Categorias</h3>
            <div className="flex flex-col gap-1.5">
              <Link
                href={buildUrl({ category: undefined, page: undefined })}
                className={`font-sans text-sm transition-colors ${!categorySlug ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`}
              >
                Todas
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug, page: undefined })}
                  className={`font-sans text-sm transition-colors ${categorySlug === cat.slug ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Área de produtos */}
        <section className="flex-grow flex flex-col gap-6">

          {/* Barra superior: total + ordenação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-variant">
            <span className="font-sans text-sm text-on-surface-variant">
              {totalCount === 0
                ? "Nenhum produto encontrado"
                : `${totalCount} ${totalCount === 1 ? "produto" : "produtos"}`}
              {query && <> para &ldquo;<strong>{query}</strong>&rdquo;</>}
            </span>

            {/* Dropdown de ordenação */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-sans text-sm text-on-surface-variant whitespace-nowrap">
                Ordenar por:
              </label>
              <SortSelect
                value={sort}
                baseUrl={buildUrl({ sort: undefined })}
                options={Object.entries(sortLabels).map(([value, label]) => ({ value, label }))}
              />
            </div>
          </div>

          {/* Grid de produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
            {products.length === 0 ? (
              <div className="col-span-full py-16 text-center text-on-surface-variant font-sans">
                Nenhum produto encontrado para os filtros selecionados.
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <nav aria-label="Paginação de produtos" className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-surface-variant">
              {/* Anterior */}
              {page > 1 ? (
                <Link
                  href={buildUrl({ page: page === 2 ? undefined : String(page - 1) })}
                  className="flex items-center gap-1 px-3 py-2 rounded-md font-sans text-sm text-primary hover:bg-surface-container transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-3 py-2 rounded-md font-sans text-sm text-on-surface-variant opacity-40 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </span>
              )}

              {/* Números de página */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-on-surface-variant font-sans text-sm">…</span>
                    ) : (
                      <Link
                        key={item}
                        href={buildUrl({ page: item === 1 ? undefined : String(item) })}
                        aria-label={`Página ${item}`}
                        aria-current={item === page ? "page" : undefined}
                        className={`w-9 h-9 flex items-center justify-center rounded-md font-sans text-sm transition-colors ${
                          item === page
                            ? "bg-primary-container text-on-primary-container font-bold"
                            : "text-on-surface hover:bg-surface-container"
                        }`}
                      >
                        {item}
                      </Link>
                    )
                  )}
              </div>

              {/* Próxima */}
              {page < totalPages ? (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="flex items-center gap-1 px-3 py-2 rounded-md font-sans text-sm text-primary hover:bg-surface-container transition-colors"
                  aria-label="Próxima página"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-3 py-2 rounded-md font-sans text-sm text-on-surface-variant opacity-40 cursor-not-allowed">
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
