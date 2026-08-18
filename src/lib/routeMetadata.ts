/**
 * 文件说明：页面路由 SEO Metadata 构建模块。
 *
 * 该模块集中承载所有 page.tsx 允许复用的 Metadata builder，
 * 避免在 Next.js 16 的 page 入口文件中导出额外命名成员，导致构建失败。
 */
import type { Metadata } from "next";
import type { Locale } from "@/i18n/translations";
import { getBlogArticleLocaleMeta } from "@/lib/blogArticles";
import { buildLocalizedPageMetadata } from "@/lib/pageMetadata";

/** 博客文章元数据构建参数。 */
interface BlogArticleMetadataInput {
  pathname: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  keywords: {
    en: string[];
    zh: string[];
  };
  publishedTime: string;
  modifiedTime: string;
}

/**
 * 构建博客文章通用 metadata。
 */
function buildBlogArticleMetadata(
  locale: Locale,
  input: BlogArticleMetadataInput
): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: input.pathname,
    title: input.title,
    description: input.description,
    keywords: {
      en: input.keywords.en,
      zh: input.keywords.zh,
    },
    openGraphType: "article",
    imageAlt: input.title,
    publishedTime: input.publishedTime,
    modifiedTime: input.modifiedTime,
  });
}

/**
 * 构建首页 metadata。
 */
export function buildHomeMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/",
    title: {
      en: "DeepSeek API Usage Analytics — Free CSV Dashboard",
      zh: "DeepSeek API 用量分析 — 免费 CSV 仪表盘",
    },
    description: {
      en: "Free DeepSeek API usage analytics. Upload billing CSVs for instant cost breakdowns, cache analysis, and per-key spend — all in your browser, no signup.",
      zh: "免费 DeepSeek API 费用追踪器。上传账单 CSV，即时查看费用拆分、缓存命中率分析和各 Key 支出明细——纯浏览器端处理，无需注册。",
    },
    keywords: {
      en: [
        "DeepSeek API usage analytics",
        "DeepSeek cost tracker",
        "DeepSeek token analysis",
        "API key cost breakdown",
        "DeepSeek cache hit rate",
        "LLM cost dashboard",
      ],
      zh: [
        "DeepSeek 用量分析",
        "DeepSeek API 费用追踪",
        "DeepSeek Token 分析",
        "API Key 成本拆分",
        "DeepSeek 缓存命中率",
        "大模型成本仪表盘",
      ],
    },
    imageAlt: {
      en: "DeepSeek API Usage Analytics Dashboard — free, private, open source",
      zh: "DeepSeek API 用量分析仪表盘：免费、隐私优先、开源",
    },
  });
}

/**
 * 构建指南页 metadata。
 */
export function buildGuidelineMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/guideline",
    title: {
      en: "DeepSeek API Usage Analytics — User Guide",
      zh: "DeepSeek API 用量分析仪表盘 — 用户指南",
    },
    description: {
      en: "Complete user guide for the DeepSeek API Usage Analytics Dashboard — export and upload CSVs, then explore every view step by step with screenshots.",
      zh: "DeepSeek API 用量分析仪表盘完整用户指南。通过分步说明和截图了解如何导出 CSV、上传文件以及浏览所有仪表盘视图。",
    },
    keywords: {
      en: [
        "DeepSeek usage guide",
        "DeepSeek API dashboard tutorial",
        "DeepSeek CSV export",
        "API cost analysis guide",
      ],
      zh: [
        "DeepSeek 使用指南",
        "DeepSeek API 仪表盘教程",
        "DeepSeek CSV 导出",
        "API 成本分析指南",
      ],
    },
    imageAlt: {
      en: "DeepSeek API Usage Analytics Dashboard user guide",
      zh: "DeepSeek API 用量分析仪表盘用户指南",
    },
  });
}

/**
 * 构建隐私政策页 metadata。
 */
export function buildPrivacyMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/privacy",
    title: {
      en: "Privacy Policy — DeepSeek API Usage Analytics Dashboard",
      zh: "隐私政策 — DeepSeek API 用量分析仪表盘",
    },
    description: {
      en: "Privacy Policy for the DeepSeek API Usage Analytics Dashboard — CSV processing is 100% local, nothing is uploaded, GA is opt-in. Built by Gavin & MindRose.",
      zh: "DeepSeek API 用量分析仪表盘隐私政策。了解我们如何处理数据：所有 CSV 处理均在本地完成，不上传文件，Google Analytics 为可选启用。",
    },
    keywords: {
      en: [
        "DeepSeek dashboard privacy",
        "API usage analytics privacy",
        "DeepSeek privacy policy",
      ],
      zh: ["DeepSeek 隐私政策", "API 用量分析隐私", "本地 CSV 处理 隐私"],
    },
    imageAlt: {
      en: "Privacy Policy — DeepSeek API Usage Analytics Dashboard",
      zh: "隐私政策 — DeepSeek API 用量分析仪表盘",
    },
  });
}

/**
 * 构建使用条款页 metadata。
 */
export function buildTermsMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/terms",
    title: {
      en: "Terms of Use — DeepSeek API Usage Analytics Dashboard",
      zh: "使用条款 — DeepSeek API 用量分析仪表盘",
    },
    description: {
      en: "Terms of Use for the DeepSeek API Usage Analytics Dashboard — open source, provided as-is, not affiliated with DeepSeek. Built by Gavin & MindRose Team.",
      zh: "DeepSeek API 用量分析仪表盘使用条款。软件按现状提供、无担保，与 DeepSeek 无隶属关系，由 Gavin 与 MindRose 团队维护。",
    },
    keywords: {
      en: [
        "DeepSeek dashboard terms",
        "open source analytics terms",
        "DeepSeek terms of use",
      ],
      zh: ["DeepSeek 使用条款", "开源分析工具 条款", "DeepSeek 仪表盘 条款"],
    },
    imageAlt: {
      en: "Terms of Use — DeepSeek API Usage Analytics Dashboard",
      zh: "使用条款 — DeepSeek API 用量分析仪表盘",
    },
  });
}

/**
 * 构建更新日志页 metadata。
 */
export function buildChangelogMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/changelog",
    title: {
      en: "Changelog — DeepSeek API Usage Analytics Dashboard",
      zh: "更新日志 — DeepSeek API 用量分析仪表盘",
    },
    description: {
      en: "Complete changelog for the DeepSeek API Usage Analytics Dashboard — new features, improvements, bug fixes, and dependencies across every release since v0.1.0.",
      zh: "DeepSeek API 用量分析仪表盘完整更新日志。追踪自 v0.1.0 以来的新增功能、改进优化、问题修复与依赖变更。",
    },
    keywords: {
      en: [
        "DeepSeek dashboard changelog",
        "API analytics release notes",
        "DeepSeek release history",
      ],
      zh: ["DeepSeek 更新日志", "API 分析工具 发布记录", "DeepSeek 仪表盘 版本历史"],
    },
    imageAlt: {
      en: "Changelog — DeepSeek API Usage Analytics Dashboard",
      zh: "更新日志 — DeepSeek API 用量分析仪表盘",
    },
  });
}

/**
 * 构建成本追踪落地页 metadata。
 */
export function buildCostTrackerMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/deepseek-api-cost-tracker",
    title: {
      en: "DeepSeek API Cost Tracker — Free CSV Dashboard | No Signup",
      zh: "DeepSeek API 费用追踪器 — 免费 CSV 仪表盘 | 无需注册",
    },
    description: {
      en: "Free DeepSeek API cost tracker — upload billing CSVs for daily costs, per-key attribution, cache hit rates, and project breakdowns, all processed locally.",
      zh: "免费 DeepSeek API 费用追踪器。上传账单 CSV，即时查看每日费用、按 Key 归因、缓存命中率和项目拆分——全部在浏览器本地处理。",
    },
    keywords: {
      en: [
        "DeepSeek API cost tracker",
        "DeepSeek billing dashboard",
        "DeepSeek cost analyzer",
        "DeepSeek API cost monitoring",
        "free DeepSeek cost tool",
      ],
      zh: [
        "DeepSeek API 费用追踪器",
        "DeepSeek 账单仪表盘",
        "DeepSeek 成本分析器",
        "DeepSeek API 成本监控",
        "免费 DeepSeek 成本工具",
      ],
    },
    imageAlt: {
      en: "DeepSeek API Cost Tracker — free, private, open source",
      zh: "DeepSeek API 费用追踪器：免费、隐私优先、开源",
    },
  });
}

/**
 * 构建缓存分析落地页 metadata。
 */
export function buildCacheAnalyzerMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/deepseek-cache-hit-rate-analyzer",
    title: {
      en: "DeepSeek Cache Hit Rate Analyzer — Optimize API Costs",
      zh: "DeepSeek 缓存命中率分析器 — 优化 API 成本",
    },
    description: {
      en: "Analyze your DeepSeek cache hit rate from billing CSVs — daily trends, per-key hits vs misses, and prompt tips to cut API costs by up to 90%.",
      zh: "从账单 CSV 分析 DeepSeek 缓存命中率。追踪每日趋势、各 Key 命中/未命中对比，获取 Prompt 工程优化技巧，最高可降低 90% API 成本。",
    },
    keywords: {
      en: [
        "DeepSeek cache hit rate",
        "DeepSeek context caching",
        "DeepSeek cache analysis",
        "improve DeepSeek caching",
        "DeepSeek API cost optimization",
      ],
      zh: [
        "DeepSeek 缓存命中率",
        "DeepSeek 上下文缓存",
        "DeepSeek 缓存分析",
        "提升 DeepSeek 缓存命中",
        "DeepSeek API 成本优化",
      ],
    },
    imageAlt: {
      en: "DeepSeek Cache Hit Rate Analyzer",
      zh: "DeepSeek 缓存命中率分析器",
    },
  });
}

/**
 * 构建定价计算器落地页 metadata。
 */
export function buildPricingCalculatorMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/deepseek-api-pricing-calculator",
    title: {
      en: "DeepSeek API Pricing Calculator — Compare 2026 Costs",
      zh: "DeepSeek API 价格计算器 — 即时比较模型成本",
    },
    description: {
      en: "Estimate your own DeepSeek API costs with an interactive calculator — adjust tokens, model, and cache hit rate for instant monthly estimates for your workload.",
      zh: "使用交互式价格计算器按你自己的用量估算 DeepSeek API 成本——调整 Token 数量、模型与缓存命中率，即时得到月度费用估算。",
    },
    keywords: {
      en: [
        "DeepSeek API pricing calculator",
        "DeepSeek token calculator",
        "DeepSeek cost estimate",
        "DeepSeek V4 Flash price",
        "LLM pricing tool",
      ],
      zh: [
        "DeepSeek API 价格计算器",
        "DeepSeek Token 计算器",
        "DeepSeek 成本估算",
        "DeepSeek V4 Flash 价格",
        "大模型定价工具",
      ],
    },
    imageAlt: {
      en: "DeepSeek API Pricing Calculator",
      zh: "DeepSeek API 价格计算器",
    },
  });
}

/**
 * 构建作者页 metadata。
 */
export function buildAuthorPageMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/author",
    title: {
      en: "About the Author — Gavin Chen & MindRose Team",
      zh: "关于作者 — Gavin Chen 与 MindRose 团队",
    },
    description: {
      en: "Learn who builds the DeepSeek API Usage Analytics Dashboard — Gavin Chen, the MindRose team, their public profiles, and the project background.",
      zh: "了解谁在构建 DeepSeek API 用量分析仪表盘。此作者页面介绍 Gavin Chen、MindRose 团队、公开资料链接与项目背景。",
    },
    keywords: {
      en: [
        "Gavin Chen",
        "MindRose Team",
        "DeepSeek API Usage Analytics author",
      ],
      zh: ["DeepSeek 用量分析 作者", "Gavin Chen", "MindRose 团队"],
    },
    openGraphType: "profile",
    imageAlt: {
      en: "Author page — DeepSeek API Usage Analytics Dashboard",
      zh: "作者页面 — DeepSeek API 用量分析仪表盘",
    },
  });
}

/**
 * 构建博客首页 metadata。
 */
export function buildBlogIndexMetadata(locale: Locale): Metadata {
  return buildLocalizedPageMetadata(locale, {
    pathname: "/blog",
    title: {
      en: "Blog — DeepSeek API Usage Analytics & Cost Optimization",
      zh: "博客 — DeepSeek API 用量分析与成本优化",
    },
    description: {
      en: "Deep dives into DeepSeek API cost optimization, context caching strategies, pricing comparisons, and developer tools. Brought to you by the MindRose team.",
      zh: "深入解读 DeepSeek API 成本优化、上下文缓存策略、价格对比与开发者工具，由 MindRose 团队提供。",
    },
    keywords: {
      en: [
        "DeepSeek API blog",
        "DeepSeek cost optimization",
        "LLM cost analysis",
        "API caching strategies",
        "AI pricing comparison",
      ],
      zh: [
        "DeepSeek 博客",
        "DeepSeek 成本优化",
        "大模型成本分析",
        "API 缓存策略",
        "AI 定价对比",
      ],
    },
    imageAlt: {
      en: "DeepSeek API blog",
      zh: "DeepSeek API 博客",
    },
  });
}

/**
 * 构建文章《DeepSeek Context Caching Guide》的 metadata。
 */
export function buildArticleCachingMetadata(locale: Locale): Metadata {
  const article = getBlogArticleLocaleMeta("deepseek-context-caching-guide", locale);
  const enArticle = getBlogArticleLocaleMeta("deepseek-context-caching-guide", "en");
  const zhArticle = getBlogArticleLocaleMeta("deepseek-context-caching-guide", "zh");

  return buildBlogArticleMetadata(locale, {
    pathname: article.pathname,
    title: {
      en: enArticle.title,
      zh: zhArticle.title,
    },
    description: {
      en: enArticle.description,
      zh: zhArticle.description,
    },
    keywords: {
      en: enArticle.keywords,
      zh: zhArticle.keywords,
    },
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
  });
}

/**
 * 构建文章《DeepSeek Cost Optimization Tools》的 metadata。
 */
export function buildArticleToolsMetadata(locale: Locale): Metadata {
  const article = getBlogArticleLocaleMeta("deepseek-cost-optimization-tools", locale);
  const enArticle = getBlogArticleLocaleMeta("deepseek-cost-optimization-tools", "en");
  const zhArticle = getBlogArticleLocaleMeta("deepseek-cost-optimization-tools", "zh");

  return buildBlogArticleMetadata(locale, {
    pathname: article.pathname,
    title: {
      en: enArticle.title,
      zh: zhArticle.title,
    },
    description: {
      en: enArticle.description,
      zh: zhArticle.description,
    },
    keywords: {
      en: enArticle.keywords,
      zh: zhArticle.keywords,
    },
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
  });
}

/**
 * 构建文章《DeepSeek V4 Flash on OpenCode Go》的 metadata。
 */
export function buildArticleOpencodeGoMetadata(locale: Locale): Metadata {
  const article = getBlogArticleLocaleMeta("opencode-go-cheapest-deepseek-v4-flash", locale);
  const enArticle = getBlogArticleLocaleMeta("opencode-go-cheapest-deepseek-v4-flash", "en");
  const zhArticle = getBlogArticleLocaleMeta("opencode-go-cheapest-deepseek-v4-flash", "zh");

  return buildBlogArticleMetadata(locale, {
    pathname: article.pathname,
    title: {
      en: enArticle.title,
      zh: zhArticle.title,
    },
    description: {
      en: enArticle.description,
      zh: zhArticle.description,
    },
    keywords: {
      en: enArticle.keywords,
      zh: zhArticle.keywords,
    },
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
  });
}

/**
 * 构建文章《OpenAI vs DeepSeek Cost Comparison》的 metadata。
 */
export function buildArticleOpenAiMetadata(locale: Locale): Metadata {
  const article = getBlogArticleLocaleMeta("openai-claude-vs-deepseek-cost-comparison", locale);
  const enArticle = getBlogArticleLocaleMeta("openai-claude-vs-deepseek-cost-comparison", "en");
  const zhArticle = getBlogArticleLocaleMeta("openai-claude-vs-deepseek-cost-comparison", "zh");

  return buildBlogArticleMetadata(locale, {
    pathname: article.pathname,
    title: {
      en: enArticle.title,
      zh: zhArticle.title,
    },
    description: {
      en: enArticle.description,
      zh: zhArticle.description,
    },
    keywords: {
      en: enArticle.keywords,
      zh: zhArticle.keywords,
    },
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
  });
}

/**
 * 构建文章《DeepSeek Changed Its Usage CSV Export Format》的 metadata。
 */
export function buildArticleCsvFormatMetadata(locale: Locale): Metadata {
  const article = getBlogArticleLocaleMeta("deepseek-csv-export-format-changed-aug-2026", locale);
  const enArticle = getBlogArticleLocaleMeta("deepseek-csv-export-format-changed-aug-2026", "en");
  const zhArticle = getBlogArticleLocaleMeta("deepseek-csv-export-format-changed-aug-2026", "zh");

  return buildBlogArticleMetadata(locale, {
    pathname: article.pathname,
    title: {
      en: enArticle.title,
      zh: zhArticle.title,
    },
    description: {
      en: enArticle.description,
      zh: zhArticle.description,
    },
    keywords: {
      en: enArticle.keywords,
      zh: zhArticle.keywords,
    },
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
  });
}

/**
 * 构建文章《GPT-5.6 Luna vs DeepSeek V4 Flash: 2026 性价比之王》的 metadata。
 */
export function buildArticleValueChampionsMetadata(locale: Locale): Metadata {
  const article = getBlogArticleLocaleMeta("gpt-5.6-luna-vs-deepseek-v4-flash-value-champions", locale);
  const enArticle = getBlogArticleLocaleMeta("gpt-5.6-luna-vs-deepseek-v4-flash-value-champions", "en");
  const zhArticle = getBlogArticleLocaleMeta("gpt-5.6-luna-vs-deepseek-v4-flash-value-champions", "zh");

  return buildBlogArticleMetadata(locale, {
    pathname: article.pathname,
    title: {
      en: enArticle.title,
      zh: zhArticle.title,
    },
    description: {
      en: enArticle.description,
      zh: zhArticle.description,
    },
    keywords: {
      en: enArticle.keywords,
      zh: zhArticle.keywords,
    },
    publishedTime: article.publishedTime,
    modifiedTime: article.modifiedTime,
  });
}
