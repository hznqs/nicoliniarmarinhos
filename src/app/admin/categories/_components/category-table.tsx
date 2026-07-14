"use client"

import { DataTable } from "@/components/ui/data-table"
import { getColumns, CategoryColumn } from "./columns"

interface CategoryTableProps {
  data: CategoryColumn[]
  categories: { id: string; name: string }[]
}

export function CategoryTable({ data, categories }: CategoryTableProps) {
  const columns = getColumns(categories)

  return <DataTable columns={columns} data={data} />
}
