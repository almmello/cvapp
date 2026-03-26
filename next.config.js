// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Evita que o Next.js faça bundle de libs nativas do PDF no serverless
  serverExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Evita clickjacking — o site não pode ser embutido em iframes
          { key: 'X-Frame-Options', value: 'DENY' },
          // Evita MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Controla informações de referrer em links externos
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Força HTTPS por 1 ano (Vercel já força, mas bom ter explícito)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Permissões de APIs do browser — desabilita o que não usamos
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // CSP: permite fontes Google, FontAwesome CDN e a própria origem
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",   // unsafe-inline necessário para Next.js inline scripts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
              "media-src 'self'",
              "frame-ancestors 'none'",               // reforça X-Frame-Options
            ].join('; '),
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
