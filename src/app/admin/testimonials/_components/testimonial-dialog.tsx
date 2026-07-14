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
import { TestimonialForm } from "./form-testimonial"

export function TestimonialDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" />Novo Depoimento</Button>} />
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Depoimento</DialogTitle>
          <DialogDescription>
            Insira o feedback do cliente.
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
