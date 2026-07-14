<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Armarinho Premium Rules

## Subagentes Disponíveis
Neste projeto, utilizamos uma arquitetura de Subagentes. Para qualquer tarefa grande, considere invocar um dos seguintes agentes via `invoke_subagent`:
- **`AdminBuilder`**: Para qualquer tela, formulário ou tabela dentro da pasta `src/app/admin`.
- **`FrontendArtisan`**: Para qualquer página pública (Vitrine, Produtos, Home).
- **`BackendArchitect`**: Para modificar `schema.prisma`, rotas de API ou `src/server/actions`.

## Skills Obrigatórias
Antes de iniciar o desenvolvimento, o agente atual DEVE ler as seguintes skills (usando `view_file` se for no diretório local, ou assumindo as diretrizes se estiver no system prompt):
- CRUDs de Admin: Leia `.agents/skills/armarinho_admin_workflow/SKILL.md`
- Telas Públicas: Leia `.agents/skills/armarinho_design_system/SKILL.md`
