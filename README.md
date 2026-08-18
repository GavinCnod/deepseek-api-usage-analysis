# DeepSeek API Usage Dashboard & Cost Tracker by Gavin & Mindrose Team

<p align="center">
  <img src="public/ds-usage-logo.png" alt="Logo" width="128" />
</p>

A browser-side analytics dashboard for DeepSeek API usage. Drag your monthly CSV exports onto the page and get instant cost charts, per-key breakdowns, cache analysis, and usage trends — all processed locally in your browser. No server, no upload, no signup.

> [中文版](README_zh.md)

## Sister Project

If you also analyze Agnes AI usage, check the companion open-source project in the same tool family:

- GitHub: [Agnes AI Usage Analytics Repo](https://github.com/GavinCnod/agnes-api-usage-analysis)
- Website: [Agnes AI Usage Analytics](https://agnes-usage.xyz)

## How it works

1. Go to [DeepSeek Platform](https://platform.deepseek.com) → Usage → Export monthly data
2. Each month downloads as a ZIP archive containing `amount-{year}-{month}.csv` and `cost-{year}-{month}.csv` (newer exports use date-range names like `amount-2026-08-01_2026-08-17.csv` — both are supported)
3. Drag ZIP files (or extracted CSVs) onto the dashboard — multiple months auto-pair
4. Charts render instantly — nothing leaves your browser

![Dashboard Overview](public/guideline/01-Ds-Api-Usage-Dashboard-Overview-en.png)

## Features

- **Overview** — KPI big numbers (cost, tokens, cache rate, active keys) + daily cost bar chart + cost-by-key donut chart
- **By Key** — Detailed table with per-key tokens, cost, color-coded cache hit rate (green > 40% / amber 20–40% / red < 20%), request counts, and inline usage bars
- **Cache** — Large-format hit rate display, daily cache hit rate trend line, stacked hits-vs-misses bar chart by key with hit% labels and tooltip
- **Trends** — Toggleable multi-metric line chart (cost / tokens / cache hit rate / requests) with dynamic hero number
- **Dark mode** — Full light/dark dual-theme with CSS custom properties; auto-detects system preference, manual toggle persisted to localStorage
- **Multi-language** — English and 中文, auto-detected from browser language; manual switch with localStorage persistence
- **By Project** — Custom project grouping tab: drag-and-drop API keys into user-defined projects, per-project cost/token/cache aggregation, config persisted to localStorage; gear icon opens drag-and-drop config modal with keyboard-accessible dropdowns
- **Model filter** — Segmented control (pill buttons) to filter all views by model; only shown when ≥2 models detected
- **One-click copy** — Reusable CopyButton component for clipboard copy of cost values across KeyView, ProjectView, and OverviewView; hover tooltip with i18n-aware toast
- **Social share cards** — Generate 1200×630 infographic share images for each dashboard tab (Overview / Projects / Keys / Cache / Trends). Customizable "From XXX" signature, optional quote message, per-tab ECharts mini-charts, QR code to deepseek-usage.xyz, app logo watermark, one-click copy to clipboard (paste directly to WeChat / Feishu / DingTalk), and PNG download.
- **Upload safety** — 50MB per-file size limit to prevent ZIP bomb attacks; user-facing error messages and dedicated FAQ entry
- **Multi-month support** — Drag multiple months at once; files auto-pair by filename pattern (both `amount-{year}-{month}.csv` and date-range `amount-2026-08-01_2026-08-17.csv` naming) and concatenate. Also supports ZIP archives directly — no extraction needed; drag DeepSeek platform ZIP exports straight onto the page.
- **Apple-minimalist design** — Cold gray paper-texture background, generous whitespace, "no-card" full-width modules, thin horizontal dividers, 5rem hero numbers, diffuse shadows
- **100% private** — All CSV parsing (Papa Parse), ZIP extraction (JSZip), and cost computation runs client-side; project configuration stored in your browser's localStorage only
- **SEO optimized** — Server-rendered metadata (canonical URLs, OpenGraph with `alternateLocale` en/zh, Twitter cards), JSON-LD structured data (`SoftwareApplication` + `FAQPage` + `BreadcrumbList` + `Organization`, bilingual, rendered via reusable `<JsonLd />` component), robots.txt + sitemap.xml (bilingual en/zh entries per route), `<noscript>` crawler fallback content, anchor-linkable landing page sections, `llms.txt` for LLM-friendly site description
- **Sister project cross-linking** — Centralized `sisterProjects.ts` module manages cross-links between the two sibling tools in the "API Usage Analyzer Series" product family (DeepSeek + Agnes). All cross-site URLs flow through a single config source with UTM tracking (`utm_source=agnes_site`, `utm_medium=referral`, per-location `utm_campaign`). Sister project links appear in the FooterBar ("Related Tools" row), LandingPage (dedicated section), and Organization JSON-LD schema.
- **Landing page** — Complete pre-upload landing with theme-aware background images, "Recommended Tools We ARE USING" AffiliateWall commercial module (above the FAQ), How It Works steps, accordion FAQ (9 items, including file size limits and project grouping), expanded multi-section About (project origin, privacy & tech, team, contact with email copy & social links + "View Changelog →" link), scroll-reveal animations, anchor-linkable sections with deferred rendering for performance
- **User Guide** — Comprehensive bilingual user manual at `/guideline` with annotated screenshots, interactive table of contents, step-by-step dashboard navigation, CSV export instructions, chart interpretation guide, and troubleshooting section
- **Changelog** — Dedicated `/changelog` page with complete version history (v0.1.0–v0.9.3) organized by category (Added/Improved/Fixed/Dependencies) with color-coded dots; Apple-minimalist bilingual design matching privacy/terms pages, JSON-LD WebPage schema, independent SEO metadata, linked from TitleBar, FooterBar, and LandingPage
- **Privacy Policy & Terms** — `/privacy` and `/terms` pages with bilingual legal content, independent SEO metadata (canonical, OpenGraph, Twitter), JSON-LD WebPage schemas, and Apple-minimalist legal-text layout; linked from footer on every page
- **Analytics** — Optional Google Analytics 4 integration via `NEXT_PUBLIC_GA_ID` env var; zero overhead when unset. Tracks page views, file uploads, share card generations, tab switches, and language switches — zero CSV data ever tracked.
- **Enhanced SEO** — Twitter `summary_large_image` card with 1200×630 OG image, `Organization` JSON-LD schema for Google Knowledge Panel, expanded `BreadcrumbList` with all sub-pages, differentiated sitemap `lastModified` dates, `keywords` + `author` + `twitter:site`/`creator` meta tags on all pages
- **Community ready** — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, Issue templates (bug report + feature request), and Pull Request template to welcome contributors
- **Error resilience** — Graceful error handling for ZIP/CSV processing failures with user-visible error messages and retry capability; parser crash protection in DataContext
- **Accessibility** — All charts have descriptive `aria-label` attributes; responsive hero text scales from `text-5xl` on mobile to `text-[5rem]` on desktop; empty-state messages when filtered data is zero

## CSV Format

Standard DeepSeek platform export. Newer exports use `start_time_iso`/`end_time_iso` ISO timestamps and date-range filenames (e.g. `amount-2026-08-01_2026-08-17.csv`); legacy exports with a `utc_date` column and `amount-{year}-{month}.csv` names are also supported.

### `amount-{year}-{month}.csv` (or date-range naming)

| Column           | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| `start_time_iso` | Period start (ISO 8601); the billing day is its date part (Beijing-local day)          |
| `end_time_iso`   | Period end (ISO 8601)                                                                  |
| `model`          | `deepseek-v4-pro`, `deepseek-v4-flash`, etc.                                           |
| `api_key_name`   | Your key label                                                                         |
| `api_key`        | Key (masked)                                                                           |
| `type`           | `request_count`, `output_tokens`, `input_cache_hit_tokens`, `input_cache_miss_tokens` |
| `price`          | Unit price in CNY (empty for `request_count`)                                          |
| `amount`         | Token or request count                                                                 |

### `cost-{year}-{month}.csv` (or date-range naming)

| Column           | Description                |
| ---------------- | -------------------------- |
| `start_time_iso` | Period start (ISO 8601)    |
| `end_time_iso`   | Period end (ISO 8601)      |
| `model`          | Model name                 |
| `wallet_type`    | Wallet type (e.g. `Paid`)  |
| `cost`           | Amount (negative = charge) |
| `currency`       | CNY                        |

## Development

```bash
npm install
npm run dev        # Dev server at localhost:3000
npm run build      # Static export → out/
npm run lint       # ESLint
npm test           # Vitest (47 tests)
```

### Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Framework   | Next.js 16 (App Router, static export)  |
| UI          | React 19                                |
| Charts      | ECharts 6 + echarts-for-react           |
| CSV Parsing | Papa Parse 5                            |
| ZIP Handling| JSZip                                    |
| Screenshot  | html2canvas                             |
| QR Code     | qrcode                                   |
| Styling     | Tailwind CSS v4 + CSS custom properties |
| Typography  | Hubot Sans (local WOFF2) + Geist Mono (next/font/google) |
| Language    | TypeScript 5 (strict mode)              |

### Project Structure

```
src/
├── app/                    # Next.js App Router (route groups + bilingual mirroring)
│   ├── (site)/             # English root layout group (invisible route group)
│   │   ├── layout.tsx          # English root layout → AppRootLayout(locale="en")
│   │   ├── page.tsx            # Entry → <Dashboard />
│   │   ├── guideline/
│   │   │   └── page.tsx        # /guideline route with independent SEO metadata
│   │   ├── privacy/
│   │   │   └── page.tsx        # /privacy route with independent SEO metadata
│   │   ├── terms/
│   │   │   └── page.tsx        # /terms route with independent SEO metadata
│   │   ├── changelog/
│   │   │   └── page.tsx        # /changelog route with independent SEO metadata
│   │   ├── deepseek-api-cost-tracker/
│   │   │   └── page.tsx        # SEO landing: DeepSeek API Cost Tracker
│   │   ├── deepseek-cache-hit-rate-analyzer/
│   │   │   └── page.tsx        # SEO landing: DeepSeek Cache Hit Rate Analyzer
│   │   ├── deepseek-api-pricing-calculator/
│   │   │   └── page.tsx        # SEO landing: DeepSeek API Pricing Calculator
│   │   ├── blog/
│   │   │   ├── page.tsx                    # /blog article index: newest-first post list
│   │   │   ├── deepseek-context-caching-guide/page.tsx    # Blog article 1
│   │   │   ├── deepseek-cost-optimization-tools/page.tsx  # Blog article 2
│   │   │   ├── openai-claude-vs-deepseek-cost-comparison/page.tsx # Blog article 3
│   │   │   ├── opencode-go-cheapest-deepseek-v4-flash/page.tsx # Blog article 4
│   │   │   ├── deepseek-csv-export-format-changed-aug-2026/page.tsx # Blog article 5
│   │   │   └── gpt-5.6-luna-vs-deepseek-v4-flash-value-champions/page.tsx # Blog article 6
│   │   └── author/
│   │       └── page.tsx          # /author route with independent SEO metadata
│   ├── zh/               # Chinese root layout group (mirrors all (site)/ routes)
│   │   ├── layout.tsx          # Chinese root layout → AppRootLayout(locale="zh")
│   │   ├── page.tsx            # /zh home → <Dashboard />
│   │   └── ...                 # Mirrors of all (site)/ pages
│   ├── globals.css         # Tailwind v4 + Hubot Sans @font-face + CSS variables
│   ├── AppI18nShell.tsx    # i18n shell + <html lang> sync
│   ├── AppRootLayout.tsx   # Shared root layout renderer (font, GA, providers)
│   ├── robots.ts           # Build-time robots.txt generation
│   └── sitemap.ts          # Build-time sitemap.xml (en + zh bilingual entries per route)
├── components/
│   ├── TitleBar.tsx         # Shared top nav bar (logo + app name + language + theme + unified "⋯" menu: guideline/privacy/terms/blog/author/changelog/GitHub)
│   ├── FooterBar.tsx        # Shared footer ("Related Tools" row + copyright + nav links + version, optional animate/reveal)
│   ├── LandingPage.tsx      # Landing page (Hero + Recommended Tools + Upload + HowItWorks + FAQ accordion + About, scroll-reveal)
│   ├── LandingContent.tsx   # Server-rendered <noscript> fallback for SEO crawlers
│   ├── GuidelinePage.tsx    # Full interactive user guide (bilingual, annotated screenshots, ToC, scroll-reveal)
│   ├── PrivacyPage.tsx      # Privacy policy (bilingual 7-section, JSON-LD WebPage, GitHub source links)
│   ├── TermsPage.tsx        # Terms of use (bilingual 8-section, JSON-LD WebPage, MIT License reference)
│   ├── ChangelogPage.tsx     # Changelog (v0.1.0–v0.9.3, category-grouped with colored dots, JSON-LD WebPage)
│   ├── CostTrackerPage.tsx    # SEO landing: DeepSeek API Cost Tracker (features + affiliate recommendations)
│   ├── CostTrackerContent.tsx # <noscript> SEO fallback: bilingual cost tracker content for crawlers
│   ├── CacheAnalyzerPage.tsx  # SEO landing: DeepSeek Cache Hit Rate Analyzer (caching education + MindRose CTA)
│   ├── CacheAnalyzerContent.tsx # <noscript> SEO fallback: bilingual cache analyzer content for crawlers
│   ├── PricingCalculatorPage.tsx # SEO landing: DeepSeek API Pricing Calculator (interactive slider + competitor table + recommendation wall)
│   ├── PricingCalculatorContent.tsx # <noscript> SEO fallback: bilingual pricing calculator content for crawlers
│   ├── AuthorPage.tsx         # Author profile page (bilingual bio, skills, social links, JSON-LD Person schema)
│   ├── AuthorContent.tsx      # <noscript> SEO fallback: bilingual author bio for crawlers
│   ├── BlogPostLayout.tsx     # Reusable blog post template (Apple-minimalist, metadata row, cross-links, CTA)
│   ├── BlogArticlePage.tsx    # Generic blog article wrapper (locale-aware content loading)
│   ├── ArticleRenderer.tsx    # Structured content renderer (h2/h3/p/ul/ol/code/table from ArticleSection[])
│   ├── BlogIndex.tsx          # Blog index page (newest-first post list, bilingual titles/descriptions/tags)
│   ├── PrivacyContent.tsx     # <noscript> SEO fallback: bilingual privacy policy for crawlers
│   ├── TermsContent.tsx       # <noscript> SEO fallback: bilingual terms of use for crawlers
│   ├── ChangelogContent.tsx   # <noscript> SEO fallback: bilingual changelog version summary for crawlers
│   ├── CopyButton.tsx         # Reusable clipboard copy button (hover tooltip, i18n toast, timer cleanup)
│   ├── ShareButton.tsx        # Share icon button in tab nav → opens ShareModal
│   ├── ShareCard.tsx          # 1200×630 social media infographic card (per-tab KPI + mini-chart + QR + watermark)
│   ├── ShareModal.tsx         # Share dialog (live preview, inputs, copy to clipboard, PNG download)
│   ├── AffiliateWall.tsx      # Commercial recommendation module: card-based layout for affiliate tools
│   ├── RecommendedToolsSection.tsx # Shared site-wide "Recommended Tools We ARE USING" wall (heading + AffiliateWall), rendered before FooterBar on every page
│   ├── Dashboard.tsx          # Routes between LandingPage and 5-tab dashboard view (semantic hidden H1)
│   ├── DropZone.tsx           # Drag-and-drop or click-to-upload CSV/ZIP (multi-file, 50MB limit)
│   ├── ProjectView.tsx        # By Project tab: drag-and-drop custom project groups, per-project stats table
│   ├── KPICards.tsx           # Summary stat cards
│   ├── OverviewView.tsx       # Hero cost + daily bars + donut
│   ├── KeyView.tsx            # Hero key count + detailed table
│   ├── CacheView.tsx          # Hero hit rate + trends + stacked bars
│   ├── TrendsView.tsx         # Hero dynamic metric + line chart
│   ├── ErrorDisplay.tsx       # Parse error & warning banners
│   ├── LanguageSwitcher.tsx   # EN / 中文 toggle (pill segmented control)
│   └── ThemeSwitcher.tsx      # Light / Dark toggle (SVG icon button)
├── i18n/
│   ├── index.ts            # Barrel export
│   ├── I18nProvider.tsx    # React context + useTranslation hook
│   └── translations.ts     # All UI strings (en + zh, 35+ key groups)
└── lib/
    ├── types.ts              # TypeScript interfaces & types
    ├── parser.ts             # CSV parsing pipeline
    ├── concatFiles.ts        # Multi-month CSV/ZIP pairing, extraction & concat + 50MB size limit
    ├── format.ts             # Locale-aware formatters
    ├── schema.ts             # JSON-LD structured data (SoftwareApplication + FAQPage + BreadcrumbList + Organization, bilingual)
    ├── DataContext.tsx       # Data state + model filter
    ├── ProjectConfigContext.tsx # Custom project grouping config (drag-and-drop, localStorage persistence)
    ├── ThemeContext.tsx      # Theme state + useTheme hook
    ├── shareCardData.ts      # Share card data extraction (per-tab summary data from ParseResult)
    ├── analytics.ts          # GA4 event tracking helper (page views, uploads, shares, tabs, language, affiliate clicks, landing CTAs)
    ├── sisterProjects.ts     # Sister project cross-linking config (Agnes/DeepSeek brand info, tracked URLs with UTM params)
    ├── affiliates.ts         # Affiliate marketing link config (Vultr/DO/Namecheap/OpenRouter/TencentCloud referral URLs)
    ├── authors.ts            # Author profile config (social/contact URLs, team member page URLs, buildAuthorMetadata)
    ├── blogArticles.ts       # Blog article definitions: slug, pathname, titleKey, descriptionKey, keywords, publishedTime
    ├── content.ts            # Article content type definitions (ArticleSection[], ContentBlock, RichParagraph, PricingRow)
    ├── content/articleCaching.ts   # Article 1 content: DeepSeek context caching guide (bilingual)
    ├── content/articleTools.ts     # Article 2 content: Top 5 cost optimization tools comparison (bilingual)
    ├── content/articleOpenai.ts    # Article 3 content: OpenAI GPT vs Claude vs DeepSeek V4 Pro cost comparison (bilingual + pricingTable)
    ├── content/articleOpencodeGo.ts # Article 4 content: DeepSeek V4 Flash on OpenCode Go (bilingual + pricingTable)
    ├── content/articleCsvFormatChange.ts # Article 5 content: DeepSeek usage CSV export format change (bilingual)
    ├── content/articleValueChampions.ts # Article 6 content: 2026 value champions (GPT-5.6 Luna vs DeepSeek V4 Flash) (bilingual + pricingTable)
    ├── localeRouting.ts      # URL-level language routing: DEFAULT_LOCALE, ZH_LOCALE_PREFIX, isZhPathname(), buildLocalePath(), switchLocalePath()
    ├── site.ts               # Site-level public constants: SITE_URL, SITE_NAME, OG_IMAGE_URL, LOGO_IMAGE_URL
    ├── pageMetadata.ts       # Page-level SEO metadata builder: buildLocalizedPageMetadata() (canonical, alternates, OG, Twitter, keywords, author)
    └── routeMetadata.ts      # Route-specific metadata builders: buildHomeMetadata(), buildGuidelineMetadata(), etc. (13 builders)
├── __tests__/
│   ├── analytics.test.ts       # trackEvent unit tests
│   ├── schema.test.ts          # Organization + BreadcrumbList schema tests
│   ├── sitemap.test.ts         # Sitemap lastModified differentiation tests
│   ├── localeRouting.test.ts   # URL routing helpers (13 tests)
│   ├── DataContext.test.tsx    # loadFiles error handling tests
│   └── DropZone.test.tsx       # Upload error display tests
```

## Design System

The dashboard follows an **Apple-minimalist** design language driven entirely by CSS custom properties:

- **30+ theme tokens** — background, text (3 levels), border, accent, semantic colors (positive/danger/warning), error/warning banners, chart colors, dropzone states
- **Light theme**: `#F5F5F7` cold gray paper background, `#1D1D1F` matte black text
- **Dark theme**: `#000000` pure black background, `#F5F5F7` white text
- **Typography**: Hubot Sans, weight 400 body / 500–700 headings, tight letter-spacing
- **Hero pattern**: `5rem` bold numbers in Overview / Keys / Cache / Trends — prominent, data-first presentation; responsive scaling (`text-5xl sm:text-6xl md:text-[5rem]`) prevents overflow on mobile
- **No-card layout**: Full-width modules separated by `1px solid var(--border)` dividers
- **Micro-interactions**: Subtle hover transitions (200ms), fade-in/slide-up animations, scroll-reveal sections with Intersection Observer, accordion QA panels
- **Custom scrollbar**: 6px thin, transparent track, themed thumb
- **Accessibility**: Respects `prefers-reduced-motion`, `color-scheme` for native UI, `focus-visible` outlines, `aria-expanded`/`aria-controls` on interactive elements

## SEO

The app implements a multi-layered SEO strategy for a client-rendered static SPA:

- **generateMetadata()** — Dynamic server-rendered metadata: canonical URL, OpenGraph (title, description, image), Twitter card, hreflang alternates (en/zh), robots directives
- **JSON-LD structured data** — `SoftwareApplication` + `FAQPage` + `BreadcrumbList` + `Organization` schemas in both English and Chinese (8 total script tags), injected at build time via `<script type="application/ld+json">` in `layout.tsx`; `Organization` schema enables Google Knowledge Panel brand recognition
- **robots.txt + sitemap.xml** — Generated at build time via Next.js 16 `MetadataRoute` conventions; sitemap includes `/`, `/guideline`, `/privacy`, `/terms`, and `/changelog` entries; site URL from `NEXT_PUBLIC_SITE_URL` env var
- **`<noscript>` fallback** — `LandingContent.tsx` outputs key landing page content (How It Works, FAQ, About) for crawlers that don't execute JavaScript; `PrivacyContent.tsx`, `TermsContent.tsx`, and `ChangelogContent.tsx` provide bilingual `<noscript>` fallbacks for the privacy, terms, and changelog pages (EEAT trust signals)
- **`llms.txt`** — LLM-friendly site description served at `/llms.txt`, summarizing the app's purpose, features, and structure for AI tools
- **Semantic HTML** — Visible `<h1>` on landing page and guideline page, `<h1 className="sr-only">` on dashboard, proper section structure

## Deploy

Static output — deploy to any static host:

```bash
npm run build
# out/ → Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain for correct canonical URLs, sitemap, and OpenGraph metadata. Optionally set `NEXT_PUBLIC_GA_ID` to your Google Analytics 4 measurement ID for page-view tracking. For sister project cross-linking, set `NEXT_PUBLIC_AGNES_SITE_URL` (Agnes site URL) and `NEXT_PUBLIC_AGNES_GITHUB_URL` (Agnes GitHub repo URL).

### Vercel Deployment

The repo includes `vercel.json` with pre-configured security headers and caching:

- **Security**: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy` — all set to production-safe values
- **Caching**: immutable caching for `/_next/static` and `/fonts` (1 year), stale-while-revalidate for `/landing` and `/guideline` images (1 week)

## Changelog

### v0.9.3

**Added:**

- Tool series internal linking — the 3 tool landing pages (`/deepseek-api-cost-tracker`, `/deepseek-cache-hit-rate-analyzer`, `/deepseek-api-pricing-calculator`) are now reachable from a new "Explore the Tool Series" homepage section, a dedicated Tools row in the footer (every page), in-content links across 5 blog posts, and cross-links between the tool pages themselves — no more orphaned pages.

**Improved:**

- Keyword ownership clarified — the homepage title now targets the broad brand term "DeepSeek API Usage Analytics — Free CSV Dashboard" (aligned with its H1); the exact-match keyword "deepseek api cost tracker" belongs exclusively to the cost tracker tool page, removing self-competition.
- Meta descriptions optimized — 10 English descriptions trimmed from 165–211 to ≤160 characters for cleaner SERP display.
- Blog index structured data — `/blog` and `/zh/blog` now emit Blog + ItemList JSON-LD referencing all 6 articles.
- Site icons slimmed — favicon compressed from 242 KB to ~10 KB (multi-size 16/32/48) plus a new 180×180 apple-touch-icon; the 242 KB `ds-usage-logo.ico` is no longer referenced from page markup (~240 KB saved per page).
- Custom bilingual 404 — branded page (English default, in-page Chinese toggle) with links back to the homepage, blog, and all three tools, via `app/global-not-found.tsx` (`experimental.globalNotFound`).

### v0.9.2

**Added:**

- `x-default` hreflang declared on every page (HTML `<head>` and XML sitemap), pointing to the English version as the search-engine language fallback.

**Improved:**

- SEO `<noscript>` fallbacks now render a single language — the 8 server-rendered content blocks (landing, 3 tool landing pages, privacy, terms, changelog, author) no longer duplicate both EN and ZH full text on every page, eliminating cross-language duplicate content; every page now contains exactly one H1.
- Page titles and meta descriptions optimized — homepage and all 6 blog posts trimmed to ≤62-character titles; 5 overlong descriptions reduced from 184–253 to 148–166 characters. Keyword ownership also differentiated between the Pricing Calculator and the OpenAI-vs-DeepSeek comparison article.
- ECharts lazy-loaded — the ~1.4 MB chart library (plus ShareCard) loads on demand after CSV upload instead of being in the landing bundle, cutting initial page JS from ~2.3 MB to ~1 MB.
- User Guide screenshots now ship descriptive bilingual alt text and captions; fixed a parser bug that silently dropped the guide's H1 title.
- Sitemap blog `lastModified` now uses real publish dates; `og-image.png` added to the vercel.json caching rule.

### v0.9.1

**Added:**

- Site-wide "Recommended Tools We ARE USING" wall — a shared `RecommendedToolsSection` component now renders the AffiliateWall commercial block at the bottom of every page (dashboard, tools landing pages, blog index, every blog post, user guide, privacy/terms/changelog/author pages), aligned to each page's content container width. The Pricing Calculator's single Vultr CTA was replaced by the full recommendation wall.

**Improved:**

- TitleBar redesigned into a unified navigation menu — all entry points (User Guide, Privacy Policy, Terms of Use, Blog, Author Team, Changelog, GitHub) are now grouped in a single Apple-style "⋯" popover menu on both desktop and mobile, replacing the scattered icon buttons. The Agnes sister-project button was removed from the title bar (the link remains in the footer).

### v0.9.0

**Added:**

- New blog article published — "The 2026 Value Champions: GPT-5.6 Luna & DeepSeek V4 Flash — and the Best Model for Every Budget" (`/blog/gpt-5.6-luna-vs-deepseek-v4-flash-value-champions`) with bilingual EN/ZH content, an 8-model dual-currency pricing table (¥ / $, peak / off-peak), the "price is no longer a proxy for quality" thesis, an off-peak scheduling playbook, and a tier-by-tier best-value framework. Fully wired into the blog index, sitemap, prev/next chain, and SEO metadata.
- Blog comparison articles refreshed to August 2026 pricing — the OpenAI vs Claude vs DeepSeek, OpenCode Go, and context-caching articles now use the new DeepSeek peak / off-peak rates, the GPT-5.6 Sol / Terra / Luna lineup, and the Claude Opus 5 / Sonnet 5 / Haiku 4.5 lineup, with dual-currency (¥ / $) pricing cells. The OpenCode Go article's "DeepSeek price hike" narrative was strengthened with the landed peak-price increase.

**Improved:**

- Pricing Calculator updated to DeepSeek's new peak / off-peak billing — DeepSeek V4 Flash and V4 Pro now use the official per-million-token prices in CNY with peak hours (Beijing time 09:00–12:00 and 14:00–18:00) billed at full price and off-peak hours at 50% off. A new "Peak-Hour Share" slider lets you model how much of your traffic falls in peak windows, and the comparison table shows both peak and off-peak prices for each DeepSeek model. Cache-hit pricing was also corrected to the new 1/30-of-input rate. Competitor lineup refreshed to GPT-5.6 Sol / Terra / Luna and Claude Opus 5 / Sonnet 5 / Haiku 4.5 with their latest August 2026 prices (including the July 30 GPT-5.6 price cuts and the 50% Batch API discount).

**Fixed:**

- DropZone stuck-spinner on parse failure — a CSV that passed concatenation but failed CSV parsing left the upload UI spinning forever, because the parse error is raised asynchronously inside the data context and never reached the drop zone's catch clause. The busy state is now correctly released after concatenation, so a failed parse returns the user to the upload state (with the error banner visible) instead of requiring a page reload. Regression test added.

### v0.8.0

**Added:**

- Support for DeepSeek's new CSV export format — the export schema changed from a `utc_date` date column to `start_time_iso` / `end_time_iso` ISO timestamps (`user_id` and `wallet_type` are now always present). The parser derives the billing day from the `start_time_iso` date part (Beijing-local day) and pairs the new date-range filenames (`amount-2026-08-01_2026-08-17.csv`). Legacy exports using `utc_date` and `amount-{year}-{month}.csv` names remain fully supported for backward compatibility.
- New `parser.test.ts` — unit tests covering the new format, legacy-format backward compatibility, missing-column errors, and the date-range filename pairing logic.

**Fixed:**

- DeepSeek export format change breaking parsing — newer platform exports no longer include the `utc_date` column, which previously caused the dashboard to reject them with a "missing column" error. Parsing now accepts the new schema (and still reads legacy files).

### v0.7.0

**Added:**

- 4th blog article published — "DeepSeek V4 Flash for $10/Month — the World's Cheapest Frontier Model Is on OpenCode Go" (`/blog/opencode-go-cheapest-deepseek-v4-flash`) with bilingual EN/ZH content, a pricing comparison table (V4 Flash vs V4 Pro vs GPT-5.6 Luna), full SEO metadata, sitemap entry, and prev/next cross-links wired into the blog chain.
- Opencode Go affiliate added to `affiliates.ts` registry — referral link (`opencode.ai/go?ref=NS60V8HH6Q`) surfaced through the AffiliateWall "Recommended Tools We ARE USING" module on the homepage, every blog post, AuthorPage, and CostTrackerPage.

**Improved:**

- Blog index now sorts articles newest-first — the post list is ordered by each article's `publishedTime` from `blogArticles.ts` instead of a hardcoded sequence, so new posts automatically surface at the top.
- Homepage sister-project section replaced with the "Recommended Tools We ARE USING" AffiliateWall commercial module — the block now sits above the FAQ section with centered title and subtitle.
- Blog post bottom CTA banner ("Try our free dashboard") replaced with the same AffiliateWall Recommended Tools module, turning every article's footer into a revenue-bearing commercial section.

### v0.6.6

**Added:**

- Promotion post templates added to `docs/promotion/` — ready-to-use posts for Vercel Blog, Product Hunt, Hacker News, Reddit (r/deepseek, r/LLMdevs, r/SideProject, r/selfhosted), V2EX, Zhihu/Juejin/Cnblogs, LinkedIn, and Twitter/X thread.

**Improved:**

- Homepage SEO metadata optimized — title changed to "DeepSeek API Cost Tracker & Usage Analytics — Free CSV Dashboard" with keyword-first strategy; description rewritten to include primary keywords in first sentence.
- Landing page hero section enhanced — added explicit keyword-rich subtitle below H1 on homepage and all three SEO landing pages (Cost Tracker, Cache Analyzer, Pricing Calculator) for improved search engine visibility.
- Tool landing page metadata refined — Cost Tracker title updated to emphasize "No Signup"; Cache Analyzer title streamlined; Pricing Calculator description de-emphasized model list in favor of action-oriented copy.

### v0.6.5

**Added:**

- Schema unit tests added — new `schema.test.ts` test file with validation coverage for JSON-LD schema generation functions, ensuring structured data correctness across versions.

**Improved:**

- Blog metadata management centralized — extracted all 3 blog article metadata (title, description, tags, publish date, SEO fields) into a shared `blogArticles.ts` module, replacing inline metadata in individual article page files for consistent single-source-of-truth management.
- Reusable JsonLd component extracted — encapsulated JSON-LD structured data generation into a generic `<JsonLd />` component, simplifying the 5 blog article page files and `layout.tsx` that previously duplicated schema generation logic.
- AuthorContent team member display refactored — rebuilt team member rendering with array mapping (`TEAM_MEMBERS` config array + `.map()`) replacing individual hardcoded member blocks, reducing code duplication and improving maintainability.
- Schema module simplified — `schema.ts` streamlined by extracting reusable JSON-LD rendering logic into `JsonLd.tsx` component, reducing module complexity.

### v0.6.4

**Added:**

- Author & Team page comprehensively revamped — replaced placeholder team section with 4 real member profiles (Gavin Chen, Lindsay Lin, Angela Lee, Simon L.) each with role, description, and initial avatar in a responsive CSS Grid layout; page title updated to "Author & Team" with refined bilingual copy across profile, bio, verification, and member sections.
- Tencent Cloud affiliate program added to `affiliates.ts` registry — new referral link integrated into the `AffiliateWall` component across AuthorPage and CostTrackerPage, alongside expanded developer infrastructure vendor coverage (Vultr, Railway, Silicon Flow, Warp) with new i18n labels ("Recommended Tools We ARE USING" / "我们正在使用的好工具").
- `og-image.png` static asset added to `/public` — 1200×630 social preview image for OpenGraph/Twitter cards, enhancing link previews when shared on social media platforms.

**Improved:**

- Blog article cost comparison data refreshed — updated pricing for GPT-5.5, GPT-5.4, GPT-5.4 mini, Claude Fable 5, Opus 4.8, Sonnet 5, and Haiku 4.5 across all comparison tables in the OpenAI vs DeepSeek blog article. Article narrative updated to include Anthropic Claude alongside OpenAI GPT and DeepSeek throughout the migration guide and cost-benefit analysis sections.
- Affiliate link system streamlined — `affiliates.ts` registry trimmed and reorganized with updated vendor categories; CostTrackerPage recommended tools section switched from Portkey/Helicone to developer infrastructure tools (Vultr, Railway, Tencent Cloud, Silicon Flow, Warp) with new descriptive labels reflecting real usage context.
- Blog article tag metadata enriched — added "Token Cost", "Claude", "GPT", and "Anthropic" tags to blog index article cards for improved SEO keyword coverage across both locales.

**Fixed:**

- Blog comparison article URL normalization — sitemap, route metadata (`routeMetadata.ts`), and blog article page paths corrected from `/blog/openai-vs-deepseek-cost-comparison` to `/blog/openai-claude-vs-deepseek-cost-comparison` to accurately reflect the three-provider comparison scope (OpenAI GPT + Anthropic Claude + DeepSeek).

### v0.6.3

**Added:**

- CNY/USD currency toggle in Pricing Calculator — users can switch between RMB (¥) and US Dollar ($) for all pricing displays, with real-time conversion at approximate exchange rate
- AffiliateWall component — centralized affiliate link showcase section for SEO landing pages, providing structured vendor recommendations (Vultr, DigitalOcean, Namecheap, OpenRouter) with referral links and `rel=sponsored nofollow` compliance
- `<noscript>` SEO fallback content for all 3 tool landing pages (CacheAnalyzerContent, CostTrackerContent, PricingCalculatorContent) — bilingual crawler-readable content for better search indexing, matching the pattern used by PrivacyContent and TermsContent
- Expanded LLM cost comparison in the OpenAI vs DeepSeek blog article — added latest GPT models (GPT-4.1, GPT-4.5 Preview, GPT-5) and Claude models (Opus 4.5, Sonnet 4.5, Haiku 4.5) with updated pricing data across all model families

**Improved:**

- Affiliate link system refactored — centralized `affiliates.ts` configuration expanded with additional vendor programs, improved type safety with categorized link groups, and better UTM tracking integration across landing pages and blog CTAs
- Landing page SEO enhanced — tool landing pages now include enhanced JSON-LD structured data and bilingual `<noscript>` crawler fallback content for better search engine visibility and EEAT trust signals
- Blog article cost comparison accuracy — updated with latest model pricing across GPT, Claude, and DeepSeek families for more accurate cost-benefit analysis

**Fixed:**

- Homepage URL canonicalization — fixed inconsistent canonical path generation for the root URL that could produce duplicate canonical URLs; simplified sitemap generation logic for cleaner output

### v0.6.2

**Added:**

- URL-level i18n routing — introduced `/zh` prefix for Chinese locale routes (e.g., `/zh/guideline`, `/zh/blog`). English routes remain prefix-free. Full bilingual URL mirroring for all pages, SEO landing pages, and blog articles. New centralized modules: `localeRouting.ts` (locale detection, path construction, redirects), `site.ts` (SITE_URL, SITE_NAME, OG/logo image URLs), `pageMetadata.ts` and `routeMetadata.ts` (shared `generateMetadata()` helpers). `AppRootLayout.tsx` extracted from old `layout.tsx` for locale-aware root layout. Each route now has independent SEO metadata via `(site)/` and `zh/` route groups.
- Locale-aware navigation — updated all internal links (TitleBar, FooterBar, LandingPage, GuidelinePage, blog components, sub-pages) to use `buildLocalePath()` for correct locale prefix handling. LanguageSwitcher now uses locale-aware path construction for seamless locale switching without losing current page context.

**Improved:**

- Blog article multi-language support — replaced hardcoded English text in BlogArticlePage and BlogPostLayout with i18n translation keys. Blog metadata fetching now uses locale-aware logic, reusing existing blog translation strings for consistent bilingual content.
- Landing page external link button styling — unified the visual style of outbound link buttons on the landing page, fixing inconsistent button appearances across different sections.
- Blog index layout refinement — adjusted blog list paragraph max-width to `max-w-3xl` for improved reading experience on wide viewports.
- Test coverage — added `localeRouting.test.ts` (69 new tests) for the locale routing module. Updated `analytics.test.ts` and `sitemap.test.ts` to cover new route structures.

### v0.6.1

**Added:**

- Author page (`/author`) — dedicated bilingual profile page for Gavin Chen with bio, skill tags, social links (GitHub, LinkedIn, Email, MindRose, WeChat), JSON-LD Person schema, independent SEO metadata (canonical, OG, Twitter), Apple-minimalist layout, and `<noscript>` crawler fallback. FooterBar navigation link added.
- Centralized author config module (`src/lib/authors.ts`) — single source of truth for social/contact URLs and team member page URLs. Blog article pages now include full author Person metadata (`sameAs` links, `worksFor` MindRose org) in JSON-LD.

**Improved:**

- Site-wide SEO metadata — added `author`, `keywords`, and `twitter:site`/`twitter:creator` meta tags to all page-level `generateMetadata()` calls (blog articles, tool landing pages, guideline, privacy, terms, changelog). Unified author references via `authors.ts`.
- Code cleanup — removed deprecated old landing page image asset and unused module-level imports.

### v0.6.0

**Added:**

- 3 SEO landing pages — `CostTrackerPage`, `CacheAnalyzerPage`, and `PricingCalculatorPage` (interactive slider calculator + competitor pricing comparison table). Each page has independent canonical URL, OpenGraph with `summary_large_image`, Twitter card, hreflang, keywords, and bilingual content. Commerce-oriented modules include affiliate tool recommendations (Portkey, Helicone) and Vultr referral CTA.
- Blog infrastructure — blog index with 3-card tag/description grid + 3 bilingual articles: *The Ultimate Guide to DeepSeek API Context Caching*, *Top 5 DeepSeek API Cost Optimization & Observability Tools*, and *OpenAI GPT vs Claude vs DeepSeek V4 Pro: Cost-Benefit Analysis*. All articles support EN/ZH switching via `BlogArticlePage` → `ArticleRenderer` structured content system (`src/lib/content/articleCaching|articleTools|articleOpenai.ts`).
- Affiliate marketing integration — centralized `src/lib/affiliates.ts` config module with Vultr, DigitalOcean, Namecheap, and OpenRouter referral URLs. Affiliate links added to landing pages and blog CTAs with `rel=sponsored nofollow`.
- UTM-based conversion tracking funnel — `trackLandingCTA()`, `trackOutboundClick()`, `trackPageView()` helpers in `src/lib/analytics.ts`. Comprehensive GA4 configuration guide at `docs/promotion/GA4_Tracking_Guide.md`.
- Blog navigation — pen icon button in TitleBar, text link in FooterBar between Changelog and GitHub. Logo in TitleBar now links to home page.
- Bilingual blog index — article card titles, descriptions, and tags sourced from `blogIndex.*` translation keys (en/zh).

**Improved:**

- Responsive TitleBar — mobile layout uses `...` popover menu (Agnes, GitHub, Guideline, Blog, Changelog, Theme toggle). Desktop retains full icon row. Clean separation prevents overflow on 375px-wide screens.
- Enhanced TitleBar icons — guideline now uses a compass icon (navigation metaphor), blog uses a pen icon (writing metaphor). Clearer semantic distinction at 16×16px.
- SEO coverage — sitemap expanded from 5 to 12 entries, covering all new tool pages, blog index, and 3 articles. `llms.txt` and `llms-full.txt` updated with all new pages.
- SEO metadata — page title optimized to `DeepSeek API Usage Dashboard & Cost Tracker | Free & Secure` with keywords-first strategy. All blog pages now have independent `generateMetadata()` (canonical, OG, Twitter, keywords, robots).

### v0.5.4

**Added:**

- Sister project cross-linking — centralized `src/lib/sisterProjects.ts` module for the "API Usage Analyzer Series" product family (DeepSeek + Agnes). Agnes AI pill button in TitleBar, dedicated Sister Project section on LandingPage, "Related Tools" row in FooterBar, and expanded Organization JSON-LD schema (`sameAs` + `brand`). All cross-site links include UTM tracking (`utm_source=agnes_site`, `utm_medium=referral`, per-location `utm_campaign`).

**Improved:**

- Improved the token count number display format in Chinese Language.

### v0.5.3

**Added:**

- Enhanced SEO — Twitter card upgraded to `summary_large_image` with 1200×630 OG social preview image; added `keywords`, `twitter:site`/`creator`, and `author` meta tags to all pages.
- Organization JSON-LD structured data for Google Knowledge Panel brand recognition; expanded BreadcrumbList with all sub-page entries.
- GA4 conversion events — `upload_csv`, `share_card`, `tab_switch`, and `language_switch` event tracking via shared `trackEvent()` analytics helper.
- Community infrastructure — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, GitHub Issue templates (bug report + feature request), and Pull Request template.

**Improved:**

- Responsive hero numbers — hero text now scales down on mobile screens (`text-5xl → sm:text-6xl → md:text-[5rem]`), preventing horizontal overflow.
- Chart accessibility — all ECharts instances now have descriptive `aria-label` attributes for screen readers.
- Sitemap lastModified dates — now differentiated per route; privacy/terms use `yearly` change frequency with historical dates.

**Fixed:**

- Critical: DropZone error handling — added missing `catch` clause for ZIP/CSV processing errors. Previously, a corrupt file or extraction failure left the UI stuck in an infinite "Processing" spinner. Now shows a user-visible error message with retry capability.
- DataContext parser crash protection — wrapped `parseDeepSeekData()` in `try/catch` inside the `setTimeout` callback. Previously, a synchronous parser crash would fail silently with no user feedback.
- Empty states — OverviewView, KeyView, TrendsView, and ProjectView now show descriptive empty-state messages when data is empty after model filtering.

**Dependencies:**

- Added `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, and `@vitejs/plugin-react` for test infrastructure. 21 tests across 5 test files.

### v0.5.2

**Added:**

- Social media share cards — each dashboard tab (Overview / Projects / Keys / Cache / Trends) can now generate a 1200×630 infographic share image. Supports customizable "From XXX" signature, optional quote message, per-tab ECharts mini-charts, QR code pointing to deepseek-usage.xyz, app logo watermark, one-click copy to clipboard (paste directly to WeChat / Feishu / DingTalk), and PNG download.

**Dependencies:**

- Added `html2canvas` (DOM-to-canvas screenshot) and `qrcode` (client-side QR code generation).

### v0.5.1

**Added:**

- Changelog page (`/changelog`) — a dedicated page showcasing the complete version history, in Apple-minimalist bilingual design matching privacy/terms pages. Includes JSON-LD WebPage schema, independent SEO metadata (canonical, OpenGraph, Twitter), and version entries organized by category (Added/Improved/Fixed/Dependencies) with color-coded dots.
- TitleBar clock icon linking to the changelog page, alongside the existing guideline book icon.
- LandingPage About section "View Changelog →" link below the social link pills.

**Improved:**

- TitleBar tooltips (User Guide, Changelog) now properly support i18n, displaying localized text in both English and Chinese.
- Sitemap (`sitemap.xml`) expanded with `/changelog` entry (priority 0.5, monthly change frequency).
- Translation system extended with `changelog.*` group (en + zh).

### v0.5.0

**Added:**

- ZIP file upload support — users can now drag DeepSeek platform ZIP exports directly into the dashboard. ZIP archives containing CSV files are automatically extracted and processed in-browser. Huge thanks to [@taylord0ng](https://github.com/taylord0ng) for this contribution.
- Custom project grouping for API keys — a new "By Project" tab lets you organize API keys into user-defined project groups via drag-and-drop, with per-project cost aggregation, token usage tracking, and cache hit rate analysis. Inspired by [@taylord0ng](https://github.com/taylord0ng).
- Project configuration modal — drag-and-drop interface for assigning keys to custom projects, with local persistence via `localStorage`, reset-to-default, empty-state prompts, keyboard-friendly operation, and dropdown menus for unassigned keys.
- Reusable CopyButton component — encapsulated clipboard copy logic with hover tooltip and i18n-aware success messages. All inline copy functionality (KeyView, ProjectView) now uses this shared component.
- One-click cost copy — copy total cost from the Overview hero number with a single click.
- 50MB per-file upload size limit — protects against accidental or malicious oversized file uploads (e.g., ZIP bombs) that could freeze the browser. Includes user-facing warning prompts and a dedicated FAQ entry.

**Improved:**

- Upload validation — file size check with clear error messaging, duplicate project name validation with inline hints, and unsaved-changes confirmation dialog when closing the project config modal.
- Keyboard accessibility — full keyboard navigation support in the project configuration modal: Enter to confirm, Escape to close, arrow keys to navigate, plus on-screen keyboard shortcut hints.
- UI polish — fixed drag highlight state glitch in project key lists, resolved React key warnings in config lists, adjusted modal layout for better visual balance.
- i18n coverage — all new UI elements (project view, copy button, upload limits, config modal) fully translated in both English and Chinese.
- Fixed CopyButton timer memory leak — timers now properly cleaned up on unmount, preventing stale state updates.
- User guide and landing page — updated FAQ (new entries for file size limits and project grouping), usage guide screenshots and documentation, and landing page copy to reflect new features.

**Dependencies:**

- Added `jszip` for client-side ZIP extraction.

### v0.4.0

**Added:**

- Privacy Policy page (`/privacy`) — bilingual (en/zh) legal content covering 7 sections: no data collection, local processing, Google Analytics (opt-in), third-party services, security, policy changes, and contact. Independent SEO metadata (canonical URL, OpenGraph, Twitter card), JSON-LD WebPage schema, Apple-minimalist legal-text layout with GitHub source links for transparency verification.
- Terms of Use page (`/terms`) — bilingual (en/zh) legal content covering 8 sections: as-is service, no warranty, not affiliated with DeepSeek, user data & responsibility, open source (MIT License), limitation of liability, changes to terms, and contact. Independent SEO metadata and JSON-LD WebPage schema.
- MIT LICENSE file — added to the project root for open-source licensing clarity.
- FooterBar now links to Privacy Policy and Terms of Use pages alongside Guideline, GitHub, and version.

**Improved:**

- Sitemap (`sitemap.xml`) expanded to include `/privacy` and `/terms` entries (priority 0.5, monthly change frequency).
- Translation system extended with `privacy.*` (21 keys) and `terms.*` (22 keys) groups in both English and Chinese.
- SEO metadata: `NEXT_PUBLIC_SITE_URL` now injected into privacy and terms page metadata generation.

### v0.3.3

**Fixed:**

- Cache hit rate chart accumulation bug in TrendsView: daily ratios were incorrectly summed instead of computing hit/(hit+miss) from raw token totals, causing values to potentially exceed 100%.

**Added:**

- Cache hit rate percentage display on the hits-vs-misses stacked bar chart in CacheView: hit rate shown in tooltip and as labels on top of each key's bar.
- `vercel.json` with production security headers (CSP, HSTS, X-Frame-Options, etc.) and optimized static asset caching rules.

### v0.3.2

**Added:**

- User Guide page (`/guideline`) — comprehensive usage documentation covering dashboard overview, CSV export, data upload, chart interpretation, and troubleshooting; bilingual (en/zh) with annotated screenshots.
- Guideline navigation links in TitleBar (book icon), FooterBar (text link), and LandingPage (below How It Works section).
- 3 new FAQ entries (Q5–Q7): "Why does my cost show as $0?", "What does Incomplete Upload mean?", and "Where can I find more troubleshooting help?".
- Dashboard overview screenshot and logo in README files (en + zh).

**Improved:**

- SEO: added `/guideline` to sitemap.xml.
- JSON-LD FAQPage schema expanded with Q5–Q7 entries (bilingual).
- Added `/docs/` to `.gitignore`.

### v0.3.1

**Added:**

- JSON-LD BreadcrumbList schema (bilingual en/zh) for better search engine understanding of site structure.

**Improved:**

- SEO: extended Chinese `meta.description` with privacy and team info (~100 characters, up from ~37).
- SEO: added `alternateLocale: ["zh_CN"]` to OpenGraph metadata, complementing existing hreflang alternates.
- SEO: added `id` attributes to landing page sections (`#how-it-works`, `#faq`, `#about`) for direct anchor linking.
- JSON-LD: added `version` field to `SoftwareApplication` schema.
- Performance: added `content-visibility: auto` to below-the-fold landing page sections (How It Works, FAQ, About) to reduce initial render cost.

### v0.3.0

**Added:**

- Rebuilt About section: expanded from a single paragraph into 4 themed subsections — Why We Built This, Under the Hood: Privacy & Tech, About MindRose, and Let's Work Together — each separated by dashed `<hr>` dividers.
- Email copy button in the Contact area: one-click clipboard copy (`navigator.clipboard.writeText` with textarea fallback), anti-scraping dynamic address concatenation, and SVG checkmark copy feedback with 2s toast.
- Social link pills: GitHub repository, Gavin's LinkedIn, and MindRose website — each with themed SVG icons, `rounded-subtle` borders, and hover background.

**Improved:**

- Landing page sections now separated by thin horizontal `<hr>` dividers for clearer visual hierarchy.
- QA accordion section centered with `max-w-2xl` for better readability on wide viewports.
- TitleBar `z-index` raised to `z-50` to guarantee it stays above all content.
- Landing page sections use `pt-10` top padding (previously `pt-0`) for consistent spacing around dividers.
- Added 14 new `landing.*` translation keys (en + zh) for all About sub-sections.
- Rebranded site title to "DeepSeek API Usage Analytics Dashboard by Gavin & Mindrose Team" across metadata, JSON-LD schema, footer, and translations.
- Fixed landing page heading hierarchy: section titles upgraded from `<h3>` to `<h2>`, sub-section titles from `<h4>` to `<h3>`.

### v0.2.3

**Added:**

- Full-site SEO: `generateMetadata()` with canonical URLs, OpenGraph, Twitter cards, and hreflang alternates.
- JSON-LD structured data: bilingual `SoftwareApplication` + `FAQPage` schemas (via `src/lib/schema.ts`).
- `robots.txt` and `sitemap.xml` generation at build time (via `src/app/robots.ts` and `src/app/sitemap.ts`).
- `<noscript>` crawler fallback content (`LandingContent.tsx`) for search engines that don't execute JavaScript.
- Theme-aware landing page background images — CSV and chart sketches that swap with light/dark mode.
- Semantic hidden H1 on dashboard view for screen readers and SEO.

**Improved:**

- `layout.tsx` upgraded to `generateMetadata()` for dynamic build-time SEO injection.
- `LandingPage.tsx` now renders `LandingContent` for SEO and theme-aware background decoration.
- `FooterBar.tsx` extracted as standalone component with `animate` and `sectionRef` props.
- `TitleBar.tsx` extracted as standalone component with logo, GitHub icon, and unified layout.
- Added `warning` translation group (date mismatch, no cost match, partial cache data, schema drift).
- Updated DropZone component background styles for better drag-and-drop interaction.

### v0.2.2

**Added:**

- Logo icon and favicon.ico — added brand identity assets to TitleBar and browser tab.
- Replaced default English font with local Hubot Sans WOFF2 files (3 weights: 400/500/700).

**Improved:**

- Redesigned LanguageSwitcher as Apple-style pill segmented control with `role="radio"` accessibility.
- Redesigned ThemeSwitcher as SVG sun/moon icon button with hover background.
- Added GitHub icon link to TitleBar for quick repository access.
- FooterBar now displays app version number alongside copyright and GitHub link.
- DropZone now has a subtle themed background color (`--dropzone-bg`) instead of transparent.
- Landing page content container widened from `max-w-3xl` to `max-w-6xl` for better visual balance.
- Added scroll-reveal fade-in + slide-up animations on landing page sections via Intersection Observer.
- Added accordion expand/collapse animation for the QA section.
- Added mobile-friendly flex-wrap layout to FooterBar for small screen readability.
- Updated bilingual copy — refined upload area hint text and corrected ellipsis formatting.
- Added global accessibility styles: smooth scrolling, `prefers-reduced-motion` support, `color-scheme` for native UI, `focus-visible` outlines.

### v0.2.1

**Added:**

- Landing page — built a complete pre-upload landing page with Hero, upload area, How It Works steps, FAQ, and About sections.

### v0.2.0

**Added:**

- Full light/dark theme switching — refactored global CSS with custom properties for unified dual-theme color management.
- Model filter — added Apple-style segmented capsule filter in Dashboard, optimized UI and data presentation.

**Improved:**

- Refined overall UI interactions and visual styling.
- Refactored all view components to render from filtered data; added Hero big-number summary sections at the top of each view.

### v0.1.0

**Added:**

- Built the DeepSeek API usage analytics dashboard — implemented CSV parsing, multi-month file concatenation, and error validation logic; all data processing runs purely in the browser.
- Developed drag-and-drop upload component, data context layer, and multi-dimensional visualization dashboard.
- Added full i18n support with language switching, and refactored numeric formatting utilities to adapt unit display rules for different locales.

## License

MIT
