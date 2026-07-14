import { prisma } from "./src/lib/prisma"
import * as argon2 from "argon2"

async function main() {
  const email = "admin@armarinho.com"
  const password = "admin" // A senha inicial

  const hashedPassword = await argon2.hash(password)

  // Verifica se já existe
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Usuário admin já existe! Atualizando a senha para 'admin'...")
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, role: "ADMIN" }
    })
    console.log("Senha atualizada com sucesso.")
    return
  }

  await prisma.user.create({
    data: {
      name: "Administrador",
      email: email,
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log("Usuário admin criado com sucesso!")
  console.log("E-mail:", email)
  console.log("Senha:", password)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
