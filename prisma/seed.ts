import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import * as argon2 from "argon2"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      "❌ Variáveis de ambiente obrigatórias não definidas.\n" +
      "Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD no seu .env antes de rodar o seed."
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const hashedPassword = await argon2.hash(password)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    console.log(`✅ Senha do admin atualizada com sucesso para: ${email}`)
    return
  }

  const hashedPassword = await argon2.hash(password)

  await prisma.user.create({
    data: {
      name: "Administrador",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log(`✅ Conta admin criada com sucesso para: ${email}`)
  console.log("🔒 A senha foi armazenada com hash Argon2id. Nunca a exponha em logs.")
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seed:", error.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
