# Plano de Migração: Flask → Next.js

## 1. Visão Geral do Projeto Atual

### Stack Atual (Python / Flask)

| Camada | Tecnologia |
|---|---|
| Framework web | Flask 1.1.2 |
| Templates | Jinja2 com `{% include %}` |
| Estilos | SCSS (Bootstrap 5 + cv-style.scss customizado) |
| Ícones | FontAwesome 5 (JS local, `all.min.js`) |
| Geração estática | Frozen-Flask (`bFrozen.py`) → output em `project/build/` |
| Servidor de dev | Flask (`app.py`) |

### Rotas existentes

| Rota Flask | Template | Descrição |
|---|---|---|
| `/` | `templates/home.html` | Currículo completo (CV) |
| `/cases/` | `templates/cases.html` | Portfólio de cases em vídeo |

### Estrutura de includes (Jinja2)

`home.html` monta a página incluindo partes isoladas:

> **Arquivos orphans:** `c01-education.html` e `c02-additional-information.html` existem na pasta `content/` mas **não são referenciados por nenhum `{% include %}`** em nenhum template. Seu conteúdo (Education, Language, Awards) já está hardcoded diretamente no HTML de `home.html`. Esses arquivos parecem ser remanescentes de uma versão anterior para geração de PDF e **não serão migrados** como componentes.

```
templates/
  home.html                        ← página principal
  cases.html                       ← página de cases
  content/
    a01-about.html                 ← texto da seção "About" (incluído via Jinja2)
    c01-education.html             ← ORPHAN: não incluído em nenhum template
    c02-additional-information.html← ORPHAN: não incluído em nenhum template
    experience/
      b01-product-manager.html     ← bullets da experiência
      b02-goalmoon.html
      b03-project-manager.html
      b04-technical-advisor.html
      b05-directlink.html
    skills/
      b01-skills-product-manager.html  ← tags de skills
      b02-skills-goalmoon.html
      b03-skills-project-manager.html
      b04-skills-technical-advisor.html
      b05-skills-directlink.html
    links/
      b01-links-product-manager.html
      b02-links-goalmoon.html
```

### Assets estáticos atuais

```
project/static/
  css/cv-style.css        ← CSS pré-compilado do SCSS
  scss/cv-style.scss      ← fonte SCSS (Bootstrap 5 + estilos customizados)
  scss/bootstrap/         ← Bootstrap 5 SCSS source
  fontawesome/            ← FontAwesome 5 (JS + webfonts local)
  images/                 ← profile.jpg, fav2.png, codeable.png
  favicon.ico             ← ícone da aba do browser
  pdf/almmello.pdf        ← PDF para download
  rga/                    ← vídeos MP4 dos cases
```

---

## 2. Decisões de Arquitetura

### Stack escolhida: Next.js 15

- Next.js com `output: 'export'` é o equivalente moderno direto ao Frozen-Flask: ambos geram HTML estático deployável sem servidor.
- App Router oferece roteamento por arquivos, metadata nativa, SCSS sem configuração extra e `next/image` com otimização automática.
- Mantém a possibilidade de adicionar rotas dinâmicas ou API Routes no futuro (ex: formulário de contato) sem mudar o framework.
- O build tool em desenvolvimento é o **Turbopack** (nativo do Next.js 15), que oferece performance equivalente ao Vite.

### Configuração escolhida

- **Next.js 15** com **App Router**
- **TypeScript**
- **`output: 'export'`** no `next.config.ts` → gera HTML estático equivalente ao Frozen-Flask
- **SCSS global** mantendo `cv-style.scss` e Bootstrap 5 via npm
- **FontAwesome** via pacote `@fortawesome/react-fontawesome` (eliminando os 400 KB de JS local)

---

## 3. Mapeamento de Arquivos

### Rotas

| Flask | Next.js (App Router) |
|---|---|
| `GET /` | `app/page.tsx` |
| `GET /cases/` | `app/cases/page.tsx` |
| 404 personalizado | `app/not-found.tsx` |

### Templates → Componentes React

> **Correção de bug — Header unificado:** `cases.html` possui um header diferente de `home.html` (título "Full Stack Developer", 2 telefones, sem link Codeable). Isso é um erro no template original. A migração **corrige** esse inconsistência: `ResumeHeader.tsx` usará o header de `home.html` como referência canônica (título "Product Manager", 3 telefones, com Codeable) para ambas as páginas.

| Jinja2 (Flask) | React (Next.js) |
|---|---|
| `templates/home.html` (estrutura) | `app/page.tsx` + `components/ResumeHeader.tsx` |
| `templates/cases.html` (estrutura — header corrigido) | `app/cases/page.tsx` + `components/ResumeHeader.tsx` |
| `{% include "content/a01-about.html" %}` | `components/content/About.tsx` |
| `{% include "content/experience/b01-*.html" %}` | `components/content/experience/ProductManager.tsx` |
| `{% include "content/experience/b02-*.html" %}` | `components/content/experience/Goalmoon.tsx` |
| `{% include "content/experience/b03-*.html" %}` | `components/content/experience/ProjectManager.tsx` |
| `{% include "content/experience/b04-*.html" %}` | `components/content/experience/TechnicalAdvisor.tsx` |
| `{% include "content/experience/b05-*.html" %}` | `components/content/experience/Directlink.tsx` |
| `{% include "content/skills/b0N-*.html" %}` | inline no componente de experiência correspondente |
| `{% include "content/links/b0N-*.html" %}` | inline no componente de experiência correspondente |
| `content/c01-education.html` (ORPHAN) | **não migrado** — conteúdo já está hardcoded em `components/content/Education.tsx` |
| `content/c02-additional-information.html` (ORPHAN) | **não migrado** — conteúdo já está hardcoded em `components/content/Languages.tsx` e `Awards.tsx` |
| `<footer>` em `home.html` e `cases.html` (idênticos) | `components/ResumeFooter.tsx` |

### Assets estáticos

| Flask (`project/static/`) | Next.js (`public/`) |
|---|---|
| `images/profile.jpg` | `public/images/profile.jpg` |
| `images/fav2.png` | `public/images/fav2.png` |
| `images/codeable.png` | `public/images/codeable.png` |
| `favicon.ico` | `public/favicon.ico` (raiz de `public/` = padrão Next.js) |
| `pdf/almmello.pdf` | `public/pdf/almmello.pdf` |
| `rga/*.mp4` | `public/rga/*.mp4` |
| `fontawesome/` | **removido** → substituído por `@fortawesome/react-fontawesome` |
| `scss/cv-style.scss` | `styles/cv-style.scss` |
| `scss/bootstrap/` | **removido** → substituído por pacote npm `bootstrap` |

### Referências de URL

| Flask (Jinja2) | Next.js |
|---|---|
| `{{ url_for('static', filename='css/cv-style.css') }}` | importado em `app/layout.tsx` via `import '../styles/globals.scss'` |
| `../static/images/profile.jpg` | `/images/profile.jpg` (relativo à raiz `public/`) |
| `./static/pdf/almmello.pdf` | `/pdf/almmello.pdf` |
| `../../static/rga/TIM-blah-EN.mp4` | `/rga/TIM-blah-EN.mp4` |

---

## 4. Estrutura de Diretórios Alvo

A migração é **in-place**: os arquivos Next.js são criados dentro da pasta `cvapp/` existente. Os diretórios `project/`, `app.py`, `bFrozen.py` e `requirements.txt` coexistem durante a migração e são removidos apenas na etapa final (etapa 12).

```
cvapp/                               ← pasta existente do repositório (migração in-place)
├── app/                             ← NOVO: App Router do Next.js
│   ├── layout.tsx                   ← root layout: metadata, fontes, CSS global
│   ├── page.tsx                     ← rota "/"  (CV completo)
│   ├── cases/
│   │   └── page.tsx                 ← rota "/cases/"
│   └── not-found.tsx                ← página 404
├── components/
│   ├── ResumeHeader.tsx             ← header compartilhado (foto + info + social)
│   ├── ResumeFooter.tsx             ← footer compartilhado
│   └── content/
│       ├── About.tsx
│       ├── Education.tsx
│       ├── Languages.tsx
│       ├── Awards.tsx
│       └── experience/
│           ├── ExperienceSection.tsx    ← wrapper: renderiza os 5 artigos de experiência em sequência
│           ├── ProductManager.tsx
│           ├── Goalmoon.tsx
│           ├── ProjectManager.tsx
│           ├── TechnicalAdvisor.tsx
│           └── Directlink.tsx
├── public/
│   ├── favicon.ico                  ← copiado de project/static/favicon.ico
│   ├── images/
│   │   ├── profile.jpg
│   │   ├── fav2.png
│   │   └── codeable.png
│   ├── pdf/
│   │   └── almmello.pdf
│   └── rga/
│       ├── TIM-blah-EN.mp4
│       └── TIM-Blah-Surfing-Bird-EN.mp4
├── styles/
│   ├── globals.scss                 ← entry point: importa Bootstrap + cv-style
│   └── cv-style.scss               ← estilos customizados (migrado de project/static/scss/)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 5. Dependências npm

### Produção

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@fortawesome/fontawesome-svg-core": "^6.x",
    "@fortawesome/free-solid-svg-icons": "^6.x",
    "@fortawesome/free-regular-svg-icons": "^6.x",
    "@fortawesome/free-brands-svg-icons": "^6.x",
    "@fortawesome/react-fontawesome": "^0.2.x",
    "bootstrap": "^5.x"
  }
}
```

### Desenvolvimento

```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "sass": "^1.x"
  }
}
```

---

## 6. Configurações-Chave

### `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',       // gera HTML estático (equivalente ao Frozen-Flask)
  trailingSlash: true,    // /cases/ em vez de /cases (mantém compatibilidade)
  images: {
    unoptimized: true,    // necessário para output: 'export'
  },
}

export default nextConfig
```

### `app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import '../styles/globals.scss'

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'almmello',
  description: 'Alexandre Monteiro de Mello – Product Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
```

> Com `next/font/google`, a fonte Roboto é baixada em build-time e servida localmente — eliminando o `<link>` externo para `fonts.googleapis.com` que existe no HTML atual.

### `styles/globals.scss`

```scss
// Bootstrap 5 via npm
@import "bootstrap/scss/bootstrap";

// Estilos customizados do CV (migrado de project/static/scss/cv-style.scss)
@import "cv-style";
```

---

## 7. Estratégia de Migração de Componentes

### Padrão: Jinja2 include → React Component

Cada `{% include "content/xNN-nome.html" %}` vira um componente React independente.

**Antes (Jinja2):**
```html
<div class="resume-timeline-item-desc">
  <ul>
    {% include "content/experience/b01-product-manager.html" without context %}
  </ul>
  <h4>Skills:</h4>
  <ul class="list-inline">
    {% include "content/skills/b01-skills-product-manager.html" without context %}
  </ul>
</div>
```

**Depois (React):**
```tsx
// components/content/experience/ProductManager.tsx
export function ProductManagerExperience() {
  return (
    <article className="resume-timeline-item position-relative pb-3">
      {/* header com cargo, empresa, período */}
      <div className="resume-timeline-item-desc">
        <ul>
          {/* bullets migrados do HTML original */}
        </ul>
        <h4 className="resume-timeline-item-desc-heading font-weight-bold">Skills:</h4>
        <ul className="list-inline">
          {/* skill badges migrados */}
        </ul>
      </div>
    </article>
  )
}
```

### Padrão: `<img src="../static/...">` → `<Image>` do Next.js

```tsx
import Image from 'next/image'

// Antes: <img class="picture" src="../static/images/profile.jpg" alt="">
// Depois:
<Image
  className="picture"
  src="/images/profile.jpg"
  alt="Alexandre Monteiro de Mello"
  width={220}
  height={220}
/>
```

### Padrão: FontAwesome `<i>` → `<FontAwesomeIcon>`

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faMobileAlt, faTrophy } from '@fortawesome/free-solid-svg-icons'

// Antes: <i class="far fa-envelope fa-fw me-2"></i>
// Depois:
<FontAwesomeIcon icon={faEnvelope} fixedWidth className="me-2" />

// data-fa-transform="grow-3" → prop transform (mesma sintaxe de string)
// Antes: <i class="fas fa-mobile-alt fa-fw me-2" data-fa-transform="grow-6"></i>
// Depois:
<FontAwesomeIcon icon={faMobileAlt} fixedWidth transform="grow-6" className="me-2" />

// data-fa-transform="shrink-2" com className posicional
// Antes: <i class="resume-award-icon fas fa-trophy position-absolute" data-fa-transform="shrink-2"></i>
// Depois:
<FontAwesomeIcon icon={faTrophy} transform="shrink-2" className="resume-award-icon position-absolute" />
```

> O pacote `@fortawesome/react-fontawesome` suporta o prop `transform` com a mesma sintaxe de string do atributo `data-fa-transform` do FA JS. Todos os 7 usos de `data-fa-transform` no projeto têm equivalência direta.

### Padrão: Cases com `<iframe>` para MP4

```tsx
// Antes: <iframe src="../../static/rga/TIM-blah-EN.mp4" ...>
// Depois: usar <video> nativo (MP4 em iframe não é ideal)
<div className="ratio ratio-16x9">
  <video controls>
    <source src="/rga/TIM-blah-EN.mp4" type="video/mp4" />
  </video>
</div>
```

---

## 8. Etapas de Execução

As etapas abaixo estão ordenadas por dependência. Cada uma pode ser commitada separadamente.

| # | Etapa | Descrição | Arquivos criados/alterados |
|---|---|---|---|
| 1 | **Scaffold Next.js in-place** | Rodar `npx create-next-app@latest .` dentro da pasta `cvapp/` existente. O wizard detectará a pasta não-vazia e perguntará se deseja continuar — responder **Yes**. Respostas corretas: TypeScript ✅, ESLint ✅, Tailwind ❌, pasta `src/` ❌, App Router ✅, Turbopack ✅, import alias `@/*` ✅ | `package.json`, `next.config.ts`, `tsconfig.json` |
| 2 | **Copiar assets** | Copiar `static/images`, `static/pdf`, `static/rga` → `public/`; copiar `static/favicon.ico` → `public/favicon.ico` | `public/**` |
| 3 | **Migrar SCSS** | Copiar `cv-style.scss`, ajustar imports para Bootstrap npm, criar `globals.scss` | `styles/globals.scss`, `styles/cv-style.scss` |
| 4 | **Layout raiz** | Criar `app/layout.tsx` com metadata, `next/font/google` para Roboto e import de SCSS global | `app/layout.tsx` |
| 5 | **Componentes de layout** | Criar `ResumeHeader.tsx` baseado no header de `home.html` (versão canônica — bug de header diferente é corrigido aqui) e `ResumeFooter.tsx` com o footer idêntico de ambos os templates | `components/ResumeHeader.tsx`, `components/ResumeFooter.tsx` |
| 6 | **Componentes de conteúdo** | Migrar cada `{% include %}` ativo para componente React individual; os orphans `c01` e `c02` são ignorados (conteúdo já hardcoded) | `components/content/**` |
| 7 | **Substituir FontAwesome** | Substituir todas as tags `<i class="fa...">` por `<FontAwesomeIcon>` com imports tree-shaken de `@fortawesome/react-fontawesome` | `components/**` |
| 8 | **Página Home (`/`)** | Compor `app/page.tsx` usando os componentes | `app/page.tsx` |
| 9 | **Página Cases (`/cases/`)** | Migrar `cases.html` para `app/cases/page.tsx` usando `ResumeHeader` unificado | `app/cases/page.tsx` |
| 10 | **Página 404** | Criar `app/not-found.tsx` | `app/not-found.tsx` |
| 11 | **Validar build estático** | `next build` → checar pasta `out/` gerada, verificar `/` e `/cases/` renderizados | `out/` (gitignored) |
| 12 | **Remover Flask** | Deletar `app.py`, `bFrozen.py`, `requirements.txt`, `htmltopdf.py`, `project/`, scripts `.sh` | — |

---

## 9. Pontos de Atenção

### SCSS e Bootstrap
- O `cv-style.scss` atual importa Bootstrap via path relativo (`bootstrap/scss/bootstrap.scss`). Após migração, o import será `@import "bootstrap/scss/bootstrap"` (via node_modules).
- O pacote `sass` npm deve ser instalado como devDependency para o Next.js compilar SCSS.

### FontAwesome via npm (tree-shaking)
- O projeto atual usa FontAwesome **totalmente local** (`project/static/fontawesome/`). A pasta local será removida.
- Abordagem adotada: `@fortawesome/react-fontawesome` com imports individuais de ícones. Isso ativa tree-shaking e elimina o carregamento de todo o bundle do FA. Cada tag `<i class="fa...">` é substituída por `<FontAwesomeIcon icon={faIconName} />` com o import correspondente do pacote `@fortawesome/free-solid-svg-icons`, `free-regular-svg-icons` ou `free-brands-svg-icons`.

### Vídeos em `<iframe>`
- O `cases.html` usa `<iframe src="...mp4">` — isso funciona em alguns browsers, mas não é padrão. Recomenda-se migrar para `<video>` HTML5 nativo.

### `url_for('static', ...)` do Jinja2
- Todas as ocorrências precisam ser substituídas por caminhos `/` relativos à pasta `public/`. Busca com regex: `url_for\('static'`.

### Frozen-Flask → `output: 'export'`
- O arquivo `out/` gerado pelo `next build` com `output: 'export'` é o equivalente direto do `project/build/` atual. O deploy pode ser feito da mesma forma (cópia de arquivos estáticos).

### Google Fonts
- O `<link href="https://fonts.googleapis.com/...">` pode ser substituído pela API de fontes do Next.js (`next/font/google`) para melhor performance e evitar requisição externa no carregamento.

```typescript
// app/layout.tsx
import { Roboto } from 'next/font/google'
const roboto = Roboto({ weight: ['300','400','500','700','900'], subsets: ['latin'] })
```

---

## 10. Resultado Esperado

Após a migração, o projeto estará:

- **Executando em dev** com `next dev` (HMR automático, sem recarregar o servidor Flask)
- **Gerando HTML estático** com `next build` → pasta `out/`, equivalente ao Frozen-Flask
- **Sem dependência Python** — apenas Node.js
- **Mantendo 100% da aparência visual** (mesmo SCSS/Bootstrap 5, mesma estrutura HTML)
- **Com melhor DX**: TypeScript, componentes reutilizáveis, tree-shaking do FontAwesome
