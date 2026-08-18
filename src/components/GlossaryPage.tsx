/**
 * 文件说明：Glossary「什么是 X」SEO 落地页共享组件。
 *
 * 通过 slug 读取 @/lib/content/glossaryContent 的术语文案，
 * 渲染定义、正文章节、FAQ 与相关页面链接。
 */
"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { trackLandingCTA } from "@/lib/analytics";
import { buildLocalePath } from "@/lib/localeRouting";
import {
  getGlossaryContent,
  GLOSSARY_NAMES,
  GLOSSARY_PATHS,
  GLOSSARY_SLUGS,
  type GlossarySlug,
} from "@/lib/content/glossaryContent";
import { buildGlossaryJsonLd } from "@/lib/schema";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";

/** UTM 参数：将落地页 CTA 转化归因到具体术语页。 */
const GLOSSARY_UTM: Record<GlossarySlug, string> = {
  "what-is-deepseek-cache-hit-rate": "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=glossary_cache_hit_rate",
  "what-is-deepseek-context-caching": "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=glossary_context_caching",
  "what-is-deepseek-off-peak-pricing": "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=glossary_off_peak_pricing",
};

/** 每个术语对应的相关工具页链接。 */
const GLOSSARY_TOOL_LINK: Record<GlossarySlug, { path: string; labelKey: "costTracker" | "cacheAnalyzer" | "pricingCalculator" }> = {
  "what-is-deepseek-cache-hit-rate": { path: "/deepseek-cache-hit-rate-analyzer", labelKey: "cacheAnalyzer" },
  "what-is-deepseek-context-caching": { path: "/deepseek-cache-hit-rate-analyzer", labelKey: "cacheAnalyzer" },
  "what-is-deepseek-off-peak-pricing": { path: "/deepseek-api-pricing-calculator", labelKey: "pricingCalculator" },
};

/** 每个术语对应的相关博客文章链接。 */
const GLOSSARY_BLOG_LINK: Record<GlossarySlug, { path: string; title: { en: string; zh: string } }> = {
  "what-is-deepseek-cache-hit-rate": {
    path: "/blog/deepseek-context-caching-guide",
    title: { en: "DeepSeek Context Caching Guide", zh: "DeepSeek 上下文缓存指南" },
  },
  "what-is-deepseek-context-caching": {
    path: "/blog/deepseek-context-caching-guide",
    title: { en: "DeepSeek Context Caching Guide", zh: "DeepSeek 上下文缓存指南" },
  },
  "what-is-deepseek-off-peak-pricing": {
    path: "/blog/gpt-5.6-luna-vs-deepseek-v4-flash-value-champions",
    title: { en: "The 2026 Value Champions", zh: "2026 价值冠军" },
  },
};

/**
 * Glossary 术语落地页
 */
export function GlossaryPage({ slug }: { slug: GlossarySlug }) {
  const { locale, t } = useTranslation();
  const content = getGlossaryContent(slug);
  const homeHref = buildLocalePath("/", locale);
  const homeCtaHref = buildLocalePath(`/?${GLOSSARY_UTM[slug]}`, locale);

  const related = GLOSSARY_SLUGS.filter((s) => s !== slug);
  const toolLink = GLOSSARY_TOOL_LINK[slug];
  const blogLink = GLOSSARY_BLOG_LINK[slug];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* 注入页面专属结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildGlossaryJsonLd(slug, locale)),
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.modelPricing.backToHome}
        </Link>

        {/* Hero */}
        <section className="mb-16">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-4 px-2.5 py-1 rounded-full"
            style={{ color: "var(--accent)", border: "1px solid var(--border)" }}
          >
            {locale === "zh" ? "术语指南" : "Glossary"}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {content.heroTitle[locale]}
          </h1>
          <p
            className="text-base leading-relaxed text-pretty mb-6 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {content.definition[locale]}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={homeCtaHref}
              onClick={() => trackLandingCTA("pricing_calculator", "hero")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
            >
              {locale === "zh" ? "分析我的 DeepSeek 用量" : "Analyze My DeepSeek Usage"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {locale === "zh" ? "100% 本地处理，数据不出浏览器" : "100% private — data never leaves your browser"}
            </span>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 正文章节 */}
        {content.sections[locale].map((section) => (
          <section key={section.heading} className="mb-16">
            <h2
              className="text-lg font-bold tracking-tight mb-3"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p
                key={p}
                className="text-sm leading-relaxed text-pretty mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* FAQ */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.modelPricing.faqTitle}
          </h2>
          <div className="space-y-5">
            {content.faq[locale].map((item) => (
              <div key={item.q}>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.q}
                </h3>
                <p
                  className="text-sm leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 相关工具 + 文章 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {locale === "zh" ? "深入阅读" : "Dive deeper"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Link
              href={buildLocalePath(toolLink.path, locale)}
              className="block p-5 rounded-subtle transition-all duration-200 hover:opacity-90"
              style={{ border: "1px solid var(--border)" }}
            >
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t[toolLink.labelKey].pageTitle}
              </h3>
              <p
                className="text-xs leading-relaxed text-pretty"
                style={{ color: "var(--text-secondary)" }}
              >
                {locale === "zh" ? "用免费工具测量并优化你的指标 →" : "Measure and optimize this metric with the free tool →"}
              </p>
            </Link>
            <Link
              href={buildLocalePath(blogLink.path, locale)}
              className="block p-5 rounded-subtle transition-all duration-200 hover:opacity-90"
              style={{ border: "1px solid var(--border)" }}
            >
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {blogLink.title[locale]}
              </h3>
              <p
                className="text-xs leading-relaxed text-pretty"
                style={{ color: "var(--text-secondary)" }}
              >
                {locale === "zh" ? "阅读完整指南 →" : "Read the full guide →"}
              </p>
            </Link>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 相关术语 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {locale === "zh" ? "相关术语" : "Related terms"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((s) => (
              <Link
                key={s}
                href={buildLocalePath(GLOSSARY_PATHS[s], locale)}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-80"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                {GLOSSARY_NAMES[s][locale]}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <RecommendedToolsSection maxWidth="3xl" />
      <FooterBar />
    </div>
  );
}

/** 导出名称映射供其他组件复用。 */
export { GLOSSARY_NAMES, GLOSSARY_PATHS, GLOSSARY_SLUGS };
