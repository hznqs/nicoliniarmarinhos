---
name: armarinho-admin-workflow
description: Fluxo de trabalho oficial para a criação de rotas e funcionalidades no Painel Administrativo.
---

# Fluxo de Trabalho de Criação de Entidades (CRUD Admin)

## 1. Banco de Dados e API Backend
- **Prisma Schema:** Verifique se a entidade já está modelada no `schema.prisma`. Se não estiver, atualize o modelo e peça ao `BackendArchitect` ou gerencie o `npx prisma db push`.
- **Server Actions:** Toda nova entidade precisa de um arquivo em `src/server/actions/[entidade].ts`. (Verifique a skill `nextjs15-server-actions-pro` para boas práticas de Zod e Revalidation).

## 2. Frontend de Tabelas (TanStack Table)
- **Estrutura de Pastas:**
  Toda tabela do admin deve seguir a organização:
  - `src/app/admin/[entidade]/page.tsx` (Server Component que consome os dados)
  - `src/app/admin/[entidade]/_components/columns.tsx` (Definição da tabela)
  - `src/app/admin/[entidade]/_components/data-table.tsx` (A tabela renderizada via Shadcn)
  - `src/app/admin/[entidade]/_components/form-[entidade].tsx` (Opcional - para diálogos/modais de edição)

## 3. Segurança (RBAC)
O acesso às páginas `/admin` é globalmente restrito, mas em componentes individuais ou Server Actions, certifique-se sempre de validar `if (session.user.role === 'USER') throw "Unauthorized"`.
