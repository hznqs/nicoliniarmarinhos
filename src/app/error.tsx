"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Error Boundary:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center py-24 px-4 text-center">
        <h2 className="font-heading text-3xl text-on-surface mb-4">Página indisponível</h2>
        <p className="font-sans text-on-surface-variant max-w-md mx-auto mb-8">
          Tivemos um problema técnico ao tentar carregar esta página. Nossa equipe técnica já foi notificada.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => reset()}
            className="bg-primary text-on-primary px-6 py-3 rounded-full font-sans font-bold hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
          <Link 
            href="/"
            className="bg-surface-variant text-on-surface-variant px-6 py-3 rounded-full font-sans font-bold hover:bg-surface-variant/80 transition-colors"
          >
            Voltar para o Início
          </Link>
        </div>
      </main>
    </div>
  )
}
