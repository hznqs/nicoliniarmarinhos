"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function DesktopNav() {
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/produtos", label: "Produtos" },
    { href: "/categorias", label: "Categorias" },
    { href: "/produtos?q=novidade", label: "Novidades" },
    { href: "/produtos?q=promoção", label: "Promoções" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-8 flex-none justify-center" aria-label="Navegação principal">
      {navLinks.map(({ href, label }) => {
        // Para a home "/", só é ativo se o pathname for exatamente "/"
        // Para os outros, verifica se o pathname começa com o href
        const isActive = 
          href === "/" 
            ? pathname === "/"
            : href.includes("?q=") // Trata links com query params
              ? false // Query params não definem pathname ativo diretamente
              : pathname.startsWith(href)

        return (
          <Link 
            key={label}
            href={href}
            className={`font-sans text-[16px] transition-colors duration-300 ${
              isActive 
                ? "text-primary border-b-2 border-primary pb-1 font-medium" 
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
