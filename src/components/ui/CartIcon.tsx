"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

export function CartIcon() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      aria-label={`Abrir carrinho${totalItems > 0 ? ` — ${totalItems} ${totalItems === 1 ? "item" : "itens"}` : ""}`}
      className="relative p-1 group"
    >
      <ShoppingCart
        className="text-primary cursor-pointer group-hover:text-[var(--color-primary-container)] transition-colors duration-300 w-6 h-6"
        aria-hidden="true"
      />
      {totalItems > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 bg-primary-container text-on-primary-container text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-bounce-once shadow"
          aria-hidden="true"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  )
}
