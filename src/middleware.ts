import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// Um Map simples para Rate Limiting na Edge (cada isolate terá o seu, mas serve contra brute-force ingênuo)
const rateLimitMap = new Map<string, { count: number; startTime: number }>()
const RATE_LIMIT_MAX = 5 // máximo de tentativas
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minuto

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") || "127.0.0.1"
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = nextUrl.pathname.startsWith("/login")

  // Resposta base que será clonada/retornada para injetar headers
  let response = NextResponse.next()

  // 1. RATE LIMITING (Aplicado apenas nas rotas de Autenticação POST - tentativas de login)
  if (req.method === "POST" && isApiAuthRoute) {
    const ip = getClientIp(req)
    const now = Date.now()
    const rateLimitInfo = rateLimitMap.get(ip)

    if (rateLimitInfo) {
      if (now - rateLimitInfo.startTime < RATE_LIMIT_WINDOW_MS) {
        if (rateLimitInfo.count >= RATE_LIMIT_MAX) {
          // Bloqueia a requisição retornando 429 Too Many Requests
          return new NextResponse("Too Many Requests. Please try again later.", { status: 429 })
        }
        rateLimitInfo.count++
      } else {
        rateLimitMap.set(ip, { count: 1, startTime: now })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: now })
    }

    // Prevenção de memory leak no Map (limpar entradas velhas ocasionalmente)
    if (rateLimitMap.size > 1000) {
      rateLimitMap.clear()
    }
  }

  // 2. CONTROLE DE ROTAS (Autenticação)
  if (isAuthRoute) {
    if (isLoggedIn) {
      response = NextResponse.redirect(new URL("/admin", nextUrl))
    }
  } else if (isAdminRoute) {
    if (!isLoggedIn) {
      response = NextResponse.redirect(new URL("/login", nextUrl))
    } else if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      response = NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // 3. SECURITY HEADERS (Injetados em todas as respostas passando pelo middleware)
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return response
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/auth/:path*"],
}
