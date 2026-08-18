/**
 * 文件说明：单模型定价 SEO 落地页共享组件。
 *
 * 通过 modelKey 读取 @/lib/modelPricing 的价格数据与
 * @/lib/content/modelPricingContent 的模型专属文案，
 * 渲染一个完整的模型定价页（价格表、关键事实、计费说明、FAQ、相关页面）。
 * 同一组件服务全部 8 个模型的独立路由。
 */
"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { trackLandingCTA } from "@/lib/analytics";
import { buildLocalePath } from "@/lib/localeRouting";
import {
  MODEL_KEYS,
  MODEL_NAMES,
  MODEL_PRICING,
  MODEL_PRICING_PATHS,
  type ModelKey,
} from "@/lib/modelPricing";
import { getModelPricingContent } from "@/lib/content/modelPricingContent";
import { buildModelPricingJsonLd } from "@/lib/schema";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";

/** UTM 参数：将落地页 CTA 转化归因到具体模型页。 */
const MODEL_UTM: Record<ModelKey, string> = {
  v4Flash: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_v4_flash",
  v4Pro: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_v4_pro",
  gpt56Sol: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_gpt56_sol",
  gpt56Terra: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_gpt56_terra",
  gpt56Luna: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_gpt56_luna",
  claudeOpus5: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_claude_opus5",
  claudeSonnet5: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_claude_sonnet5",
  claudeHaiku45: "utm_source=deepseek-usage.xyz&utm_medium=referral&utm_campaign=model_claude_haiku45",
};

/** 将价格单元渲染为显示文本（保留高峰/闲时双价）。 */
function priceLabel(cell: number | { peak: number; offpeak: number }, currency: "CNY" | "USD", locale: "en" | "zh"): string {
  const symbol = currency === "CNY" ? "¥" : "$";
  const fmt = (v: number) => (v === 0 ? `${symbol}0` : `${symbol}${v.toFixed(2)}`);
  if (typeof cell === "number") return fmt(cell);
  return `${locale === "zh" ? "高峰" : "Peak"} ${fmt(cell.peak)} · ${locale === "zh" ? "闲时" : "Off-peak"} ${fmt(cell.offpeak)}`;
}

/**
 * 单模型定价落地页
 */
export function ModelPricingPage({ modelKey }: { modelKey: ModelKey }) {
  const { locale, t } = useTranslation();
  const content = getModelPricingContent(modelKey);
  const pricing = MODEL_PRICING[modelKey];
  const name = MODEL_NAMES[modelKey][locale];
  const homeHref = buildLocalePath("/", locale);
  const calculatorHref = buildLocalePath("/deepseek-api-pricing-calculator", locale);
  const homeCtaHref = buildLocalePath(`/?${MODEL_UTM[modelKey]}`, locale);

  const related = MODEL_KEYS.filter((k) => k !== modelKey);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* 注入页面专属结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildModelPricingJsonLd(modelKey, locale)),
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
            {t.modelPricing.badge}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {content.heroTitle[locale]}
          </h1>
          <p
            className="text-lg font-medium mb-4 max-w-xl"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {content.heroSubtitle[locale]}
          </p>
          <p
            className="text-base leading-relaxed text-pretty mb-6 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {content.intro[locale]}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={homeCtaHref}
              onClick={() => trackLandingCTA("pricing_calculator", "hero")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
            >
              {t.modelPricing.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {t.modelPricing.updatedAsOf}
            </span>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 价格表 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.modelPricing.pricePerMillionTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {name} · {pricing.currency === "CNY" ? "CNY" : "USD"}{" "}
            {locale === "zh" ? "官方单价" : "official list price"}
          </p>
          <div className="rounded-subtle overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {locale === "zh" ? "类型" : "Tier"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {locale === "zh" ? "单价" : "Rate"}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--text-primary)" }}>
                    {t.modelPricing.inputLabel}
                  </td>
                  <td className="py-3 px-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {priceLabel(pricing.input, pricing.currency, locale)}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--text-primary)" }}>
                    {t.modelPricing.outputLabel}
                  </td>
                  <td className="py-3 px-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {priceLabel(pricing.output, pricing.currency, locale)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--text-primary)" }}>
                    {t.modelPricing.cacheHitLabel}
                  </td>
                  <td className="py-3 px-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {priceLabel(pricing.cacheHit, pricing.currency, locale)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-pretty" style={{ color: "var(--text-tertiary)" }}>
            {t.modelPricing.cnyNote}
          </p>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 关键事实 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {content.bestForTitle[locale]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {content.facts[locale].map((fact, idx) => (
              <div
                key={fact.title}
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
                  {fact.title}
                </h3>
                <p className="text-xs leading-relaxed text-pretty" style={{ color: "var(--text-secondary)" }}>
                  {fact.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 适合场景 */}
        <section className="mb-16">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            {t.modelPricing.bestForBadge}
          </span>
          <p
            className="text-sm leading-relaxed text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {content.bestFor[locale]}
          </p>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 计费说明 */}
        <section className="mb-16">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            {t.modelPricing.pricingNoteBadge}
          </span>
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {content.pricingNoteTitle[locale]}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {content.pricingNote[locale]}
          </p>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 与竞品对比 */}
        <section className="mb-16">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--accent)" }}
          >
            {t.modelPricing.vsBadge}
          </span>
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {content.vsTitle[locale]}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {content.vs[locale]}
          </p>
        </section>

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

        {/* 相关模型定价 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.modelPricing.relatedTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.modelPricing.relatedDesc}
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map((k) => (
              <Link
                key={k}
                href={buildLocalePath(MODEL_PRICING_PATHS[k], locale)}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-80"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
              >
                {MODEL_NAMES[k][locale]}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 计算器 CTA */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.modelPricing.calculatorTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-5 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.modelPricing.calculatorDesc}
          </p>
          <Link
            href={calculatorHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: "var(--text-primary)", color: "var(--accent-inverse)" }}
          >
            {t.modelPricing.calculatorLink}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>
      </div>

      <RecommendedToolsSection maxWidth="3xl" />
      <FooterBar />
    </div>
  );
}
