"use client"

import { useState } from "react"
import type { Image as PrismaImage } from "@prisma/client"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: PrismaImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Fallback se não houver imagens
  if (!images || images.length === 0) {
    return (
      <div className="flex-1 w-full bg-surface-container-low rounded-xl aspect-square overflow-hidden relative flex flex-col items-center justify-center border border-outline-variant shadow-sm">
        <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">
          image
        </span>
        <span className="text-on-surface-variant font-sans text-lg font-medium">
          Sem Imagem do Produto
        </span>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Imagem Principal */}
      <div className="w-full bg-surface-container-lowest rounded-xl aspect-square overflow-hidden relative border border-outline-variant shadow-sm group cursor-zoom-in">
        <img
          src={activeImage.url}
          alt={activeImage.alt || "Imagem do Produto"}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Miniaturas (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent snap-x">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "snap-start flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                activeIndex === idx
                  ? "border-primary shadow-md opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-outline"
              )}
              aria-label={`Ver imagem ${idx + 1}`}
              aria-current={activeIndex === idx ? "true" : "false"}
            >
              <img
                src={img.url}
                alt={img.alt || `Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
