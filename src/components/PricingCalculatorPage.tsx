/** 文件说明：DeepSeek API 定价计算器 SEO 落地页，包含交互式估算器、计费模型说明与竞品对比。 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";
import { buildPricingCalculatorSoftwareAppJsonLd } from "@/lib/schema";
import { formatTokens } from "@/lib/format";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";

/** 单个计价单元：固定价（竞品）或 高峰/闲时 双价（DeepSeek 新定价） */
type PriceCell = number | { peak: number; offpeak: number };

type ModelPricing = {
  input: PriceCell;
  output: PriceCell;
  cacheHit: PriceCell;
  /** 价格基准货币：DeepSeek 官方价按 CNY 维护，竞品按 USD 维护 */
  currency: "CNY" | "USD";
};

const CNY_PER_USD = 6.9;

/**
 * DeepSeek 定价 (CNY/百万 tokens，按高峰/闲时) + 竞品定价 (USD/百万 tokens)
 *
 * 高峰时段：北京时间 9:00–12:00、14:00–18:00；其余为闲时，价格减半。
 */
const PRICING: Record<string, ModelPricing> = {
  v4Flash: {
    input: { peak: 3.0, offpeak: 1.5 },
    output: { peak: 9.0, offpeak: 4.5 },
    cacheHit: { peak: 0.1, offpeak: 0.05 },
    currency: "CNY",
  },
  v4Pro: {
    input: { peak: 9.0, offpeak: 4.5 },
    output: { peak: 27.0, offpeak: 13.5 },
    cacheHit: { peak: 0.3, offpeak: 0.15 },
    currency: "CNY",
  },
  gpt56Sol: { input: 5.0, output: 30.0, cacheHit: 0.5, currency: "USD" },
  gpt56Terra: { input: 2.0, output: 12.0, cacheHit: 0.2, currency: "USD" },
  gpt56Luna: { input: 0.2, output: 1.2, cacheHit: 0.02, currency: "USD" },
  claudeOpus5: { input: 5.0, output: 25.0, cacheHit: 0.5, currency: "USD" },
  claudeSonnet5: { input: 2.0, output: 10.0, cacheHit: 0.2, currency: "USD" },
  claudeHaiku45: { input: 1.0, output: 5.0, cacheHit: 0.1, currency: "USD" },
};

/** 高峰/闲时混合后的有效单价 (忙时占比为 0–1) */
function effectivePrice(cell: PriceCell, share: number): number {
  return typeof cell === "number" ? cell : cell.offpeak + (cell.peak - cell.offpeak) * share;
}

/**
 * 格式化成本显示 (支持 CNY/USD 切换)
 */
function formatMoney(
  value: number,
  from: "CNY" | "USD",
  to: "CNY" | "USD",
  locale: string
): string {
  const val = from === to ? value : from === "CNY" ? value / CNY_PER_USD : value * CNY_PER_USD;
  const symbol = to === "USD" ? "$" : "¥";

  if (val === 0) return `${symbol}0.00`;
  if (val < 0.01) return `<${symbol}0.01`;

  if (locale === "zh") {
    if (val >= 100000000) {
      return `${symbol}${Number((val / 100000000).toFixed(2))}亿`;
    }
    if (val >= 10000) {
      return `${symbol}${Number((val / 10000).toFixed(2))}万`;
    }
    return `${symbol}${val.toFixed(2)}`;
  }

  if (val < 1000) return `${symbol}${val.toFixed(2)}`;
  if (val < 1000000) return `${symbol}${(val / 1000).toFixed(1)}K`;
  return `${symbol}${(val / 1000000).toFixed(1)}M`;
}

/**
 * DeepSeek API Pricing Calculator 落地页
 *
 * 独立 SEO 落地页，捕获 "deepseek api pricing calculator" 搜索意图。
 * 包含交互式计算器 + 竞品对比表 + Vultr 联盟导流 CTA。
 */
export function PricingCalculatorPage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);

  const [inputTokens, setInputTokens] = useState(10_000_000); // 10M
  const [outputTokens, setOutputTokens] = useState(1_000_000); // 1M
  const [cacheHitRate, setCacheHitRate] = useState(40); // 40%
  const [peakShare, setPeakShare] = useState(40); // 40% 高峰占比
  const [currency, setCurrency] = useState<"CNY" | "USD">("CNY");

  const inputM = inputTokens / 1_000_000;
  const outputM = outputTokens / 1_000_000;
  const cacheFraction = cacheHitRate / 100;
  const peakFraction = peakShare / 100;

  /** 根据输入、输出、缓存命中率和高峰占比估算某个模型的月度成本。 */
  const calcCost = (p: ModelPricing, share: number) => {
    const cachedInput = inputM * cacheFraction * effectivePrice(p.cacheHit, share);
    const uncachedInput = inputM * (1 - cacheFraction) * effectivePrice(p.input, share);
    const outputCost = outputM * effectivePrice(p.output, share);
    return cachedInput + uncachedInput + outputCost;
  };

  const modelsData = [
    { key: "v4Flash", name: t.pricingCalculator.deepseekV4Flash, pricing: PRICING.v4Flash, color: "var(--positive)", notes: t.pricingCalculator.peakWindowNote },
    { key: "v4Pro", name: t.pricingCalculator.deepseekV4Pro, pricing: PRICING.v4Pro, color: "var(--positive)", notes: t.pricingCalculator.peakWindowNote },
    { key: "gpt56Sol", name: "GPT-5.6 Sol", pricing: PRICING.gpt56Sol, color: "var(--danger)", notes: "—" },
    { key: "gpt56Terra", name: "GPT-5.6 Terra", pricing: PRICING.gpt56Terra, color: "var(--danger)", notes: "—" },
    { key: "gpt56Luna", name: "GPT-5.6 Luna", pricing: PRICING.gpt56Luna, color: "var(--text-primary)", notes: "—" },
    { key: "claudeOpus5", name: "Claude Opus 5", pricing: PRICING.claudeOpus5, color: "var(--danger)", notes: "—" },
    { key: "claudeSonnet5", name: "Claude Sonnet 5", pricing: PRICING.claudeSonnet5, color: "var(--text-primary)", notes: "—" },
    { key: "claudeHaiku45", name: "Claude Haiku 4.5", pricing: PRICING.claudeHaiku45, color: "var(--positive)", notes: "—" },
  ];

  const estimateSteps = [
    { title: t.pricingCalculator.estimateStep1Title, desc: t.pricingCalculator.estimateStep1Desc },
    { title: t.pricingCalculator.estimateStep2Title, desc: t.pricingCalculator.estimateStep2Desc },
    { title: t.pricingCalculator.estimateStep3Title, desc: t.pricingCalculator.estimateStep3Desc },
    { title: t.pricingCalculator.estimateStep4Title, desc: t.pricingCalculator.estimateStep4Desc },
  ];
  const billingItems = [
    { title: t.pricingCalculator.billingModelInputTitle, desc: t.pricingCalculator.billingModelInputDesc },
    { title: t.pricingCalculator.billingModelCacheTitle, desc: t.pricingCalculator.billingModelCacheDesc },
    { title: t.pricingCalculator.billingModelOutputTitle, desc: t.pricingCalculator.billingModelOutputDesc },
    { title: t.pricingCalculator.billingModelPeakTitle, desc: t.pricingCalculator.billingModelPeakDesc },
  ];
  const resultGuides = [
    { title: t.pricingCalculator.resultGuide1Title, desc: t.pricingCalculator.resultGuide1Desc },
    { title: t.pricingCalculator.resultGuide2Title, desc: t.pricingCalculator.resultGuide2Desc },
    { title: t.pricingCalculator.resultGuide3Title, desc: t.pricingCalculator.resultGuide3Desc },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* 注入页面专属结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPricingCalculatorSoftwareAppJsonLd(locale)),
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
          {t.pricingCalculator.backToHome}
        </Link>

        {/* Hero */}
        <section className="mb-12">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-widest mb-4 px-2.5 py-1 rounded-full"
            style={{ color: "var(--accent)", border: "1px solid var(--border)" }}
          >
            {t.pricingCalculator.badge}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {t.pricingCalculator.heroTitle}
          </h1>
          <p
            className="text-lg font-medium mb-4 max-w-xl"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {locale === "zh"
              ? "免费 DeepSeek API 价格计算器 — 拖动滑块，估算忙闲时成本"
              : "Free DeepSeek API Pricing Calculator — Slide & Estimate Peak vs. Off-Peak Costs"}
          </p>
          <p
            className="text-base leading-relaxed text-pretty max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.pricingCalculator.heroDesc}
          </p>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "2.5rem" }} />

        {/* 交互式计算器 */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="sr-only">{t.pricingCalculator.estimationGuideTitle}</h2>
            {/* 货币切换 */}
            <div className="flex bg-[var(--border)] rounded-full p-1 w-fit ml-auto">
              <button
                onClick={() => setCurrency("CNY")}
                className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors ${currency === "CNY" ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                {t.pricingCalculator.currencyCNY}
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors ${currency === "USD" ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                {t.pricingCalculator.currencyUSD}
              </button>
            </div>
          </div>
          <div
            className="p-6 rounded-subtle mb-8"
            style={{ border: "1px solid var(--border)" }}
          >
            {/* Input Tokens */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="input-tokens-range"
                  className="block text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.pricingCalculator.inputTokensLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputTokens.toLocaleString("en-US")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      const num = parseInt(raw, 10);
                      if (!isNaN(num)) setInputTokens(Math.min(num, 50000000000));
                      else if (raw === "") setInputTokens(0);
                    }}
                    className="text-xs px-2 py-1 rounded border outline-none w-32 text-right font-mono"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
              </div>
              <input
                id="input-tokens-range"
                type="range"
                min={1}
                max={50000}
                value={inputM}
                onChange={(e) => setInputTokens(Number(e.target.value) * 1_000_000)}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                style={{ accentColor: "var(--text-primary)", background: "var(--border)" }}
              />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                <span>{formatTokens(1_000_000, locale)}</span>
                <span>{formatTokens(50_000_000_000, locale)}</span>
              </div>
            </div>

            {/* Output Tokens */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="output-tokens-range"
                  className="block text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.pricingCalculator.outputTokensLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={outputTokens.toLocaleString("en-US")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      const num = parseInt(raw, 10);
                      if (!isNaN(num)) setOutputTokens(Math.min(num, 5000000000));
                      else if (raw === "") setOutputTokens(0);
                    }}
                    className="text-xs px-2 py-1 rounded border outline-none w-32 text-right font-mono"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
              </div>
              <input
                id="output-tokens-range"
                type="range"
                min={0.1}
                max={5000}
                step={0.1}
                value={outputM}
                onChange={(e) => setOutputTokens(Number(e.target.value) * 1_000_000)}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                style={{ accentColor: "var(--text-primary)", background: "var(--border)" }}
              />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                <span>{formatTokens(100_000, locale)}</span>
                <span>{formatTokens(5_000_000_000, locale)}</span>
              </div>
            </div>

            {/* Cache Hit Rate */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="cache-hit-rate-range"
                  className="block text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.pricingCalculator.cacheHitRateLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={cacheHitRate}
                    onChange={(e) => setCacheHitRate(Number(e.target.value))}
                    className="text-xs px-2 py-1 rounded border outline-none w-16 text-right font-mono"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  <span className="text-xs font-mono text-[var(--text-tertiary)]">%</span>
                </div>
              </div>
              <input
                id="cache-hit-rate-range"
                type="range"
                min={0}
                max={100}
                value={cacheHitRate}
                onChange={(e) => setCacheHitRate(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                style={{ accentColor: "var(--text-primary)", background: "var(--border)" }}
              />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>
              {t.pricingCalculator.cacheHitRateHint}
            </p>

            {/* Peak-Hour Share */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="peak-share-range"
                  className="block text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.pricingCalculator.peakShareLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={peakShare}
                    onChange={(e) => setPeakShare(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="text-xs px-2 py-1 rounded border outline-none w-16 text-right font-mono"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                  <span className="text-xs font-mono text-[var(--text-tertiary)]">%</span>
                </div>
              </div>
              <input
                id="peak-share-range"
                type="range"
                min={0}
                max={100}
                value={peakShare}
                onChange={(e) => setPeakShare(Number(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
                style={{ accentColor: "var(--text-primary)", background: "var(--border)" }}
              />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>
              {t.pricingCalculator.peakShareHint}
            </p>
          </div>

          {/* 预估结果 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {modelsData.map((item) => {
              const currentCost = calcCost(item.pricing, peakFraction);
              const isBaseModel = item.key === "v4Flash" || item.key === "v4Pro";
              const multiplierFlash = currentCost > 0 ? (currentCost / calcCost(PRICING.v4Flash, peakFraction)).toFixed(1) : "0";
              const multiplierPro = currentCost > 0 ? (currentCost / calcCost(PRICING.v4Pro, peakFraction)).toFixed(1) : "0";

              return (
                <div key={item.key} className="p-4 rounded-subtle text-center flex flex-col justify-center" style={{ border: "1px solid var(--border)" }}>
                  <span className="block text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>
                    {item.name}
                  </span>
                  <span className="text-lg font-bold" style={{ color: item.color }}>
                    {formatMoney(currentCost, item.pricing.currency, currency, locale)}
                  </span>
                  {!isBaseModel && currentCost > 0 && (
                    <div className="text-[10px] mt-1.5 flex justify-center gap-2" style={{ color: "var(--text-tertiary)" }}>
                      <span>Flash ×{multiplierFlash}</span>
                      <span>Pro ×{multiplierPro}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 月用量估算方法 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.pricingCalculator.estimationGuideTitle}
          </h2>
          <p
            className="text-sm leading-relaxed text-pretty mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.pricingCalculator.estimationGuideDesc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {estimateSteps.map((item, idx) => (
              <div
                key={item.title}
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

        {/* 计费模型说明 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.pricingCalculator.billingModelTitle}
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {billingItems.map((item) => (
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

        {/* 竞品对比表 */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              {t.pricingCalculator.competitorComparison}
            </h2>
            <div className="flex items-center gap-4">
              {/* 货币切换 */}
              <div className="flex bg-[var(--border)] rounded-full p-1 w-fit">
                <button
                  onClick={() => setCurrency("CNY")}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors ${currency === "CNY" ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                  {t.pricingCalculator.currencyCNY}
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors ${currency === "USD" ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                >
                  {t.pricingCalculator.currencyUSD}
                </button>
              </div>
              <Link
                href={buildLocalePath("/blog/openai-claude-vs-deepseek-cost-comparison", locale)}
                className="text-xs font-medium hover:underline inline-flex items-center gap-1"
                style={{ color: "var(--accent)" }}
              >
                {locale === "zh" ? "阅读深度对比报告" : "Read the deep-dive comparison"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <p className="text-xs mb-6" style={{ color: "var(--text-tertiary)" }}>
            {t.pricingCalculator.comparisonNote}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th className="text-left py-2 pr-4" style={{ color: "var(--text-primary)" }}>
                    {t.pricingCalculator.compModelHeader}
                  </th>
                  <th className="text-right py-2 px-3" style={{ color: "var(--text-secondary)" }}>
                    {t.pricingCalculator.compInputPriceHeader}
                  </th>
                  <th className="text-right py-2 px-3" style={{ color: "var(--text-secondary)" }}>
                    {t.pricingCalculator.compOutputPriceHeader}
                  </th>
                  <th className="text-right py-2 px-3" style={{ color: "var(--text-secondary)" }}>
                    {t.pricingCalculator.compCacheHitHeader}
                  </th>
                  <th className="text-left py-2 pl-3" style={{ color: "var(--text-secondary)" }}>
                    {t.pricingCalculator.compNotesHeader}
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelsData.map((item) => {
                  const src = item.pricing.currency;
                  const renderPrice = (cell: PriceCell) =>
                    typeof cell === "number" ? (
                      formatMoney(cell, src, currency, locale)
                    ) : (
                      <span className="block leading-relaxed">
                        <span className="block">{t.pricingCalculator.peakShort} {formatMoney(cell.peak, src, currency, locale)}</span>
                        <span className="block">{t.pricingCalculator.offpeakShort} {formatMoney(cell.offpeak, src, currency, locale)}</span>
                      </span>
                    );
                  return (
                    <tr key={item.key} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="py-2.5 pr-4 font-semibold" style={{ color: item.color }}>
                        {item.name}
                      </td>
                      <td className="text-right py-2.5 px-3 font-mono" style={{ color: item.color === "var(--positive)" || item.color === "var(--text-primary)" ? item.color : "var(--danger)" }}>
                        {renderPrice(item.pricing.input)}
                      </td>
                      <td className="text-right py-2.5 px-3 font-mono" style={{ color: item.color === "var(--positive)" || item.color === "var(--text-primary)" ? item.color : "var(--danger)" }}>
                        {renderPrice(item.pricing.output)}
                      </td>
                      <td className="text-right py-2.5 px-3 font-mono" style={{ color: item.color === "var(--danger)" ? "var(--text-primary)" : item.color }}>
                        {renderPrice(item.pricing.cacheHit)}
                      </td>
                      <td className="py-2.5 pl-3" style={{ color: "var(--text-tertiary)" }}>
                        {item.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <hr style={{ borderColor: "var(--border)", marginBottom: "3rem" }} />

        {/* 结果解读 */}
        <section className="mb-16">
          <h2
            className="text-lg font-bold tracking-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t.pricingCalculator.resultGuideTitle}
          </h2>
          <div className="space-y-5">
            {resultGuides.map((item) => (
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
      </div>

      {/* 底部推荐工具（商业化模块） */}
      <RecommendedToolsSection maxWidth="3xl" />

      <FooterBar />
    </div>
  );
}
