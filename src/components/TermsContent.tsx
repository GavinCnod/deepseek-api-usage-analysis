/**
 * Terms 页内容 —— 服务端渲染回退组件
 *
 * 将使用条款的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到法律文本内容（对 EEAT 信任信号至关重要）。
 *
 * 浏览器（JS 开启时）不会渲染 <noscript> 内部内容，
 * 实际的交互式内容由 TermsPage.tsx 客户端组件负责渲染。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";

export default function TermsContent() {
  const { locale, t } = useTranslation();

  const sections = [
    { title: t.terms.asIsTitle, content: t.terms.asIsDesc },
    { title: t.terms.noWarrantyTitle, content: t.terms.noWarrantyDesc },
    { title: t.terms.notAffiliatedTitle, content: t.terms.notAffiliatedDesc },
    { title: t.terms.userDataTitle, content: t.terms.userDataDesc },
    { title: t.terms.openSourceTitle, content: t.terms.openSourceDesc, note: t.terms.openSourceLicense },
    { title: t.terms.limitationTitle, content: t.terms.limitationDesc },
    { title: t.terms.changesTitle, content: t.terms.changesDesc },
    { title: t.terms.contactTitle, content: t.terms.contactDesc },
  ];

  return (
    <noscript>
      <section lang={locale}>
        <h2>{t.terms.pageTitle}</h2>
        <p>{t.terms.effectiveDate}</p>
        <p>{t.terms.intro}</p>

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