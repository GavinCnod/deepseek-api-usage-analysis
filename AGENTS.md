<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DeepSeek API Usage Analytics Dashboard

Client-only analytics dashboard for DeepSeek platform CSV/ZIP exports. Apple-minimalist design, EN/ZH bilingual (`/zh/*` routes), light/dark theming. Next.js 16 App Router, static export, no server.

## Commands

- `npm run dev` — dev server on :3000. The script passes `--webpack`: Next 16 defaults to Turbopack; this repo pins webpack, so keep the flag.
- `npm run build` — static export to `out/` (`output: "export"` in `next.config.ts`) — also type-checks the app.
- `npm run lint` — ESLint (flat config `eslint.config.mjs`, eslint-config-next).
- `npm test` — Vitest. **38 tests across 6 files** in `src/__tests__/` (analytics, schema, sitemap, localeRouting, DataContext, DropZone). Older "50 tests"/"90 tests"/BlogIndex claims are stale — do not repeat them.
- `npx vitest run src/__tests__/<file>` — single test file.
- `npx tsc --noEmit` — standalone typecheck (no dedicated npm script).
- `npm run start` does not serve the static build; preview `out/` with a static host (e.g. `npx serve out`).

## Architecture rules (things you'd otherwise get wrong)

- **Everything is client-side**: all components are `"use client"`, no SSR/RSC dynamic rendering. `generateMetadata`, `robots.ts`, `sitemap.ts`, and the `<noscript>` fallbacks are the only server/build-time code paths.
- **Bilingual mirroring is mandatory**: every route in `src/app/(site)/` must be mirrored under `src/app/zh/` with localized metadata. Adding a page = both `page.tsx` files + `sitemap.ts` entry + translation keys + footer nav link.
- **i18n is a custom React context** (`src/i18n/`), not next-intl. Keys are **flat 2-level** `group.keyName` in `translations.ts` — do NOT nest deeper; the type system flattens leaf keys to `string`. Always add both `en` and `zh`.
- **Theming**: all colors are CSS custom properties in `src/app/globals.css` — never hardcode hex in components. New variables go in BOTH `:root, .light` AND `.dark` blocks.
- **Charts**: ECharts via `echarts-for-react`; pull colors from `useTheme()` (`isDark` branch) and build options in `useMemo`.
- **Model filter**: views consume `filteredResult` (model-filtered), never `result` directly. `filteredResult.summary.models` is preserved unfiltered so the filter UI stays complete.
- **View pattern**: each tab is Hero big-number (`text-[5rem] font-bold tracking-tighter`) + chart(s).

## Key flows

- **Data pipeline**: `src/lib/parser.ts` (parse → pivot → join → `computeKeyStats`), types in `types.ts`. Amount CSV columns pivot on `type` (`request_count | output_tokens | input_cache_hit_tokens | input_cache_miss_tokens`); cost CSV costs are distributed proportionally across keys by token share per (date, model). Multi-month pairing + ZIP extraction in `concatFiles.ts` (filename pattern `amount-{year}-{month}.csv` / `cost-{year}-{month}.csv`; 50MB limit = ZIP-bomb guard).
- **SEO**: metadata builders centralized in `src/lib/routeMetadata.ts` → `pageMetadata.ts` (`buildLocalizedPageMetadata`); JSON-LD in `schema.ts`. SEO-critical pages need a `<noscript>` fallback component (`*Content.tsx`) rendered into the page for crawlers.
- **Config modules** (single source of truth, edit these not the consumers): `sisterProjects.ts` (UTM-tracked cross-links), `affiliates.ts` (affiliate/referral links), `blogArticles.ts` + `src/lib/content/*` (blog articles), `authors.ts`, `site.ts` (site URLs, default `https://deepseek-usage.xyz` via `NEXT_PUBLIC_SITE_URL`).

## Testing

- Vitest config: jsdom, globals, setup `vitest.setup.ts` (jest-dom), tests glob `src/__tests__/**/*.{test,spec}.{ts,tsx}`.
- Real DeepSeek sample CSVs live in `sampleData/` — use them for manual parser/dashboard verification.
- No CI workflows exist under `.github/` (only issue/PR templates).

## Gotchas

- Fonts: Hubot Sans is local WOFF2 loaded via `@font-face` in `globals.css`; Geist Mono via `next/font/google` in `AppRootLayout.tsx`.
- Clipboard copies go through `CopyButton` (`navigator.clipboard` + `<textarea>` fallback).
- GA4 is opt-in via `NEXT_PUBLIC_GA_ID`; when set, gtag is injected at build time in `AppRootLayout.tsx`. Leave unset locally.
- `vercel.json` owns security headers + static-asset cache rules; deploy-compatible with any static host.
- `localFilesDev/` and `docs/` are local dev scratch / promotion notes — not build inputs. Ignore them when working.
- The AffiliateWall "Recommended Tools We ARE USING" commercial block (`affiliates.ts`-driven) renders on the homepage (above the FAQ section), at the bottom of every blog post (`BlogPostLayout`), and on `AuthorPage` / `CostTrackerPage`. `BlogIndex` sorts posts by `publishedTime` newest-first.
- Respect `prefers-reduced-motion`; scroll-reveal uses `.reveal-section` + IntersectionObserver.
