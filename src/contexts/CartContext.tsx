"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl?: string | null
  slug: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      }
    case "UPDATE_QTY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    }
    case "CLEAR_CART":
      return { ...state, items: [], isOpen: false }
    case "OPEN_CART":
      return { ...state, isOpen: true }
    case "CLOSE_CART":
      return { ...state, isOpen: false }
    case "HYDRATE":
      return { ...state, items: action.payload }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  buildWhatsAppMessage: (phone: string) => string
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "armarinho_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Hidratação: lê localStorage apenas no client
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed })
        }
      }
    } catch {
      // Ignora erros de parse silenciosamente
    }
  }, [])

  // Persiste no localStorage sempre que os itens mudam
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // Ignora erros de storage
    }
  }, [state.items])

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }, [])

  const updateQty = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
  }, [])

  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), [])
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), [])

  const buildWhatsAppMessage = useCallback(
    (phone: string) => {
      const lines = state.items.map((item) => {
        const total = (item.price * item.quantity).toFixed(2).replace(".", ",")
        const unitPrice = item.price.toFixed(2).replace(".", ",")
        if (item.quantity > 1) {
          return `• ${item.name} — ${item.quantity}x de R$ ${unitPrice} = R$ ${total}`
        }
        return `• ${item.name} — R$ ${unitPrice}`
      })

      const totalFormatted = totalPrice.toFixed(2).replace(".", ",")

      const message = [
        "Olá! Gostaria de fazer um pedido com os seguintes itens:",
        "",
        "🛍️ *Meu Pedido:*",
        ...lines,
        "",
        `💰 *Total Estimado: R$ ${totalFormatted}*`,
        "",
        "Poderia confirmar disponibilidade e formas de pagamento? 😊",
      ].join("\n")

      const phoneClean = phone.replace(/\D/g, "")
      return `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`
    },
    [state.items, totalPrice]
  )

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        buildWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>")
  }
  return context
}
