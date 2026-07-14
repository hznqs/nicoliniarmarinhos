---
name: armarinho-design-system
description: Requisitos visuais e de design obrigatórios para o projeto Armarinho Premium (Fidelidade ao Stitch).
---

# Design System & Identidade Visual (Armarinho Premium)

## CSS Variables e Cores
O projeto utiliza **Tailwind v4** (no arquivo `src/app/globals.css`). 
TODOS os componentes construídos devem utilizar as variáveis nativas do Design gerado.
- Evite classes genéricas de cor do Tailwind (`bg-blue-500`, `text-red-400`). 
- Use variáveis exatas como: `text-primary`, `bg-surface`, `text-on-background`, `bg-[var(--color-primary-container)]`.
- As cores estão mapeadas na raiz `:root` e `@theme` do `globals.css`.

## Tipografia (Google Fonts)
- As fontes oficiais do projeto são `Inter` (sans-serif) e `Playfair Display` (serif).
- **Títulos (Headings/Display):** Devem utilizar as classes `font-heading` ou `font-display-lg`, `font-headline-md`, etc.
- **Textos e Parágrafos (Body):** Devem utilizar as classes `font-sans`, `font-body-md`, `font-body-lg`.

## Espaçamentos
- Utilize o sistema de grids e gaps do design, como `gap-[var(--spacing-gutter)]`.
- As margens base nas páginas são tratadas por: `px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto`.

## Componentes UI
- Substitua a biblioteca de ícones do Material Symbols por `lucide-react`.
- O layout das páginas institucionais DEVE permanecer exatamente como especificado nos exports HTML do Stitch (`_design_refs`).
