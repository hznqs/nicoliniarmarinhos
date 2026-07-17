"use client"

import { useState, useTransition } from "react"
import { ShoppingCart, Check, Minus, Plus } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl?: string | null
    slug: string
  }
  /** "full" mostra botão completo com controle de quantidade (página de detalhe)  
   *  "compact" mostra apenas o botão para cards da listagem */
  variant?: "full" | "compact"
}

export function AddToCartButton({ product, variant = "compact" }: AddToCartButtonProps) {
  const { addItem, items, updateQty, removeItem } = useCart()
  const [added, setAdded] = useState(false)
  const [, startTransition] = useTransition()

  const cartItem = items.find((i) => i.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      slug: product.slug,
    })

    // Feedback visual de "adicionado"
    setAdded(true)
    startTransition(() => {
      setTimeout(() => setAdded(false), 1500)
    })
  }

  // ─── Variante COMPACT (para ProductCard) ─────────────────────────────────
  if (variant === "compact") {
    if (quantity > 0) {
      return (
        <div className="flex items-center justify-center gap-2 w-full bg-surface-container rounded-lg px-3 py-2 border border-outline-variant">
          <button
            onClick={() => quantity === 1 ? removeItem(product.id) : updateQty(product.id, quantity - 1)}
            aria-label="Diminuir quantidade"
            className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-all"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-sans text-sm font-bold text-on-surface min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => updateQty(product.id, quantity + 1)}
            aria-label="Aumentar quantidade"
            className="w-7 h-7 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )
    }

    return (
      <button
        onClick={handleAdd}
        aria-label={`Adicionar ${product.name} ao carrinho`}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-sans text-sm font-semibold transition-all duration-300 border ${
          added
            ? "bg-green-50 border-green-400 text-green-700"
            : "bg-surface-container border-outline-variant text-on-surface hover:bg-primary-container hover:text-on-primary-container hover:border-primary-container"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Adicionado!
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Adicionar
          </>
        )}
      </button>
    )
  }

  // ─── Variante FULL (para página de detalhe) ──────────────────────────────
  if (quantity > 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <span className="font-sans text-sm text-on-surface-variant">No carrinho:</span>
          <div className="flex items-center gap-3 bg-surface-container rounded-xl px-4 py-2 border border-outline-variant">
            <button
              onClick={() => quantity === 1 ? removeItem(product.id) : updateQty(product.id, quantity - 1)}
              aria-label="Diminuir quantidade"
              className="w-8 h-8 rounded-full hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-heading text-lg font-bold text-on-surface min-w-[24px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQty(product.id, quantity + 1)}
              aria-label="Aumentar quantidade"
              className="w-8 h-8 rounded-full hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="font-heading text-base font-bold text-on-background">
            = R$ {(Number(product.price) * quantity).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <p className="font-sans text-xs text-green-700 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Produto no carrinho! Ajuste a quantidade acima.
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleAdd}
      aria-label={`Adicionar ${product.name} ao carrinho`}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-sans text-base font-bold transition-all duration-300 border-2 ${
        added
          ? "bg-green-50 border-green-400 text-green-700"
          : "bg-surface-container border-outline-variant text-on-surface hover:bg-primary-container hover:text-on-primary-container hover:border-transparent"
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Adicionado ao Carrinho!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Adicionar ao Carrinho
        </>
      )}
    </button>
  )
}
