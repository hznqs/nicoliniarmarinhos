import { getBanners } from "@/server/actions/banner"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { BannerDialog } from "./_components/banner-dialog"

export default async function BannersAdminPage() {
  const result = await getBanners()
  const data = result.success && result.data ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Banners</h1>
          <p className="text-gray-500">Gerencie os banners exibidos na página inicial.</p>
        </div>
        <BannerDialog />
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  )
}
