/**
 * PricingCalculator 页内容 —— 服务端渲染回退组件
 *
 * 将 PricingCalculator 落地页的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到文本内容（对 SEO 至关重要）。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";

export default function PricingCalculatorContent() {
  const { locale, t } = useTranslation();

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
    <noscript>
      <section lang={locale}>
        {/* noscript 内不输出 H1：主内容 H1 已在静态 HTML 中，避免重复 */}
        <h2>{t.pricingCalculator.heroTitle}</h2>
        <p>{t.pricingCalculator.heroDesc}</p>

        <h2>{t.pricingCalculator.estimationGuideTitle}</h2>
        <p>{t.pricingCalculator.estimationGuideDesc}</p>
        {estimateSteps.map((step, i) => (
          <div key={i}>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}

        <h2>{t.pricingCalculator.billingModelTitle}</h2>
        {billingItems.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}

        <h2>{t.pricingCalculator.resultGuideTitle}</h2>
        {resultGuides.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>
    </noscript>
  );
}