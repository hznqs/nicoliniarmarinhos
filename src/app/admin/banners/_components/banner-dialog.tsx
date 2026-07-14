"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BannerForm } from "./form-banner"

export function BannerDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" />Novo Banner</Button>} />
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Banner</DialogTitle>
          <DialogDescription>
            Configure a imagem e os links do banner que será exibido no site.
          </DialogDescription>
        </DialogHeader>
        <BannerForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
