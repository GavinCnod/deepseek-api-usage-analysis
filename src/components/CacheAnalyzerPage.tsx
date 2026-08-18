/** 文件说明：DeepSeek 缓存命中率 SEO 落地页，包含缓存机制说明、经验基准、优化策略与诊断内容。 */
"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { trackLandingCTA, trackOutboundClick } from "@/lib/analytics";
import { buildLocalePath } from "@/lib/localeRouting";
import { buildCacheAnalyzerSoftwareAppJsonLd } from "@/lib/schema";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";

/** UTM 参数：将落地页 CTA 转化归因到本页面 */
const UTM =
  "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=landing_cache_analyzer";
const HOME_CTA = `/?${UTM}`;

/**
 * DeepSeek Cache Hit Rate Analyzer 落地页
 *
 * 独立 SEO 落地页，捕获 "deepseek cache hit rate analysis" 搜索意图。
 * 包含缓存机制教育模块和 MindRose 商业导流 CTA。
 */
export function CacheAnalyzerPage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);
  const homeCtaHref = buildLocalePath(HOME_CTA, locale);

  const tips = [
    { title: t.cacheAnalyzer.cachingTip1Title, desc: t.cacheAnalyzer.cachingTip1Desc },
    { title: t.cacheAnalyzer.cachingTip2Title, desc: t.cacheAnalyzer.cachingTip2Desc },
    { title: t.cacheAnalyzer.cachingTip3Title, desc: t.cacheAnalyzer.cachingTip3Desc },
  ];
  const benchmarks = [
    { title: t.cacheAnalyzer.benchmark1Title, desc: t.cacheAnalyzer.benchmark1Desc },
    { title: t.cacheAnalyzer.benchmark2Title, desc: t.cacheAnalyzer.benchmark2Desc },
    { title: t.cacheAnalyzer.benchmark3Title, desc: t.cacheAnalyzer.benchmark3Desc },
    { title: t.cacheAnalyzer.benchmark4Title, desc: t.cacheAnalyzer.benchmark4Desc },
  ];
  const strategies = [
    { title: t.cacheAnalyzer.strategy1Title, desc: t.cacheAnalyzer.strategy1Desc },
    { title: t.cacheAnalyzer.strategy2Title, desc: t.cacheAnalyzer.strategy2Desc },
    { title: t.cacheAnalyzer.strategy3Title, desc: t.cacheAnalyzer.strategy3Desc },
  ];
  const diagnosisItems = [
    { title: t.cacheAnalyzer.diagnosis1Title, desc: t.cacheAnalyzer.diagnosis1Desc },
    { title: t.cacheAnalyzer.diagnosis2Title, desc: t.cacheAnalyzer.diagnosis2Desc },
    { title: t.cacheAnalyzer.diagnosis3Title, desc: t.cacheAnalyzer.diagnosis3Desc },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* 注入页面专属结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCacheAnalyzerSoftwareAppJsonLd(locale)),
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
          {t.cacheAnalyzer.backToHome}
        </Link>

        {/* Hero */}
        <section className="mb-16">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-4 px-2.5 py-1 rounded-full"
            style={{ color: "var(--accent)", border: "1px solid var(--border)" }}
          >
            {t.cacheAnalyzer.badge}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {t.cacheAnalyzer.heroTitle}
          </h1>
          <p
            className="text-lg font-medium mb-4 max-w-xl"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {locale === "zh"
              ? "免费 DeepSeek 缓存命中率分析器 — 上传 CSV，秒级诊断"
              : "Free DeepSeek Cache Hit Rate Analyzer — Upload CSV, Instant Diagnosis"}
          </p>
          <p
            className="text-base leading-relaxed text-pretty mb-6 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.cacheAnalyzer.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={homeCtaHref}
              onClick={() => trackLandingCTA("cache_analyzer", "hero")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
            >
              {t.cacheAnalyzer.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {t.cacheAnalyzer.privacyBadge}
            </span>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* Cache 机制解释 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.cacheAnalyzer.cachingExplainerTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.cacheAnalyzer.cachingExplainerDesc}
          </p>

          {/* 3 个优化技巧 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 rounded-subtle"
                style={{ border: "1px solid var(--border)" }}
              >
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mb-3"
                  style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
                >
                  {idx + 1}
                </span>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                >
                  {tip.title}
                </h3>
                <p
                  className="text-xs leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 命中率经验基准 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.cacheAnalyzer.benchmarkTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.cacheAnalyzer.benchmarkDesc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benchmarks.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-subtle"
                style={{ border: "1px solid var(--border)" }}
              >
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 更多优化策略 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.cacheAnalyzer.strategyTitle}
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {strategies.map((item, idx) => (
              <div key={item.title}>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.desc}
                  {idx === strategies.length - 1 && (
                    <span className="block mt-2">
                      <Link
                        href={buildLocalePath("/blog/deepseek-context-caching-guide", locale)}
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {locale === "zh" ? "阅读完整上下文缓存指南" : "Read the full context caching guide"}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 工具功能亮点 */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {t.cacheAnalyzer.feature1Title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {t.cacheAnalyzer.feature1Desc}
              </p>
              <span className="block mt-2">
                <Link
                  href={buildLocalePath("/deepseek-api-cost-tracker", locale)}
                  className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {locale === "zh" ? "用费用追踪器查看对应花费" : "See the matching spend in the cost tracker"}
                  <span aria-hidden="true">→</span>
                </Link>
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {t.cacheAnalyzer.feature2Title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {t.cacheAnalyzer.feature2Desc}
              </p>
              <span className="block mt-2">
                <Link
                  href={buildLocalePath("/deepseek-api-pricing-calculator", locale)}
                  className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {locale === "zh" ? "用定价计算器量化你的节省" : "Quantify your savings with the pricing calculator"}
                  <span aria-hidden="true">→</span>
                </Link>
              </span>
            </div>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 命中率下滑诊断 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.cacheAnalyzer.diagnosisTitle}
          </h2>
          <div className="space-y-5">
            {diagnosisItems.map((item) => (
              <div key={item.title}>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* MindRose 导流 CTA */}
        <section className="mb-16 text-center">
          <h2
            className="text-xl font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.cacheAnalyzer.bottomCTATitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.cacheAnalyzer.bottomCTADesc}
          </p>
          <a
            href="mailto:hello@mindrose.xyz"
            onClick={() => trackOutboundClick("cache_analyzer", "mindrose")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
          >
            {t.cacheAnalyzer.bottomCTALink}
          </a>
        </section>
      </div>

      <RecommendedToolsSection maxWidth="3xl" />
      <FooterBar />
    </div>
  );
}
