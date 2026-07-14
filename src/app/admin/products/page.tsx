import { getProducts } from "@/server/actions/product"
import { prisma } from "@/lib/prisma"
import { ProductTable } from "./_components/product-table"
import { ProductDialog } from "./_components/product-dialog"

export default async function ProductsAdminPage() {
  const result = await getProducts()
  const data = result.success && result.data ? result.data : []

  // Fetch das categorias para usar no formulário
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Produtos</h1>
          <p className="text-gray-500">Gerencie o catálogo de produtos da sua loja.</p>
        </div>
        <ProductDialog categories={categories} />
      </div>
      
      <ProductTable data={data} categories={categories} />
    </div>
  )
}
