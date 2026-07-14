import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Configuração base (home, contato, sobre)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://armarinhopremium.vercel.app'

  const routes = [
    '',
    '/produtos',
    '/categorias',
    '/sobre',
    '/contato',
    '/promocoes',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Obter Produtos Dinâmicos
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
  })

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/produtos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Obter Categorias Dinâmicas
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    select: { slug: true, updatedAt: true },
  })

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categorias/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...categoryRoutes, ...productRoutes]
}
