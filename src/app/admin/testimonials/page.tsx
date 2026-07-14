import { getTestimonials } from "@/server/actions/testimonial"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { TestimonialDialog } from "./_components/testimonial-dialog"
import { SyncGoogleButton } from "./_components/sync-google-button"

export default async function TestimonialsAdminPage() {
  const result = await getTestimonials()
  const data = result.success && result.data ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Depoimentos</h1>
          <p className="text-gray-500">Gerencie os depoimentos dos clientes.</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncGoogleButton />
          <TestimonialDialog />
        </div>
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  )
}
