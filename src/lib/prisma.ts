import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = process.env.DATABASE_URL

// Definindo os tipos globais de forma robusta
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
  // eslint-disable-next-line no-var
  var pgPoolGlobal: Pool | undefined
}

// 1. Instancia o Pool uma única vez e guarda em cache no objeto global
const pool = globalThis.pgPoolGlobal ?? new Pool({ connectionString })
if (process.env.NODE_ENV !== "production") {
  globalThis.pgPoolGlobal = pool
}

// 2. Cria o adaptador
const adapter = new PrismaPg(pool)

// 3. Função padrão para criar o Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

// 4. Cria e guarda o PrismaClient no objeto global
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}
