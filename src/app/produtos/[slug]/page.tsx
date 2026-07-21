import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ProductGallery } from "@/components/store/ProductGallery"
import { ProductCard } from "@/components/store/ProductCard"
import { AddToCartButton } from "@/components/store/AddToCartButton"
import { ProductViewTracker } from "@/components/store/ProductViewTracker"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug }
  })
  
  if (!product) return { title: "Produto não encontrado - Armarinho Premium" }
  
  const description = product.description || `Detalhes do produto ${product.name}`
  const images = [{ url: "/og-image.jpg" }] // Posteriormente, pegar da tabela Image

  return {
    title: product.name, // O template "%s | Armarinho Premium" do layout cuidará do sufixo
    description,
    openGraph: {
      title: product.name,
      description,
      url: `/produtos/${product.slug}`,
      images,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images,
    }
  }
}

export default async function ProdutoDetalhePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
    include: { category: true, images: true, attributes: { orderBy: [{ key: "asc" }, { order: "asc" }] } }
  })

  if (!product) {
    notFound()
  }

  // Prepara o link do WhatsApp com dados reais da empresa e do produto
  const company = await prisma.company.findFirst()
  const phoneRaw = company?.whatsapp || company?.phone || "5511999999999"
  const phoneClean = phoneRaw.replace(/\D/g, "")
  const priceFormatted = Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const skuLine = product.sku ? `\n🔖 *Código (SKU):* ${product.sku}` : ""
  const whatsappMessage = encodeURIComponent(
    `Olá, ${company?.name || "Armarinho"}! 👋\n\n` +
    `Tenho interesse em um produto do site:\n\n` +
    `📦 *Produto:* ${product.name}\n` +
    `🏷️ *Categoria:* ${product.category.name}\n` +
    `💰 *Preço:* ${priceFormatted}` +
    skuLine +
    `\n\nPoderia verificar disponibilidade e formas de pagamento?`
  )
  const whatsappUrl = `https://wa.me/${phoneClean}?text=${whatsappMessage}`

  // Buscar produtos relacionados
  const relatedProducts = product.categoryId 
    ? await prisma.product.findMany({
        where: { 
          categoryId: product.categoryId, 
          id: { not: product.id }, 
          isActive: true,
          deletedAt: null
        },
        include: { category: true, images: true },
        take: 4,
        orderBy: { createdAt: "desc" }
      })
    : []

  // Schema.org para E-commerce
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": "https://armarinhopremium.vercel.app/og-image.jpg",
    "description": product.description || product.name,
    "sku": product.sku || product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://armarinhopremium.vercel.app/produtos/${product.slug}`,
      "priceCurrency": "BRL",
      "price": Number(product.price),
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <ProductViewTracker slug={product.slug} />
      <Header />
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-grow max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center text-on-surface-variant font-sans text-sm mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
          <Link href="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
          <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
          {product.category && (
            <>
              <Link href={`/produtos?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
              <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
            </>
          )}
          <span className="text-on-surface font-medium">{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)] mb-24">
          
          {/* Main Image (Left, 7 cols) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col md:flex-row gap-[var(--spacing-gutter)]">
            <ProductGallery images={product.images} />
          </div>

          {/* Product Info (Right, 5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col pt-4 md:pt-12 md:pl-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.category && (
                <span className="bg-surface-container text-on-surface font-sans text-xs px-4 py-2 rounded-xl font-medium">
                  {product.category.name}
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-primary-container text-on-primary-container font-sans text-xs px-4 py-2 rounded-xl font-bold">
                  Destaque
                </span>
              )}
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-on-surface mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-8 gap-4">
              <span className="font-heading text-2xl font-bold text-on-background">
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </span>
              {product.oldPrice && (
                <span className="text-on-surface-variant font-sans text-base line-through">
                  R$ {Number(product.oldPrice).toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
            
            <p className="font-sans text-base text-on-surface-variant mb-10 leading-relaxed whitespace-pre-line">
              {product.description || "Este produto não possui descrição detalhada."}
            </p>

            {/* Características do produto */}
            {product.attributes.length > 0 && (() => {
              // Agrupa valores por chave
              const grouped = product.attributes.reduce<Record<string, string[]>>(
                (acc, attr) => {
                  if (!acc[attr.key]) acc[attr.key] = []
                  acc[attr.key].push(attr.value)
                  return acc
                },
                {}
              )
              return (
                <div className="mb-10 flex flex-col gap-4">
                  {Object.entries(grouped).map(([key, values]) => (
                    <div key={key} className="flex flex-col gap-2">
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        {key}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {values.map((val) => (
                          <span
                            key={val}
                            className="inline-block bg-surface-container text-on-surface font-sans text-sm px-3 py-1.5 rounded-lg border border-outline-variant"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}



            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  imageUrl: product.images[0]?.url ?? null,
                  slug: product.slug,
                }}
                variant="full"
              />
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-[#0D0D0D] text-[#FFFFFF] font-sans text-base font-bold py-4 rounded-lg hover:bg-primary-container transition-colors duration-300 flex items-center justify-center gap-2 shadow-md"
              >
                Comprar via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-outline-variant">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-on-surface mb-2">Produtos Relacionados</h2>
                <p className="font-sans text-on-surface-variant">Complemente sua compra com estas opções incríveis da mesma categoria.</p>
              </div>
              <Link href={`/produtos?category=${product.category?.slug}`} className="font-sans text-primary font-bold hover:underline underline-offset-4 transition-all">
                Ver todos os itens
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gutter)]">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
