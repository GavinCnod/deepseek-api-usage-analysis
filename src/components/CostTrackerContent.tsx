/**
 * CostTracker 页内容 —— 服务端渲染回退组件
 *
 * 将 CostTracker 落地页的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到文本内容（对 SEO 至关重要）。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";

export default function CostTrackerContent() {
  const { locale, t } = useTranslation();

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

  const faq = [
    { q: t.costTracker.faq1Q, a: t.costTracker.faq1A },
    { q: t.costTracker.faq2Q, a: t.costTracker.faq2A },
    { q: t.costTracker.faq3Q, a: t.costTracker.faq3A },
  ];

  return (
    <noscript>
      <section lang={locale}>
        {/* noscript 内不输出 H1：主内容 H1 已在静态 HTML 中，避免重复 */}
        <h2>{t.costTracker.heroTitle}</h2>
        <p>{t.costTracker.heroDesc}</p>

        <h2>{t.costTracker.featuresTitle}</h2>
        {features.map((f, i) => (
          <div key={i}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}

        <h2>{t.costTracker.useCasesTitle}</h2>
        {useCases.map((u, i) => (
          <div key={i}>
            <h3>{u.title}</h3>
            <p>{u.desc}</p>
          </div>
        ))}

        <h2>{t.costTracker.faqTitle}</h2>
        {faq.map((f, i) => (
          <div key={i}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>
    </noscript>
  );
}