/**
 * PricingCalculator 页内容 —— 服务端渲染回退组件
 *
 * 将 PricingCalculator 落地页的完整中英双语内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到文本内容（对 SEO 至关重要）。
 */
import translations from "@/i18n/translations";

const en = translations.en.pricingCalculator;
const zh = translations.zh.pricingCalculator;

const ESTIMATE_STEPS_EN = [
  { title: en.estimateStep1Title, desc: en.estimateStep1Desc },
  { title: en.estimateStep2Title, desc: en.estimateStep2Desc },
  { title: en.estimateStep3Title, desc: en.estimateStep3Desc },
  { title: en.estimateStep4Title, desc: en.estimateStep4Desc },
];

const ESTIMATE_STEPS_ZH = [
  { title: zh.estimateStep1Title, desc: zh.estimateStep1Desc },
  { title: zh.estimateStep2Title, desc: zh.estimateStep2Desc },
  { title: zh.estimateStep3Title, desc: zh.estimateStep3Desc },
  { title: zh.estimateStep4Title, desc: zh.estimateStep4Desc },
];

const BILLING_ITEMS_EN = [
  { title: en.billingModelInputTitle, desc: en.billingModelInputDesc },
  { title: en.billingModelCacheTitle, desc: en.billingModelCacheDesc },
  { title: en.billingModelOutputTitle, desc: en.billingModelOutputDesc },
  { title: en.billingModelPeakTitle, desc: en.billingModelPeakDesc },
];

const BILLING_ITEMS_ZH = [
  { title: zh.billingModelInputTitle, desc: zh.billingModelInputDesc },
  { title: zh.billingModelCacheTitle, desc: zh.billingModelCacheDesc },
  { title: zh.billingModelOutputTitle, desc: zh.billingModelOutputDesc },
  { title: zh.billingModelPeakTitle, desc: zh.billingModelPeakDesc },
];

const RESULT_GUIDES_EN = [
  { title: en.resultGuide1Title, desc: en.resultGuide1Desc },
  { title: en.resultGuide2Title, desc: en.resultGuide2Desc },
  { title: en.resultGuide3Title, desc: en.resultGuide3Desc },
];

const RESULT_GUIDES_ZH = [
  { title: zh.resultGuide1Title, desc: zh.resultGuide1Desc },
  { title: zh.resultGuide2Title, desc: zh.resultGuide2Desc },
  { title: zh.resultGuide3Title, desc: zh.resultGuide3Desc },
];

export default function PricingCalculatorContent() {
  return (
    <noscript>
      {/* 英文版 */}
      <section lang="en">
        <h1>{en.pageTitle}</h1>
        <p>{en.heroTitle}</p>
        <p>{en.heroDesc}</p>

        <h2>{en.estimationGuideTitle}</h2>
        <p>{en.estimationGuideDesc}</p>
        {ESTIMATE_STEPS_EN.map((step, i) => (
          <div key={i}>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}

        <h2>{en.billingModelTitle}</h2>
        {BILLING_ITEMS_EN.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}

        <h2>{en.resultGuideTitle}</h2>
        {RESULT_GUIDES_EN.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 中文版 */}
      <section lang="zh">
        <h1>{zh.pageTitle}</h1>
        <p>{zh.heroTitle}</p>
        <p>{zh.heroDesc}</p>

        <h2>{zh.estimationGuideTitle}</h2>
        <p>{zh.estimationGuideDesc}</p>
        {ESTIMATE_STEPS_ZH.map((step, i) => (
          <div key={i}>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}

        <h2>{zh.billingModelTitle}</h2>
        {BILLING_ITEMS_ZH.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}

        <h2>{zh.resultGuideTitle}</h2>
        {RESULT_GUIDES_ZH.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>
    </noscript>
  );
}
