import type { NextConfig } from "next"

const R2_PUBLIC_HOSTNAME = (() => {
  try {
    return process.env.CLOUDFLARE_PUBLIC_URL
      ? new URL(process.env.CLOUDFLARE_PUBLIC_URL).hostname
      : ""
  } catch {
    return ""
  }
})()

const securityHeaders = [
  // Proíbe o site de ser embutido em iframes de outros domínios (Clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Impede que o browser faça MIME-sniffing do tipo de conteúdo declarado
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Força HTTPS por 2 anos em todos os subdomínios
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Controla informações de referrer enviadas em requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desativa funcionalidades de browser não utilizadas
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Prefetch de DNS para performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy — define origens confiáveis para cada tipo de recurso
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: 'unsafe-inline' necessário para Next.js, remover quando possível
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Estilos: inline necessário para Tailwind + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Imagens: R2 público + Google (para avatares de auth) + dados inline
      `img-src 'self' data: blob: ${R2_PUBLIC_HOSTNAME ? `https://${R2_PUBLIC_HOSTNAME}` : ""} https://lh3.googleusercontent.com`,
      // Fontes: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Conexões: self apenas (adicionar domínios de analytics/monitoring quando necessário)
      "connect-src 'self'",
      // Frames: permite iframes do Google Maps
      "frame-src 'self' https://www.google.com/maps/ https://maps.google.com/",
      // Objetos plugin: nenhum (Flash, etc.)
      "object-src 'none'",
      // Base URI: limita redirecionamentos de base tag
      "base-uri 'self'",
      // Forms: apenas para o próprio domínio
      "form-action 'self'",
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Aplicar headers em todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // Limitar tamanho do body de Server Actions para 5MB (prevenção de DoS)
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
}

import { withSentryConfig } from "@sentry/nextjs"

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "armarinho-premium",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: true
  }
})
