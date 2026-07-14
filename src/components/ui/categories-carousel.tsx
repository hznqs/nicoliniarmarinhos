"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  _count: {
    products: number
  }
}

export function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    
    // Auto scroll
    const interval = setInterval(() => {
      if (el) {
        // scroll by the width of one child plus gap
        const firstChild = el.children[1] as HTMLElement // children[0] is the <style>
        if (firstChild) {
          const scrollAmount = firstChild.offsetWidth + 24 // 24px is gap-6 (or spacing-gutter)
          
          // If we reached the end, go back to start
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
            el.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
          }
        }
      }
    }, 5000) // Muda a cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  if (!categories || categories.length === 0) return null

  return (
    <div className="relative w-full">
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .flex::-webkit-scrollbar { display: none; }
        `}} />
        {categories.map((category) => (
          <Link 
            href={`/produtos?category=${category.slug}`} 
            key={category.id} 
            className="snap-start shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative overflow-hidden bg-[var(--color-surface-container-low)] cursor-pointer shadow-[0px_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 rounded-lg block"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-surface-variant flex items-center justify-center relative">
              {category.imageUrl ? (
                <Image 
                  src={category.imageUrl} 
                  alt={category.name} 
                  fill
                  className="object-cover object-center transition-all duration-500 group-hover:scale-105 blur-[2px] group-hover:blur-sm"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                />
              ) : (
                <span className="material-symbols-outlined text-6xl text-outline opacity-20">category</span>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 transition-opacity duration-300 z-20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-30">
              <div>
                <h3 className="font-heading text-[24px] text-white drop-shadow-md font-semibold">{category.name}</h3>
                <p className="font-sans text-[12px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {category._count.products} produtos
                </p>
              </div>
              <ArrowRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
