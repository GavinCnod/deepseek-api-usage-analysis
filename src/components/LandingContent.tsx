/**
 * Landing 页内容 —— 服务端渲染组件
 *
 * 将 How It Works、FAQ、About 的文字内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。这样即使在不执行 JavaScript 的爬虫环境中，
 * 搜索引擎也能抓取到完整页面内容。
 *
 * 浏览器（JS 开启时）不会渲染 <noscript> 内部内容，
 * 实际的交互式内容由 LandingPage.tsx 客户端组件负责渲染。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";

export default function LandingContent() {
  const { locale, t } = useTranslation();
  const authorPath = buildLocalePath("/author", locale);

  const steps = [
    { title: t.landing.howItWorksStep1Title, desc: t.landing.howItWorksStep1Desc },
    { title: t.landing.howItWorksStep2Title, desc: t.landing.howItWorksStep2Desc },
    { title: t.landing.howItWorksStep3Title, desc: t.landing.howItWorksStep3Desc },
  ];

  const qaItems = [
    { q: t.landing.qaQ1, a: t.landing.qaA1 },
    { q: t.landing.qaQ2, a: t.landing.qaA2 },
    { q: t.landing.qaQ3, a: t.landing.qaA3 },
    { q: t.landing.qaQ4, a: t.landing.qaA4 },
    { q: t.landing.qaQ5, a: t.landing.qaA5 },
    { q: t.landing.qaQ6, a: t.landing.qaA6 },
    { q: t.landing.qaQ7, a: t.landing.qaA7 },
    { q: t.landing.qaQ8, a: t.landing.qaA8 },
    { q: t.landing.qaQ9, a: t.landing.qaA9 },
  ];

  const aboutSections = [
    { title: t.landing.aboutWhyTitle, desc: t.landing.aboutWhyDesc },
    { title: t.landing.aboutPrivacyTitle, desc: t.landing.aboutPrivacyDesc },
    { title: t.landing.aboutMindRoseTitle, desc: t.landing.aboutMindRoseDesc },
    {
      title: t.landing.aboutContactTitle,
      desc: t.landing.aboutContactDesc,
    },
  ];

  return (
    <noscript>
      <section lang={locale}>
        {/* noscript 内不输出 H1：主内容 H1 已在静态 HTML 中，避免重复 */}
        <h2>{t.app.title}</h2>

        <h2>{t.landing.howItWorksTitle}</h2>
        <div>
          {steps.map((step, i) => (
            <div key={i}>
              <span>{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>

        <h2>{t.landing.qaTitle}</h2>
        <div>
          {qaItems.map((item, i) => (
            <div key={i}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>

        <h2>{t.landing.aboutSectionTitle}</h2>
        {aboutSections.map((section, i) => (
          <div key={i}>
            <h3>{section.title}</h3>
            <p>{section.desc}</p>
          </div>
        ))}

        <p>{t.landing.aboutContactService}</p>
        <p>
          {t.landing.aboutContactCTA}{" "}
          <a href="mailto:hello@mindrose.xyz">hello@mindrose.xyz</a>
        </p>

        <p>
          <a href={authorPath}>{t.author.pageTitle}</a>
        </p>

        <p>
          <a href="https://github.com/GavinCnod/deepseek-api-usage-analysis">
            {t.landing.aboutGitHubLabel}
          </a>
        </p>
      </section>
    </noscript>
  );
}