import type { NextAuthConfig } from "next-auth"

export default {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "USER" | "ADMIN" | "MANAGER"
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
} satisfies NextAuthConfig
