# Export PDF from HTML — Plano de Feature

**Data:** 26/03/2026  
**Status:** Aguardando implementação  
**Estratégia escolhida:** Route Handler Next.js + Puppeteer headless (Opção C)

---

## 1. Contexto e objetivo

### Problema atual
O botão "Download PDF Version" no header serve um arquivo estático `/public/pdf/almmello.pdf`. Toda vez que o conteúdo do CV muda, o arquivo precisa ser regenerado manualmente com um script Python e substituído no repositório.

### Objetivo
O link de download deve entregar sempre uma versão PDF gerada dinamicamente a partir do HTML atual do site — sem intervenção manual, sem arquivo estático, refletindo o conteúdo em tempo real.

### Requisitos
- PDF gerado on-demand a partir do HTML renderizado do site
- Visual de impressão/leitura: diferente da versão web (sem botões, links com URLs expandidas, tipografia otimizada)
- Alguns elementos devem ser suprimidos ou trocados na versão PDF (botão de download, overlays, elementos interativos)
- Mínimo de mudanças estruturais nos componentes existentes
- Funciona na Vercel (serverless)

---

## 2. Solução: Route Handler + Puppeteer headless

### Como funciona

```
Usuário clica "Download PDF"
        ↓
GET /api/pdf
        ↓
Route Handler abre Chrome headless
        ↓
Navega para /?print=1 (mesma URL do site, com flag de print)
        ↓
Aguarda hidratação completa
        ↓
page.pdf() → bytes em memória
        ↓
Response com Content-Type: application/pdf
        ↓
Browser faz download de almmello-cv.pdf
```

### Por que esta abordagem

| Critério | Motivo |
|---|---|
| Fidelidade visual | Puppeteer renderiza o Chrome real — fontes, ícones FontAwesome, cores exatas |
| Aproveita CSS existente | Toda a `@media print` já configurada no `globals.css` é respeitada |
| Controle granular | Query `?print=1` permite esconder elementos específicos só para o PDF |
| Compatível com Vercel | `@sparticuz/chromium-min` é a build do Chromium feita para ambientes serverless |
| Esforço mínimo | Nenhuma mudança estrutural nos componentes — apenas um arquivo novo e um link |

### Por que não as alternativas

**`window.print()`** — abre diálogo do browser, o usuário precisa salvar manualmente. Não é entrega de PDF.

**`html2pdf.js` / `jsPDF`** — geração client-side via canvas: ícones FontAwesome não renderizam, fontes cortadas, layout quebrado em múltiplas páginas.

**`@react-pdf/renderer`** — exige reescrever todo o layout numa DSL própria (componentes `<Document>`, `<Page>`, `<Text>`). Zero reuso do código atual.

---

## 3. Dependências a instalar

```bash
npm install @sparticuz/chromium-min puppeteer-core
```

| Pacote | Versão alvo | Motivo |
|---|---|---|
| `@sparticuz/chromium-min` | `^131` | Build mínima do Chromium para Lambda/Vercel (≈20MB) |
| `puppeteer-core` | `^24` | Puppeteer sem Chromium bundled — usa o `chromium-min` acima |

> **Nota:** `puppeteer` (sem `-core`) baixa um Chromium de ~300MB que ultrapassa o limite de 250MB do bundle serverless da Vercel. Usar sempre `puppeteer-core` + `@sparticuz/chromium-min`.

---

## 4. Arquivos a criar/modificar

### 4.1 Novo: `app/api/pdf/route.ts`

Route Handler que:
1. Detecta a URL base (localhost em dev, URL de produção na Vercel)
2. Lança o Chromium headless
3. Navega para `/?print=1`
4. Aguarda a carga completa (`networkidle0` ou seletor específico)
5. Chama `page.pdf()` com configurações de página A4
6. Retorna os bytes com headers corretos

```typescript
import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

export const maxDuration = 60 // segundos — limite Vercel Pro/Hobby

export async function GET(request: Request) {
  const host = request.headers.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const url = `${protocol}://${host}/?print=1`

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      // URL pública do chromium-min (necessária na Vercel)
      'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
    ),
    headless: chromium.headless,
  })

  try {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,   // preserva cores de fundo (header navy)
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="almmello-cv.pdf"',
      },
    })
  } finally {
    await browser.close()
  }
}
```

> **Sobre `maxDuration`:** a geração leva ~5–15s. O plano Hobby da Vercel aceita até 60s para Route Handlers. Mais que suficiente.

---

### 4.2 Modificar: `components/ResumeHeader.tsx`

Trocar o `<a href="/pdf/almmello.pdf" download>` por `<a href="/api/pdf">`:

```diff
- href="/pdf/almmello.pdf"
- download
+ href="/api/pdf"
```

Sem outras mudanças no componente.

---

### 4.3 Modificar: `styles/globals.css` — adaptações `@media print`

A `@media print` atual já exibe URLs dos links. Precisamos adicionar regras para:

#### Suprimir elementos que não fazem sentido no PDF

```css
@media print {
  /* Elementos interativos / navegação */
  .print\:hidden {
    display: none !important;
  }

  /* Links — exibir URL embaixo (já existe, manter) */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.75em;
    color: #666;
  }
  a.no-print-url::after {
    content: none;
  }

  /* Suprimir URLs de links de contato (tel:, mailto: já têm o texto inline) */
  a[href^="tel:"]::after,
  a[href^="mailto:"]::after {
    content: none;
  }
}
```

#### Verificar: header escuro no PDF

`printBackground: true` no Puppeteer preserva o `bg-navy-dark`. O PDF terá o header na cor original — bom para identidade visual. Se quiser versão B&W para impressoras monocromáticas, adicionar:

```css
@media print {
  /* Opcional: converter para monocromático */
  header {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

---

### 4.4 Controle via query `?print=1`

Para esconder elementos **somente no PDF** (sem afetar a versão web e sem afetar o `@media print` do browser):

No componente relevante, usar uma classe condicional baseada no search param:

```tsx
// Em componentes que precisam esconder algo só no PDF
// app/page.tsx recebe searchParams e passa para componentes via prop ou context
```

Ou mais simples: um `useSearchParams()` num `'use client'` wrapper leve que adiciona uma classe `is-pdf-export` ao body, e o CSS reage a ela:

```css
.is-pdf-export .no-pdf {
  display: none !important;
}
```

> Para a v1, o `@media print` padrão já resolve a maioria dos casos. O `?print=1` fica como extensão para casos avançados.

---

## 5. Configuração `next.config.js`

Na Vercel com Puppeteer, o bundle serverless pode pesar mais. Necessário adicionar:

```js
const nextConfig = {
  turbopack: { root: __dirname },
  serverExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
}
```

`serverExternalPackages` instrui o Next.js a não fazer bundle dessas libs nos Server Components — elas são carregadas do `node_modules` em runtime (o que é exatamente o que a Vercel espera).

---

## 6. Variáveis de ambiente

Nenhuma obrigatória para funcionar. Opcional para controle:

| Variável | Uso |
|---|---|
| `CHROMIUM_PACK_URL` | Permite trocar a URL do `chromium-min` sem mudar código |

---

## 7. Comportamento em dev vs. produção

| Ambiente | Chromium usado | Observação |
|---|---|---|
| `localhost` | Chromium baixado on-demand pelo `@sparticuz/chromium-min` | Primeira execução faz download (~20MB), depois usa cache |
| Vercel (produção) | Mesmo pacote, mas buscado da URL pública no cold start | `executablePath` recebe a URL do `.tar` |

Em dev, a URL gerada é `http://localhost:3000/?print=1` — o servidor precisa estar rodando para o Puppeteer conseguir navegar. Como o Route Handler **é** parte do servidor, isso funciona naturalmente: o handler `GET /api/pdf` faz uma requisição para o próprio servidor em `/`.

---

## 8. O que fazer com `/public/pdf/almmello.pdf`

Após a implementação e validação, o arquivo estático pode ser **removido** do repositório. Enquanto a feature está em desenvolvimento, mantê-lo garante fallback.

---

## 9. Sequência de implementação

1. `npm install @sparticuz/chromium-min puppeteer-core`
2. Criar `app/api/pdf/route.ts`
3. Atualizar `next.config.js` com `serverExternalPackages`
4. Trocar o link no `ResumeHeader.tsx`
5. Complementar `@media print` no `globals.css`
6. Testar em dev: `npm run dev` → abrir `http://localhost:3000` → clicar Download
7. Testar build: `npm run build`
8. Deploy na Vercel → testar em produção
9. Remover `/public/pdf/almmello.pdf` após validação

---

## 10. Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Cold start lento na Vercel (>15s) | Média | `maxDuration: 60` cobre; usuário vê loading normal do browser |
| Limite de 250MB de bundle serverless | Baixa | `serverExternalPackages` externaliza as libs grandes |
| Fonte Montserrat não carrega no headless | Baixa | `waitUntil: 'networkidle0'` garante que fontes do Google/next/font estejam carregadas |
| `executablePath` da URL falha (rede) | Baixa | Fixar versão da URL do chromium-min; usar cache da Vercel |
| Header navy escuro "come" tinta | Design | `printBackground: true` é escolha consciente; pode ter versão B&W via query param futuro |
