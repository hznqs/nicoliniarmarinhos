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
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CategoryForm } from "./form-category"

const ActionsCell = ({ category, parentCategories }: { category: CategoryColumn, parentCategories: { id: string, name: string }[] }) => {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      startTransition(async () => {
        const res = await deleteCategory(category.id)
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

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da categoria.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm 
          initialData={category}
          parentCategories={parentCategories.filter(c => c.id !== category.id)} 
          onSuccess={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  )
}

export type CategoryColumn = {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  parent?: { name: string } | null
  _count?: { products: number }
}

export const getColumns = (parentCategories: { id: string, name: string }[]): ColumnDef<CategoryColumn>[] => [
  {
    accessorKey: "imageUrl",
    header: "Imagem",
    cell: ({ row }) => {
      const url = row.original.imageUrl
      return url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Capa" className="h-10 w-10 object-cover rounded shadow-sm" />
      ) : (
        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Sem</div>
      )
    }
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <span className="text-gray-500">{row.getValue("slug")}</span>
  },
  {
    accessorKey: "parent.name",
    header: "Categoria Pai",
    cell: ({ row }) => {
      const parentName = row.original.parent?.name
      return parentName ? <span className="bg-gray-100 px-2 py-1 rounded text-xs">{parentName}</span> : <span className="text-gray-400 text-xs">Nenhuma</span>
    }
  },
  {
    accessorKey: "_count.products",
    header: "Produtos Vinculados",
    cell: ({ row }) => {
      const count = row.original._count?.products || 0
      return <div className="text-center">{count}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell category={row.original} parentCategories={parentCategories} />,
  },
]
