import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Guard que garante que o usuário está autenticado e possui role ADMIN ou MANAGER.
 * Deve ser chamado no início de TODA Server Action de mutação (create/update/delete).
 *
 * Lança redirect para /login se não autenticado.
 * Lança Error("Forbidden") se autenticado mas sem permissão suficiente.
 *
 * @returns A sessão autenticada do usuário com garantia de role adequado.
 */
export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const role = session.user.role
  if (role !== "ADMIN" && role !== "MANAGER") {
    throw new Error("Forbidden: você não tem permissão para executar esta ação.")
  }

  return session
}
