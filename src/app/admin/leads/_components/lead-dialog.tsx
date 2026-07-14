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
import { LeadForm } from "./form-lead"

export function LeadDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" />Novo Lead</Button>} />
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
          <DialogDescription>
            Insira os dados de contato manualmente.
          </DialogDescription>
        </DialogHeader>
        <LeadForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
