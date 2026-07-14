import Link from "next/link"
import { User, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"
import { MobileMenu } from "./MobileMenu"
import { DesktopNav } from "./DesktopNav"

// Cache da empresa por 1 hora — dados raramente mudam e o Header é renderizado em cada página
const getCachedCompany = unstable_cache(
  async () => prisma.company.findFirst(),
  ["company-settings"],
  { revalidate: 3600, tags: ["company"] }
)

export async function Header() {
  const company = await getCachedCompany()

  const phoneRaw = company?.whatsapp || company?.phone || "5511999999999"
  const phoneClean = phoneRaw.replace(/\D/g, "")
  const whatsappUrl = `https://wa.me/${phoneClean}?text=Olá! Vim pelo site e gostaria de conversar.`
  const companyName = company?.name || "Armarinho"

  return (
    <header className="bg-surface shadow-[0px_10px_30px_rgba(0,0,0,0.04)] top-0 sticky z-50">
      <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-[1460px] mx-auto h-20 md:h-28 gap-4 md:gap-8">
        {/* Logo */}
        <div className="flex-1 flex justify-start font-heading text-display-lg-mobile md:text-[32px] text-primary tracking-tight font-bold items-center gap-2">
          {company?.logoUrl ? (
            <Link href="/" aria-label={`Ir para a página inicial — ${companyName}`} className="inline-block w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={company.logoUrl} alt={companyName} className="h-full max-h-[60px] md:max-h-[90px] w-auto max-w-[200px] md:max-w-[280px] object-contain object-left -ml-2" />
            </Link>
          ) : (
            <Link href="/">{companyName}</Link>
          )}
        </div>

        {/* Navegação desktop */}
        <DesktopNav />

        {/* Ações desktop */}
        <div className="hidden md:flex flex-1 justify-end items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Link href="/login" aria-label="Acessar login">
              <User className="text-primary cursor-pointer hover:text-[var(--color-primary-container)] transition-colors duration-300 w-6 h-6" aria-hidden="true" />
            </Link>
            <Link href="/produtos" aria-label="Buscar produtos">
              <Search className="text-primary cursor-pointer hover:text-[var(--color-primary-container)] transition-colors duration-300 w-6 h-6" aria-hidden="true" />
            </Link>
          </div>
          <Link
            href="/contato"
            className="bg-[#0D0D0D] text-white px-6 py-3 rounded font-sans text-[14px] font-medium hover:bg-[var(--color-primary-container)] hover:text-white transition-colors duration-300 scale-95 hover:scale-100"
          >
            Orçamento
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-[#0D0D0D] text-[#0D0D0D] px-6 py-3 rounded font-sans text-[14px] font-medium hover:border-[var(--color-primary-container)] hover:text-[var(--color-primary-container)] transition-colors duration-300 scale-95 hover:scale-100"
          >
            WhatsApp
          </a>
        </div>

        {/* Menu mobile — componente cliente com estado real */}
        <MobileMenu whatsappUrl={whatsappUrl} companyName={companyName} />
      </div>
    </header>
  )
}
