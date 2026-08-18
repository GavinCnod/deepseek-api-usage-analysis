/**
 * Schema.org 结构化数据辅助模块
 *
 * 生成 JSON-LD 格式的 Schema Markup，支持多语言（en / zh）。
 * 在 LandingPage 客户端组件中根据当前 locale 动态渲染。
 */
import type { Locale } from "@/i18n/translations";
import translations from "@/i18n/translations";
import {
  buildAuthorPageUrl,
  GAVIN_LINKEDIN_URL,
  MINDROSE_SITE_URL,
} from "@/lib/authors";
import { getBlogArticleDefinition, type BlogArticleSlug } from "@/lib/blogArticles";
import { buildLocaleUrl } from "@/lib/localeRouting";
import {
  MODEL_NAMES,
  MODEL_PRICING,
  MODEL_PRICING_PATHS,
  MODEL_VENDOR,
  type ModelKey,
  type PriceCell,
} from "@/lib/modelPricing";
import { getModelPricingContent } from "@/lib/content/modelPricingContent";
import {
  getGlossaryContent,
  GLOSSARY_PATHS,
  type GlossarySlug,
} from "@/lib/content/glossaryContent";
import { LOGO_IMAGE_URL } from "@/lib/site";
import { deepseekProject, TOOL_SERIES_NAME } from "@/lib/sisterProjects";

/* ------------------------------------------------------------------ */
/*  多语言翻译映射                                                       */
/* ------------------------------------------------------------------ */

/** 应用版本号，与 package.json 保持同步 */
const APP_VERSION = "0.10.2";

/** SoftwareApplication Schema 翻译 */
const softwareAppSchema: Record<
  Locale,
  { name: string; description: string; version: string }
> = {
  en: {
    name: "DeepSeek API Usage Analytics Dashboard by Gavin & Mindrose Team",
    description:
      "Visualize your DeepSeek API usage — drop your monthly CSVs and get instant cost analytics, cache analysis, and per-key breakdowns. Free, open-source, browser-side.",
    version: APP_VERSION,
  },
  zh: {
    name: "DeepSeek API 用量分析仪表盘 by Gavin & Mindrose Team",
    description:
      "可视化您的 DeepSeek API 使用情况 — 拖拽月度 CSV，即时获取费用分析、缓存分析和各 Key 用量明细。免费、开源、纯浏览器端。",
    version: APP_VERSION,
  },
};

/**
 * 读取首页可见 FAQ 文案。
 *
 * 直接复用 `translations.ts` 中的页面可见文本，确保 FAQPage Schema
 * 与落地页上的问答内容完全一致，不再维护第二份硬编码副本。
 */
function getLandingFaqItems(locale: Locale): { q: string; a: string }[] {
  const landing = translations[locale].landing;

  return [
    { q: landing.qaQ1, a: landing.qaA1 },
    { q: landing.qaQ2, a: landing.qaA2 },
    { q: landing.qaQ3, a: landing.qaA3 },
    { q: landing.qaQ4, a: landing.qaA4 },
    { q: landing.qaQ5, a: landing.qaA5 },
    { q: landing.qaQ6, a: landing.qaA6 },
    { q: landing.qaQ7, a: landing.qaA7 },
    { q: landing.qaQ8, a: landing.qaA8 },
    { q: landing.qaQ9, a: landing.qaA9 },
  ];
}

/* ------------------------------------------------------------------ */
/*  生成器                                                              */
/* ------------------------------------------------------------------ */

/** 根据 locale 生成 SoftwareApplication JSON-LD */
export function buildSoftwareAppJsonLd(locale: Locale): Record<string, unknown> {
  const t = softwareAppSchema[locale];
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.name,
    url: buildLocaleUrl(locale, "/"),
    version: t.version,
    operatingSystem: "Any (web browser)",
    applicationCategory: "DeveloperApplication",
    description: t.description,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://mindrose.xyz/#organization",
      name: "MindRose Team",
      url: MINDROSE_SITE_URL,
    },
  };
}

/** 根据 locale 生成 FAQPage JSON-LD */
export function buildFaqJsonLd(locale: Locale): Record<string, unknown> {
  const questions = getLandingFaqItems(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: buildLocaleUrl(locale, "/"),
    inLanguage: locale,
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** Organization Schema 翻译 */
const organizationSchema: Record<Locale, { description: string }> = {
  en: {
    description:
      "MindRose Team builds free, open-source, browser-side analytics tools for DeepSeek and AI API usage. All CSV parsing runs locally in your browser.",
  },
  zh: {
    description:
      "MindRose 团队打造免费、开源、纯浏览器端的 DeepSeek 与 AI API 用量分析工具，所有 CSV 解析均在本地完成。",
  },
};

/**
 * 根据 locale 生成 Organization JSON-LD
 *
 * 代表真实发布实体 MindRose Team，帮助 Google 建立品牌实体识别，
 * 通过 sameAs 关联官网与 GitHub 等外部平台。
 */
export function buildOrganizationJsonLd(locale: Locale): Record<string, unknown> {
  const t = organizationSchema[locale];
  const sameAs = Array.from(
    new Set([
      MINDROSE_SITE_URL,
      deepseekProject.githubUrl,
    ])
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://mindrose.xyz/#organization",
    name: "MindRose Team",
    url: MINDROSE_SITE_URL,
    logo: LOGO_IMAGE_URL,
    description: t.description,
    inLanguage: locale,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@mindrose.xyz",
      contactType: "customer support",
      availableLanguage: ["en", "zh"],
    },
    brand: {
      "@type": "Brand",
      name: TOOL_SERIES_NAME,
    },
  };
}

/** 博客文章 JSON-LD 生成参数 */
export interface ArticleJsonLdInput {
  locale: Locale;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  imageUrl: string;
}

/**
 * 生成博客文章 Article JSON-LD。
 *
 * 用于 blog 文章详情页，补充文章标题、发布日期、作者、图片等结构化数据，
 * 帮助搜索引擎更准确理解页面的文章属性。
 */
export function buildArticleJsonLd(
  input: ArticleJsonLdInput
): Record<string, unknown> {
  const authorPageUrl = buildAuthorPageUrl(input.locale);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: input.locale,
    author: {
      "@id": authorPageUrl,
      "@type": "Person",
      name: input.authorName,
      url: authorPageUrl,
      sameAs: [GAVIN_LINKEDIN_URL],
      worksFor: {
        "@type": "Organization",
        name: "MindRose Team",
        url: MINDROSE_SITE_URL,
        sameAs: [MINDROSE_SITE_URL],
      },
    },
    publisher: {
      "@type": "Organization",
      name: "MindRose Team",
      url: MINDROSE_SITE_URL,
      sameAs: [MINDROSE_SITE_URL],
      logo: {
        "@type": "ImageObject",
        url: LOGO_IMAGE_URL,
      },
    },
    image: [input.imageUrl],
  };
}

/* ------------------------------------------------------------------ */
/*  子页面专属 JSON-LD                                                   */
/* ------------------------------------------------------------------ */

/**
 * 根据 locale 生成博客索引 Blog + ItemList JSON-LD
 *
 * 为 /blog 与 /zh/blog 提供 Blog 聚合结构化数据，
 * 每条博客文章同时出现在 blogPost 数组与 ItemList 中，便于搜索引擎建立站点内容结构。
 */
export function buildBlogIndexJsonLd(locale: Locale): Record<string, unknown> {
  const blog = translations[locale].blogIndex;
  const slugs: BlogArticleSlug[] = [
    "deepseek-context-caching-guide",
    "deepseek-cost-optimization-tools",
    "openai-claude-vs-deepseek-cost-comparison",
    "opencode-go-cheapest-deepseek-v4-flash",
    "deepseek-csv-export-format-changed-aug-2026",
    "gpt-5.6-luna-vs-deepseek-v4-flash-value-champions",
  ];
  const titles: Record<BlogArticleSlug, string> = {
    "deepseek-context-caching-guide": blog.article1Title,
    "deepseek-cost-optimization-tools": blog.article2Title,
    "openai-claude-vs-deepseek-cost-comparison": blog.article3Title,
    "opencode-go-cheapest-deepseek-v4-flash": blog.article4Title,
    "deepseek-csv-export-format-changed-aug-2026": blog.article5Title,
    "gpt-5.6-luna-vs-deepseek-v4-flash-value-champions": blog.article6Title,
  };
  const blogUrl = buildLocaleUrl(locale, "/blog");

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: blog.pageTitle,
    url: blogUrl,
    inLanguage: locale,
    description: blog.pageSubtitle,
    blogPost: slugs.map((slug) => {
      const def = getBlogArticleDefinition(slug);
      return {
        "@type": "BlogPosting",
        headline: titles[slug],
        url: buildLocaleUrl(locale, def.pathname),
        datePublished: def.publishedTime,
      };
    }),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: slugs.map((slug, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: titles[slug],
        url: buildLocaleUrl(locale, getBlogArticleDefinition(slug).pathname),
      })),
    },
  };
}

/**
 * 生成 CostTracker 页面的 FAQPage JSON-LD
 */
export function buildCostTrackerFaqJsonLd(locale: Locale): Record<string, unknown> {
  const t = translations[locale].costTracker;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: buildLocaleUrl(locale, "/deepseek-api-cost-tracker"),
    inLanguage: locale,
    mainEntity: [
      {
        "@type": "Question",
        name: t.faq1Q,
        acceptedAnswer: { "@type": "Answer", text: t.faq1A },
      },
      {
        "@type": "Question",
        name: t.faq2Q,
        acceptedAnswer: { "@type": "Answer", text: t.faq2A },
      },
      {
        "@type": "Question",
        name: t.faq3Q,
        acceptedAnswer: { "@type": "Answer", text: t.faq3A },
      },
    ],
  };
}

/**
 * 生成 CostTracker 页面的 SoftwareApplication JSON-LD
 */
export function buildCostTrackerSoftwareAppJsonLd(locale: Locale): Record<string, unknown> {
  const t = translations[locale].costTracker;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.pageTitle,
    url: buildLocaleUrl(locale, "/deepseek-api-cost-tracker"),
    version: APP_VERSION,
    operatingSystem: "Any (web browser)",
    applicationCategory: "DeveloperApplication",
    description: t.heroDesc,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * 生成 PricingCalculator 页面的 SoftwareApplication JSON-LD
 */
export function buildPricingCalculatorSoftwareAppJsonLd(locale: Locale): Record<string, unknown> {
  const t = translations[locale].pricingCalculator;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.pageTitle,
    url: buildLocaleUrl(locale, "/deepseek-api-pricing-calculator"),
    version: APP_VERSION,
    operatingSystem: "Any (web browser)",
    applicationCategory: "DeveloperApplication",
    description: t.heroDesc,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * 生成 CacheAnalyzer 页面的 SoftwareApplication JSON-LD
 */
export function buildCacheAnalyzerSoftwareAppJsonLd(locale: Locale): Record<string, unknown> {
  const t = translations[locale].cacheAnalyzer;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.pageTitle,
    url: buildLocaleUrl(locale, "/deepseek-cache-hit-rate-analyzer"),
    version: APP_VERSION,
    operatingSystem: "Any (web browser)",
    applicationCategory: "DeveloperApplication",
    description: t.heroDesc,
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * 生成单模型定价页的 FAQPage + Product JSON-LD
 *
 * 每个模型独立定价落地页注入一套结构化数据：
 * - FAQPage 复用页面可见的 FAQ 文案，保证一致
 * - Product + AggregateOffer 完整表达该模型 input/output/cache 三档公开价格，
 *   并通过 availableAtOrFrom 明确价格归属厂商，避免被误认为本站售卖
 */

/** 三档计价单元的多语言标签。 */
const priceTierLabels = {
  input: { en: "Input tokens", zh: "输入 tokens" },
  output: { en: "Output tokens", zh: "输出 tokens" },
  cacheHit: { en: "Cached input tokens", zh: "缓存命中输入 tokens" },
} as const;

type PriceTierKey = keyof typeof priceTierLabels;

/** 取计价单元的头条价格：固定价取原值，高峰/闲时取高峰价。 */
function priceCellHeadline(cell: PriceCell): number {
  return typeof cell === "number" ? cell : cell.peak;
}

/** 生成某档价的「每百万 token」说明文案（DeepSeek 补充高峰价标注）。 */
function buildPriceTierDescription(
  key: PriceTierKey,
  hasOffPeak: boolean,
  locale: Locale
): string {
  const unit =
    locale === "zh"
      ? {
          input: "每百万输入 token",
          output: "每百万输出 token",
          cacheHit: "每百万缓存命中输入 token",
        }
      : {
          input: "per million input tokens",
          output: "per million output tokens",
          cacheHit: "per million cached input tokens",
        };
  const base = unit[key];
  return hasOffPeak
    ? `${base}（${locale === "zh" ? "高峰价" : "peak-hour list price"}）`
    : base;
}

export function buildModelPricingJsonLd(
  modelKey: ModelKey,
  locale: Locale
): Record<string, unknown> {
  const content = getModelPricingContent(modelKey);
  const pathname = MODEL_PRICING_PATHS[modelKey];
  const url = buildLocaleUrl(locale, pathname);
  const name = MODEL_NAMES[modelKey][locale];
  const pricing = MODEL_PRICING[modelKey];
  const vendor = MODEL_VENDOR[modelKey];
  const hasOffPeak = typeof pricing.input !== "number";

  const tiers: { key: PriceTierKey; cell: PriceCell }[] = [
    { key: "input", cell: pricing.input },
    { key: "output", cell: pricing.output },
    { key: "cacheHit", cell: pricing.cacheHit },
  ];
  const rates = tiers.map((t) => priceCellHeadline(t.cell));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    inLanguage: locale,
    mainEntity: content.faq[locale].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    about: {
      "@type": "Product",
      "@id": `${url}#model`,
      name,
      url,
      description: content.description[locale],
      inLanguage: locale,
      brand: { "@type": "Brand", name: vendor.name },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: pricing.currency,
        lowPrice: String(Math.min(...rates)),
        highPrice: String(Math.max(...rates)),
        offerCount: tiers.length,
        priceSpecification: tiers.map((t) => ({
          "@type": "UnitPriceSpecification",
          name: priceTierLabels[t.key][locale],
          price: String(priceCellHeadline(t.cell)),
          priceCurrency: pricing.currency,
          description: buildPriceTierDescription(t.key, hasOffPeak, locale),
        })),
        availableAtOrFrom: {
          "@type": "Place",
          name: vendor.name,
          url: vendor.pricingUrl,
        },
      },
    },
  };
}

/**
 * 生成 Glossary 术语页的 FAQPage + Article JSON-LD
 *
 * 每个术语页注入 FAQPage（复用页面可见文案）与 Article
 * （标注定义与正文章节），帮助搜索引擎理解术语含义。
 */
export function buildGlossaryJsonLd(
  slug: GlossarySlug,
  locale: Locale
): Record<string, unknown> {
  const content = getGlossaryContent(slug);
  const pathname = GLOSSARY_PATHS[slug];
  const url = buildLocaleUrl(locale, pathname);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    inLanguage: locale,
    mainEntity: content.faq[locale].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    about: {
      "@type": "Article",
      headline: content.heroTitle[locale],
      description: content.description[locale],
      url,
      inLanguage: locale,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: {
        "@type": "Organization",
        name: "MindRose Team",
        url: MINDROSE_SITE_URL,
      },
    },
  };
}
