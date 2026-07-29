# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal resume/CV website (almmello.com) built with Next.js 16 (App Router) and React 19, styled with Tailwind CSS v4. Its standout feature is server-side, on-demand PDF export of the live page via Puppeteer.

## Commands

```sh
npm run dev     # Next.js dev server (forced to webpack, not turbopack — see next.config.js)
npm run build   # Production build
npm run start   # Start production server (run build first)
npm run lint    # ESLint over app/ and components/ only
```

There is no test suite configured in this repo. Before considering a change done, run `npm run lint` and `npm run build` — the README calls these out explicitly as the pre-publish checks (`npm run lint && npm run build && npm audit`).

## Architecture

**Routing (`app/`)**: Two pages — `app/page.tsx` (the CV/resume) and `app/cases/page.tsx` (a case-studies page with embedded videos). Both share the same shell: `ResumeHeader` + content + `ResumeFooter`, wrapped in the same `max-w-4xl mx-auto bg-white` card layout. `app/not-found.tsx` is a custom 404.

**Resume content (`components/content/`)**: Each resume section (About, Education, Languages, Awards) is its own component with no props — content is hardcoded directly in JSX rather than pulled from a data file or CMS. `components/content/experience/` holds one component per job (ProductManager, Goalmoon, ProjectManager, TechnicalAdvisor, Directlink), rendered in reverse-chronological order by `ExperienceSection.tsx`. To update resume content (add a job, edit bullet points, change skills), edit the relevant component directly — there is no intermediate data layer.

**PDF export (`app/api/pdf/route.ts`)**: A `GET` route that launches headless Chromium via `puppeteer-core` + `@sparticuz/chromium-min`, navigates to `${origin}/?print=1` on the *same running instance*, waits for `networkidle0`, and returns a rendered A4 PDF as an attachment. This means the PDF is always a snapshot of the live HTML/CSS, not a separately maintained template — any styling change to the page automatically flows into the PDF. Key details:
- Executable path resolution branches on `CHROMIUM_EXECUTABLE_PATH` env var: if set (local dev, especially Windows), it launches that local browser with minimal args; otherwise it downloads/uses the Sparticuz Chromium pack (production/serverless), pinned via `CHROMIUM_PACK_URL`.
- `maxDuration = 60` caps the serverless function for Vercel.
- Local dev on Windows requires `.env.local` with `CHROMIUM_EXECUTABLE_PATH` pointing at a local Chrome/Edge binary (see README) — without it, PDF generation will fail locally unless a Chromium pack download succeeds.
- The client trigger is `components/PdfDownloadButton.tsx`, a client component that fetches `/api/pdf`, converts the response to a blob, and triggers a browser download.

**Print vs. screen rendering**: The same components render for both the interactive site and the PDF snapshot, differentiated via Tailwind's `print:` variant (e.g. `print:hidden`, `print:flex`, `print:bg-white`) rather than a separate print-only template. `styles/globals.css` adds supporting `@media print` rules: forcing background colors to print, appending visible URLs after external links (`a[href]::after`), hiding `.mp4` links (not meaningful in a PDF), avoiding page breaks inside list items and two-column blocks (`.print-section`), and enforcing `break-after: avoid` on headings so section titles don't get orphaned at a page bottom. When touching layout/content components, keep print-mode classes in sync with the on-screen design — a change that looks right on screen but wasn't given a `print:` treatment can break the PDF layout.

**Design system / theming**: Tailwind v4's CSS-first `@theme` config lives in `styles/globals.css` (no `tailwind.config.js`). Custom color tokens (`navy`, `navy-dark`, `navy-header`, `interactive`, `interactive-light`, `mint`, `cool-1`, `cool-2`) come from the Goalmoon brand palette — deep navy/blue for primary surfaces, `interactive` blues exclusively for links/interactive elements, `mint` reserved for primary CTAs (e.g. the PDF download button) and success/focus states. Prefer these semantic tokens over raw Tailwind colors or hex values when styling. Font is Montserrat, loaded via `next/font/google` in `app/layout.tsx` and exposed as `--font-montserrat` / `--font-sans`.

**Security headers**: `next.config.js` sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy for all routes. `serverExternalPackages` excludes `@sparticuz/chromium-min` and `puppeteer-core` from bundling since they're native/binary-loading libraries. If the CSP needs loosening for a new asset source (fonts, scripts, images), edit the `headers()` function here rather than adding per-page meta tags. All external `target="_blank"` links must include `rel="noopener noreferrer"`.

**Path alias**: `@/*` maps to the repo root (see `tsconfig.json`), so imports look like `@/components/ResumeHeader` and `@/styles/globals.css`.

**`docs/`**: Contains planning docs (migration plan, PDF export plan, post-migration analysis, design system notes). This directory is gitignored — it holds local working notes, not published documentation, and won't be present in a fresh clone.
