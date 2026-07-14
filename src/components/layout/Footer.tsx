import Link from "next/link"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { prisma } from "@/lib/prisma"

export async function Footer() {
  const company = await prisma.company.findFirst()
  
  const phoneRaw = company?.whatsapp || company?.phone || "5511999999999"
  const phoneClean = phoneRaw.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${phoneClean}?text=Olá! Vim pelo site e gostaria de conversar.`

  return (
    <footer className="bg-[var(--color-input)] w-full pt-16 pb-8 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-gutter)] max-w-[var(--spacing-container-max)] mx-auto mb-16">
        <div>
          <div className="font-heading text-[32px] md:text-[48px] text-primary mb-6 font-bold tracking-tight">
            {company?.name || "Armarinho"}
          </div>
          <p className="font-sans text-[16px] text-muted-foreground mb-6 leading-relaxed">
            {company?.aboutText ? company.aboutText.slice(0, 100) + '...' : "A essência do seu artesanato com materiais premium e atendimento especializado."}
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Siga-nos no Facebook">
              <FaFacebook className="text-secondary hover:text-primary transition-colors cursor-pointer w-6 h-6" aria-hidden="true" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Siga-nos no Instagram">
              <FaInstagram className="text-secondary hover:text-primary transition-colors cursor-pointer w-6 h-6" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-[24px] text-primary mb-6 font-semibold">Contato</h4>
          <ul className="space-y-4">
            {company?.address && (
              <li><span className="font-sans text-[16px] text-muted-foreground">{company.address} - {company.city}/{company.state}</span></li>
            )}
            {company?.phone && (
              <li><a href={`tel:${company.phone}`} className="font-sans text-[16px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{company.phone}</a></li>
            )}
            {company?.email && (
              <li><a href={`mailto:${company.email}`} className="font-sans text-[16px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{company.email}</a></li>
            )}
            <li><a className="font-sans text-[16px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp: {company?.whatsapp || "Entrar em contato"}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-[24px] text-primary mb-6 font-semibold">Explore</h4>
          <ul className="space-y-4">
            <li><Link className="font-sans text-[16px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" href="/produtos">Produtos</Link></li>
            <li><Link className="font-sans text-[16px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" href="/categorias">Categorias</Link></li>
            <li><Link className="font-sans text-[16px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline" href="/sobre">Sobre Nós</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-[24px] text-primary mb-6 font-semibold">Newsletter</h4>
          <p className="font-sans text-[16px] text-muted-foreground mb-4">Receba novidades e ofertas exclusivas.</p>
          <div className="flex flex-col space-y-4">
            <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
            <input id="newsletter-email" className="bg-transparent border-b border-secondary focus:border-[var(--color-primary-container)] outline-none py-2 font-sans text-[16px] text-foreground transition-colors" placeholder="Seu e-mail" type="email" aria-label="E-mail para assinar a newsletter" />
            <button type="button" className="bg-[#0D0D0D] text-white px-6 py-3 rounded font-sans text-[14px] font-medium hover:bg-[var(--color-primary-container)] hover:text-white transition-colors duration-300 w-fit" aria-label="Assinar newsletter">
              Assinar
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-ring)] pt-8 text-center max-w-[var(--spacing-container-max)] mx-auto">
        <p className="font-sans text-[12px] text-muted-foreground">© {new Date().getFullYear()} {company?.name || "Armarinho"}. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
