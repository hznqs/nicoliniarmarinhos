import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "ADMIN" | "MANAGER"
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
