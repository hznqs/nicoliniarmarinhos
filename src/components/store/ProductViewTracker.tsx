"use client"

import { useEffect, useRef } from "react"
import { trackProductView } from "@/server/actions/tracking"

export function ProductViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    // Evita contar múltiplas vezes no Strict Mode do React durante o desenvolvimento
    if (tracked.current) return
    tracked.current = true

    // Dispara em background
    trackProductView(slug)
  }, [slug])

  return null
}
