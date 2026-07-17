"use client"

import { useEffect, useRef } from "react"
import { X, Minus, Plus, ShoppingBag, MessageCircle, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5511999999999"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalItems, buildWhatsAppMessage } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Fecha ao apertar ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [closeCart])

  // Trava o scroll do body quando aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const handleWhatsApp = () => {
    const url = buildWhatsAppMessage(WHATSAPP_PHONE)
    window.open(url, "_blank", "noreferrer")
  }

  return (
    <>
      {/* Overlay escurecido */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className={`fixed top-0 right-0 z-[60] h-full w-full max-w-md bg-surface-container-lowest shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header do Drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-on-surface">
              Meu Carrinho
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Lista de itens */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <ShoppingBag className="w-16 h-16 text-outline-variant" />
              <p className="font-sans text-on-surface-variant text-base">
                Seu carrinho está vazio.
              </p>
              <Link
                href="/produtos"
                onClick={closeCart}
                className="mt-2 font-sans text-sm text-primary font-semibold hover:underline underline-offset-4 transition-all"
              >
                Ver produtos →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-surface-container rounded-xl p-3 shadow-sm"
              >
                {/* Imagem */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-outline-variant" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <Link
                    href={`/produtos/${item.slug}`}
                    onClick={closeCart}
                    className="font-sans text-sm font-medium text-on-surface hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <span className="font-heading text-base font-bold text-on-background">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="font-sans text-xs text-on-surface-variant">
                    R$ {item.price.toFixed(2).replace(".", ",")} cada
                  </span>

                  {/* Controle de quantidade */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      className="w-7 h-7 rounded-full border border-outline-variant hover:bg-surface-container-high flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-on-surface" />
                    </button>
                    <span className="font-sans text-sm font-semibold text-on-surface w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      aria-label={`Aumentar quantidade de ${item.name}`}
                      className="w-7 h-7 rounded-full border border-outline-variant hover:bg-surface-container-high flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3 text-on-surface" />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remover ${item.name} do carrinho`}
                      className="ml-auto p-1.5 rounded-full hover:bg-error-container hover:text-on-error-container transition-colors text-on-surface-variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer com total e botão WhatsApp */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-outline-variant bg-surface-container-lowest space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-base text-on-surface-variant">Total estimado</span>
              <span className="font-heading text-xl font-bold text-on-background">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant">
              * Preços sujeitos a confirmação. O vendedor irá confirmar disponibilidade e prazo.
            </p>

            {/* Botão WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-sans text-base font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              Pedir via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  )
}
