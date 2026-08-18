/**
 * Changelog 页内容 —— 服务端渲染回退组件
 *
 * 将更新日志的版本历史和摘要内容以纯 HTML 形式输出，
 * 包裹在 <noscript> 中。爬虫可借此了解项目的演进历程
 * 和持续维护状态（对 EEAT 信号有帮助）。
 *
 * 浏览器（JS 开启时）不会渲染 <noscript> 内部内容，
 * 实际的交互式内容由 ChangelogPage.tsx 客户端组件负责渲染。
 *
 * 仅输出当前路由语言的内容，避免在单一页面中出现双语重复文本。
 */
"use client";

import { useTranslation } from "@/i18n";

/**
 * 简化版更新日志数据 — 仅包含版本号和日期作为摘要
 *
 * 完整条目由 ChangelogPage.tsx 客户端组件渲染。
 * 此处提供版本概览供爬虫抓取，展示项目持续维护的活跃度。
 */
const VERSION_SUMMARY = [
  { version: "v0.10.2", date: "2026-08-18" },
  { version: "v0.10.1", date: "2026-08-18" },
  { version: "v0.10.0", date: "2026-08-18" },
  { version: "v0.9.3", date: "2026-08-18" },
  { version: "v0.9.2", date: "2026-08-18" },
  { version: "v0.9.1", date: "2026-08-17" },
  { version: "v0.9.0", date: "2026-08-17" },
  { version: "v0.8.0", date: "2026-08-17" },
  { version: "v0.7.0", date: "2026-08-13" },
  { version: "v0.6.6", date: "2026-07-19" },
  { version: "v0.6.5", date: "2026-07-12" },
  { version: "v0.6.4", date: "2026-07-10" },
  { version: "v0.6.3", date: "2026-07-09" },
  { version: "v0.6.2", date: "2026-07-06" },
  { version: "v0.6.1", date: "2026-07-05" },
  { version: "v0.6.0", date: "2026-07-04" },
  { version: "v0.5.4", date: "2026-06-24" },
  { version: "v0.5.3", date: "2026-06-21" },
  { version: "v0.5.2", date: "2026-06-17" },
  { version: "v0.5.1", date: "2026-06-16" },
  { version: "v0.5.0", date: "2026-06-15" },
  { version: "v0.4.0", date: "2026-06-14" },
  { version: "v0.3.3", date: "2026-06-13" },
  { version: "v0.3.2", date: "2026-06-12" },
  { version: "v0.3.1", date: "2026-06-11" },
  { version: "v0.3.0", date: "2026-06-10" },
  { version: "v0.2.1", date: "2026-06-09" },
  { version: "v0.2.0", date: "2026-06-08" },
  { version: "v0.1.1", date: "2026-06-07" },
  { version: "v0.1.0", date: "2026-06-06" },
];

/**
 * 按类别统计各版本的变更条目数（语言无关）
 *
 * 爬虫可通过此数据了解每次发布的范围和规模。
 */
const VERSION_STATS = [
  { version: "v0.10.2", improved: 1, fixed: 2 },
  { version: "v0.10.1", improved: 2 },
  { version: "v0.10.0", added: 2, improved: 2 },
  { version: "v0.9.3", added: 1, improved: 5 },
  { version: "v0.9.2", added: 1, improved: 5 },
  { version: "v0.9.1", added: 1, improved: 1 },
  { version: "v0.9.0", added: 2, improved: 1, fixed: 1 },
  { version: "v0.8.0", added: 1, fixed: 1 },
  { version: "v0.7.0", added: 2, improved: 3 },
  { version: "v0.6.6", improved: 3 },
  { version: "v0.6.5", added: 1, improved: 4 },
  { version: "v0.6.4", added: 3, improved: 3, fixed: 1 },
  { version: "v0.6.3", added: 4, improved: 3, fixed: 1 },
  { version: "v0.6.2", added: 2, improved: 4 },
  { version: "v0.6.1", added: 2, improved: 2 },
  { version: "v0.6.0", added: 5, improved: 3 },
  { version: "v0.5.4", improved: 1 },
  { version: "v0.5.3", added: 3, improved: 2, fixed: 3 },
  { version: "v0.5.2", added: 1, dependencies: 1 },
  { version: "v0.5.1", added: 3, improved: 3 },
  { version: "v0.5.0", added: 6, improved: 7, dependencies: 1 },
  { version: "v0.4.0", added: 4, improved: 3 },
  { version: "v0.3.3", added: 2, fixed: 1 },
  { version: "v0.3.2", added: 4, improved: 3 },
  { version: "v0.3.1", added: 1, improved: 5 },
  { version: "v0.3.0", added: 3, improved: 1 },
  { version: "v0.2.1", improved: 3 },
  { version: "v0.2.0", added: 7, improved: 2 },
  { version: "v0.1.1", added: 2, improved: 2 },
  { version: "v0.1.0", added: 7 },
];

export default function ChangelogContent() {
  const { locale, t } = useTranslation();
  const c = t.changelog;
  const separator = locale === "zh" ? "，" : ", ";

  return (
    <noscript>
      <section lang={locale}>
        <h2>{c.pageTitle}</h2>
        <p>{c.lastUpdated}</p>
        <p>{c.intro}</p>

        <ol>
          {VERSION_SUMMARY.map((v, i) => {
            const stats = VERSION_STATS[i];
            const summary: string[] = [];
            if (stats?.added) summary.push(`${c.added}: ${stats.added}`);
            if (stats?.improved) summary.push(`${c.improved}: ${stats.improved}`);
            if (stats?.fixed) summary.push(`${c.fixed}: ${stats.fixed}`);
            if (stats?.dependencies) summary.push(`${c.dependencies}: ${stats.dependencies}`);

            return (
              <li key={v.version}>
                <strong>{v.version}</strong>
                {v.date && ` — ${v.date}`}
                {summary.length > 0 && ` · ${summary.join(separator)}`}
              </li>
            );
          })}
        </ol>
      </section>
    </noscript>
  );
}