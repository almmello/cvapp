import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

// Limite de duração da função serverless na Vercel (segundos)
export const maxDuration = 60

// URL do pack Chromium para ambientes serverless (Vercel, Lambda, etc.)
// Atualizar se necessário: https://github.com/Sparticuz/chromium/releases
const CHROMIUM_PACK_URL =
  process.env.CHROMIUM_PACK_URL ??
  'https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.tar'

async function getExecutablePath(): Promise<string> {
  // Em desenvolvimento (Windows), use um Chrome/Edge local via .env.local:
  // CHROMIUM_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return process.env.CHROMIUM_EXECUTABLE_PATH
  }
  // Em produção (Vercel/Linux): baixa e extrai o Chromium do GitHub
  return chromium.executablePath(CHROMIUM_PACK_URL)
}

export async function GET(request: Request) {
  const isLocalChrome = !!process.env.CHROMIUM_EXECUTABLE_PATH

  const executablePath = await getExecutablePath()

  // Derivar a URL base da requisição atual
  const { origin } = new URL(request.url)
  const targetUrl = `${origin}/?print=1`

  const browser = await puppeteer.launch({
    // args otimizados para serverless; em dev com Chrome local usa args mínimos
    args: isLocalChrome
      ? ['--no-sandbox', '--disable-setuid-sandbox']
      : chromium.args,
    defaultViewport: { width: 1024, height: 768 },
    executablePath,
    headless: true,
  })

  try {
    const page = await browser.newPage()

    // Aguardar carregamento completo (fontes, imagens, JS)
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30_000 })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true, // preserva cores de fundo (header navy)
      margin: { top: '16mm', right: '14mm', bottom: '16mm', left: '14mm' },
    })

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="almmello-cv.pdf"',
        // Sem cache — PDF deve sempre refletir o conteúdo atual
        'Cache-Control': 'no-store',
      },
    })
  } finally {
    await browser.close()
  }
}
