import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/store/CartDrawer";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://armarinhopremium.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Armarinho Premium",
    template: "%s | Armarinho Premium",
  },
  description: "A essência do seu artesanato com materiais premium. Compre lãs, linhas, tecidos e acessórios para costura.",
  openGraph: {
    title: "Armarinho Premium",
    description: "A essência do seu artesanato com materiais premium. Compre lãs, linhas, tecidos e acessórios para costura.",
    url: siteUrl,
    siteName: "Armarinho Premium",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Armarinho Premium",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Armarinho Premium",
    description: "A essência do seu artesanato com materiais premium.",
    images: ["/og-image.jpg"],
  },
};

const getCachedWhatsapp = unstable_cache(
  async () => {
    const company = await prisma.company.findFirst({
      select: { whatsapp: true, phone: true },
    })
    const raw = company?.whatsapp || company?.phone || ""
    return raw.replace(/\D/g, "")
  },
  ["company-whatsapp"],
  { revalidate: 3600, tags: ["company"] }
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappPhone = await getCachedWhatsapp()
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body className="antialiased font-sans bg-background text-foreground overflow-x-hidden">
        <CartProvider>
          {children}
          <CartDrawer whatsappPhone={whatsappPhone} />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
