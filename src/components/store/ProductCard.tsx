import Link from "next/link"
import type { Product, Category, Image as PrismaImage } from "@prisma/client"

interface ProductWithRelations extends Product {
  category: Category | null
  images: PrismaImage[]
}

export function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Link href={`/produtos/${product.slug}`} className="group relative flex flex-col gap-3 cursor-pointer transition-transform duration-300 hover:-translate-y-1 h-full">
      <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden rounded-lg shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0].url} 
            alt={product.images[0].alt || product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-variant flex items-center justify-center">
            <span className="text-on-surface-variant font-sans text-xs">Sem Imagem</span>
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full font-sans text-xs font-bold uppercase tracking-wider shadow-sm z-10">
            Destaque
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-full font-sans text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            Ver detalhes
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center text-center mt-2 flex-grow justify-end">
        <span className="font-sans text-xs text-primary-container uppercase tracking-wider mb-1 font-bold">
          {product.category?.name || "Geral"}
        </span>
        <h4 className="font-sans text-base text-on-surface mb-1 font-medium line-clamp-2">{product.name}</h4>
        <div className="flex items-center gap-2 mt-auto pt-1">
          {product.oldPrice && (
            <span className="font-sans text-sm text-on-surface-variant line-through">
              R$ {Number(product.oldPrice).toFixed(2).replace(".", ",")}
            </span>
          )}
          <span className="font-heading text-lg font-bold text-on-background">
            R$ {Number(product.price).toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </Link>
  )
}
