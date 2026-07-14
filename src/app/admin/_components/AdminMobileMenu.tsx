"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard, Package, Tags, Users, Settings,
  Image as ImageIcon, MessageSquare, LogOut, Building,
  Menu, X, Globe
} from "lucide-react"

interface AdminMobileMenuProps {
  userName?: string | null
  userEmail?: string | null
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Produtos", group: "E-commerce" },
  { href: "/admin/categories", icon: Tags, label: "Categorias" },
  { href: "/admin/leads", icon: Users, label: "Leads", group: "Institucional" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Depoimentos" },
  { href: "/admin/banners", icon: ImageIcon, label: "Banners" },
  { href: "/admin/company", icon: Building, label: "Empresa" },
]

export function AdminMobileMenu({ userName, userEmail }: AdminMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* Botão hambúrguer — visível apenas em mobile */}
      <button
        className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu de navegação do painel"
        aria-expanded={isOpen}
        aria-controls="admin-mobile-nav"
      >
        <Menu className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <nav
        id="admin-mobile-nav"
        role="dialog"
        aria-label="Menu do painel administrativo"
        aria-modal="true"
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Cabeçalho */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <span className="font-heading text-xl font-bold text-primary">Admin Panel</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ href, icon: Icon, label, group }, index) => {
            const prevGroup = index > 0 ? navItems[index - 1].group : undefined
            const showGroupHeader = group && group !== prevGroup

            return (
              <div key={href}>
                {showGroupHeader && (
                  <div className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{group}</p>
                  </div>
                )}
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
                  {label}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Rodapé com usuário e logout */}
        <div className="p-4 border-t flex flex-col gap-2">
          <Link href="/" target="_blank" className="flex w-full items-center px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors mb-2 font-medium">
            <Globe className="w-4 h-4 mr-3" aria-hidden="true" />
            Ver Site
          </Link>
          <div className="text-sm font-medium text-gray-900 truncate">{userName || "Usuário"}</div>
          <div className="text-xs text-gray-500 truncate">{userEmail}</div>
          <button 
            onClick={() => {
              import("next-auth/react").then(({ signOut }) => signOut({ callbackUrl: "/login" }))
            }}
            className="flex w-full items-center px-3 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" aria-hidden="true" />
            Sair
          </button>
        </div>
      </nav>
    </>
  )
}
