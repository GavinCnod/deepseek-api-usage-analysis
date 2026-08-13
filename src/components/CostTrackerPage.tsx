/** 文件说明：DeepSeek API Cost Tracker SEO 落地页，包含产品卖点、场景说明、对比表与 FAQ。 */
"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { trackLandingCTA } from "@/lib/analytics";
import { buildLocalePath } from "@/lib/localeRouting";
import AffiliateWall from "./AffiliateWall";
import JsonLd from "./JsonLd";
import { buildCostTrackerSoftwareAppJsonLd, buildCostTrackerFaqJsonLd } from "@/lib/schema";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";

/** UTM 参数：将落地页 CTA 转化归因到本页面 */
const UTM =
  "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=landing_cost_tracker";
const HOME_CTA = `/?${UTM}`;

/**
 * DeepSeek API Cost Tracker 落地页
 *
 * 独立 SEO 落地页，捕获 "deepseek api cost tracker" 等搜索意图。
 * Apple 极简风格，与主应用一致。含商业化推荐模块占位（Portkey/Helicone 联盟链接）。
 */
export function CostTrackerPage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);
  const homeCtaHref = buildLocalePath(HOME_CTA, locale);

  const features = [
    { title: t.costTracker.feature1Title, desc: t.costTracker.feature1Desc },
    { title: t.costTracker.feature2Title, desc: t.costTracker.feature2Desc },
    { title: t.costTracker.feature3Title, desc: t.costTracker.feature3Desc },
    { title: t.costTracker.feature4Title, desc: t.costTracker.feature4Desc },
  ];
  const useCases = [
    { title: t.costTracker.useCase1Title, desc: t.costTracker.useCase1Desc },
    { title: t.costTracker.useCase2Title, desc: t.costTracker.useCase2Desc },
    { title: t.costTracker.useCase3Title, desc: t.costTracker.useCase3Desc },
  ];
  const comparisons = [
    {
      label: t.costTracker.comparisonRow1Label,
      bestFor: t.costTracker.comparisonRow1BestFor,
      tradeoff: t.costTracker.comparisonRow1Tradeoff,
    },
    {
      label: t.costTracker.comparisonRow2Label,
      bestFor: t.costTracker.comparisonRow2BestFor,
      tradeoff: t.costTracker.comparisonRow2Tradeoff,
    },
    {
      label: t.costTracker.comparisonRow3Label,
      bestFor: t.costTracker.comparisonRow3BestFor,
      tradeoff: t.costTracker.comparisonRow3Tradeoff,
    },
  ];
  const faqItems = [
    { question: t.costTracker.faq1Q, answer: t.costTracker.faq1A },
    { question: t.costTracker.faq2Q, answer: t.costTracker.faq2A },
    { question: t.costTracker.faq3Q, answer: t.costTracker.faq3A },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* 注入页面专属结构化数据 */}
      <JsonLd data={buildCostTrackerSoftwareAppJsonLd(locale)} />
      <JsonLd data={buildCostTrackerFaqJsonLd(locale)} />
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
          {t.costTracker.backToHome}
        </Link>

        {/* Hero */}
        <section className="mb-16">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-4 px-2.5 py-1 rounded-full"
            style={{
              color: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            {t.costTracker.badge}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            {t.costTracker.heroTitle}
          </h1>
          <p
            className="text-lg font-medium mb-4 max-w-xl"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {locale === "zh"
              ? "免费 DeepSeek API 费用追踪器 — 上传 CSV，秒级分析"
              : "Free DeepSeek API Cost Tracker — Upload CSV, Instant Analysis"}
          </p>
          <p
            className="text-base leading-relaxed text-pretty mb-6 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.costTracker.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={homeCtaHref}
              onClick={() => trackLandingCTA("cost_tracker", "hero")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                background: "var(--text-primary)",
                color: "var(--accent-inverse)",
              }}
            >
              {t.costTracker.cta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <span
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              {t.costTracker.privacyBadge}
            </span>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* Features */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f, idx) => (
              <div key={idx}>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.desc}
                  {idx === 2 && (
                    <span className="block mt-2">
                      <Link
                        href={buildLocalePath("/deepseek-cache-hit-rate-analyzer", locale)}
                        className="inline-flex items-center gap-1 font-medium hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {locale === "zh" ? "深入分析缓存命中率" : "Deep dive into cache hit rate"}
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

        {/* 真实使用场景 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.costTracker.useCasesTitle}
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {useCases.map((item) => (
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

        {/* 方案对比 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.costTracker.comparisonTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.costTracker.comparisonDesc}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th className="text-left py-2 pr-4" style={{ color: "var(--text-primary)" }}>
                    {t.costTracker.comparisonHeaderTool}
                  </th>
                  <th className="text-left py-2 px-3" style={{ color: "var(--text-secondary)" }}>
                    {t.costTracker.comparisonHeaderBestFor}
                  </th>
                  <th className="text-left py-2 pl-3" style={{ color: "var(--text-secondary)" }}>
                    {t.costTracker.comparisonHeaderTradeoff}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item) => (
                  <tr key={item.label} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.label}
                    </td>
                    <td className="py-3 px-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {item.bestFor}
                    </td>
                    <td className="py-3 pl-3 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                      {item.tradeoff}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* Bottom CTA */}
        <section className="mb-16 text-center">
          <h2
            className="text-xl font-bold tracking-tight mb-3"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.costTracker.bottomCTA}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.costTracker.bottomCTADesc}
          </p>
          <a
            href={homeCtaHref}
            onClick={() => trackLandingCTA("cost_tracker", "bottom")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              background: "var(--text-primary)",
              color: "var(--accent-inverse)",
            }}
          >
            {t.costTracker.cta}
          </a>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* FAQ */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.costTracker.faqTitle}
          </h2>
          <div className="space-y-5">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.question}
                </h3>
                <p
                  className="text-sm leading-relaxed text-pretty"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* Recommended Tools (商业化模块) */}
        <section className="mb-16">  
          <h2
            className="text-sm font-semibold mb-3"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {t.costTracker.recommendedUsingTools}
          </h2>
          <p
            className="text-xs leading-relaxed text-pretty mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t.costTracker.recommendedUsingDes}
          </p>
          <AffiliateWall ids={["opencode-go","vultr", "railway", "tencent-cloud", "silicon-flow", "warp"]} />
        </section>
      </div>

      <FooterBar />
    </div>
  );
}
