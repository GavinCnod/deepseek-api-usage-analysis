/**
 * Glossary 页内容 —— 服务端渲染回退组件
 *
 * 将术语落地页的完整内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。确保不执行 JavaScript 的爬虫
 * 也能抓取到文本内容（对 SEO 至关重要）。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";
import { getGlossaryContent, type GlossarySlug } from "@/lib/content/glossaryContent";

export default function GlossaryContent({ slug }: { slug: GlossarySlug }) {
  const { locale, t } = useTranslation();
  const content = getGlossaryContent(slug);

  return (
    <noscript>
      <section lang={locale}>
        <h2>{content.heroTitle[locale]}</h2>
        <p>{content.definition[locale]}</p>

        {content.sections[locale].map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}

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
