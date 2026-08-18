/**
 * Privacy 页内容 —— 服务端渲染回退组件
 *
 * 将隐私政策的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到法律文本内容（对 EEAT 信任信号至关重要）。
 *
 * 浏览器（JS 开启时）不会渲染 <noscript> 内部内容，
 * 实际的交互式内容由 PrivacyPage.tsx 客户端组件负责渲染。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";

export default function PrivacyContent() {
  const { locale, t } = useTranslation();

  const sections = [
    { title: t.privacy.noCollectionTitle, content: t.privacy.noCollectionDesc },
    { title: t.privacy.localProcessingTitle, content: t.privacy.localProcessingDesc },
    {
      title: t.privacy.analyticsTitle,
      content: t.privacy.analyticsDesc,
      note: t.privacy.analyticsOptOut + " " + t.privacy.gaIdNote,
    },
    { title: t.privacy.thirdPartyTitle, content: t.privacy.thirdPartyDesc },
    { title: t.privacy.securityTitle, content: t.privacy.securityDesc },
    { title: t.privacy.changesTitle, content: t.privacy.changesDesc },
    { title: t.privacy.contactTitle, content: t.privacy.contactDesc },
  ];

  return (
    <noscript>
      <section lang={locale}>
        <h2>{t.privacy.pageTitle}</h2>
        <p>{t.privacy.effectiveDate}</p>
        <p>{t.privacy.intro}</p>

        {sections.map((section, idx) => (
          <div key={idx}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
            {section.note && <p>{section.note}</p>}
          </div>
        ))}
      </section>
    </noscript>
  );
}