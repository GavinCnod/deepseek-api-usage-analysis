/**
 * ModelPricing 页内容 —— 服务端渲染回退组件
 *
 * 将单模型定价落地页的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到文本内容（对 SEO 至关重要）。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";
import {
  MODEL_NAMES,
  MODEL_PRICING,
  type ModelKey,
} from "@/lib/modelPricing";
import { getModelPricingContent } from "@/lib/content/modelPricingContent";

export default function ModelPricingContent({ modelKey }: { modelKey: ModelKey }) {
  const { locale, t } = useTranslation();
  const content = getModelPricingContent(modelKey);
  const pricing = MODEL_PRICING[modelKey];
  const name = MODEL_NAMES[modelKey][locale];

  return (
    <noscript>
      <section lang={locale}>
        <h2>{content.heroTitle[locale]}</h2>
        <p>{content.heroSubtitle[locale]}</p>
        <p>{content.intro[locale]}</p>

        <h2>{t.modelPricing.pricePerMillionTitle}</h2>
        <p>{name}</p>
        <ul>
          <li>
            {t.modelPricing.inputLabel}:{" "}
            {typeof pricing.input === "number"
              ? pricing.input
              : `${t.modelPricing.peakLabel} ${pricing.input.peak} · ${t.modelPricing.offpeakLabel} ${pricing.input.offpeak}`}{" "}
            ({pricing.currency})
          </li>
          <li>
            {t.modelPricing.outputLabel}:{" "}
            {typeof pricing.output === "number"
              ? pricing.output
              : `${t.modelPricing.peakLabel} ${pricing.output.peak} · ${t.modelPricing.offpeakLabel} ${pricing.output.offpeak}`}{" "}
            ({pricing.currency})
          </li>
          <li>
            {t.modelPricing.cacheHitLabel}:{" "}
            {typeof pricing.cacheHit === "number"
              ? pricing.cacheHit
              : `${t.modelPricing.peakLabel} ${pricing.cacheHit.peak} · ${t.modelPricing.offpeakLabel} ${pricing.cacheHit.offpeak}`}{" "}
            ({pricing.currency})
          </li>
        </ul>

        <h2>{content.bestForTitle[locale]}</h2>
        {content.facts[locale].map((fact) => (
          <div key={fact.title}>
            <h3>{fact.title}</h3>
            <p>{fact.desc}</p>
          </div>
        ))}

        <h2>{t.modelPricing.bestForBadge}</h2>
        <p>{content.bestFor[locale]}</p>

        <h2>{content.pricingNoteTitle[locale]}</h2>
        <p>{content.pricingNote[locale]}</p>

        <h2>{content.vsTitle[locale]}</h2>
        <p>{content.vs[locale]}</p>

        <h2>{t.modelPricing.faqTitle}</h2>
        {content.faq[locale].map((item) => (
          <div key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </section>
    </noscript>
  );
}
