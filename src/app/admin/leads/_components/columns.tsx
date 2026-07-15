"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteLead } from "@/server/actions/lead"
import { useTransition, useState } from "react"
import type { LeadStatus } from "@prisma/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LeadForm } from "./form-lead"

const ActionsCell = ({ lead }: { lead: LeadColumn }) => {
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      startTransition(async () => {
        const res = await deleteLead(lead.id)
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
          <DialogTitle>Editar Lead</DialogTitle>
          <DialogDescription>
            Atualize as informações do lead selecionado.
          </DialogDescription>
        </DialogHeader>
        <LeadForm 
          initialData={lead}
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}

export type LeadColumn = {
  id: string
  name: string
  email: string
  phone: string | null
  status: LeadStatus
  createdAt: Date
}

const statusMap: Record<LeadStatus, { label: string, color: string }> = {
  NEW: { label: "Novo", color: "bg-blue-100 text-blue-800" },
  CONTACTED: { label: "Contatado", color: "bg-yellow-100 text-yellow-800" },
  CONVERTED: { label: "Convertido", color: "bg-green-100 text-green-800" },
  LOST: { label: "Perdido", color: "bg-red-100 text-red-800" },
}

export const columns: ColumnDef<LeadColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => row.getValue("phone") || "-"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as LeadStatus
      const config = statusMap[status]
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
          {config.label}
        </span>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return new Date(date).toLocaleDateString("pt-BR")
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell lead={row.original} />,
  },
]
