"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import { CartIcon } from "@/components/ui/CartIcon"

interface MobileMenuProps {
  whatsappUrl: string
  companyName: string
}

export function MobileMenu({ whatsappUrl, companyName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Fechar menu ao apertar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Bloquear scroll do body quando menu está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/produtos", label: "Produtos" },
    { href: "/categorias", label: "Categorias" },
    { href: "/artesanal", label: "Artesanal" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ]

  return (
    <>
      {/* Botão hambúrguer + ícone do carrinho lado a lado no mobile */}
      <div className="md:hidden flex items-center gap-3">
        <CartIcon />
        <button
          className="text-primary p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu de navegação"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>

      {/* Overlay escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer lateral */}
      <nav
        id="mobile-nav"
        role="dialog"
        aria-label="Menu de navegação mobile"
        aria-modal="true"
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-surface shadow-2xl
          flex flex-col transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Cabeçalho do drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="font-heading text-xl font-bold text-primary">{companyName}</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Links de navegação */}
        <ul className="flex-1 overflow-y-auto py-4 px-4 space-y-1" role="list">
          {navLinks.map(({ href, label }) => {
            const isActive = 
              href === "/" 
                ? pathname === "/"
                : href.includes("?q=") 
                  ? false 
                  : pathname.startsWith(href)

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-3 text-base rounded-md transition-colors font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-on-surface hover:bg-accent hover:text-primary border-l-4 border-transparent"
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Ações no rodapé */}
        <div className="p-4 border-t border-border space-y-3">
          <Link
            href="/contato"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-full bg-foreground text-background px-4 py-3 rounded-md font-medium text-sm hover:bg-primary transition-colors"
          >
            Solicitar Orçamento
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-full border border-border text-on-surface px-4 py-3 rounded-md font-medium text-sm hover:border-primary hover:text-primary transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </nav>
    </>
  )
}
