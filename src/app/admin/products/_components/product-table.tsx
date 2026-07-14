"use client"

import { DataTable } from "@/components/ui/data-table"
import { getColumns, ProductColumn } from "./columns"

interface ProductTableProps {
  data: ProductColumn[]
  categories: { id: string; name: string }[]
}

export function ProductTable({ data, categories }: ProductTableProps) {
  const columns = getColumns(categories)

  return <DataTable columns={columns} data={data} />
}
