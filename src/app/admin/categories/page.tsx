import { getCategories } from "@/server/actions/category"
import { CategoryTable } from "./_components/category-table"
import { CategoryDialog } from "./_components/category-dialog"

export default async function CategoriesAdminPage() {
  const result = await getCategories()
  const data = result.success && result.data ? result.data : []

  // Assumindo que data tem a lista plana de categorias
  const categories = data.map(c => ({ id: c.id, name: c.name }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorias</h1>
          <p className="text-gray-500">Organize seus produtos em categorias.</p>
        </div>
        <CategoryDialog categories={categories} />
      </div>
      
      <CategoryTable data={data} categories={categories} />
    </div>
  )
}
