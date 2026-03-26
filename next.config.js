// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Evita que o Next.js faça bundle de libs nativas do PDF no serverless
  serverExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
};

module.exports = nextConfig;
