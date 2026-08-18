@AGENTS.md

## Architecture

This project uses Next.js 16 App Router with route groups and bilingual mirroring:

- **Route groups**: `(site)/` is an invisible grouping for the English root layout; all pages live under `src/app/(site)/`. The Chinese mirror lives under `src/app/zh/` with identical routes.
- **Shared root layout**: `AppRootLayout.tsx` is imported by both `(site)/layout.tsx` and `zh/layout.tsx`, rendering `<ThemeProvider> → <AppI18nShell locale> → <DataProvider> → <ProjectConfigProvider>` with GA script injection.
- **Global 404**: because there is no single root layout, the custom 404 uses `experimental.globalNotFound` + `src/app/global-not-found.tsx` (full HTML document, wraps `NotFoundClient.tsx` in a standalone `I18nProvider` — locale is NOT locked, so the in-page EN/ZH toggle works via `setLocale`).
- **SEO metadata**: Centralized in `routeMetadata.ts` (page-specific builders) → `pageMetadata.ts` (`buildLocalizedPageMetadata`) → `schema.ts` (JSON-LD). Each page imports the appropriate builder.
- **Locale routing**: `localeRouting.ts` provides path helpers (`buildLocalePath`, `switchLocalePath`, `buildLocaleUrl`, etc.) used by navigation components and language switcher.

### Key files you may reference

| File | Purpose |
|---|---|
| `src/app/AppRootLayout.tsx` | Shared root layout renderer (font, GA, providers) |
| `src/lib/localeRouting.ts` | URL-level i18n routing helpers (`/zh` prefix logic) |
| `src/lib/site.ts` | Site constants (`SITE_URL`, `SITE_NAME`, image URLs) |
| `src/lib/pageMetadata.ts` | `buildLocalizedPageMetadata()` — canonical, alternates, OG, Twitter, keywords, author |
| `src/lib/routeMetadata.ts` | Per-route `generateMetadata()` builders (home, guideline, privacy, terms, changelog, cost-tracker, cache-analyzer, pricing-calculator, author, blog index, 6 articles) |
| `src/lib/blogArticles.ts` | Blog article definitions (slug, pathname, titleKey, descriptionKey, keywords, publishedTime) |
| `src/lib/content.ts` | Article content type definitions (`ArticleSection[]`, `ContentBlock`, `PricingRow`) |
| `src/lib/content/articleCaching.ts` | Article 1 content (context caching guide) |
| `src/lib/content/articleTools.ts` | Article 2 content (cost optimization tools) |
| `src/lib/content/articleOpenai.ts` | Article 3 content (OpenAI vs Claude vs DeepSeek comparison) |
| `src/lib/content/articleOpencodeGo.ts` | Article 4 content (OpenCode Go — cheapest DeepSeek V4 Flash) |
| `src/lib/content/articleCsvFormatChange.ts` | Article 5 content (DeepSeek CSV export format change) |
| `src/lib/content/articleValueChampions.ts` | Article 6 content (2026 value champions: GPT-5.6 Luna vs DeepSeek V4 Flash) |
| `src/components/JsonLd.tsx` | Reusable JSON-LD `<script>` renderer |
| `src/components/NotFoundClient.tsx` | Client 404 UI (bilingual, in-page locale toggle, back-links) rendered by `global-not-found.tsx` |
| `src/components/AffiliateWall.tsx` | Commercial recommendation module for affiliate links |
| `src/components/RecommendedToolsSection.tsx` | Shared site-wide "Recommended Tools We ARE USING" wall (AffiliateWall + heading), rendered before FooterBar on every page |
| `src/components/CostTrackerContent.tsx` | `<noscript>` fallback for cost tracker SEO |
| `src/components/CacheAnalyzerContent.tsx` | `<noscript>` fallback for cache analyzer SEO |
| `src/components/PricingCalculatorContent.tsx` | `<noscript>` fallback for pricing calculator SEO |

## Sister project cross-linking

This project is part of the "API Usage Analyzer Series" — a product family with a sister project for Agnes AI:

- **DeepSeek Usage Analyzer** (this repo): `https://github.com/GavinCnod/deepseek-api-usage-analysis` → `https://deepseek-usage.xyz`
- **Agnes AI Usage Analyzer** (sister): `https://github.com/GavinCnod/agnes-api-usage-analysis` → `https://agnes-usage.xyz`

All cross-site links are centralized in `src/lib/sisterProjects.ts`. When adding a new cross-link entry point, use `buildTrackedSisterUrl(baseUrl, campaign)` to append UTM tracking (`utm_source=agnes_site`, `utm_medium=referral`, `utm_campaign=...`). The module exports `deepseekProject`, `agnesProject`, and `TOOL_SERIES_NAME`. The Agnes link appears in `FooterBar.tsx` ("Related Tools" row) and `LandingPage.tsx`; it was removed from `TitleBar.tsx` (v0.9.1) in favor of the unified "⋯" navigation menu.

Environment variables:
- `NEXT_PUBLIC_SITE_URL` — current site URL (default: `https://deepseek-usage.xyz`)
- `NEXT_PUBLIC_AGNES_SITE_URL` — Agnes site URL (falls back to GitHub URL if unset)
- `NEXT_PUBLIC_AGNES_GITHUB_URL` — Agnes GitHub repo URL (default: `https://github.com/GavinCnod/agnes-api-usage-analysis`)

## Bilingual routing

The app supports full EN/ZH mirroring at the URL level:

- **English** routes are prefix-free: `/`, `/guideline`, `/blog`, `/author`, etc.
- **Chinese** routes use `/zh` prefix: `/zh`, `/zh/guideline`, `/zh/blog`, `/zh/author`, etc.
- All pages have corresponding mirrors under `src/app/zh/` — when adding a new page, create both `(site)/<route>/page.tsx` and `zh/<route>/page.tsx`.
- Language switching via `LanguageSwitcher` uses `buildLocalePath()` to preserve the current page context.
- Sitemap generates both en and zh entries per route with cross-referenced `alternates.languages`.
- SEO landing pages (`/deepseek-api-cost-tracker`, `/deepseek-cache-hit-rate-analyzer`, `/deepseek-api-pricing-calculator`) each have Chinese mirrors with localized metadata.
- Blog articles have Chinese mirrors with localized content loaded from `content/article*.ts` modules.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
