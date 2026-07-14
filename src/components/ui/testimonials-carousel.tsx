"use client"

import { useEffect, useRef } from "react"
import { Star } from "lucide-react"

type Testimonial = {
  id: string
  name: string
  role: string | null
  content: string
  rating: number
}

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
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
          const scrollAmount = firstChild.offsetWidth + 24 // 24px is gap-6
          
          // If we reached the end, go back to start
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20) {
            el.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
          }
        }
      }
    }, 4000) // Muda a cada 4 segundos

    return () => clearInterval(interval)
  }, [])

  if (!testimonials || testimonials.length === 0) return null

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
        {testimonials.map((t) => (
          <div 
            key={t.id} 
            className="snap-start shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-surface p-8 rounded-2xl shadow-sm flex flex-col border border-outline-variant/20"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-primary text-primary" : "text-outline-variant"}`} />
              ))}
            </div>
            <p className="italic text-on-surface-variant mb-6 font-serif line-clamp-5">"{t.content}"</p>
            <div className="flex items-center gap-3 mt-auto">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shrink-0">
                {t.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-on-surface truncate">{t.name}</p>
                {t.role && <p className="text-xs text-on-surface-variant truncate">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
