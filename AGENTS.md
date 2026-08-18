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
- `npm test` — Vitest. **49 tests across 7 files** in `src/__tests__/` (analytics, schema, sitemap, localeRouting, DataContext, DropZone, parser). Older "50 tests"/"90 tests"/BlogIndex claims are stale — do not repeat them.
- `npx vitest run src/__tests__/<file>` — single test file.
- `npx tsc --noEmit` — standalone typecheck (no dedicated npm script).
- `npm run start` does not serve the static build; preview `out/` with a static host (e.g. `npx serve out`).

## Architecture rules (things you'd otherwise get wrong)

- **Everything is client-side**: all components are `"use client"`, no SSR/RSC dynamic rendering. `generateMetadata`, `robots.ts`, `sitemap.ts`, and the `<noscript>` fallbacks are the only server/build-time code paths. The `*Content.tsx` `<noscript>` fallbacks are client components (they read the locale from the i18n context) but are still pre-rendered into static HTML per route at build time — keep them single-language, one H1 per page.
- **Custom 404 is a global-not-found**: the project has two root layouts (`(site)` + `zh`), so the branded bilingual 404 lives in `src/app/global-not-found.tsx` (`experimental.globalNotFound` in `next.config.ts`). It is a full HTML document wrapping `NotFoundClient.tsx` in a standalone `I18nProvider` WITHOUT a locked locale — that's what makes the in-page EN/ZH toggle (`setLocale`) work. Do NOT add `app/not-found.tsx` (no single root layout to render it in).
- **Bilingual mirroring is mandatory**: every route in `src/app/(site)/` must be mirrored under `src/app/zh/` with localized metadata. Adding a page = both `page.tsx` files + `sitemap.ts` entry + translation keys + footer nav link.
- **i18n is a custom React context** (`src/i18n/`), not next-intl. Keys are **flat 2-level** `group.keyName` in `translations.ts` — do NOT nest deeper; the type system flattens leaf keys to `string`. Always add both `en` and `zh`.
- **Theming**: all colors are CSS custom properties in `src/app/globals.css` — never hardcode hex in components. New variables go in BOTH `:root, .light` AND `.dark` blocks.
- **Charts**: ECharts via `echarts-for-react`; pull colors from `useTheme()` (`isDark` branch) and build options in `useMemo`.
- **Model filter**: views consume `filteredResult` (model-filtered), never `result` directly. `filteredResult.summary.models` is preserved unfiltered so the filter UI stays complete.
- **View pattern**: each tab is Hero big-number (`text-[5rem] font-bold tracking-tighter`) + chart(s).

## Key flows

- **Data pipeline**: `src/lib/parser.ts` (parse → pivot → join → `computeKeyStats`), types in `types.ts`. Amount CSV columns pivot on `type` (`request_count | output_tokens | input_cache_hit_tokens | input_cache_miss_tokens`); cost CSV costs are distributed proportionally across keys by token share per (date, model). The billing date is derived from `start_time_iso`'s date part (Beijing-local day); legacy `utc_date` exports are still accepted. Multi-month pairing + ZIP extraction in `concatFiles.ts` (filename patterns `amount-{year}-{month}.csv` / `cost-{year}-{month}.csv` legacy, and date-range `amount-2026-08-01_2026-08-17.csv` / `cost-2026-08-01_2026-08-17.csv` new; 50MB limit = ZIP-bomb guard).
- **SEO**: metadata builders centralized in `src/lib/routeMetadata.ts` → `pageMetadata.ts` (`buildLocalizedPageMetadata`); JSON-LD in `schema.ts`. SEO-critical pages need a `<noscript>` fallback component (`*Content.tsx`) rendered into the page for crawlers.
- **Config modules** (single source of truth, edit these not the consumers): `sisterProjects.ts` (UTM-tracked cross-links), `affiliates.ts` (affiliate/referral links), `blogArticles.ts` + `src/lib/content/*` (blog articles), `modelPricing.ts` (model prices + registry — shared by the Pricing Calculator and the 8 per-model pricing pages; keep prices here, not in components), `authors.ts`, `site.ts` (site URLs, default `https://deepseek-usage.xyz` via `NEXT_PUBLIC_SITE_URL`).
- **Programmatic SEO pages** (v0.10): 8 model pricing pages (`/deepseek-*-pricing`, `/gpt-5.6-*-pricing`, `/claude-*-pricing`) + 3 glossary pages (`/what-is-deepseek-*`), all EN/ZH mirrored. Shared client components `ModelPricingPage/Content.tsx` + `GlossaryPage/Content.tsx` are driven by `src/lib/content/modelPricingContent.ts` + `glossaryContent.ts` (unique per-page copy, FAQ, JSON-LD via `buildModelPricingJsonLd`/`buildGlossaryJsonLd` in `schema.ts`, metadata via `buildModelPricingMetadata`/`buildGlossaryMetadata` in `routeMetadata.ts`). The Pricing Calculator page hosts the hub section linking all 8 pricing pages — keep those links (anti-orphan). Model pricing content is data + copy config, NOT translation keys.

## Testing

- Vitest config: jsdom, globals, setup `vitest.setup.ts` (jest-dom), tests glob `src/__tests__/**/*.{test,spec}.{ts,tsx}`.
- Real DeepSeek sample CSVs live in `sampleData/` — use them for manual parser/dashboard verification.
- No CI workflows exist under `.github/` (only issue/PR templates).

## Gotchas

- Fonts: Hubot Sans is local WOFF2 loaded via `@font-face` in `globals.css`; Geist Mono via `next/font/google` in `AppRootLayout.tsx`.
- Clipboard copies go through `CopyButton` (`navigator.clipboard` + `<textarea>` fallback).
- GA4 is opt-in via `NEXT_PUBLIC_GA_ID`; when set, gtag is injected at build time in `AppRootLayout.tsx`. Leave unset locally.
- `vercel.json` owns security headers + static-asset cache rules; deploy-compatible with any static host.
- **Icons**: `src/app/favicon.ico` (~10 KB, multi-size 16/32/48 PNG-in-ICO) and `src/app/apple-icon.png` (180×180) are auto-detected by Next and referenced from every page — do not point `icons` metadata at the 242 KB `public/ds-usage-logo.ico` (it exists only as a legacy file). Regenerate them from `public/ds-usage-logo.png` with `sharp` (Node) if the logo changes.
- `localFilesDev/` and `docs/` are local dev scratch / promotion notes — not build inputs. Ignore them when working.
- The AffiliateWall "Recommended Tools We ARE USING" commercial block (`affiliates.ts`-driven) renders site-wide via `RecommendedToolsSection` at the bottom of every page (homepage above the FAQ section, every blog post via `BlogPostLayout`, dashboard, tool landing pages, blog index, guide/privacy/terms/changelog/author pages). `BlogIndex` sorts posts by `publishedTime` newest-first.
- `TitleBar.tsx` hosts a single unified "⋯" navigation menu (guideline / privacy / terms / blog / author / changelog / GitHub). When adding an internal page, wire it into `TitleBar.tsx` `navItems`, `FooterBar.tsx`, and `sitemap.ts`. The Agnes sister-project button lives only in `FooterBar.tsx` now, not the title bar.
- **Only one page in the series is a real tool**: `/deepseek-api-pricing-calculator` is an interactive tool; `/deepseek-api-cost-tracker` and `/deepseek-cache-hit-rate-analyzer` are pure SEO landing pages (their CTAs point to the homepage dashboard). The homepage "Free Tools" section (`LandingPage.tsx`) shows only the calculator card plus a hub linking all 8 model pricing pages (`MODEL_KEYS`/`MODEL_PRICING_PATHS` from `modelPricing.ts`). The footer Tools row (`FooterBar.tsx`) still links all three pages and the SEO pages cross-link each other and the calculator — do not remove those links or the pages become orphaned.
- **Blog content links are auto-localized**: `ArticleRenderer` rewrites any `<a href="/...">` in `src/lib/content/article*.ts` via `buildLocalePath` — write plain `/route` hrefs (identical in both en and zh content files).
- Respect `prefers-reduced-motion`; scroll-reveal uses `.reveal-section` + IntersectionObserver.
