/**
 * 文件说明：博客文章元数据统一配置模块。
 *
 * 将博客页的标题、描述、日期、作者、关键词与路径集中管理，
 * 供页面可见内容、Metadata 和 JSON-LD 共同复用，避免多处手写后发生漂移。
 */

import translations, { type Locale } from "@/i18n/translations";

/** 支持结构化数据与 SEO 复用的博客文章 slug。 */
export type BlogArticleSlug =
  | "deepseek-context-caching-guide"
  | "deepseek-cost-optimization-tools"
  | "openai-claude-vs-deepseek-cost-comparison"
  | "opencode-go-cheapest-deepseek-v4-flash"
  | "deepseek-csv-export-format-changed-aug-2026"
  | "gpt-5.6-luna-vs-deepseek-v4-flash-value-champions";

type BlogTitleKey =
  | "article1Title"
  | "article2Title"
  | "article3Title"
  | "article4Title"
  | "article5Title"
  | "article6Title";
type BlogDescriptionKey =
  | "article1Desc"
  | "article2Desc"
  | "article3Desc"
  | "article4Desc"
  | "article5Desc"
  | "article6Desc";

interface BlogArticleDefinition {
  slug: BlogArticleSlug;
  pathname: string;
  titleKey: BlogTitleKey;
  descriptionKey: BlogDescriptionKey;
  author: string;
  publishedTime: string;
  modifiedTime: string;
  dateLabel: Record<Locale, string>;
  keywords: Record<Locale, string[]>;
}

/** 页面渲染、Metadata 与 JSON-LD 共用的单篇文章本地化元数据。 */
export interface BlogArticleLocaleMeta {
  slug: BlogArticleSlug;
  pathname: string;
  title: string;
  description: string;
  date: string;
  author: string;
  publishedTime: string;
  modifiedTime: string;
  keywords: string[];
}

/** 博客文章的稳定配置。 */
const BLOG_ARTICLES: Record<BlogArticleSlug, BlogArticleDefinition> = {
  "deepseek-context-caching-guide": {
    slug: "deepseek-context-caching-guide",
    pathname: "/blog/deepseek-context-caching-guide",
    titleKey: "article1Title",
    descriptionKey: "article1Desc",
    author: "Gavin Chen",
    publishedTime: "2026-07-04T00:00:00.000Z",
    modifiedTime: "2026-07-04T00:00:00.000Z",
    dateLabel: {
      en: "July 4, 2026",
      zh: "2026 年 7 月 4 日",
    },
    keywords: {
      en: [
        "DeepSeek context caching",
        "DeepSeek cache hit rate",
        "DeepSeek API cost optimization",
        "prompt caching guide",
      ],
      zh: [
        "DeepSeek 上下文缓存",
        "DeepSeek 缓存命中率",
        "DeepSeek API 成本优化",
        "Prompt 缓存指南",
      ],
    },
  },
  "deepseek-cost-optimization-tools": {
    slug: "deepseek-cost-optimization-tools",
    pathname: "/blog/deepseek-cost-optimization-tools",
    titleKey: "article2Title",
    descriptionKey: "article2Desc",
    author: "Gavin Chen",
    publishedTime: "2026-07-04T00:00:00.000Z",
    modifiedTime: "2026-07-04T00:00:00.000Z",
    dateLabel: {
      en: "July 4, 2026",
      zh: "2026 年 7 月 4 日",
    },
    keywords: {
      en: [
        "DeepSeek cost optimization tools",
        "DeepSeek API monitoring",
        "LLM observability",
        "Helicone",
        "Portkey",
        "LangFuse",
      ],
      zh: [
        "DeepSeek 成本优化工具",
        "DeepSeek API 监控",
        "LLM 可观测性",
        "Helicone",
        "Portkey",
        "LangFuse",
      ],
    },
  },
  "openai-claude-vs-deepseek-cost-comparison": {
    slug: "openai-claude-vs-deepseek-cost-comparison",
    pathname: "/blog/openai-claude-vs-deepseek-cost-comparison",
    titleKey: "article3Title",
    descriptionKey: "article3Desc",
    author: "Gavin Chen",
    publishedTime: "2026-07-04T00:00:00.000Z",
    modifiedTime: "2026-07-04T00:00:00.000Z",
    dateLabel: {
      en: "July 4, 2026",
      zh: "2026 年 7 月 4 日",
    },
    keywords: {
      en: [
        "DeepSeek vs OpenAI GPT",
        "DeepSeek vs Claude",
        "OpenAI GPT Pricing",
        "Claude Pricing",
        "DeepSeek V4 Pro",
        "LLM cost comparison",
        "AI pricing 2026",
      ],
      zh: [
        "DeepSeek vs OpenAI GPT",
        "DeepSeek vs Claude",
        "OpenAI GPT 定价",
        "Claude 定价",
        "DeepSeek V4 Pro",
        "大模型成本对比",
        "AI 定价 2026",
      ],
    },
  },
  "opencode-go-cheapest-deepseek-v4-flash": {
    slug: "opencode-go-cheapest-deepseek-v4-flash",
    pathname: "/blog/opencode-go-cheapest-deepseek-v4-flash",
    titleKey: "article4Title",
    descriptionKey: "article4Desc",
    author: "Gavin Chen",
    publishedTime: "2026-08-13T00:00:00.000Z",
    modifiedTime: "2026-08-13T00:00:00.000Z",
    dateLabel: {
      en: "August 13, 2026",
      zh: "2026 年 8 月 13 日",
    },
    keywords: {
      en: [
        "DeepSeek V4 Flash",
        "OpenCode Go",
        "cheap DeepSeek",
        "DeepSeek pricing",
        "AI coding subscription",
        "DeepSeek V4 Flash price",
        "cheapest LLM",
      ],
      zh: [
        "DeepSeek V4 Flash",
        "OpenCode Go",
        "便宜的 DeepSeek",
        "DeepSeek 定价",
        "AI 编程订阅",
        "DeepSeek V4 Flash 价格",
        "最便宜的大模型",
      ],
    },
  },
  "deepseek-csv-export-format-changed-aug-2026": {
    slug: "deepseek-csv-export-format-changed-aug-2026",
    pathname: "/blog/deepseek-csv-export-format-changed-aug-2026",
    titleKey: "article5Title",
    descriptionKey: "article5Desc",
    author: "Gavin Chen",
    publishedTime: "2026-08-17T00:00:00.000Z",
    modifiedTime: "2026-08-17T00:00:00.000Z",
    dateLabel: {
      en: "August 17, 2026",
      zh: "2026 年 8 月 17 日",
    },
    keywords: {
      en: [
        "DeepSeek CSV export format",
        "DeepSeek usage export",
        "DeepSeek billing CSV",
        "DeepSeek start_time_iso",
        "DeepSeek export format change",
        "DeepSeek CSV parser",
      ],
      zh: [
        "DeepSeek CSV 导出格式",
        "DeepSeek 用量导出",
        "DeepSeek 账单 CSV",
        "DeepSeek start_time_iso",
        "DeepSeek 导出格式变更",
        "DeepSeek CSV 解析",
      ],
    },
  },
  "gpt-5.6-luna-vs-deepseek-v4-flash-value-champions": {
    slug: "gpt-5.6-luna-vs-deepseek-v4-flash-value-champions",
    pathname: "/blog/gpt-5.6-luna-vs-deepseek-v4-flash-value-champions",
    titleKey: "article6Title",
    descriptionKey: "article6Desc",
    author: "Gavin Chen",
    publishedTime: "2026-08-17T00:00:00.000Z",
    modifiedTime: "2026-08-17T00:00:00.000Z",
    dateLabel: {
      en: "August 17, 2026",
      zh: "2026 年 8 月 17 日",
    },
    keywords: {
      en: [
        "GPT-5.6 Luna",
        "DeepSeek V4 Flash",
        "best value LLM",
        "cheap LLM",
        "LLM pricing 2026",
        "off-peak pricing",
        "LLM cost optimization",
        "GPT-5.6 Terra",
        "Claude Sonnet 5",
      ],
      zh: [
        "GPT-5.6 Luna",
        "DeepSeek V4 Flash",
        "性价比模型",
        "便宜的大模型",
        "大模型定价 2026",
        "闲时定价",
        "大模型成本优化",
        "GPT-5.6 Terra",
        "Claude Sonnet 5",
      ],
    },
  },
};

/**
 * 判断传入字符串是否为受支持的博客文章 slug。
 */
export function isBlogArticleSlug(slug: string): slug is BlogArticleSlug {
  return slug in BLOG_ARTICLES;
}

/**
 * 读取博客文章的稳定配置。
 */
export function getBlogArticleDefinition(
  slug: BlogArticleSlug,
): BlogArticleDefinition {
  return BLOG_ARTICLES[slug];
}

/**
 * 按语言读取博客文章可见内容与 SEO 共用元数据。
 */
export function getBlogArticleLocaleMeta(
  slug: BlogArticleSlug,
  locale: Locale,
): BlogArticleLocaleMeta {
  const article = getBlogArticleDefinition(slug);
  const blogIndexTranslations = translations[locale].blogIndex;

  return {
    slug: article.slug,
    pathname: article.pathname,
    title: blogIndexTranslations[article.titleKey],
    description: blogIndexTranslations[article.descriptionKey],
    date: article.dateLabel[locale],
    author: article.author,
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
    keywords: article.keywords[locale],
  };
}

/**
 * 按字符串 slug 安全读取博客文章元数据。
 */
export function findBlogArticleLocaleMeta(
  slug: string,
  locale: Locale,
): BlogArticleLocaleMeta | null {
  if (!isBlogArticleSlug(slug)) {
    return null;
  }

  return getBlogArticleLocaleMeta(slug, locale);
}
