"use client";

/**
 * ChangelogPage — 更新日志页面
 *
 * 展示 DeepSeek API 用量分析仪表盘自 v0.1.0 以来的所有版本变更记录。
 * 采用与 PrivacyPage / TermsPage 一致的 Apple 极简风格：
 * - TitleBar + 返回首页 + 主内容区 + FooterBar
 * - 支持中英双语切换（通过 useTranslation hook）
 * - 支持浅色/深色双主题（CSS 变量驱动）
 * - 按版本号倒序排列，每个版本按类别（新增/改进/修复/依赖）分组展示
 */

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath, buildLocaleUrl } from "@/lib/localeRouting";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";
import { useMemo } from "react";

/* ================================================================== */
/*  更新日志数据结构                                                      */
/* ================================================================== */

/** 单条变更项（双语） */
interface ChangeItem {
  en: string;
  zh: string;
}

/** 单个版本的更新条目 */
interface VersionEntry {
  version: string;
  /** 版本日期（可选，如 "2026-06-17"） */
  date?: string;
  /** 新增功能 */
  added?: ChangeItem[];
  /** 改进优化 */
  improved?: ChangeItem[];
  /** 问题修复 */
  fixed?: ChangeItem[];
  /** 依赖变更 */
  dependencies?: ChangeItem[];
}

/* ================================================================== */
/*  完整更新日志数据（与 README 同步）                                      */
/* ================================================================== */

/** 所有版本的更新日志，按版本倒序排列 */
const CHANGELOG_DATA: VersionEntry[] = [
  {
    version: "v0.10.2",
    date: "2026-08-18",
    fixed: [
      {
        en: "Homepage BreadcrumbList JSON-LD removed — the landing page is a single-page dashboard, not a multi-level hierarchy, so the breadcrumb schema misled search engines about the site structure.",
        zh: "移除首页 BreadcrumbList JSON-LD — 落地页是单页仪表盘而非多级层级结构，面包屑 Schema 会误导搜索引擎对站点结构的理解。",
      },
      {
        en: "Organization JSON-LD corrected to the real publisher — the schema previously used a DeepSeek-branded name/URL; it now identifies MindRose Team (name/url/@id = mindrose.xyz, contactPoint hello@mindrose.xyz) and is linked from the `SoftwareApplication` `publisher` field, so Google's Knowledge Panel no longer associates this site with DeepSeek itself.",
        zh: "Organization JSON-LD 修正为真实发布者 — 原 Schema 使用 DeepSeek 品牌的名称/网址；现改为标识 MindRose Team（name/url/@id = mindrose.xyz，contactPoint hello@mindrose.xyz），并从 `SoftwareApplication` 的 `publisher` 字段关联，避免 Google 知识面板将本站与 DeepSeek 本体混淆。",
      },
    ],
    improved: [
      {
        en: "Model pricing pages upgraded to a full `AggregateOffer` — each of the 8 per-model pricing pages now emits `lowPrice`/`highPrice`/`offerCount` plus three `UnitPriceSpecification` tiers (input / output / cached input tokens, peak-hour list price for DeepSeek) and `availableAtOrFrom` pointing at the vendor's official pricing page, so search engines no longer read the listed prices as offers sold by this site.",
        zh: "模型定价页升级为完整 `AggregateOffer` — 8 个单模型定价页现输出 `lowPrice`/`highPrice`/`offerCount` 及三档 `UnitPriceSpecification`（输入 / 输出 / 缓存命中输入 tokens，DeepSeek 标注高峰价），并通过 `availableAtOrFrom` 指向厂商官方定价页，避免搜索引擎将所列价格误读为本站在售商品。",
      },
    ],
  },
  {
    version: "v0.10.1",
    date: "2026-08-18",
    improved: [
      {
        en: "Homepage \"Free Tools\" section redesigned — only the pricing calculator is a real interactive tool (the cost tracker and cache analyzer are pure SEO landing pages whose CTAs point back to the homepage dashboard), so the homepage now shows a single calculator card instead of three. A hub of all 8 per-model pricing pages (`MODEL_KEYS`/`MODEL_PRICING_PATHS`) was added below it (anti-orphan), and the section title updated to \"Free Tools\". The two SEO pages stay reachable via the footer Tools row, blog posts, and cross-links.",
        zh: "首页「免费工具」区块重设 — 本系列真正的交互工具只有价格计算器（成本追踪器与缓存分析器实为纯 SEO 落地页，其 CTA 均指向首页仪表盘），因此首页改为只展示一张计算器卡片，不再把两个 SEO 页当工具展示。卡片下方新增全部 8 个单模型定价页的枢纽（`MODEL_KEYS`/`MODEL_PRICING_PATHS` 驱动，杜绝孤儿页），区块标题更新为「免费工具」。两篇 SEO 落地页仍可通过页脚工具行、博客内链与页面互链触达。",
      },
      {
        en: "AffiliateWall gains a `centered` prop — the homepage \"Recommended Tools\" cards now center their text (name, description, commission) to match the section's centered heading, while all other pages keep the default left-aligned cards.",
        zh: "AffiliateWall 新增 `centered` 属性 — 首页「我们正在使用的好工具」卡片文字（名称、描述、佣金）改为居中，与区块的居中标题保持一致；其余页面保持默认左对齐卡片不变。",
      },
    ],
  },
  {
    version: "v0.10.0",
    date: "2026-08-18",
    added: [
      {
        en: "Programmatic SEO pages launched — 8 per-model pricing pages (`/deepseek-v4-flash-pricing`, `/deepseek-v4-pro-pricing`, `/gpt-5.6-sol-pricing`, `/gpt-5.6-terra-pricing`, `/gpt-5.6-luna-pricing`, `/claude-opus-5-pricing`, `/claude-sonnet-5-pricing`, `/claude-haiku-4.5-pricing`) and 3 glossary pages (`/what-is-deepseek-cache-hit-rate`, `/what-is-deepseek-context-caching`, `/what-is-deepseek-off-peak-pricing`), all EN/ZH mirrored with unique per-page copy, FAQ, and JSON-LD (`Product` + `FAQPage` for pricing pages, `Article` + `FAQPage` for glossary pages). The Pricing Calculator now hosts a hub section linking all 8 pricing pages (anti-orphan), each pricing page cross-links its siblings, and glossary pages link to the relevant tools, blog articles, and related terms.",
        zh: "程序化 SEO 页面上线 — 8 个单模型定价页（`/deepseek-v4-flash-pricing`、`/deepseek-v4-pro-pricing`、`/gpt-5.6-sol-pricing`、`/gpt-5.6-terra-pricing`、`/gpt-5.6-luna-pricing`、`/claude-opus-5-pricing`、`/claude-sonnet-5-pricing`、`/claude-haiku-4.5-pricing`）与 3 个 Glossary 页（`/what-is-deepseek-cache-hit-rate`、`/what-is-deepseek-context-caching`、`/what-is-deepseek-off-peak-pricing`），均双语镜像并含每页独立文案、FAQ 与 JSON-LD（定价页 `Product` + `FAQPage`，术语页 `Article` + `FAQPage`）。价格计算器新增连接全部 8 个定价页的枢纽区块（杜绝孤儿页），每个定价页与姊妹页互链，术语页则链向相关工具、博客文章与关联术语。",
      },
      {
        en: "Shared model pricing config — `MODEL_PRICING` extracted from the Pricing Calculator into a single source of truth (`src/lib/modelPricing.ts`) consumed by both the calculator and all 8 pricing pages, eliminating price drift between pages. Prices render live into each pricing page's table from this config.",
        zh: "共享模型定价配置 — 将 `MODEL_PRICING` 从价格计算器提取为唯一事实来源（`src/lib/modelPricing.ts`），由计算器与全部 8 个定价页共同消费，杜绝页面间价格漂移。各定价页的价格表从该配置实时渲染。",
      },
    ],
    improved: [
      {
        en: "Pricing Calculator now links out to every model's dedicated pricing page from a new 'Full pricing pages per model' section, turning it into the hub of the programmatic pricing cluster.",
        zh: "价格计算器新增「每个模型的完整定价页面」区块，为每个模型链接独立定价页，成为程序化定价页面集群的枢纽。",
      },
      {
        en: "Sitemap expanded from 54 to 60 entries — 8 model pricing routes and 3 glossary routes added with en/zh bilingual entries and `alternates.languages`.",
        zh: "Sitemap 从 54 条扩展到 60 条 — 新增 8 个模型定价路由与 3 个 Glossary 路由，每路由含 en/zh 双语条目与 `alternates.languages`。",
      },
    ],
  },
  {
    version: "v0.9.3",
    date: "2026-08-18",
    added: [
      {
        en: "Tool series internal linking — the 3 tool landing pages (`/deepseek-api-cost-tracker`, `/deepseek-cache-hit-rate-analyzer`, `/deepseek-api-pricing-calculator`) are now linked from a new 'Explore the Tool Series' section on the homepage, a dedicated Tools row in the footer (visible on every page), in-content links across 5 blog posts, and cross-links between the tool pages themselves — no more orphaned pages.",
        zh: "工具系列内链体系 — 3 个工具落地页（`/deepseek-api-cost-tracker`、`/deepseek-cache-hit-rate-analyzer`、`/deepseek-api-pricing-calculator`）现可从首页新增的「探索工具系列」区块、页脚新增的「工具」链接行（全站可见）、5 篇博客正文内链以及工具页之间的互链触达——彻底消除孤儿页面。",
      },
    ],
    improved: [
      {
        en: "Keyword ownership clarified — the homepage title now targets the broad brand term 'DeepSeek API Usage Analytics — Free CSV Dashboard' (aligned with its H1), while the exact-match keyword 'deepseek api cost tracker' is owned exclusively by the cost tracker tool page, removing self-competition between the two.",
        zh: "关键词归属明确 — 首页标题改为瞄准宽泛品牌词「DeepSeek API Usage Analytics — Free CSV Dashboard」（与 H1 对齐），精确词「deepseek api cost tracker」完全归属成本追踪工具页，消除两页之间的关键词自相蚕食。",
      },
      {
        en: "Meta descriptions optimized — 10 English page descriptions trimmed from 165–211 characters down to ≤160 for cleaner SERP display (home, guideline, privacy, terms, changelog, cost tracker, cache analyzer, author, and 2 blog posts).",
        zh: "元描述优化 — 10 条英文页面描述从 165–211 字符精简至 160 字符以内（首页、指南、隐私、条款、更新日志、费用追踪、缓存分析、作者及 2 篇博客），改善搜索结果展示。",
      },
      {
        en: "Blog index structured data — `/blog` and `/zh/blog` now emit Blog + ItemList JSON-LD referencing all 6 articles, giving search engines an explicit content hierarchy for the blog.",
        zh: "博客索引结构化数据 — `/blog` 与 `/zh/blog` 新增 Blog + ItemList JSON-LD，引用全部 6 篇文章，为搜索引擎提供明确的博客内容层级。",
      },
      {
        en: "Site icons slimmed — favicon compressed from 242 KB to ~10 KB (multi-size 16/32/48) with a new 180×180 apple-touch-icon; the 242 KB `ds-usage-logo.ico` is no longer referenced from page markup, saving ~240 KB per page load.",
        zh: "站点图标瘦身 — favicon 从 242 KB 压缩至约 10 KB（16/32/48 多尺寸），并新增 180×180 苹果触摸图标；页面标记不再引用 242 KB 的 `ds-usage-logo.ico`，每个页面请求节省约 240 KB。",
      },
      {
        en: "Custom bilingual 404 — replaced the default Next.js error page with a branded page (English by default, with an in-page Chinese toggle) that links back to the homepage, blog, and all three tools. Requires `experimental.globalNotFound` (multiple root layouts) and ships as `app/global-not-found.tsx`.",
        zh: "自定义双语 404 页 — 用品牌化页面替换 Next.js 默认错误页（默认英文，页面内可切换中文），并提供首页、博客和三个工具的返回链接。因项目采用多根布局，启用 `experimental.globalNotFound` 并通过 `app/global-not-found.tsx` 输出。",
      },
    ],
  },
  {
    version: "v0.9.2",
    date: "2026-08-18",
    added: [
      {
        en: "`x-default` hreflang declared on every page — the language-alternates map now includes an `x-default` entry pointing to the English version (in both the HTML `<head>` and the XML sitemap) so search engines have an explicit fallback page for the language selector.",
        zh: "所有页面新增 `x-default` hreflang 声明 — 语言映射表现包含指向英文版的 `x-default` 条目（HTML `<head>` 与 XML sitemap 同步输出），为搜索引擎提供明确的语言兜底页面。",
      },
    ],
    improved: [
      {
        en: "SEO `<noscript>` fallbacks now render a single language — the 8 server-rendered content blocks (landing page, 3 tool landing pages, privacy, terms, changelog, author) no longer duplicate both EN and ZH full text on every page, eliminating cross-language duplicate content; every page now contains exactly one H1.",
        zh: "SEO `<noscript>` 回退内容改为单语言输出 — 8 个服务端渲染的内容块（落地页、3 个工具落地页、隐私、条款、更新日志、作者）不再在每个页面重复中英双语全文，消除跨语言重复内容，且每个页面现在只包含一个 H1。",
      },
      {
        en: "Page titles and meta descriptions optimized — homepage and all 6 blog posts trimmed to ≤62-character titles; 5 overlong meta descriptions reduced from 184–253 characters to 148–166 characters for cleaner SERP display. Keyword ownership also differentiated between the Pricing Calculator (interactive estimation tool) and the OpenAI-vs-DeepSeek comparison article.",
        zh: "页面标题与元描述优化 — 首页与全部 6 篇博客文章标题精简至 62 字符以内；5 条过长的 meta description 从 184–253 字符压缩到 148–166 字符，改善搜索结果展示。同时明确了定价计算器（交互式估算工具）与 OpenAI vs DeepSeek 对比文章的关键词归属，避免相互蚕食。",
      },
      {
        en: "ECharts now lazy-loaded — the ~1.4 MB chart library (plus the ShareCard) is fetched on demand after CSV upload instead of being bundled into the landing page, cutting initial page JS from ~2.3 MB to ~1 MB.",
        zh: "ECharts 改为按需加载 — 约 1.4 MB 的图表库（含分享卡片）改为上传 CSV 后再拉取，不再打包进落地页首屏，首屏 JS 从约 2.3 MB 降至约 1 MB。",
      },
      {
        en: "User Guide screenshot accessibility — all 12 screenshots now ship descriptive bilingual alt text and captions, and a parser bug that silently dropped the guide's document title (H1) was fixed.",
        zh: "操作手册截图可访问性 — 12 张截图补充了描述性双语 alt 与图注，并修复了解析器静默丢弃手册文档标题（H1）的隐藏 bug。",
      },
      {
        en: "Sitemap accuracy — blog post `lastModified` values now reflect real publish dates (from `blogArticles.ts`) instead of the build date, and `og-image.png` was added to the vercel.json caching rule.",
        zh: "Sitemap 准确性 — 博客文章 `lastModified` 改用真实发布日期（取自 `blogArticles.ts`）而非构建日期；`og-image.png` 已加入 vercel.json 缓存规则。",
      },
    ],
  },
  {
    version: "v0.9.1",
    date: "2026-08-17",
    added: [
      {
        en: "Site-wide \"Recommended Tools We ARE USING\" wall — a shared `RecommendedToolsSection` component now renders the AffiliateWall commercial block at the bottom of every page (dashboard, tools landing pages, blog index, every blog post, user guide, privacy/terms/changelog/author pages), aligned to each page's content container width. The Pricing Calculator's single Vultr CTA was replaced by the full recommendation wall.",
        zh: "全站推荐工具墙 — 新增共享 `RecommendedToolsSection` 组件，将 AffiliateWall「我们正在使用的好工具」商业化模块渲染到每个页面底部（仪表盘、工具落地页、博客首页、每篇博客文章、操作手册、隐私/条款/更新日志/作者等页面），宽度自动对齐各页面正文容器。定价计算器原本单独的 Vultr CTA 已替换为完整推荐墙。",
      },
    ],
    improved: [
      {
        en: "TitleBar redesigned into a unified navigation menu — all entry points (User Guide, Privacy Policy, Terms of Use, Blog, Author Team, Changelog, GitHub) are now grouped in a single Apple-style \"⋯\" popover menu on both desktop and mobile, replacing the scattered icon buttons. The Agnes sister-project button was removed from the title bar (the link remains in the footer).",
        zh: "TitleBar 重构为统一导航菜单 — 所有入口（用户操作手册、隐私政策、使用条款、博客、作者团队、更新日志、GitHub）统一收纳进桌面端与移动端共用的 Apple 风格「⋯」弹出菜单，取代原先分散的图标按钮。标题栏中的 Agnes 姊妹项目按钮已移除（页脚仍保留链接）。",
      },
    ],
  },
  {
    version: "v0.9.0",
    date: "2026-08-17",
    added: [
      {
        en: "New blog article published — \"The 2026 Value Champions: GPT-5.6 Luna & DeepSeek V4 Flash — and the Best Model for Every Budget\" (`/blog/gpt-5.6-luna-vs-deepseek-v4-flash-value-champions`) with bilingual EN/ZH content, an 8-model dual-currency pricing table (¥ / $, peak / off-peak), the \"price is no longer a proxy for quality\" thesis, an off-peak scheduling playbook, and a tier-by-tier best-value framework. Fully wired into the blog index, sitemap, prev/next chain, and SEO metadata.",
        zh: "发布新博客文章 —《2026 年性价比之王：GPT-5.6 Luna 与 DeepSeek V4 Flash——每个预算档位的最优模型选择》（`/zh/blog/gpt-5.6-luna-vs-deepseek-v4-flash-value-champions`），含中英双语内容、8 模型双币种（¥ / $、高峰 / 闲时）对比表、「价格不再是质量代理」论点、闲时调度打法与分档最优选择框架。已完整接入博客首页、sitemap、前后篇链与 SEO 元数据。",
      },
      {
        en: "Blog comparison articles refreshed to August 2026 pricing — the OpenAI vs Claude vs DeepSeek, OpenCode Go, and context-caching articles now use the new DeepSeek peak / off-peak rates, the GPT-5.6 Sol / Terra / Luna lineup, and the Claude Opus 5 / Sonnet 5 / Haiku 4.5 lineup, with dual-currency (¥ / $) pricing cells. The OpenCode Go article's \"DeepSeek price hike\" narrative was strengthened with the landed peak-price increase.",
        zh: "对比类博客文章更新至 2026 年 8 月定价 — OpenAI vs Claude vs DeepSeek、OpenCode Go 与上下文缓存指南三篇文章改用新的 DeepSeek 高峰/闲时价、GPT-5.6 Sol / Terra / Luna 阵容与 Claude Opus 5 / Sonnet 5 / Haiku 4.5 阵容，价格单元格支持双币种（¥ / $）。OpenCode Go 文章的「DeepSeek 涨价」叙事结合已落地的高峰价上调得到强化。",
      },
    ],
    improved: [
      {
        en: "Pricing Calculator updated to DeepSeek's new peak / off-peak billing — DeepSeek V4 Flash and V4 Pro now use the official per-million-token prices in CNY with peak hours (Beijing time 09:00–12:00 and 14:00–18:00) billed at full price and off-peak hours at 50% off. A new \"Peak-Hour Share\" slider lets you model how much of your traffic falls in peak windows, and the comparison table shows both peak and off-peak prices for each DeepSeek model. Cache-hit pricing was also corrected to the new 1/30-of-input rate. Competitor lineup refreshed to GPT-5.6 Sol / Terra / Luna and Claude Opus 5 / Sonnet 5 / Haiku 4.5 with their latest August 2026 prices (including the July 30 GPT-5.6 price cuts and the 50% Batch API discount).",
        zh: "定价计算器更新为 DeepSeek 新的高峰 / 闲时计价 — DeepSeek V4 Flash 与 V4 Pro 现按官方每百万 Token 人民币价格计费，高峰时段（北京时间 9:00–12:00、14:00–18:00）全价、闲时半价。新增「忙时占比」滑块，可模拟流量落在高峰窗口的比例；对比表为每个 DeepSeek 模型同时展示高峰与闲时价格。缓存命中计价同步修正为输入价的 1/30。竞品阵容更新为 GPT-5.6 Sol / Terra / Luna 与 Claude Opus 5 / Sonnet 5 / Haiku 4.5，采用 2026 年 8 月最新定价（含 7 月 30 日 GPT-5.6 降价与 Batch API 五折优惠）。",
      },
    ],
    fixed: [
      {
        en: "DropZone stuck-spinner on parse failure — a CSV that passed concatenation but failed CSV parsing left the upload UI spinning forever, because the parse error is raised asynchronously inside the data context and never reached the drop zone's catch clause. The busy state is now correctly released after concatenation, so a failed parse returns the user to the upload state (with the error banner visible) instead of requiring a page reload. Regression test added.",
        zh: "修复 DropZone 解析失败后卡在「处理中」旋转状态 — 拼接通过但 CSV 解析失败时，由于解析错误在数据上下文中异步抛出、不会进入上传区的 catch 分支，上传区会永久卡在转圈状态。现拼接完成后正确释放 busy 状态，解析失败会回到可重新上传的界面（并显示错误横幅），无需刷新页面。已补充回归测试。",
      },
    ],
  },
  {
    version: "v0.8.0",
    date: "2026-08-17",
    added: [
      {
        en: "Support for DeepSeek's new CSV export format — the export schema changed from a `utc_date` date column to `start_time_iso` / `end_time_iso` ISO timestamps (and `user_id` / `wallet_type` became always-present). The parser now derives the billing day from the `start_time_iso` date part (Beijing-local day) and pairs the new date-range filenames (`amount-2026-08-01_2026-08-17.csv`). Legacy exports using `utc_date` and `amount-{year}-{month}.csv` names remain fully supported for backward compatibility.",
        zh: "支持 DeepSeek 新导出 CSV 格式 — 导出字段由 `utc_date` 日期列改为 `start_time_iso` / `end_time_iso` ISO 时间戳（且 `user_id`、`wallet_type` 变为必带列）。解析器现从 `start_time_iso` 的日期部分派生账单日（北京时间当天），并支持按新的日期区间文件名（如 `amount-2026-08-01_2026-08-17.csv`）配对多个月份。旧式导出（`utc_date` 列 + `amount-{year}-{month}.csv` 命名）保持完整向后兼容。",
      },
    ],
    fixed: [
      {
        en: "DeepSeek export format change breaking parsing — newer platform exports no longer include the `utc_date` column, which previously caused the dashboard to reject them with a \"missing column\" error. Parsing now accepts the new schema (and still reads legacy files).",
        zh: "修复 DeepSeek 导出格式变更导致的解析失败 — 新版本平台导出不再包含 `utc_date` 列，此前会导致仪表盘以「缺少列」错误拒绝文件。现解析逻辑已支持新字段结构（同时兼容旧文件）。",
      },
    ],
  },
  {
    version: "v0.7.0",
    date: "2026-08-13",
    added: [
      {
        en: "4th blog article published — \"DeepSeek V4 Flash for $10/Month — the World's Cheapest Frontier Model Is on OpenCode Go\" (`/blog/opencode-go-cheapest-deepseek-v4-flash`) with bilingual EN/ZH content, a pricing comparison table (V4 Flash vs V4 Pro vs GPT-5.6 Luna), full SEO metadata, sitemap entry, and prev/next cross-links wired into the blog chain.",
        zh: "发布第 4 篇博客文章 —《全球最便宜的 DeepSeek V4 Flash，就在 OpenCode Go（每月 $10）》（`/zh/blog/opencode-go-cheapest-deepseek-v4-flash`），含中英双语内容、定价对比表（V4 Flash vs V4 Pro vs GPT-5.6 Luna）、完整 SEO 元数据、sitemap 条目，并已接入博客链路的上一篇/下一篇交叉链接。",
      },
      {
        en: "Opencode Go affiliate added to `affiliates.ts` registry — referral link (`opencode.ai/go?ref=NS60V8HH6Q`) surfaced through the AffiliateWall \"Recommended Tools We ARE USING\" module on the homepage, every blog post, AuthorPage, and CostTrackerPage.",
        zh: "在 `affiliates.ts` 注册表中新增 Opencode Go 联盟推广 — 推荐链接（`opencode.ai/go?ref=NS60V8HH6Q`）通过 AffiliateWall「我们正在使用的好工具」模块展示在首页、每篇博客文章、AuthorPage 与 CostTrackerPage。",
      },
    ],
    improved: [
      {
        en: "Blog index now sorts articles newest-first — the post list is ordered by each article's `publishedTime` from `blogArticles.ts` instead of a hardcoded sequence, so new posts automatically surface at the top.",
        zh: "博客首页改为按最新优先排序 — 文章列表依据 `blogArticles.ts` 中各文章的 `publishedTime` 排序，取代原先的硬编码顺序，新文章会自动置顶。",
      },
      {
        en: "Homepage sister-project section replaced with the \"Recommended Tools We ARE USING\" AffiliateWall commercial module — the block now sits above the FAQ section with centered title and subtitle.",
        zh: "首页姊妹项目区段替换为 AffiliateWall「我们正在使用的好工具」商业化模块 — 该模块现位于常见问题区段之前，标题与副标题居中展示。",
      },
      {
        en: "Blog post bottom CTA banner (\"Try our free dashboard\") replaced with the same AffiliateWall Recommended Tools module, turning every article's footer into a revenue-bearing commercial section.",
        zh: "博客文章底部 CTA 横幅（「试试我们的免费仪表盘」）替换为相同的 AffiliateWall 推荐工具模块，让每篇文章的底部都成为可承载商业变现的区段。",
      },
    ],
  },
  {
    version: "v0.6.6",
    date: "2026-07-19",
    improved: [
      {
        en: "Homepage SEO metadata optimized — title changed to 'DeepSeek API Cost Tracker & Usage Analytics — Free CSV Dashboard' with keyword-first strategy; description rewritten to include primary keywords in first sentence.",
        zh: "首页 SEO 元数据优化 — title 改为 'DeepSeek API Cost Tracker & Usage Analytics — Free CSV Dashboard'，采用关键词前置策略；description 重写，首句包含核心关键词。",
      },
      {
        en: "Landing page hero section enhanced — added explicit keyword-rich subtitle below H1 on homepage and all three SEO landing pages (Cost Tracker, Cache Analyzer, Pricing Calculator) for improved search engine visibility.",
        zh: "落地页 Hero 区域增强 — 在首页和三个 SEO 落地页（Cost Tracker、Cache Analyzer、Pricing Calculator）的 H1 下方新增显式关键词副标题，提升搜索引擎可见性。",
      },
      {
        en: "Tool landing page metadata refined — Cost Tracker title updated to emphasize 'No Signup'; Cache Analyzer title streamlined; Pricing Calculator description de-emphasized model list in favor of action-oriented copy.",
        zh: "工具落地页 metadata 精细化 — Cost Tracker 标题强调「无需注册」；Cache Analyzer 标题精简；Pricing Calculator description 从模型列表描述转向动作导向文案。",
      },
    ],
  },
  {
    version: "v0.6.5",
    date: "2026-07-12",
    improved: [
      {
        en: "Blog metadata management centralized — extracted all 3 blog article metadata (title, description, tags, publish date, SEO fields) into a shared `blogArticles.ts` module, replacing inline metadata in individual article page files for consistent single-source-of-truth management.",
        zh: "博客元数据集中管理 — 将 3 篇博客文章的元数据（标题、描述、标签、发布日期、SEO 字段）提取到共享的 `blogArticles.ts` 模块中，替换各文章页面文件中的内联元数据，实现一致的单源管理。",
      },
      {
        en: "Reusable JsonLd component extracted — encapsulated JSON-LD structured data generation into a generic `<JsonLd />` component, simplifying the 5 blog article page files and `layout.tsx` that previously duplicated schema generation logic.",
        zh: "抽取可复用 JsonLd 组件 — 将 JSON-LD 结构化数据生成封装为通用的 `<JsonLd />` 组件，简化了原先在 5 个博客文章页面文件和 `layout.tsx` 中重复的 Schema 生成逻辑。",
      },
      {
        en: "AuthorContent team member display refactored — rebuilt team member rendering with array mapping (`TEAM_MEMBERS` config array + `.map()`) replacing individual hardcoded member blocks, reducing code duplication and improving maintainability.",
        zh: "AuthorContent 团队成员展示重构 — 使用数组映射模式（`TEAM_MEMBERS` 配置数组 + `.map()`）重建团队成员渲染逻辑，替换原有的逐个硬编码成员区块，减少代码重复并提升可维护性。",
      },
      {
        en: "Schema module simplified — `schema.ts` streamlined by extracting reusable JSON-LD rendering logic into `JsonLd.tsx` component, reducing the module from 129+ lines of inline schema generation.",
        zh: "Schema 模块精简 — 将可复用的 JSON-LD 渲染逻辑提取到 `JsonLd.tsx` 组件中，`schema.ts` 从 129+ 行内联 Schema 生成代码大幅精简。",
      },
    ],
    added: [
      {
        en: "Schema unit tests added — new `schema.test.ts` test file with validation coverage for JSON-LD schema generation functions, ensuring structured data correctness across versions.",
        zh: "新增 Schema 单元测试 — 新增 `schema.test.ts` 测试文件，覆盖 JSON-LD Schema 生成函数的验证，确保跨版本结构化数据的正确性。",
      },
    ],
  },
  {
    version: "v0.6.4",
    date: "2026-07-10",
    added: [
      {
        en: "Author & Team page comprehensively revamped — replaced placeholder team section with 4 real member profiles (Gavin Chen, Lindsay Lin, Angela Lee, Simon L.) each with role, description, and initial avatar in a responsive CSS Grid layout; page title updated to \"Author & Team\" with refined bilingual copy throughout the author page, member bios, and verification sections to reflect the expanded team scope.",
        zh: "作者团队页面全面重构 — 用 4 位真实成员简介（Gavin Chen、Lindsay Lin、Angela Lee、Simon L.）替换原有的占位内容，采用响应式 CSS Grid 布局展示每位成员的角色、描述和首字母头像；页面标题更新为「作者团队」，作者页、成员简介和验证区域的英中双语内容全面优化以反映扩展的团队范围。",
      },
      {
        en: "Tencent Cloud affiliate program added to `affiliates.ts` registry — new referral link integrated into the AffiliateWall component across AuthorPage and CostTrackerPage, alongside expanded developer infrastructure vendor coverage (Vultr, Railway, Silicon Flow, Warp) with updated i18n labels \"Recommended Tools We ARE USING\" / \"我们正在使用的好工具\".",
        zh: "腾讯云联盟推广新增至 `affiliates.ts` 注册表 — 新推荐链接集成到 AuthorPage 和 CostTrackerPage 的 AffiliateWall 组件，同步扩展开发者基础设施服务商覆盖（Vultr、Railway、硅基流动、Warp），新增双语标签「Recommended Tools We ARE USING」/「我们正在使用的好工具」。",
      },
      {
        en: "og-image.png static asset added to `/public` — 1200×630 social preview image for OpenGraph/Twitter cards, enhancing link previews when the site URL is shared on social media platforms.",
        zh: "og-image.png 静态资源添加至 `/public` — 1200×630 社交媒体预览图片，用于 OpenGraph/Twitter 卡片，增强网站在社交平台分享时的链接预览效果。",
      },
    ],
    improved: [
      {
        en: "Blog article cost comparison data refreshed — updated GPT-5.5 ($15.00→$5.00), GPT-5.4 ($5.00→$2.50), GPT-5.4 mini ($0.15→$0.75), Claude Fable 5 ($0.80→$10.00), Opus 4.8 ($15.00→$5.00), Sonnet 5 ($3.00→$2.00), and Haiku 4.5 ($0.25→$1.00) pricing across all comparison tables in the OpenAI vs DeepSeek blog article. Article narrative updated to include Anthropic Claude alongside OpenAI GPT and DeepSeek throughout the migration and cost-benefit analysis sections.",
        zh: "博客文章成本对比数据更新 — 更新 OpenAI vs DeepSeek 博客文章中所有对比表格的 GPT-5.5（$15.00→$5.00）、GPT-5.4（$5.00→$2.50）、GPT-5.4 mini（$0.15→$0.75）、Claude Fable 5（$0.80→$10.00）、Opus 4.8（$15.00→$5.00）、Sonnet 5（$3.00→$2.00）和 Haiku 4.5（$0.25→$1.00）定价数据。文章迁移指南和成本收益分析章节的叙事已更新为涵盖 Anthropic Claude、OpenAI GPT 和 DeepSeek 三家供应商。",
      },
      {
        en: "Affiliate link system streamlined — `affiliates.ts` registry trimmed and reorganized with updated vendor categories (`serverProviders`, `domainRegistrars`, `aiGateways`); CostTrackerPage recommended tools section switched from Portkey/Helicone to developer infrastructure tools (Vultr, Railway, Tencent Cloud, Silicon Flow, Warp) with new descriptive labels reflecting real usage context.",
        zh: "联盟链接系统精简 — `affiliates.ts` 注册表重新整理，更新服务商分类（`serverProviders`、`domainRegistrars`、`aiGateways`）；CostTrackerPage 推荐工具区从 Portkey/Helicone 切换为开发者基础设施工具（Vultr、Railway、腾讯云、硅基流动、Warp），新增描述性标签以反映实际使用场景。",
      },
      {
        en: "Blog article tag metadata enriched — added \"Token Cost\", \"Claude\", \"GPT\", and \"Anthropic\" tags to blog index article cards for improved SEO keyword coverage and search relevance across both English and Chinese locales.",
        zh: "博客文章标签元数据增强 — 为博客首页文章卡片添加「Token成本」「Claude」「GPT」「Anthropic」等标签（中英双语），提升 SEO 关键词覆盖和搜索相关性。",
      },
    ],
    fixed: [
      {
        en: "Blog comparison article URL normalization — sitemap, route metadata (`routeMetadata.ts`), and article page paths corrected from `/blog/openai-vs-deepseek-cost-comparison` to `/blog/openai-claude-vs-deepseek-cost-comparison` to accurately reflect the three-provider comparison scope (OpenAI GPT + Anthropic Claude + DeepSeek).",
        zh: "博客对比文章 URL 规范化 — sitemap、路由元数据（`routeMetadata.ts`）和文章页面路径从 `/blog/openai-vs-deepseek-cost-comparison` 修正为 `/blog/openai-claude-vs-deepseek-cost-comparison`，准确反映三家供应商对比的文章内容范围（OpenAI GPT + Anthropic Claude + DeepSeek）。",
      },
    ],
  },
  {
    version: "v0.6.3",
    date: "2026-07-09",
    added: [
      {
        en: "CNY/USD currency toggle in Pricing Calculator — users can switch between RMB (¥) and US Dollar ($) for all pricing displays, with real-time conversion at approximate exchange rate.",
        zh: "定价计算器人民币/美元货币切换 — 用户可以在人民币（¥）和美元（$）之间切换所有价格显示，按近似汇率实时转换。",
      },
      {
        en: "AffiliateWall component — centralized affiliate link showcase section for SEO landing pages, providing structured vendor recommendations (Vultr, DigitalOcean, Namecheap, OpenRouter) with referral links and `rel=sponsored nofollow` compliance.",
        zh: "AffiliateWall 组件 — SEO 落地页集中化的联盟链接展示区段，提供结构化的服务商推荐（Vultr、DigitalOcean、Namecheap、OpenRouter），含推荐链接和 `rel=sponsored nofollow` 合规标注。",
      },
      {
        en: "`<noscript>` SEO fallback content for all 3 tool landing pages — `CacheAnalyzerContent`, `CostTrackerContent`, and `PricingCalculatorContent` components provide bilingual crawler-readable content for better search engine indexing, matching the pattern used by PrivacyContent and TermsContent.",
        zh: "3 个工具落地页的 `<noscript>` SEO 回退内容 — `CacheAnalyzerContent`、`CostTrackerContent` 和 `PricingCalculatorContent` 组件提供双语爬虫可读内容，提升搜索引擎索引效果，与 PrivacyContent、TermsContent 保持一致的模式。",
      },
      {
        en: "Expanded LLM cost comparison in the OpenAI vs DeepSeek blog article — added latest GPT models (GPT-4.1, GPT-4.5 Preview, GPT-5) and Claude models (Opus 4.5, Sonnet 4.5, Haiku 4.5) with updated pricing data across all model families for more comprehensive cost-benefit analysis.",
        zh: "扩展 OpenAI vs DeepSeek 博客文章中的大模型成本对比 — 新增最新 GPT 模型（GPT-4.1、GPT-4.5 Preview、GPT-5）和 Claude 模型（Opus 4.5、Sonnet 4.5、Haiku 4.5），同步更新所有模型族的最新定价数据，提供更全面的成本收益分析。",
      },
    ],
    improved: [
      {
        en: "Affiliate link system refactored — centralized `affiliates.ts` configuration expanded with additional vendor programs, improved type safety with categorized link groups (`serverProviders`, `domainRegistrars`, `aiGateways`), and better UTM tracking integration across landing pages and blog CTAs.",
        zh: "联盟链接系统重构 — 集中化 `affiliates.ts` 配置扩展了更多服务商项目，通过分类链接组（`serverProviders`、`domainRegistrars`、`aiGateways`）改进类型安全，优化落地页和博客 CTA 区域的 UTM 追踪集成。",
      },
      {
        en: "Landing page SEO enhanced — tool landing pages (`/deepseek-api-cost-tracker`, `/deepseek-cache-hit-rate-analyzer`, `/deepseek-api-pricing-calculator`) now include enhanced JSON-LD structured data and bilingual `<noscript>` crawler fallback content for better search engine visibility and EEAT trust signals.",
        zh: "落地页 SEO 增强 — 工具落地页（`/deepseek-api-cost-tracker`、`/deepseek-cache-hit-rate-analyzer`、`/deepseek-api-pricing-calculator`）现包含增强的 JSON-LD 结构化数据和双语 `<noscript>` 爬虫回退内容，提升搜索引擎可见性和 EEAT 信任信号。",
      },
      {
        en: "Blog article cost comparison accuracy — updated with latest model pricing across GPT, Claude, and DeepSeek families for more accurate cost-benefit analysis in the OpenAI vs DeepSeek comparison article.",
        zh: "博客文章成本对比准确性 — 同步更新 GPT、Claude 和 DeepSeek 全系模型的最新定价，在 OpenAI vs DeepSeek 对比文章中提供更精准的成本收益分析。",
      },
    ],
    fixed: [
      {
        en: "Homepage URL canonicalization — fixed inconsistent canonical path generation for the root URL that could produce duplicate canonical URLs (both `/` and empty path variants). Simplified sitemap generation logic for cleaner, more maintainable output.",
        zh: "首页 URL 规范化 — 修复根 URL 可能产生不一致规范路径（`/` 和空路径两种变体）导致重复规范 URL 的问题。简化站点地图生成逻辑，输出更清晰、更易维护。",
      },
    ],
  },
  {
    version: "v0.6.2",
    date: "2026-07-06",
    added: [
      {
        en: "URL-level i18n routing — introduced `/zh` prefix for Chinese locale routes (e.g., `/zh/guideline`, `/zh/blog`). English routes remain prefix-free. Full bilingual URL mirroring for all pages, SEO landing pages, and blog articles. New `localeRouting.ts` module centralizes locale detection, path construction, and redirect logic. New `site.ts` module centralizes site-level constants (SITE_URL, SITE_NAME, OG/logo image URLs). New `pageMetadata.ts` and `routeMetadata.ts` provide shared `generateMetadata()` helpers for all routes. `AppRootLayout.tsx` extracted from old `layout.tsx` to support locale-aware root layout. Each route now has independent SEO metadata generation via `(site)/` and `zh/` route groups.",
        zh: "URL 级国际化路由 — 为中文语言引入 `/zh` 路径前缀（如 `/zh/guideline`、`/zh/blog`）。英文路由保持无前缀。所有页面、SEO 落地页和博客文章实现完整的双语 URL 镜像。新增 `localeRouting.ts` 模块集中管理语言检测、路径构建和重定向逻辑。新增 `site.ts` 模块集中管理站点级常量（SITE_URL、SITE_NAME、OG/Logo 图片 URL）。新增 `pageMetadata.ts` 和 `routeMetadata.ts` 为所有路由提供共享的 `generateMetadata()` 辅助函数。从旧的 `layout.tsx` 中提取 `AppRootLayout.tsx` 以支持语言感知的根布局。每个路由现在通过 `(site)/` 和 `zh/` 路由组拥有独立的 SEO 元数据生成。",
      },
      {
        en: "Locale-aware navigation — updated all internal links (TitleBar, FooterBar, LandingPage, GuidelinePage, blog components, sub-pages) to use `buildLocalePath()` for correct locale prefix handling. LanguageSwitcher now uses locale-aware path construction for seamless locale switching without losing current page context.",
        zh: "语言感知导航 — 更新所有内部链接（TitleBar、FooterBar、LandingPage、GuidelinePage、博客组件、子页面），使用 `buildLocalePath()` 正确处理语言前缀。LanguageSwitcher 现在使用语言感知的路径构建，切换语言时不会丢失当前页面上下文。",
      },
    ],
    improved: [
      {
        en: "Blog article multi-language support — replaced hardcoded English text in BlogArticlePage and BlogPostLayout with i18n translation keys. Blog metadata fetching now uses locale-aware logic, reusing existing blog translation strings for consistent bilingual content.",
        zh: "博客文章多语言支持 — 将 BlogArticlePage 和 BlogPostLayout 中的硬编码英文文本替换为 i18n 翻译键。博客元数据获取现在使用语言感知逻辑，复用已有的博客翻译字符串以保持双语内容的一致性。",
      },
      {
        en: "Landing page external link button styling — unified the visual style of outbound link buttons on the landing page, fixing inconsistent button appearances across different sections.",
        zh: "落地页外链按钮样式统一 — 统一了落地页外链按钮的视觉风格，修复了不同区块之间按钮外观不一致的问题。",
      },
      {
        en: "Blog index layout refinement — adjusted blog list paragraph max-width to `max-w-3xl` for improved reading experience on wide viewports.",
        zh: "博客首页布局优化 — 将博客列表段落最大宽度调整为 `max-w-3xl`，提升宽屏下的阅读体验。",
      },
      {
        en: "Test coverage — added `localeRouting.test.ts` (69 new tests) for the locale routing module. Updated `analytics.test.ts` and `sitemap.test.ts` to cover new route structures.",
        zh: "测试覆盖 — 新增 `localeRouting.test.ts`（69 个测试用例）覆盖语言路由模块。更新 `analytics.test.ts` 和 `sitemap.test.ts` 以覆盖新的路由结构。",
      },
    ],
  },
  {
    version: "v0.6.1",
    date: "2026-07-05",
    added: [
      {
        en: "Author page (`/author`) — dedicated bilingual profile page for Gavin Chen with bio, skill tags, social links (GitHub, LinkedIn, Email, MindRose, WeChat), JSON-LD Person schema, independent SEO metadata (canonical, OG, Twitter), Apple-minimalist layout, and `<noscript>` crawler fallback via `AuthorContent.tsx`. Navigation link added to FooterBar.",
        zh: "作者页面（`/author`）— Gavin Chen 的专属双语个人资料页，包含个人简介、技能标签、社交链接（GitHub、LinkedIn、Email、MindRose、微信）、JSON-LD Person Schema、独立 SEO 元数据（canonical、OG、Twitter）、Apple 极简风格布局，以及通过 `AuthorContent.tsx` 实现的 `<noscript>` 爬虫回退。FooterBar 新增导航链接。",
      },
      {
        en: "Centralized author config module (`src/lib/authors.ts`) — single source of truth for author social/contact URLs (GitHub, LinkedIn, Email, MindRose, WeChat) and team member page URLs. Consumed by AuthorPage, BlogPostLayout (author metadata), and schema.ts (Person/Article JSON-LD). Blog article pages now include full author Person metadata (`sameAs` links, `worksFor` MindRose org) in JSON-LD.",
        zh: "集中化作者配置模块（`src/lib/authors.ts`）— 作者社交/联系链接（GitHub、LinkedIn、Email、MindRose、微信）和团队成员页面 URL 的统一数据源。被 AuthorPage、BlogPostLayout（作者元数据）和 schema.ts（Person/Article JSON-LD）引用。博客文章页面现在在 JSON-LD 中包含完整的作者 Person 元数据（`sameAs` 链接、`worksFor` MindRose 组织信息）。",
      },
    ],
    improved: [
      {
        en: "Site-wide SEO metadata pass — added `author` meta tag, `keywords`, and `twitter:site`/`twitter:creator` to all page-level `generateMetadata()` calls (blog articles, tool landing pages, guideline, privacy, terms, changelog). Unified author references across all pages using the new `authors.ts` config.",
        zh: "全站 SEO 元数据优化 — 为所有页面级 `generateMetadata()` 调用（博客文章、工具落地页、操作手册、隐私政策、使用条款、更新日志）添加 `author` 元标签、`keywords` 和 `twitter:site`/`twitter:creator`。使用新的 `authors.ts` 配置统一全站作者引用。",
      },
      {
        en: "Code cleanup — removed deprecated old landing page image asset. Removed unused module-level imports across page components.",
        zh: "代码清理 — 移除已废弃的旧落地页图片资源。清理页面组件中未使用的模块级导入。",
      },
    ],
  },
  {
    version: "v0.6.0",
    date: "2026-07-04",
    added: [
      {
        en: "3 SEO landing pages — DeepSeek API Cost Tracker, Cache Hit Rate Analyzer, and Pricing Calculator (interactive slider + competitor pricing table). Each page has independent canonical/OG/Twitter SEO metadata, bilingual content, and commerce-oriented modules (affiliate recommendations, MindRose service CTA).",
        zh: "3 个 SEO 落地页 — DeepSeek API 费用追踪器、缓存命中率分析器和价格计算器（交互式滑块 + 竞品定价对比表）。每个页面拥有独立的 canonical/OG/Twitter SEO 元数据、双语内容，以及商业化模块（联盟推荐、MindRose 服务导流 CTA）。",
      },
      {
        en: "Blog infrastructure — blog index with 3-card grid + 3 bilingual articles: Context Caching Guide, Top 5 Cost Optimization Tools comparison, and OpenAI vs DeepSeek cost-benefit analysis. Structured content system (`ArticleRenderer` + `ArticleSection[]`) enables rapid article creation. All articles support EN/ZH switching.",
        zh: "博客基础设施 — 博客首页 3 卡片网格 + 3 篇双语文章：上下文缓存终极指南、Top 5 成本优化工具横评、OpenAI vs DeepSeek 成本收益分析。结构化内容系统（`ArticleRenderer` + `ArticleSection[]`）支持快速创建新文章。所有文章支持中英文切换。",
      },
      {
        en: "Affiliate marketing integration — centralized `affiliates.ts` config module (Vultr, DigitalOcean, Namecheap, OpenRouter referral URLs). Affiliate links added to tool pages and blog CTA areas with `rel=sponsored nofollow` compliance.",
        zh: "联盟营销集成 — 集中化 `affiliates.ts` 配置模块（Vultr、DigitalOcean、Namecheap、OpenRouter 推荐链接）。联盟链接已加入工具页和博客 CTA 区域，使用 `rel=sponsored nofollow` 合规标注。",
      },
      {
        en: "UTM-based conversion tracking funnel — `trackLandingCTA()`, `trackOutboundClick()`, `trackPageView()` helpers in analytics module. Full GA4 configuration guide at `docs/promotion/GA4_Tracking_Guide.md` with step-by-step setup instructions.",
        zh: "基于 UTM 的转化追踪漏斗 — analytics 模块新增 `trackLandingCTA()`、`trackOutboundClick()`、`trackPageView()` 辅助函数。完整 GA4 配置指南位于 `docs/promotion/GA4_Tracking_Guide.md`，含逐步配置说明。",
      },
      {
        en: "Blog navigation in TitleBar (pen icon) and FooterBar (text link). Logo in TitleBar now links to home page.",
        zh: "TitleBar 新增博客导航（笔形图标），FooterBar 新增博客文字链接。TitleBar 中的 Logo 现在可点击回到首页。",
      },
    ],
    improved: [
      {
        en: "Responsive TitleBar — mobile layout with `...` popover menu (Agnes, GitHub, Guideline, Blog, Changelog, Theme toggle). Clean logo + title + language switcher on mobile; full icon row on desktop.",
        zh: "响应式 TitleBar — 移动端采用 `...` 弹出菜单（Agnes、GitHub、操作手册、博客、更新日志、主题切换）。移动端仅留 Logo + 标题 + 语言切换；桌面端完整图标行。",
      },
      {
        en: "Enhanced icons — guideline now uses a compass icon (navigation/guide metaphor); blog uses a pen icon (writing/blog metaphor). Meanings are more distinct at small sizes.",
        zh: "图标语义优化 — 操作手册改为指南针图标（导航/指南隐喻）；博客改为笔形图标（写作/博客隐喻）。小尺寸下含义更清晰。",
      },
      {
        en: "SEO coverage — sitemap expanded from 5 to 12 entries (3 tool pages + blog index + 3 articles). llms.txt and llms-full.txt updated with all new pages. Page title optimized to include 'Cost Tracker' keyword. Blog index and all articles now have full generateMetadata().",
        zh: "SEO 覆盖 — sitemap 从 5 条扩展至 12 条（3 个工具页 + 博客首页 + 3 篇文章）。llms.txt 和 llms-full.txt 已更新覆盖所有新页面。页面标题优化为包含 'Cost Tracker' 关键词。博客首页及所有文章现已具备完整的 generateMetadata()。",
      },
    ],
  },
  {
    version: "v0.5.4",
    date: "2026-06-24",
    improved: [
      {
        en: "Optimized token number display format for Chinese language, more suitable for Chinese users.",
        zh: "优化了中文语言下的 token 数字显示格式，更符合中文习惯。",
      },
    ],
  },
  {
    version: "v0.5.3",
    date: "2026-06-21",
    added: [
      {
        en: "SEO enhancements — added keywords, twitter:site/creator, and author meta tags to all pages. Added Organization JSON-LD structured data for Google Knowledge Panel brand recognition. Expanded BreadcrumbList JSON-LD with all sub-page entries. Differentiated sitemap lastModified dates per route. Landing page OG image support for richer social media link previews.",
        zh: "SEO 增强 — 为所有页面添加 keywords、twitter:site/creator 和 author 元标签。新增 Organization JSON-LD 结构化数据用于 Google Knowledge Panel 品牌识别。扩展 BreadcrumbList JSON-LD，包含所有子页面条目。各路由站点地图 lastModified 日期差异化。支持落地页 OG 图片，提升社交媒体链接预览效果。",
      },
      {
        en: "GA4 conversion events — added upload_csv, share_card, tab_switch, and language_switch event tracking via a shared trackEvent() analytics helper. Only active when NEXT_PUBLIC_GA_ID is configured.",
        zh: "GA4 转化事件 — 通过共享的 trackEvent() 分析辅助函数新增 upload_csv、share_card、tab_switch 和 language_switch 事件追踪。仅在配置 NEXT_PUBLIC_GA_ID 时生效。",
      },
      {
        en: "Community infrastructure — added CONTRIBUTING.md, CODE_OF_CONDUCT.md, GitHub issue templates (bug report + feature request), and a pull request template to lower the contribution barrier.",
        zh: "社区基础设施 — 新增 CONTRIBUTING.md、CODE_OF_CONDUCT.md、GitHub Issue 模板（Bug 报告 + 功能请求）和 Pull Request 模板，降低贡献门槛。",
      },
    ],
    improved: [
      {
        en: "Responsive hero numbers — hero text now scales down on mobile screens (text-5xl → sm:text-6xl → md:text-[5rem]), preventing horizontal overflow on small viewports.",
        zh: "响应式 Hero 数字 — Hero 文本现在在移动端屏幕上自适应缩小（text-5xl → sm:text-6xl → md:text-[5rem]），避免小视口上的水平溢出。",
      },
      {
        en: "Chart accessibility — all ECharts instances now have descriptive aria-labels for screen readers.",
        zh: "图表无障碍 — 所有 ECharts 实例现在具有供屏幕阅读器使用的描述性 aria-label。",
      },
    ],
    fixed: [
      {
        en: "Critical: DropZone error handling — added missing catch clause for ZIP/CSV processing errors. Previously, a corrupt file or extraction failure would leave the UI stuck in an infinite \"Processing\" spinner. Now shows a user-visible error message with the ability to retry. Same fix applied to Dashboard re-upload flow.",
        zh: "关键修复：DropZone 错误处理 — 为 ZIP/CSV 处理错误添加缺失的 catch 子句。此前，损坏的文件或解压失败会导致 UI 卡在无限「处理中」旋转状态。现在显示用户可见的错误信息，并允许重试。Dashboard 重新上传流程也应用了同样的修复。",
      },
      {
        en: "DataContext parser crash protection — wrapped parseDeepSeekData() in a try/catch inside the setTimeout callback. Previously, a synchronous parser crash would throw into the void with no user feedback. Now routes to the ErrorDisplay component.",
        zh: "DataContext 解析器崩溃保护 — 在 setTimeout 回调中将 parseDeepSeekData() 包裹在 try/catch 中。此前，同步解析器崩溃会静默失败，无任何用户反馈。现在将错误路由至 ErrorDisplay 组件显示。",
      },
      {
        en: "Empty states — OverviewView, KeyView, TrendsView, and ProjectView now show descriptive empty-state messages when data is zero/empty after model filtering, instead of blank charts or tables.",
        zh: "空状态 — OverviewView、KeyView、TrendsView 和 ProjectView 现在在模型筛选后数据为空时显示描述性的空状态提示信息，而非空白图表或表格。",
      },
    ],
  },
  {
    version: "v0.5.2",
    date: "2026-06-17",
    added: [
      {
        en: "Social media share card — each dashboard tab (Overview / Projects / Keys / Cache / Trends) can now generate a 1200×630 infographic for sharing. Features customizable \"From XXX\" signature, optional quote message, per-tab ECharts mini charts, QR code pointing to deepseek-usage.xyz, app logo watermark, one-click copy to clipboard (paste directly into WeChat/Feishu/DingTalk), and PNG download.",
        zh: "社交媒体分享卡片 — 每个仪表盘标签页（总览 / 项目 / Key / 缓存 / 趋势）现可生成 1200×630 信息图分享图片。支持自定义「From XXX」署名、可选引用文案、各标签页专属 ECharts 迷你图表、deepseek-usage.xyz 二维码、应用 Logo 水印、一键复制到剪贴板（直接粘贴至微信/飞书/钉钉）以及 PNG 下载。",
      },
    ],
    dependencies: [
      {
        en: "Added `html2canvas` (DOM-to-canvas screenshot capture) and `qrcode` (client-side QR code generation) packages.",
        zh: "新增 `html2canvas`（DOM 转 Canvas 截图）和 `qrcode`（客户端二维码生成）依赖包。",
      },
    ],
  },
  {
    version: "v0.5.1",
    added: [
      {
        en: "Changelog page (/changelog) — a dedicated page showcasing the complete version history, in Apple-minimalist bilingual design matching privacy/terms pages. Includes JSON-LD WebPage schema, independent SEO metadata (canonical, OpenGraph, Twitter), and version entries organized by category (Added/Improved/Fixed/Dependencies) with color-coded dots.",
        zh: "更新日志页面（/changelog）— 专属页面展示完整版本历史，采用与隐私政策/使用条款一致的 Apple 极简双语设计。包含 JSON-LD WebPage 结构化数据、独立 SEO 元数据（canonical、OpenGraph、Twitter），版本条目按类别（新增/改进/修复/依赖）以彩色圆点分组展示。",
      },
      {
        en: "TitleBar clock icon linking to the changelog page, alongside the existing guideline book icon.",
        zh: "TitleBar 时钟图标链接至更新日志页面，与现有操作手册书籍图标并列。",
      },
      {
        en: "LandingPage About section \"View Changelog →\" link below the social link pills.",
        zh: "落地页关于区域社交链接胶囊下方新增「查看更新日志 →」链接。",
      },
    ],
    improved: [
      {
        en: "TitleBar tooltips (User Guide, Changelog) now properly support i18n, displaying localized text in both English and Chinese.",
        zh: "TitleBar 悬浮提示（操作手册、更新日志）现正确支持多语言，中英文环境下显示对应本地化文本。",
      },
      {
        en: "Sitemap (sitemap.xml) expanded with /changelog entry (priority 0.5, monthly change frequency).",
        zh: "sitemap.xml 扩展，新增 /changelog 条目（优先级 0.5，月度更新频率）。",
      },
      {
        en: "Translation system extended with changelog.* group (en + zh).",
        zh: "翻译系统扩展，新增 changelog.* 分组（中英双语）。",
      },
    ],
  },
  {
    version: "v0.5.0",
    added: [
      {
        en: "ZIP file upload support — users can now drag DeepSeek platform ZIP exports directly into the dashboard. ZIP archives containing CSV files are automatically extracted and processed in-browser. Huge thanks to @taylord0ng for this contribution.",
        zh: "ZIP 文件上传支持 — 用户现可直接将 DeepSeek 平台导出的 ZIP 压缩包拖入仪表盘，内含的 CSV 文件将在浏览器端自动解压处理。感谢 @taylord0ng 贡献此功能。",
      },
      {
        en: "Custom project grouping for API keys — a new \"By Project\" tab lets you organize API keys into user-defined project groups via drag-and-drop, with per-project cost aggregation, token usage tracking, and cache hit rate analysis. Inspired by @taylord0ng.",
        zh: "自定义项目分组管理 API 密钥 — 新增「按项目」标签页，支持通过拖拽将 API 密钥归入用户自定义的项目分组，提供按项目汇总的费用、Token 用量追踪及缓存命中率分析。灵感来自 @taylord0ng。",
      },
      {
        en: "Project configuration modal — drag-and-drop interface for assigning keys to custom projects, with local persistence via localStorage, reset-to-default, empty-state prompts, keyboard-friendly operation, and dropdown menus for unassigned keys.",
        zh: "项目配置弹窗 — 拖拽式界面，可将密钥分配至自定义项目，支持 localStorage 本地持久化、一键重置、空状态提示、键盘友好操作以及未分配密钥的下拉菜单。",
      },
      {
        en: "Reusable CopyButton component — encapsulated clipboard copy logic with hover tooltip and i18n-aware success messages. All inline copy functionality (KeyView, ProjectView) now uses this shared component.",
        zh: "通用 CopyButton 组件 — 封装剪贴板复制逻辑，含悬浮提示和国际化成功消息。KeyView 和 ProjectView 中的所有复制功能现已统一使用此共享组件。",
      },
      {
        en: "One-click cost copy — copy total cost from the Overview hero number with a single click.",
        zh: "费用一键复制 — 点击总览 Hero 区域的总费用大数字即可一键复制。",
      },
      {
        en: "50MB per-file upload size limit — protects against accidental or malicious oversized file uploads that could freeze the browser. Includes user-facing warning prompts and a dedicated FAQ entry.",
        zh: "单文件 50MB 上传大小限制 — 防止意外或恶意超大文件导致浏览器卡死，包含用户可见的警告提示和专属 FAQ 条目。",
      },
    ],
    improved: [
      {
        en: "Upload validation — file size check with clear error messaging, duplicate project name validation with inline hints, and unsaved-changes confirmation dialog when closing the project config modal.",
        zh: "上传校验增强 — 文件大小检查并给出明确错误提示、项目名称重复校验及内联提示、关闭项目配置弹窗时的未保存修改确认对话框。",
      },
      {
        en: "Keyboard accessibility — full keyboard navigation support in the project configuration modal: Enter to confirm, Escape to close, arrow keys to navigate, plus on-screen keyboard shortcut hints.",
        zh: "键盘无障碍 — 项目配置弹窗支持完整键盘导航：Enter 确认、Escape 关闭、方向键浏览，同时提供界面上可见的快捷键提示。",
      },
      {
        en: "UI polish — fixed drag highlight state glitch in project key lists, resolved React key warnings in config lists, adjusted modal layout for better visual balance.",
        zh: "UI 细节优化 — 修复项目密钥列表中拖拽高亮状态异常、解决配置列表 React key 警告、调整弹窗布局以获得更好的视觉平衡。",
      },
      {
        en: "i18n coverage — all new UI elements (project view, copy button, upload limits, config modal) fully translated in both English and Chinese.",
        zh: "国际化覆盖 — 所有新增 UI 元素（项目视图、复制按钮、上传限制、配置弹窗）均已完善中英双语文案。",
      },
      {
        en: "Fixed CopyButton timer memory leak — timers now properly cleaned up on unmount, preventing stale state updates.",
        zh: "修复 CopyButton 定时器内存泄漏 — 组件卸载时正确清理定时器，避免过期状态更新。",
      },
      {
        en: "User guide and landing page — updated FAQ (new entries for file size limits and project grouping), usage guide screenshots and documentation, and landing page copy to reflect new features.",
        zh: "用户操作手册与落地页 — 更新 FAQ（新增文件大小限制与项目分组相关条目）、使用指南截图与文档、落地页文案以反映新增功能。",
      },
    ],
    dependencies: [
      {
        en: "Added `jszip` dependency for client-side ZIP extraction.",
        zh: "新增 `jszip` 依赖，用于浏览器端 ZIP 解压。",
      },
    ],
  },
  {
    version: "v0.4.0",
    added: [
      {
        en: "Privacy Policy page (/privacy) — bilingual (en/zh) legal content covering 7 sections, independent SEO metadata (canonical, OpenGraph, Twitter), JSON-LD WebPage schema, Apple-minimalist legal-text layout with GitHub source links for transparency verification.",
        zh: "隐私政策页面（/privacy）— 双语（中/英）法律内容，涵盖 7 个章节：不收集数据、本地处理、Google Analytics（可选启用）、第三方服务、安全性、政策变更、联系我们。独立 SEO 元数据，JSON-LD WebPage Schema，Apple 极简风格法律文本布局，附 GitHub 源码链接以供透明验证。",
      },
      {
        en: "Terms of Use page (/terms) — bilingual (en/zh) legal content covering 8 sections, independent SEO metadata and JSON-LD WebPage schema.",
        zh: "使用条款页面（/terms）— 双语（中/英）法律内容，涵盖 8 个章节：按现状提供、免责声明、与 DeepSeek 无关、用户数据与责任、开源许可（MIT License）、责任限制、条款变更、联系我们。独立 SEO 元数据和 JSON-LD WebPage Schema。",
      },
      {
        en: "MIT LICENSE file — added to the project root for open-source licensing clarity.",
        zh: "MIT LICENSE 文件 — 添加至项目根目录，明确开源许可协议。",
      },
      {
        en: "FooterBar now links to Privacy Policy and Terms of Use pages alongside Guideline, GitHub, and version.",
        zh: "FooterBar 现同时链接至隐私政策和使用条款页面，与操作手册、GitHub、版本号并列。",
      },
    ],
    improved: [
      {
        en: "sitemap.xml expanded to include /privacy and /terms entries (priority 0.5, monthly change frequency).",
        zh: "sitemap.xml 扩展，新增 /privacy 和 /terms 条目（优先级 0.5，月度更新频率）。",
      },
      {
        en: "Translation system extended with privacy.* (21 keys) and terms.* (22 keys) groups in both English and Chinese.",
        zh: "翻译系统扩展，新增 privacy.*（21 个键）和 terms.*（22 个键）分组，涵盖英文和中文。",
      },
      {
        en: "SEO metadata: NEXT_PUBLIC_SITE_URL now injected into privacy and terms page metadata generation.",
        zh: "SEO 元数据：NEXT_PUBLIC_SITE_URL 现注入至隐私政策和使用条款页面的元数据生成中。",
      },
    ],
  },
  {
    version: "v0.3.3",
    fixed: [
      {
        en: "Cache hit rate chart accumulation bug in TrendsView: daily ratios were incorrectly summed instead of computing hit/(hit+miss) from raw token totals, causing values to potentially exceed 100%.",
        zh: "修复 TrendsView 中缓存命中率图表数据累加错误：每日比例值被错误累加，现已改为按原始 token 数量先累加再计算 hit/(hit+miss)，避免数值超过 100%。",
      },
    ],
    added: [
      {
        en: "Cache hit rate percentage display on the hits-vs-misses stacked bar chart in CacheView: hit rate shown in tooltip and as labels on top of each key's bar.",
        zh: "CacheView 的 hitsVsMisses 堆叠柱状图新增缓存命中率显示：tooltip 中展示百分比，柱状图顶部显示各 Key 的命中率标签。",
      },
      {
        en: "vercel.json with production security headers (CSP, HSTS, X-Frame-Options, etc.) and optimized static asset caching rules.",
        zh: "新增 vercel.json，配置生产环境安全头（CSP、HSTS、X-Frame-Options 等）和静态资源缓存优化规则。",
      },
    ],
  },
  {
    version: "v0.3.2",
    added: [
      {
        en: "User Guide page (/guideline) — comprehensive usage documentation covering dashboard overview, CSV export, data upload, chart interpretation, and troubleshooting; bilingual (en/zh) with annotated screenshots.",
        zh: "用户操作手册页面（/guideline）— 涵盖仪表盘总览、CSV 导出、数据上传、图表解读、故障排查的全面使用文档，双语（中/英）配标注截图。",
      },
      {
        en: "Guideline navigation links in TitleBar (book icon), FooterBar (text link), and LandingPage (below How It Works section).",
        zh: "操作手册导航入口：TitleBar（书籍图标）、FooterBar（文字链接）、LandingPage（使用说明区域下方）。",
      },
      {
        en: "3 new FAQ entries (Q5–Q7): \"Why does my cost show as $0?\", \"What does Incomplete Upload mean?\", and \"Where can I find more troubleshooting help?\".",
        zh: "3 个新增常见问题（Q5–Q7）：「为什么费用显示为 0？」「显示\"上传不完整\"是什么意思？」「哪里可以找到更多故障排查帮助？」",
      },
      {
        en: "Dashboard overview screenshot and logo in README files (en + zh).",
        zh: "README 文件中添加仪表盘总览截图和 Logo（中英文版）。",
      },
    ],
    improved: [
      {
        en: "SEO: added /guideline to sitemap.xml.",
        zh: "SEO：在 sitemap.xml 中新增 /guideline 条目。",
      },
      {
        en: "JSON-LD FAQPage schema expanded with Q5–Q7 entries (bilingual).",
        zh: "JSON-LD FAQPage Schema 扩充 Q5–Q7 条目（双语）。",
      },
      {
        en: "Added /docs/ to .gitignore.",
        zh: "在 .gitignore 中新增 /docs/。",
      },
    ],
  },
  {
    version: "v0.3.1",
    added: [
      {
        en: "JSON-LD BreadcrumbList schema (bilingual en/zh) for better search engine understanding of site structure.",
        zh: "JSON-LD BreadcrumbList 面包屑 Schema（中英文双语），帮助搜索引擎理解页面在站点中的位置。",
      },
    ],
    improved: [
      {
        en: "SEO: extended Chinese meta.description with privacy and team info (~100 characters, up from ~37).",
        zh: "SEO：扩展中文 meta.description，融入隐私说明和团队信息（约 100 字符，原 37 字符）。",
      },
      {
        en: "SEO: added alternateLocale: [\"zh_CN\"] to OpenGraph metadata, complementing existing hreflang alternates.",
        zh: "SEO：OpenGraph 元数据新增 alternateLocale: [\"zh_CN\"]，与 hreflang 语言标注相呼应。",
      },
      {
        en: "SEO: added id attributes to landing page sections (#how-it-works, #faq, #about) for direct anchor linking.",
        zh: "SEO：为落地页板块添加 id 属性（#how-it-works、#faq、#about），支持页面内锚点链接。",
      },
      {
        en: "JSON-LD: added version field to SoftwareApplication schema.",
        zh: "JSON-LD：SoftwareApplication Schema 新增 version 字段。",
      },
      {
        en: "Performance: added content-visibility: auto to below-the-fold landing page sections (How It Works, FAQ, About) to reduce initial render cost.",
        zh: "性能：为折叠区域下方的落地页板块（使用说明、常见问题、关于）添加 content-visibility: auto，减少初始渲染开销。",
      },
    ],
  },
  {
    version: "v0.3.0",
    added: [
      {
        en: "Rebuilt About section: expanded from a single paragraph into 4 themed subsections — Why We Built This, Under the Hood: Privacy & Tech, About MindRose, and Let's Work Together — each separated by dashed <hr> dividers.",
        zh: "重构关于板块：从单一简介扩展为 4 个主题子板块 — 为什么开发这个工具、极致的隐私与技术架构、关于 MindRose、商业合作 — 各板块以虚线 <hr> 分割。",
      },
      {
        en: "Email copy button in the Contact area: one-click clipboard copy with textarea fallback, anti-scraping dynamic address concatenation, and SVG checkmark copy feedback with 2s toast.",
        zh: "联系方式区域新增邮箱复制按钮：一键复制到剪贴板，反爬虫动态拼接邮箱地址，SVG 对勾复制反馈 + 2 秒提示。",
      },
      {
        en: "Social link pills: GitHub repository, Gavin's LinkedIn, and MindRose website — each with themed SVG icons, rounded borders, and hover background.",
        zh: "社交链接胶囊：GitHub 仓库、Gavin 的 LinkedIn、MindRose 官网 — 各含主题 SVG 图标、圆角边框和 hover 背景。",
      },
    ],
    improved: [
      {
        en: "Landing page sections now separated by thin horizontal <hr> dividers for clearer visual hierarchy.",
        zh: "落地页各板块之间新增水平 <hr> 分割线，视觉层次更清晰。",
      },
      {
        en: "Added 14 new landing.* translation keys (en + zh) for all About sub-sections.",
        zh: "为所有关于子板块新增 14 个 landing.* 翻译键（中英文）。",
      },
      {
        en: "Rebranded site title to \"DeepSeek API Usage Analytics Dashboard by Gavin & Mindrose Team\" across metadata, JSON-LD schema, footer, and translations.",
        zh: "站点标题更新为 \"DeepSeek API Usage Analytics Dashboard by Gavin & Mindrose Team\"，同步更新元数据、JSON-LD Schema、页脚和翻译文案。",
      },
      {
        en: "Fixed landing page heading hierarchy: section titles upgraded from <h3> to <h2>, sub-section titles from <h4> to <h3>.",
        zh: "修复落地页标题层级：板块标题从 <h3> 升级为 <h2>，子板块标题从 <h4> 升级为 <h3>。",
      },
    ],
  },
  {
    version: "v0.2.3",
    added: [
      {
        en: "Full-site SEO: generateMetadata() with canonical URLs, OpenGraph, Twitter cards, and hreflang alternates.",
        zh: "全站 SEO 优化：generateMetadata() 动态元数据（规范 URL、OpenGraph、Twitter 卡片、hreflang 语言标注）。",
      },
      {
        en: "JSON-LD structured data: bilingual SoftwareApplication + FAQPage schemas (via src/lib/schema.ts).",
        zh: "JSON-LD 结构化数据：双语 SoftwareApplication + FAQPage Schema（通过 src/lib/schema.ts 生成）。",
      },
      {
        en: "robots.txt and sitemap.xml generation at build time (via src/app/robots.ts and src/app/sitemap.ts).",
        zh: "构建时 robots.txt 和 sitemap.xml 生成（通过 src/app/robots.ts 和 src/app/sitemap.ts）。",
      },
      {
        en: "<noscript> crawler fallback content (LandingContent.tsx) for search engines that don't execute JavaScript.",
        zh: "<noscript> 爬虫回退内容（LandingContent.tsx），确保不执行 JavaScript 的搜索引擎也能抓取落地页文字。",
      },
      {
        en: "Theme-aware landing page background images — CSV and chart themed sketches that swap with light/dark mode.",
        zh: "落地页主题感知背景图片 — CSV 和图表主题素描图，随浅色/深色模式切换。",
      },
      {
        en: "Semantic hidden H1 on dashboard view for screen readers and SEO.",
        zh: "仪表盘视图新增语义化隐藏 H1，便于屏幕阅读器和搜索引擎读取。",
      },
    ],
    improved: [
      {
        en: "layout.tsx upgraded to generateMetadata() for dynamic build-time SEO injection.",
        zh: "layout.tsx 升级为 generateMetadata()，实现构建时动态 SEO 注入。",
      },
      {
        en: "FooterBar.tsx extracted as standalone component with animate and sectionRef props.",
        zh: "FooterBar.tsx 提取为独立组件，支持 animate 和 sectionRef 属性。",
      },
      {
        en: "TitleBar.tsx extracted as standalone component with logo, GitHub icon, and unified layout.",
        zh: "TitleBar.tsx 提取为独立组件，包含 Logo、GitHub 图标和统一布局。",
      },
      {
        en: "Added warning translation group (date mismatch, no cost match, partial cache data, schema drift).",
        zh: "新增 warning 翻译分组（日期不匹配、缺少费用数据、缓存数据不完整、数据结构不一致）。",
      },
    ],
  },
  {
    version: "v0.2.2",
    added: [
      {
        en: "Logo icon and favicon.ico — added brand identity assets to TitleBar and browser tab.",
        zh: "新增 Logo 图标和 favicon.ico 文件 — 在 TitleBar 和浏览器标签页中展示品牌标识。",
      },
      {
        en: "Replaced default English font with local Hubot Sans WOFF2 files (3 weights: 400/500/700).",
        zh: "替换项目英文默认字体为本地 Hubot Sans WOFF2 文件（3 个字重：400/500/700）。",
      },
    ],
    improved: [
      {
        en: "Redesigned LanguageSwitcher as Apple-style pill segmented control with role=\"radio\" accessibility.",
        zh: "重新设计语言切换器为 Apple 风格胶囊分段控件，支持 role=\"radio\" 无障碍属性。",
      },
      {
        en: "Redesigned ThemeSwitcher as SVG sun/moon icon button with hover background.",
        zh: "重新设计主题切换器为 SVG 太阳/月亮图标按钮，hover 时显示圆形背景。",
      },
      {
        en: "Added GitHub icon link to TitleBar for quick repository access.",
        zh: "TitleBar 新增 GitHub 图标链接，方便快速访问代码仓库。",
      },
      {
        en: "FooterBar now displays app version number alongside copyright and GitHub link.",
        zh: "FooterBar 新增版本号显示，与版权信息和 GitHub 链接并列。",
      },
      {
        en: "Landing page content container widened from max-w-3xl to max-w-6xl for better visual balance.",
        zh: "Landing 页面内容容器从 max-w-3xl 扩宽至 max-w-6xl，视觉更平衡。",
      },
      {
        en: "Added scroll-reveal fade-in + slide-up animations on landing page sections via Intersection Observer.",
        zh: "Landing 页面新增滚动渐显动画（Intersection Observer 驱动的淡入 + 上滑效果）。",
      },
      {
        en: "Added accordion expand/collapse animation for the QA section.",
        zh: "常见问题区域新增手风琴展开/折叠动画。",
      },
      {
        en: "Added global accessibility styles: smooth scrolling, prefers-reduced-motion support, color-scheme for native UI, focus-visible outlines.",
        zh: "添加全局无障碍样式：平滑滚动、prefers-reduced-motion 适配、color-scheme 原生 UI、focus-visible 焦点轮廓。",
      },
    ],
  },
  {
    version: "v0.2.1",
    added: [
      {
        en: "Landing page — built a complete pre-upload landing page with Hero, upload area, How It Works steps, FAQ, and About sections.",
        zh: "构建完整的上传前落地页，包含 Hero 区、上传区、使用说明、常见问题和关于等模块。",
      },
    ],
  },
  {
    version: "v0.2.0",
    added: [
      {
        en: "Full light/dark theme switching — refactored global CSS with custom properties for unified dual-theme color management.",
        zh: "实现完整的明暗主题切换功能，重构全局 CSS 样式，使用 CSS 变量统一管理双主题配色。",
      },
      {
        en: "Model filter — added Apple-style segmented capsule filter in Dashboard, optimized UI and data presentation.",
        zh: "新增模型筛选功能，在 Dashboard 添加 Apple 风格分段胶囊过滤器，优化 UI 与数据展示。",
      },
    ],
    improved: [
      {
        en: "Refined overall UI interactions and visual styling.",
        zh: "优化整体 UI 交互与视觉样式。",
      },
      {
        en: "Refactored all view components to render from filtered data; added Hero big-number summary sections at the top of each view.",
        zh: "重构所有视图组件，改用过滤后的数据渲染，新增顶部 Hero 大数字汇总模块。",
      },
    ],
  },
  {
    version: "v0.1.0",
    added: [
      {
        en: "Built the DeepSeek API usage analytics dashboard — implemented CSV parsing, multi-month file concatenation, and error validation logic; all data processing runs purely in the browser.",
        zh: "搭建 DeepSeek API 使用分析仪表盘，实现 CSV 解析、多月份文件合并与错误校验逻辑，所有数据处理均在浏览器端完成。",
      },
      {
        en: "Developed drag-and-drop upload component, data context layer, and multi-dimensional visualization dashboard.",
        zh: "开发拖拽上传组件、数据上下文与多维度可视化仪表盘页面。",
      },
      {
        en: "Added full i18n support with language switching, and refactored numeric formatting utilities to adapt unit display rules for different locales.",
        zh: "新增完整多语言支持与语言切换功能，并重构数值格式化工具函数，适配不同语言的单位展示规则。",
      },
    ],
  },
];

/* ================================================================== */
/*  ChangelogPage 组件                                                 */
/* ================================================================== */

/**
 * 更新日志页面
 *
 * Apple 极简风格 — 按版本倒序展示所有变更记录。
 * 每个版本以 h2 标题呈现，变更项按类别（新增/改进/修复/依赖）分组列出。
 * 顶部标题栏带版本号和日期，底部有 GitHub 链接和 FooterBar。
 */
export function ChangelogPage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);

  /** 判断当前是否为中文环境 */
  const isZh = locale === "zh";

  /** JSON-LD 结构化数据 */
  const changelogJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isZh
        ? "更新日志 — DeepSeek API 用量分析仪表盘"
        : "Changelog — DeepSeek API Usage Analytics Dashboard",
      description: isZh
        ? "DeepSeek API 用量分析仪表盘完整更新日志。追踪自 v0.1.0 以来的所有新增功能、改进优化、问题修复和依赖变更。"
        : "Complete changelog for the DeepSeek API Usage Analytics Dashboard. Track all new features, improvements, bug fixes, and dependency changes since v0.1.0.",
      url: buildLocaleUrl(locale, "/changelog"),
      inLanguage: locale,
      about: {
        "@type": "Thing",
        name: isZh ? "更新日志" : "Changelog",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "DeepSeek API Usage Analytics Dashboard",
        url: buildLocaleUrl(locale, "/"),
      },
    };
  }, [isZh, locale]);

  /**
   * 根据当前 locale 获取变更项文本
   *
   * @param item - 双语变更项
   * @returns 对应语言的文本
   */
  function getText(item: ChangeItem): string {
    return isZh ? item.zh : item.en;
  }

  /** 变更类别标签与对应的数据字段名 */
  type CategoryKey = "added" | "improved" | "fixed" | "dependencies";

  const categories: { key: CategoryKey; label: string; dotColor: string }[] = [
    { key: "added", label: t.changelog.added, dotColor: "#34C759" },
    { key: "improved", label: t.changelog.improved, dotColor: "#007AFF" },
    { key: "fixed", label: t.changelog.fixed, dotColor: "#FF9500" },
    {
      key: "dependencies",
      label: t.changelog.dependencies,
      dotColor: "#AF52DE",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(changelogJsonLd),
        }}
      />
      <TitleBar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* 返回首页 */}
        <Link
          href={homeHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 mb-8 hover:opacity-80"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.changelog.backToHome}
        </Link>

        {/* 页面标题 */}
        <h1
          className="text-2xl font-bold tracking-tight mb-2"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
          translate="no"
        >
          {t.changelog.pageTitle}
        </h1>

        {/* 最后更新时间 */}
        <p className="text-xs mb-10" style={{ color: "var(--text-tertiary)" }}>
          {t.changelog.lastUpdated}
        </p>

        {/* 引言 */}
        <p
          className="text-sm leading-relaxed mb-12 text-pretty"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.changelog.intro}
        </p>

        {/* 各版本变更 */}
        {CHANGELOG_DATA.map((entry) => (
          <section key={entry.version} className="mb-12">
            {/* 版本标题 */}
            <h2
              className="text-lg font-bold mb-1"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {entry.version}
            </h2>

            {/* 版本日期 */}
            {entry.date && (
              <p
                className="text-xs mb-5"
                style={{ color: "var(--text-tertiary)" }}
              >
                {entry.date}
              </p>
            )}

            {/* 各变更类别 */}
            {categories.map((cat) => {
              const items = entry[cat.key];
              return (
                items &&
                items.length > 0 && (
                  <div key={cat.key} className="mb-5">
                    {/* 类别标签 */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.dotColor }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {cat.label}
                      </span>
                    </div>

                    {/* 变更项列表 */}
                    <ul className="space-y-1.5 pl-4">
                      {items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm leading-relaxed text-pretty"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {getText(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              );
            })}

            {/* 版本间分割线 */}
            <hr
              className="mt-8"
              style={{ borderColor: "var(--border)" }}
            />
          </section>
        ))}

        {/* 底部 GitHub 链接和 FooterBar */}
        <hr className="my-10" style={{ borderColor: "var(--border)" }} />

        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          <a
            href="https://github.com/GavinCnod/deepseek-api-usage-analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.changelog.githubLabel}
          </a>
        </p>
      </div>

      <RecommendedToolsSection maxWidth="3xl" />
      <FooterBar />
    </div>
  );
}
