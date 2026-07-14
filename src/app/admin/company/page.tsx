import { getCompanySettings } from "@/server/actions/company"
import { CompanyForm } from "./_components/form-company"

export default async function CompanyAdminPage() {
  const result = await getCompanySettings()
  const initialData = result.success ? result.data : null

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Empresa</h1>
        <p className="text-gray-500">Gerencie as informações institucionais, contatos e endereços da loja.</p>
      </div>
      
      <CompanyForm initialData={initialData} />
    </div>
  )
}
