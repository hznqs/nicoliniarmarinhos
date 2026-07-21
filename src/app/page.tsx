import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ArrowRight, Star } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel"
import { CategoriesCarousel } from "@/components/ui/categories-carousel"
import { ProductCard } from "@/components/store/ProductCard"

export default async function Home() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  const heroBanner = banners.length > 0 ? banners[0] : null

  const categories = await prisma.category.findMany({
    take: 9,
    include: {
      _count: {
        select: { products: { where: { isActive: true } } }
      }
    }
  })

  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    take: 9,
    orderBy: { createdAt: "desc" },
  })

  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null, isFeatured: true },
    include: { category: true, images: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  })

  // Se não houver produtos em destaque, pega os mais recentes
  const productsToShow = featuredProducts.length > 0 
    ? featuredProducts 
    : await prisma.product.findMany({
        where: { isActive: true, deletedAt: null },
        include: { category: true, images: true },
        take: 8,
        orderBy: { createdAt: "desc" },
      })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        {heroBanner && (
          <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <img 
                alt={heroBanner.title || "Banner"} 
                className="w-full h-full object-cover object-center" 
                src={heroBanner.imageUrl}
              />
            </div>
            <div className="relative z-20 text-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-4xl mx-auto flex flex-col items-center">
              {heroBanner.title && (
                <h1 className="font-heading text-[32px] md:text-[48px] font-bold text-white mb-6 drop-shadow-lg tracking-tight">
                  {heroBanner.title}
                </h1>
              )}
              {heroBanner.subtitle && (
                <p className="font-sans text-[18px] text-white/90 mb-10 max-w-2xl font-light leading-relaxed">
                  {heroBanner.subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href={heroBanner.linkUrl || "/produtos"} className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-8 py-4 rounded font-sans text-[14px] font-medium hover:bg-white hover:text-primary transition-all duration-300 shadow-lg inline-block">
                  Conheça nossos produtos
                </Link>
                <Link href="/contato" className="border border-white text-white px-8 py-4 rounded font-sans text-[14px] font-medium hover:bg-white/10 transition-all duration-300 inline-block">
                  Solicitar orçamento
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Categories Grid */}
        {categories.length > 0 && (
          <section className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-surface max-w-[var(--spacing-container-max)] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-[32px] text-primary mb-4 font-semibold">Nossas Categorias</h2>
              <p className="font-sans text-[16px] text-muted-foreground max-w-2xl mx-auto">
                Explore nossa vasta seleção organizada para facilitar sua busca pela perfeição.
              </p>
            </div>
            
            <CategoriesCarousel categories={categories} />
            <div className="mt-12 text-center">
              <Link href="/categorias" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
                Ver todas as categorias <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {productsToShow.length > 0 && (
          <section className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-surface max-w-[var(--spacing-container-max)] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-[32px] text-primary mb-4 font-semibold">
                {featuredProducts.length > 0 ? "Produtos em Destaque" : "Novidades"}
              </h2>
              <p className="font-sans text-[16px] text-muted-foreground max-w-2xl mx-auto">
                {featuredProducts.length > 0 
                  ? "Seleção especial das melhores peças do nosso catálogo." 
                  : "Confira os itens mais recentes adicionados ao nosso catálogo."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsToShow.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/produtos" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
                Ver todos os produtos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-surface-container-low max-w-[var(--spacing-container-max)] mx-auto">
             <div className="text-center mb-16">
              <h2 className="font-heading text-[32px] text-primary mb-4 font-semibold">O Que Dizem Nossos Clientes</h2>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
