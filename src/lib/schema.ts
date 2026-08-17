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
import { buildLocaleUrl } from "@/lib/localeRouting";
import { LOGO_IMAGE_URL } from "@/lib/site";
import { agnesProject, deepseekProject, TOOL_SERIES_NAME } from "@/lib/sisterProjects";

/* ------------------------------------------------------------------ */
/*  多语言翻译映射                                                       */
/* ------------------------------------------------------------------ */

/** 应用版本号，与 package.json 保持同步 */
const APP_VERSION = "0.9.0";

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

/**
 * BreadcrumbList JSON-LD Schema 翻译
 *
 * 面包屑导航的多语言名称映射。
 */
const breadcrumbSchema: Record<
  Locale,
  {
    home: string;
    guideline: string;
    privacy: string;
    terms: string;
    changelog: string;
    author: string;
  }
> = {
  en: {
    home: "DeepSeek API Usage Analytics Dashboard",
    guideline: "User Guide",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    changelog: "Changelog",
    author: "Author",
  },
  zh: {
    home: "DeepSeek API 用量分析仪表盘",
    guideline: "使用指南",
    privacy: "隐私政策",
    terms: "使用条款",
    changelog: "更新日志",
    author: "作者",
  },
};

/**
 * 根据 locale 生成 BreadcrumbList JSON-LD
 *
 * 包含站点所有主要页面的面包屑导航，
 * 帮助搜索引擎理解站点层级结构。
 */
export function buildBreadcrumbJsonLd(locale: Locale): Record<string, unknown> {
  const t = breadcrumbSchema[locale];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.home,
        item: buildLocaleUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.guideline,
        item: buildLocaleUrl(locale, "/guideline"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t.privacy,
        item: buildLocaleUrl(locale, "/privacy"),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: t.terms,
        item: buildLocaleUrl(locale, "/terms"),
      },
      {
        "@type": "ListItem",
        position: 5,
        name: t.changelog,
        item: buildLocaleUrl(locale, "/changelog"),
      },
      {
        "@type": "ListItem",
        position: 6,
        name: t.author,
        item: buildAuthorPageUrl(locale),
      },
    ],
  };
}

/** Organization Schema 翻译 */
const organizationSchema: Record<Locale, { name: string; description: string }> = {
  en: {
    name: "DeepSeek API Usage Analytics Dashboard by Gavin & Mindrose Team",
    description:
      "Free, open-source, browser-side dashboard for DeepSeek API usage analytics. Drop your monthly CSVs and get instant cost analysis.",
  },
  zh: {
    name: "DeepSeek API 用量分析仪表盘 by Gavin & Mindrose Team",
    description:
      "免费、开源、纯浏览器端的 DeepSeek API 用量分析仪表盘。拖拽月度 CSV 即可获取即时费用分析。",
  },
};

/**
 * 根据 locale 生成 Organization JSON-LD
 *
 * 帮助 Google 建立品牌实体识别（Knowledge Panel），
 * 通过 sameAs 链接关联 GitHub 等外部平台。
 */
export function buildOrganizationJsonLd(locale: Locale): Record<string, unknown> {
  const t = organizationSchema[locale];
  const sameAs = Array.from(
    new Set([
      deepseekProject.githubUrl,
      agnesProject.siteUrl,
    ])
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t.name,
    url: buildLocaleUrl(locale, "/"),
    logo: LOGO_IMAGE_URL,
    description: t.description,
    inLanguage: locale,
    sameAs,
    brand: TOOL_SERIES_NAME,
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
