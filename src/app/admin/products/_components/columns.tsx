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
import { deleteProduct } from "@/server/actions/product"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductForm } from "./form-product"

const ActionsCell = ({ product, categories }: { product: ProductColumn, categories: { id: string, name: string }[] }) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      startTransition(async () => {
        const res = await deleteProduct(product.id)
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
      
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize os detalhes do produto.
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          initialData={product}
          categories={categories} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}

export type ProductColumn = {
  id: string
  name: string
  price: number
  stock: number
  isActive: boolean
  category?: { name: string } | null
  imageUrl?: string | null
}

export const getColumns = (categories: { id: string, name: string }[]): ColumnDef<ProductColumn>[] => [
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => {
      const url = row.getValue("imageUrl") as string
      return url ? (
        <div className="w-10 h-10 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={row.original.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-md border bg-muted flex items-center justify-center">
          <span className="material-symbols-outlined text-muted-foreground text-sm opacity-50">image</span>
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
    cell: ({ row }) => {
      const categoryName = row.original.category?.name || "Sem categoria"
      return <div>{categoryName}</div>
    }
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "stock",
    header: "Estoque",
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
    cell: ({ row }) => <ActionsCell product={row.original} categories={categories} />,
  },
]
