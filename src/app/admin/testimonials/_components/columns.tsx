"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTestimonial } from "@/server/actions/testimonial"
import { useTransition, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TestimonialForm } from "./form-testimonial"

const ActionsCell = ({ testimonial }: { testimonial: TestimonialColumn }) => {
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      startTransition(async () => {
        const res = await deleteTestimonial(testimonial.id)
        if (res?.error) {
          alert(res.error)
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground outline-none">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} disabled={isPending} className="text-red-600">
            {isPending ? "Excluindo..." : "Excluir"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Depoimento</DialogTitle>
          <DialogDescription>
            Atualize as informações do depoimento selecionado.
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm 
          initialData={testimonial}
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}

export type TestimonialColumn = {
  id: string
  name: string
  role: string | null
  avatarUrl: string | null
  rating: number
  isApproved: boolean
}

export const columns: ColumnDef<TestimonialColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome / Cargo",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const role = row.original.role
      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          {role && <span className="text-xs text-gray-500">{role}</span>}
        </div>
      )
    }
  },
  {
    accessorKey: "rating",
    header: "Avaliação",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number
      return (
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) => {
      const isApproved = row.getValue("isApproved") as boolean
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {isApproved ? "Aprovado" : "Pendente"}
        </span>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell testimonial={row.original} />,
  },
]
