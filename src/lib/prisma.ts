import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

// Declaração robusta de variáveis globais para o padrão Singleton
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
  // eslint-disable-next-line no-var
  var pgPoolGlobal: Pool | undefined
}

// O Pool e o PrismaClient são criados uma única vez e guardados no globalThis.
// Isso previne vazamento de conexões tanto em desenvolvimento (HMR) quanto em produção (cold starts).
const pool = globalThis.pgPoolGlobal ?? new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = globalThis.prismaGlobal ?? new PrismaClient({ adapter })

// Guarda as instâncias globalmente para reutilização
globalThis.pgPoolGlobal = pool
globalThis.prismaGlobal = prisma
