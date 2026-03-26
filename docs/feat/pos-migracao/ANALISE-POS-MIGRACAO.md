# Análise Pós-Migração — CV App Next.js 16
**Data:** 26/03/2026 — *atualizado com decisões confirmadas; pronto para execução*  
**Referência:** https://almmello.com  
**Design System:** `docs/feat/pos-migracao/Design System 20260325 01.md`

---

## 1. Resumo Executivo

A migração gerou uma build estática funcional (sem erros de compilação), mas o resultado visual está inaceitável. Os problemas não são de conteúdo — todo o texto e links estão corretos — mas sim de CSS/layout, ícones desproporcionais e ausência de modernização de design. Este documento diagnostica cada problema com precisão e propõe um plano de refatoração com decisões fundamentadas.

---

## 2. Diagnóstico Técnico Detalhado

### 2.1 Imagens "Quebradas" — O Que Realmente Aconteceu

As imagens **existem** em `out/images/` (profile.jpg: 76 KB, fav2.png, codeable.png). O HTML gerado tem os `<img>` com `src="/images/profile.jpg"` — corretos para servir via HTTP. O problema surge ao abrir `out/index.html` direto no navegador via `file:///`: o caminho absoluto `/images/profile.jpg` não resolve localmente.

**Status:** As imagens não estão quebradas no build. Estão quebradas apenas quando o `index.html` é aberto como arquivo local, não via servidor HTTP. Quando servido corretamente (ex: `npx serve out`), as imagens aparecem.

**Impacto visual:** Médio — Provavelmente foi assim que o screenshot de referência foi capturado (abertura direta do HTML, não via servidor). Em produção (deploy real), as imagens funcionariam.

### 2.2 Globos Gigantes — Causa Raiz Identificada

Os enormes ícones de globo azul-escuro que dominam a página são os **dois links de MP4** na seção de Experience > "Product Manager". O `ProductManager.tsx` renderiza:

```tsx
<span className="fa-container text-center me-2">
  <FontAwesomeIcon icon={faGlobe} fixedWidth />
</span>
```

O CSS de `cv-style.scss` restringe `.fa-container` apenas dentro de `.resume-social`:

```scss
.resume-social .fa-container {
    width: 24px;
    height: 24px;
    /* ... */
}
```

Fora do contexto `.resume-social`, o `<span class="fa-container">` não tem dimensões definidas. O SVG do FontAwesome, sem container dimensionado, expande para ocupar todo o espaço disponível — resultando em globos com largura de ~1000px no layout.

**Impacto:** Crítico — Dois ícones de 1000px cada dominam toda a tela.

### 2.3 Bootstrap como CSS Pré-compilado — Perda de Customização

Para contornar o bug do Turbopack com `@import "bootstrap/scss/bootstrap"`, Bootstrap foi importado como CSS pré-compilado (`bootstrap.min.css`). Isso acarretou:

| Perda | Impacto |
|---|---|
| `$theme-colors` override não funciona | Badges de skills usam cinza Bootstrap padrão (não `#374161`) |
| `.btn-primary` parcialmente sobrescrito via CSS vars | Funciona apenas em browsers modernos |
| `bg-secondary` nos badges não usa a cor secundária customizada | Visual genérico, não alinhado ao Design System |
| Variáveis `$theme-color-primary` no `cv-style.scss` ainda funcionam | Via `@import` SCSS legado (funciona, mas deprecated) |

### 2.4 `font-weight-bold` Removido no Bootstrap 5

Bootstrap 5 removeu a utility class `font-weight-bold` em favor de `fw-bold`. O HTML gerado contém:

```html
<h3 class="resume-position-title font-weight-bold ...">
<h2 class="resume-section-title text-uppercase font-weight-bold ...">
```

**Impacto:** Todos os títulos de seção e posições de experiência aparecem sem negrito.

### 2.5 `height: 220px` Fixo no Header

O CSS atual:
```scss
.resume-header {
    background: $theme-color-primary;
    height: 220px;
}
```

Com o Bootstrap pré-compilado e a grid do React, o header tenta caber em 220px mas o conteúdo (foto 220x220 + nome + contatos + social links) tem muito mais altura. Em telas menores o header clipa o conteúdo. O media query `@media (max-width: 767.98px)` corrige para `height: auto` mas não está sendo aplicado corretamente pelo conflito de especificidade com Bootstrap.

### 2.6 Links do ProductManager com URL Errada

Os links dos MP4 estão com a URL antiga do servidor Flask:

```tsx
href="/rga/TIM-blah-Surfing-Bird-EN.mp4"
...
https://almmello.com.br/static/rga/TIM-blah-Surfing-Bird-EN.mp4
```

O `href` usa a path correta (`/rga/...`) para o arquivo local, mas o **texto do link** ainda exibe a URL antiga do Flask (`almmello.com.br/static/rga/...`). Visualmente confuso.

### 2.7 Ausência de Design System — Gap Estrutural

A migração focou em 1:1 fidelidade ao template Pillar/Bootstrap original, mas a identidade visual do Design System (arquivo `Design System 20260325 01.md`) não foi aplicada:

| Design System | Estado Atual |
|---|---|
| Tipografia: Montserrat Bold/Regular | ❌ Usando Roboto |
| Cor primária: `#374161` (Deep Navy) | ✅ Aplicada via `$theme-color-primary` |
| Interactive Blues: `#6374AD`, `#879FED` | ❌ Não implementados (links usam a cor primária) |
| Action Mint: `#71b399` para CTAs | ❌ Não implementado |
| Layout limpo e espaçoso | ⚠️ Template Pillar é funcional mas datado |
| Badges modernos | ❌ Bootstrap `bg-secondary` cinza padrão |

---

## 3. Decisão Estratégica: Bootstrap vs. Tailwind CSS

### 3.1 Análise Comparativa

| Critério | Bootstrap (atual) | Tailwind CSS |
|---|---|---|
| **Compatibilidade com Turbopack** | ❌ SCSS via `@import` quebra o Turbopack; forçou fallback para CSS pré-compilado | ✅ CSS-in-JS utility classes, sem problema de resolução de `@import` |
| **Customização de cores** | ❌ Perdemos override de variáveis Sass ao usar CSS pré-compilado | ✅ `tailwind.config.ts` com `extend.colors` para o Design System completo |
| **Tamanho do bundle CSS** | ❌ `bootstrap.min.css` = 230 KB no bundle independente do uso | ✅ PurgeCSS automático — só o que é usado vai para produção |
| **Integração com `next/font`** | ⚠️ Funciona mas não integra variáveis CSS da fonte automaticamente | ✅ `fontFamily` no config via CSS variables da `next/font` |
| **Design moderno** | ⚠️ Templates Bootstrap são reconhecíveis e datados | ✅ Tailwind não impõe estilo visual — design parte do zero |
| **Manutenção** | ⚠️ Depende de SCSS para customizar; Sass `@import` deprecated | ✅ Classes utilitárias diretamente no JSX; sem camada SCSS |
| **Curva de aprendizado** | ✅ Familiar | ✅ Rápido para quem já conhece CSS |

### 3.2 ✅ Decisão Confirmada: **Tailwind CSS**

**Justificativa:**

1. **Elimina definitivamente o problema do Turbopack + SCSS** — A causa raiz de todos os hacks CSS desta sessão.
2. **Permite implementação fiel do Design System** — Configurar `#374161`, `#6374AD`, `#879FED`, `#71b399` diretamente no `tailwind.config.ts`. Cada token do Design System vira uma classe Tailwind.
3. **Bundle menor em produção** — Bootstrap está adicionando 230 KB de CSS; Tailwind com PurgeCSS entrega ~5-15 KB para este volume de classes.
4. **Consistência** — Sem conflito entre classes Bootstrap (`bg-secondary`) e estilos customizados — todo o estilo fica no JSX.
5. **Design mais moderno** — Tailwind é a ferramenta padrão de projetos React/Next.js modernos em 2026; o design final não se "parece com Bootstrap".

**Custo da migração:** Médio. Reescrever className de cada componente (busca/substituição sistemática), remover bootstrap do package.json, adicionar tailwind. Estimativa: ~6h de trabalho.

---

## 4. Mapeamento Design System → Implementação Tailwind

### 4.1 Cores — bloco `@theme` em `globals.css` (Tailwind v4)

```css
@theme {
  --color-navy: #374161;               /* Deep Navy / Space Blue — cor dominante */
  --color-navy-dark: #293047;          /* Dark Slate — backgrounds secundários */
  --color-navy-header: #3F4A6E;        /* Header Blue — navegação e destaques */
  --color-blue-interactive: #6374AD;   /* Interactive Blues — links, botões secundários */
  --color-blue-light: #879FED;         /* Light Blue — hover states, toggles */
  --color-mint: #71b399;               /* Action Mint — CTAs, focus states, sucesso */
  --color-neutral-cool1: #dbe2ea;
  --color-neutral-cool2: #eaf0f5;
  --color-neutral-warm1: #E6E0D3;
  --color-neutral-warm2: #E2DBCD;
}
```

> **Tailwind v4 não usa `tailwind.config.ts`** — toda a configuração de tema fica no bloco `@theme {}` dentro do `globals.css`.

### 4.2 Tipografia

- **Substituir Roboto por Montserrat** (Design System §2)
- `next/font/google` com Montserrat, pesos `400`, `700`, `variable: '--font-montserrat'`
- Em `layout.tsx`: `<body className={montserrat.variable}>` expõe a CSS variable ao restante da árvore
- Em `globals.css`, no bloco `@theme`: `--font-sans: var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif;`
- `font-bold` para headings (já nativo no Tailwind)

### 4.3 Tokens de Componentes

| Componente | Design System | Classe Tailwind |
|---|---|---|
| Header background | Deep Navy `#374161` | `bg-navy` |
| Section title | `#374161` + underline | `text-navy border-b border-navy/30` |
| Timeline dot | `#374161` border | `border-navy` |
| Skill badge | Interactive Blue `#6374AD` | `bg-blue-interactive text-white` |
| Social icon box | White bg + navy icon | `bg-white text-navy` |
| Links | Interactive Blue | `text-blue-interactive hover:text-blue-light` |
| CTA (download PDF) | Action Mint | `text-mint hover:opacity-80` |
| Body text | `#374161` + 10% lightness | `text-navy/70` |

---

## 5. Plano de Ajuste

### Fase 1 — Fundação CSS (Tailwind v4 + Design System)

**Etapa 1.1 — Remover Bootstrap e Sass; instalar Tailwind v4**
```bash
# Remover dependências antigas
npm uninstall bootstrap sass

# Instalar Tailwind v4 (versão confirmada: 4.2.2)
npm install -D tailwindcss @tailwindcss/postcss postcss
```

**Etapa 1.2 — Criar `postcss.config.mjs`**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Etapa 1.3 — Criar `styles/globals.css`** (substitui `globals.scss`)
```css
@import "tailwindcss";

@theme {
  /* Cores do Design System */
  --color-navy: #374161;
  --color-navy-dark: #293047;
  --color-navy-header: #3F4A6E;
  --color-blue-interactive: #6374AD;
  --color-blue-light: #879FED;
  --color-mint: #71b399;
  --color-neutral-cool1: #dbe2ea;
  --color-neutral-cool2: #eaf0f5;

  /* Tipografia — usa a CSS variable exposta pelo next/font */
  --font-sans: var(--font-montserrat), 'Helvetica Neue', Arial, sans-serif;
}
```

> **Não existe `tailwind.config.ts` em Tailwind v4** — todas as customizações ficam no `@theme` acima.

**Etapa 1.4 — Atualizar `app/layout.tsx`**
```tsx
// Substituir:
import { Roboto } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/globals.scss'

// Por:
import { Montserrat } from 'next/font/google'
import '@/styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
})

// No <body>:
<body className={montserrat.variable}>
```

**Etapa 1.5 — Apagar `styles/globals.scss` e `styles/cv-style.scss`**
Estes dois arquivos SCSS não têm mais utilidade após a migração para Tailwind.

---

### Fase 2 — Reescrever Componentes

**Etapa 2.1 — `ResumeHeader.tsx`**  
Prioridade máxima. Problemas identificados:
- `height: 220px` fixo → alterar para `min-h-[220px]` ou `h-auto`
- Três colunas em telas grandes, layout vertical em mobile
- Foto com borda arredondada de enfeite
- Ícones sociais com caixas navy/white correctly sized

**Etapa 2.2 — `app/page.tsx` + seção de Experience**  
- Substituir classes Bootstrap (`container-fluid`, `row`, `col-sm-6`)
- Modernizar timeline: linha vertical + pontos decorativos com Tailwind
- Corrigir `font-weight-bold` → `font-bold`

**Etapa 2.3 — ProductManager.tsx (hotfix crítico)**
- Remover `<span className="fa-container">` dos links de MP4 — a classe não tem dimensões fora do contexto `.resume-social`, causando os globos de ~1000px
- Usar ícone inline com largura fixa: `<FontAwesomeIcon icon={faFilm} className="w-4 h-4 inline mr-1 print:hidden" />`
- Exibir texto de link limpo (ex: `"TIM BLA — Surfing Bird (EN)"`), sem a URL antiga do Flask

**Tratamento de impressão (print) — decisão confirmada:**
```tsx
<a
  href="/rga/TIM-blah-Surfing-Bird-EN.mp4"
  className="text-blue-interactive hover:text-blue-light underline
             print:no-underline print:text-navy"
  target="_blank"
  rel="noopener noreferrer"
>
  <FontAwesomeIcon icon={faFilm} className="w-4 h-4 inline mr-1 print:hidden" />
  TIM BLA — Surfing Bird (EN)
</a>
```
Adicionar ao bloco `@media print` no `globals.css`:
```css
@media print {
  a[href]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #666; }
}
```

**Etapa 2.4 — Skill Badges**  
- Substituir `<span className="badge bg-secondary">` por classe Tailwind com Interactive Blue `#6374AD`

**Etapa 2.5 — Education, Languages, Awards**  
- Substituir classes Bootstrap por equivalentes Tailwind

**Etapa 2.6 — `ResumeFooter.tsx`**  
- Apenas ajuste cosmético de spacing

---

### Fase 3 — Modernização Visual

**Etapa 3.1 — Header Redesenhado**  
- Altura mais generosa (`min-h-56` ou `min-h-64`)  
- Gradiente sutil: `bg-gradient-to-r from-navy-dark to-navy`
- Foto com borda arredondada maior (`rounded-2xl`)
- Nome em Montserrat Bold, tracking ampliado

**Etapa 3.2 — Seções com Espaçamento Moderno**  
- Mais `padding` e `gap` entre seções (whitespace generoso, conforme Design System §1)
- Títulos de seção com sublinhado fino `#374161` (manter identidade visual)

**Etapa 3.3 — Timeline de Experiência**  
- Linha vertical com `border-l-2 border-navy/20`
- Ponto decorativo: `w-3 h-3 rounded-full bg-navy border-2 border-white ring-2 ring-navy/20`

**Etapa 3.4 — Cards de Skills**  
- Pills com Interactive Blue `#6374AD`: `bg-[#6374AD]/10 text-[#6374AD] border border-[#6374AD]/30`
- Hover state com `hover:bg-[#6374AD]/20`

---

### Fase 4 — Validação

**Etapa 4.1 — `npx next build`** → Confirmar 0 erros  
**Etapa 4.2 — `npx serve out`** → Abrir http://localhost:3000 e revisar visualmente  
**Etapa 4.3 — Comparação com https://almmello.com** → Todo conteúdo presente e correto  
**Etapa 4.4 — Mobile (375px)** → Header, timeline e footer responsivos  

---

## 6. Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Ícone FA renomeado em v6 (`faMobileAlt` → `faMobileScreen`, `faGithubAlt` → `faGithub`) | Média | Build error aponta o nome correto imediatamente; ajuste pontual |
| `cases/page.tsx` sem análise prévia | Baixa | Mesma heurística de substituição Bootstrap → Tailwind; nenhum risco de regressão de conteúdo |
| Turbopack + `@tailwindcss/postcss` v4 edge case em `next dev` | Baixa | Workaround: `next dev` sem `--turbo`; `next build` não usa Turbopack e deve funcionar sem problemas |

---

## 7. O Que Não Muda

- Estrutura de rotas: `/` e `/cases/` continuam sendo as mesmas rotas
- Conteúdo de texto: 100% correto e fiel ao original
- FontAwesome React: mantido (não requer Bootstrap)
- `output: 'export'` e `trailingSlash: true` no `next.config.ts`
- Arquivos em `public/`: `profile.jpg`, PDFs, MP4s permanecem inalterados
- `next/image` para as imagens (`unoptimized: true`)
- Estrutura de componentes: mesma hierarquia, apenas classes CSS mudam

---

## 8. Decisões Confirmadas

Todas as decisões abaixo foram confirmadas pelo autor antes da execução.

| # | Questão | Decisão Confirmada |
|---|---|---|
| 1 | Framework CSS | **Tailwind CSS v4** — `bootstrap` e `sass` removidos do `package.json` |
| 2 | Escopo de execução | **Fases 1 + 2 + 3 juntas** — nenhuma iteração separada para modernização |
| 3 | Links dos MP4 | **Texto simples + ícone `faFilm`** — ícone oculto no print (`print:hidden`); URL completa exibida como texto no print via `a[href]::after { content: " (" attr(href) ")" }` |

---

## 9. Go/No-Go — Avaliação Formal

### Critérios Técnicos

| Critério | Status | Detalhe |
|---|---|---|
| `next build` gera `out/` sem erros de compilação | ✅ GO | Confirmado na sessão de migração (Flask → Next.js) |
| `output: 'export'` e `trailingSlash: true` em `next.config.ts` | ✅ GO | Nenhuma mudança necessária neste arquivo |
| Assets em `public/` presentes e corretos | ✅ GO | `profile.jpg`, `fav2.png`, `codeable.png`, PDFs, MP4s verificados |
| FontAwesome `@6.7.2` compatível com Tailwind | ✅ GO | FA usa SVG inline; sem dependência de Bootstrap |
| Tailwind CSS v4 disponível no registry npm | ✅ GO | `tailwindcss@4.2.2` + `@tailwindcss/postcss@4.2.2` confirmados |
| `postcss.config.mjs` inexistente (precisa ser criado) | ✅ GO | Coberto pela Etapa 1.2 |
| `globals.scss` → `globals.css` com `@import "tailwindcss"` + `@theme {}` | ✅ GO | Coberto pela Etapa 1.3 |
| `bootstrap` e `sass` no `package.json` para remoção explícita | ✅ GO | `npm uninstall bootstrap sass` na Etapa 1.1 |
| Node.js v22.15.0 / npm 11.3.0 no ambiente | ✅ GO | Compatíveis com Tailwind v4 e Next.js 16.2.1 |
| Todos os componentes a modificar identificados | ✅ GO | 7 componentes mapeados + `cases/page.tsx` como pendente de revisão |

### Veredicto

> **✅ GO — Autorizado para execução imediata.**
>
> Todos os 10 critérios técnicos estão satisfeitos. Os 3 riscos residuais são de probabilidade baixa/média, todos com mitigação direta e sem bloqueador. As Fases 1, 2 e 3 podem ser executadas na sequência definida neste documento.
