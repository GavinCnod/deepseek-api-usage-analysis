/**
 * CacheAnalyzer 页内容 —— 服务端渲染回退组件
 *
 * 将 CacheAnalyzer 落地页的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到文本内容（对 SEO 至关重要）。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";

export default function CacheAnalyzerContent() {
  const { locale, t } = useTranslation();

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

  const diagnosis = [
    { title: t.cacheAnalyzer.diagnosis1Title, desc: t.cacheAnalyzer.diagnosis1Desc },
    { title: t.cacheAnalyzer.diagnosis2Title, desc: t.cacheAnalyzer.diagnosis2Desc },
    { title: t.cacheAnalyzer.diagnosis3Title, desc: t.cacheAnalyzer.diagnosis3Desc },
  ];

  return (
    <noscript>
      <section lang={locale}>
        {/* noscript 内不输出 H1：主内容 H1 已在静态 HTML 中，避免重复 */}
        <h2>{t.cacheAnalyzer.heroTitle}</h2>
        <p>{t.cacheAnalyzer.heroDesc}</p>

        <h2>{t.cacheAnalyzer.cachingExplainerTitle}</h2>
        <p>{t.cacheAnalyzer.cachingExplainerDesc}</p>
        {tips.map((tip, i) => (
          <div key={i}>
            <h3>{tip.title}</h3>
            <p>{tip.desc}</p>
          </div>
        ))}

        <h2>{t.cacheAnalyzer.benchmarkTitle}</h2>
        <p>{t.cacheAnalyzer.benchmarkDesc}</p>
        {benchmarks.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}

        <h2>{t.cacheAnalyzer.strategyTitle}</h2>
        {strategies.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}

        <h2>{t.cacheAnalyzer.diagnosisTitle}</h2>
        {diagnosis.map((item, i) => (
          <div key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>
    </noscript>
  );
}