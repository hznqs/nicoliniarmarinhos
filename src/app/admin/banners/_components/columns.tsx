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
import { deleteBanner } from "@/server/actions/banner"
import { useTransition, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BannerForm } from "./form-banner"

const ActionsCell = ({ banner }: { banner: BannerColumn }) => {
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este banner?")) {
      startTransition(async () => {
        const res = await deleteBanner(banner.id)
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
          <DialogTitle>Editar Banner</DialogTitle>
          <DialogDescription>
            Atualize as informações do banner selecionado.
          </DialogDescription>
        </DialogHeader>
        <BannerForm 
          initialData={banner}
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}

export type BannerColumn = {
  id: string
  title: string | null
  imageUrl: string
  order: number
  isActive: boolean
}

export const columns: ColumnDef<BannerColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => {
      const url = row.getValue("imageUrl") as string
      return (
        <div className="relative h-12 w-24 bg-gray-100 rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Banner" className="object-cover w-full h-full" />
        </div>
      )
    }
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => row.getValue("title") || <span className="text-gray-400">Sem título</span>
  },
  {
    accessorKey: "order",
    header: "Ordem",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive")
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isActive ? "Ativo" : "Inativo"}
        </span>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell banner={row.original} />,
  },
]
