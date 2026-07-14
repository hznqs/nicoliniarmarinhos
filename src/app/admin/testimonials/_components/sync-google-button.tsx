"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { syncGoogleReviews } from "@/server/actions/google-reviews"

export function SyncGoogleButton() {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    toast.info("Iniciando sincronização com o Google...")
    
    try {
      const result = await syncGoogleReviews()
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao sincronizar.")
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleSync} 
      disabled={isSyncing}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
      {isSyncing ? "Sincronizando..." : "Sincronizar Google"}
    </Button>
  )
}
