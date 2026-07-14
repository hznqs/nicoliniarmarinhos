import Link from "next/link"
import { auth } from "@/auth"
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Building,
  Globe,
} from "lucide-react"
import { AdminMobileMenu } from "./_components/AdminMobileMenu"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    const { redirect } = await import("next/navigation")
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar — visível apenas em desktop (md+) */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0 flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b">
          <span className="font-heading text-xl font-bold text-primary">Admin Panel</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Navegação do painel">
          <Link href="/admin" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" aria-hidden="true" />
            Dashboard
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-commerce</p>
          </div>
          <Link href="/admin/products" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Package className="w-5 h-5 mr-3" aria-hidden="true" />
            Produtos
          </Link>
          <Link href="/admin/categories" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Tags className="w-5 h-5 mr-3" aria-hidden="true" />
            Categorias
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Institucional</p>
          </div>
          <Link href="/admin/leads" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Users className="w-5 h-5 mr-3" aria-hidden="true" />
            Leads
          </Link>
          <Link href="/admin/testimonials" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <MessageSquare className="w-5 h-5 mr-3" aria-hidden="true" />
            Depoimentos
          </Link>
          <Link href="/admin/banners" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <ImageIcon className="w-5 h-5 mr-3" aria-hidden="true" />
            Banners
          </Link>
          <Link href="/admin/company" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Building className="w-5 h-5 mr-3" aria-hidden="true" />
            Empresa
          </Link>
        </nav>

        <div className="p-4 border-t flex flex-col gap-2">
          <Link href="/" target="_blank" className="flex w-full items-center px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors mb-2 font-medium">
            <Globe className="w-4 h-4 mr-3" aria-hidden="true" />
            Ver Site
          </Link>
          <div className="text-sm font-medium text-gray-900 truncate">
            {session?.user?.name || "Usuário"}
          </div>
          <div className="text-xs text-gray-500 truncate">{session?.user?.email}</div>
          <form action={async () => {
            "use server"
            const { signOut } = await import("@/auth")
            await signOut({ redirectTo: "/login" })
          }}>
            <button type="submit" className="flex w-full items-center px-3 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <LogOut className="w-4 h-4 mr-3" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile — visível apenas em telas menores que md */}
        <header className="h-16 bg-white shadow-sm flex items-center px-4 md:hidden">
          {/* Menu mobile com estado real */}
          <AdminMobileMenu
            userName={session?.user?.name}
            userEmail={session?.user?.email}
          />
          <span className="ml-4 font-heading text-lg font-bold text-primary">Admin</span>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
