import { getLeads } from "@/server/actions/lead"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./_components/columns"
import { LeadDialog } from "./_components/lead-dialog"

export default async function LeadsAdminPage() {
  const result = await getLeads()
  const data = result.success && result.data ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leads</h1>
          <p className="text-gray-500">Gerencie os contatos de clientes em potencial.</p>
        </div>
        <LeadDialog />
      </div>
      
      <DataTable columns={columns} data={data} />
    </div>
  )
}
