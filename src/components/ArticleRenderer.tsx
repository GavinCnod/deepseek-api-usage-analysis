/** 文件说明：博客文章结构化内容渲染器，负责统一渲染段落、列表、代码块与价格表。 */
"use client";

import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";
import type { ReactNode } from "react";
import type { ArticleSection, PricingRow } from "@/lib/content";

/* ===== Props ===== */

interface ArticleRendererProps {
  sections: ArticleSection[];
  pricingTable?: {
    headers: string[];
    rows: PricingRow[];
  };
}

/* ===== Inline HTML 渲染 ===== */

/**
 * 格式化文章内容里的受控内联 HTML。
 *
 * 目前统一支持 `<strong>`、`<em>`、`<a>`、`<code>` 四类标签，
 * 供段落与列表项复用，避免不同内容块的渲染行为不一致。
 */
function formatRichHtml(html: string, locale: ReturnType<typeof useTranslation>["locale"]): string {
  return html
    .replace(
      /<strong>([^<]*)<\/strong>/g,
      '<strong style="color:var(--text-primary);font-weight:600">$1</strong>'
    )
    .replace(
      /<em>([^<]*)<\/em>/g,
      '<em style="font-style:italic">$1</em>'
    )
    .replace(
      /<a href="([^"]+)">([^<]*)<\/a>/g,
      (_: string, href: string, text: string) => {
        const isInternalPath = href.startsWith("/");
        const resolvedHref = isInternalPath ? buildLocalePath(href, locale) : href;
        const isLocalAction = isInternalPath || href.startsWith("mailto:");

        return `<a href="${resolvedHref}" ${isLocalAction ? "" : 'target="_blank" rel="sponsored nofollow noopener noreferrer"'} class="underline" style="color:var(--accent)">${text}</a>`;
      }
    )
    .replace(
      /<code>([^<]*)<\/code>/g,
      '<code class="text-xs px-1 py-0.5 rounded font-mono" style="background:var(--border);color:var(--text-primary)">$1</code>'
    );
}

/**
 * 将段落字符串渲染为 JSX。
 * 支持 <strong>, <em>, <a href="...">, <code> 四种内联标签。
 * 内容来自项目自身的 content 模块，XSS 安全。
 */
function RichParagraph({
  html,
  locale,
}: {
  html: string;
  locale: ReturnType<typeof useTranslation>["locale"];
}) {
  return (
    <p
      className="mb-3 text-sm leading-relaxed text-pretty"
      style={{ color: "var(--text-secondary)" }}
      dangerouslySetInnerHTML={{
        __html: formatRichHtml(html, locale),
      }}
    />
  );
}

/**
 * 将列表项字符串渲染为富文本内联内容。
 *
 * 列表项不能再包一层 `<p>`，因此单独输出为 `<span>`，
 * 但复用与段落完全相同的内联标签处理逻辑。
 */
function RichListItem({
  html,
  locale,
}: {
  html: string;
  locale: ReturnType<typeof useTranslation>["locale"];
}) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: formatRichHtml(html, locale),
      }}
    />
  );
}

/* ===== 主渲染器 ===== */

/** Render a pricing cell — arrays are stacked into multiple lines (peak/off-peak × currency). */
function renderCell(value: string | string[]): ReactNode {
  if (Array.isArray(value)) {
    return value.map((line, i) => (
      <span key={i} className="block whitespace-nowrap">
        {line}
      </span>
    ));
  }
  return value;
}

export default function ArticleRenderer({ sections, pricingTable }: ArticleRendererProps) {
  const { locale } = useTranslation();

  return (
    <>
      {sections.map((section, si) => (
        <section key={si} className="mb-10">
          <h2
            className="text-xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {section.heading}
          </h2>

          {section.blocks.map((block, bi) => {
            switch (block.type) {
              case "h3":
                return (
                  <h3
                    key={bi}
                    className="text-base font-semibold mt-6 mb-2"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                  >
                    {block.content}
                  </h3>
                );
              case "p":
                return <RichParagraph key={bi} html={block.content} locale={locale} />;
              case "ul":
                return (
                  <ul key={bi} className="list-disc pl-5 mb-3 space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {block.items.map((item, ii) => (
                      <li key={ii}>
                        <RichListItem html={item} locale={locale} />
                      </li>
                    ))}
                  </ul>
                );
              case "ol":
                return (
                  <ol key={bi} className="list-decimal pl-5 mb-4 space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {block.items.map((item, ii) => (
                      <li key={ii}>
                        <RichListItem html={item} locale={locale} />
                      </li>
                    ))}
                  </ol>
                );
              case "inline_code":
                return (
                  <code
                    key={bi}
                    className="block text-xs px-2 py-1.5 rounded font-mono mb-3"
                    style={{ background: "var(--border)", color: "var(--text-primary)" }}
                  >
                    {block.content}
                  </code>
                );
              case "compare_note":
                return (
                  <p key={bi} className="text-xs mb-6" style={{ color: "var(--text-tertiary)" }}>
                    {block.content}
                  </p>
                );
              default:
                return null;
            }
          })}
        </section>
      ))}

      {/* 定价对比表 */}
      {pricingTable && (
        <div className="overflow-x-auto mt-10">
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                {pricingTable.headers.map((h, hi) => (
                  <th
                    key={hi}
                    className={`py-2 ${hi === 0 ? "text-left pr-4" : "text-right px-3"}`}
                    style={{ color: hi === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}
                  >
                    {h}
                  </th>
                ))}
                <th className="text-left py-2 pl-3" style={{ color: "var(--text-secondary)" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pricingTable.rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td
                    className={`py-2.5 pr-4 ${row.modelColor ? "font-semibold" : ""}`}
                    style={{ color: row.modelColor || "var(--text-primary)" }}
                  >
                    {row.model}
                  </td>
                  <td className="text-right py-2.5 px-3 font-mono" style={{ color: row.inputColor || "var(--text-primary)" }}>
                    {renderCell(row.input)}
                  </td>
                  <td className="text-right py-2.5 px-3 font-mono" style={{ color: row.outputColor || "var(--text-primary)" }}>
                    {renderCell(row.output)}
                  </td>
                  <td className="text-right py-2.5 px-3 font-mono" style={{ color: row.cacheHitColor || "var(--text-primary)" }}>
                    {renderCell(row.cacheHit)}
                  </td>
                  <td className="py-2.5 pl-3" style={{ color: "var(--text-tertiary)" }}>
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
