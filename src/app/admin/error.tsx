"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin Error Boundary:", error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Oops, algo deu errado no painel!</h2>
      <p className="text-gray-500">
        Ocorreu um erro inesperado ao carregar esta página do painel administrativo.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Tentar novamente
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/admin"}>
          Voltar ao Início
        </Button>
      </div>
    </div>
  )
}
