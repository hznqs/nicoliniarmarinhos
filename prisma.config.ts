import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // url: utilizado pelo PrismaClient em runtime (via pool de conexões do Neon)
    url: process.env["DATABASE_URL"],
    // directUrl: utilizado pelo prisma migrate e prisma studio (conexão direta, sem pooler)
    // Para Neon: remove "-pooler" do host na DATABASE_URL e defina como DIRECT_URL
    // Exemplo: ep-mute-violet-ac4xrfg4.sa-east-1.aws.neon.tech (sem -pooler)
    ...(process.env["DIRECT_URL"] ? { directUrl: process.env["DIRECT_URL"] } : {}),
  },
})
