# CV App

Next.js 16 resume website with Tailwind CSS v4, dynamic PDF export, and Vercel-ready deployment.

## Live Website

- [almmello.com](https://almmello.com)

## Tech Stack

- Next.js 16.2.1 (App Router)
- React 19
- Tailwind CSS v4
- Font Awesome
- Puppeteer Core + @sparticuz/chromium-min (server-side PDF generation)

## Main Features

- Responsive resume website
- Dynamic PDF generation from the current HTML (`/api/pdf`)
- Print-optimized layout for better PDF readability
- Security headers configured in `next.config.js`

## Getting Started

Clone the repo:

```sh
git clone https://github.com/almmello/cvapp
cd cvapp
```

Install dependencies:

```sh
npm install
```

## Local Development

Run development server:

```sh
npm run dev
```

Open:

- `http://localhost:3000`

## Dynamic PDF Export

The download button in the header calls `GET /api/pdf`, which:

1. Opens a headless browser
2. Renders the current site with print styles
3. Generates and returns `almmello-cv.pdf`

### Local requirement (Windows)

For local development on Windows, set a browser executable path in `.env.local`:

```env
CHROMIUM_EXECUTABLE_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
```

Optional override for serverless Chromium pack URL:

```env
CHROMIUM_PACK_URL=https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.tar
```

## Scripts

- `npm run dev` - Starts Next.js dev server (webpack)
- `npm run build` - Production build
- `npm run start` - Starts production server
- `npm run lint` - Lints `app` and `components`

## Security

Configured HTTP security headers include:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

External links using `target="_blank"` include `rel="noopener noreferrer"`.

## Build and Validation

Run before publishing:

```sh
npm run lint
npm run build
npm audit
```

## Deploy (Vercel)

This project is ready for Vercel with default Next.js settings.

1. Connect the repository in Vercel
2. Deploy with defaults (no custom build command needed)
3. Ensure environment variables are configured if needed

## Notes

- `.env.local` is local-only and should not be committed
- PDF output uses print-specific CSS rules to hide/adjust interactive UI elements

