import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import * as argon2 from "argon2"
import authConfig from "./auth.config"
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const email = credentials.email as string
        const { success } = checkRateLimit(email)
        
        if (!success) {
          throw new Error("Muitas tentativas falhas. Tente novamente mais tarde.")
        }

        const user = await prisma.user.findUnique({
          where: { email }
        })
        
        if (!user || !user.password) return null
        
        let isValid = false
        if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$")) {
          // Old bcrypt hash fallback
          isValid = await bcrypt.compare(credentials.password as string, user.password)
        } else {
          // New Argon2id hash
          isValid = await argon2.verify(user.password, credentials.password as string)
        }
        if (!isValid) return null
        
        // Login com sucesso, limpa as tentativas falhas
        resetRateLimit(email)
        
        return user
      }
    })
  ]
})
