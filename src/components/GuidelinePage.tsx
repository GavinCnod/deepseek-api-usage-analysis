"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { buildLocalePath } from "@/lib/localeRouting";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";

/* ================================================================== */
/*  截图文件名映射                                                       */
/* ================================================================== */

/**
 * 截图占位编号 → 截图文件名（不含 locale 后缀和扩展名）
 *
 * 所有截图存放在 public/guideline/ 目录下，命名规则：
 *   {编号}-描述-{locale}.png
 * 如：01-Ds-Api-Usage-Dashboard-Overview-cn.png
 */
const SCREENSHOT_MAP: Record<number, string> = {
  1: "01-Ds-Api-Usage-Dashboard-Overview",
  2: "02-Ds-Platform-Usage-Csv-Download",
  3: "03-Drap-Drop-Csvs-Trigger-Analysis",
  4: "04-TitleBar",
  16: "16-Ds-Api-Usage-Dashboard-Overview",
  17: "17-Action-Buttons",
  20: "20-Total-Overview-Data",
  23: "23-Usage-Overview",
  24: "24-Usage-By-Key-Overview",
  26: "26-Cache-Of-Usage-Overview",
  28: "28-Trends-Of-Usage-Overview",
  29: "29-Trends-Of-Usage-Overview2",
};

/* ================================================================== */
/*  内容类型定义                                                         */
/* ================================================================== */

type ContentBlock =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "h4"; text: string }
  | { type: "h5"; text: string }
  | { type: "h6"; text: string }
  | { type: "p"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "screenshot"; id: number; description: string }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

/** 带标题的子节 */
interface Section {
  title: string;
  anchorId: string;
  blocks: ContentBlock[];
}

/* ================================================================== */
/*  解析器：将 MD 文本转为结构化内容                                      */
/* ================================================================== */

/**
 * 将 rawContent 解析为 Section 数组。
 *
 * 约定：
 * - `## 标题` → 新的 Section，派生 anchorId
 * - `### 标题` → h3 block
 * - `#### 标题` → h4 block
 * - `> [截图占位 - XX]` + `> *描述*` → screenshot block
 * - `| ... |` 行 → table block（简单按行分割）
 * - `- 列表项` → ul block（连续的 - 合并）
 * - `1. 列表项` → ol block
 */
function parseContent(raw: string): Section[] {
  const lines = raw.split("\n");
  const sections: Section[] = [];

  let currentSection: Section | null = null;
  let currentBlocks: ContentBlock[] = [];
  let i = 0;

  /** 用标题文本派生一个 HTML 安全的 anchor ID */
  function toAnchorId(text: string): string {
    return text
      .replace(/[#（）()]/g, "")
      .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
  }

  /** 收集连续的列表/表格行 */
  function flushPending(): void {
    // no-op: table/ul/ol are handled inline
  }

  while (i < lines.length) {
    const line = lines[i];

    // ## heading → new section
    if (/^##\s+/.test(line)) {
      flushPending();
      if (currentSection) {
        currentSection.blocks = currentBlocks;
        sections.push(currentSection);
      }
      const title = line.replace(/^##\s+/, "").trim();
      const anchorId = toAnchorId(title);
      currentSection = { title, anchorId, blocks: [] };
      currentBlocks = [];
      i++;
      continue;
    }

    // ### heading
    if (/^###\s+/.test(line)) {
      const text = line.replace(/^###\s+/, "").trim();
      currentBlocks.push({ type: "h3", text, id: toAnchorId(text) });
      i++;
      continue;
    }

    // #### heading
    if (/^####\s+/.test(line)) {
      const text = line.replace(/^####\s+/, "").trim();
      currentBlocks.push({ type: "h4", text });
      i++;
      continue;
    }

    // ##### heading
    if (/^#####\s+/.test(line)) {
      const text = line.replace(/^#####\s+/, "").trim();
      currentBlocks.push({ type: "h5", text });
      i++;
      continue;
    }

    // ###### heading
    if (/^######\s+/.test(line)) {
      const text = line.replace(/^######\s+/, "").trim();
      currentBlocks.push({ type: "h6", text });
      i++;
      continue;
    }

    // --- → hr
    if (/^---+$/.test(line.trim())) {
      currentBlocks.push({ type: "hr" });
      i++;
      continue;
    }

    // > **[截图占位 - XX]** + 下一行 > *描述*
    if (line.startsWith("> **[截图占位 - ") && line.includes("]**")) {
      const idMatch = line.match(/截图占位\s*-\s*(\d+)/);
      const id = idMatch ? parseInt(idMatch[1], 10) : 0;
      // 下一行是描述
      i++;
      let description = "";
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        const cleaned = lines[i].replace(/^>\s*\*?/, "").replace(/\*?$/, "").trim();
        description += (description ? " " : "") + cleaned;
        i++;
      }
      currentBlocks.push({ type: "screenshot", id, description });
      continue;
    }

    // > 开头的引用
    if (line.startsWith("> ")) {
      const text = line.replace(/^>\s*/, "").trim();
      // 跳过空的引用块（截图描述已在上面处理）
      if (text && !text.startsWith("*需要截图") && !text.startsWith("需要截图") && !text.startsWith("截图占位") && !text.startsWith("**")) {
        currentBlocks.push({ type: "blockquote", text });
      }
      i++;
      continue;
    }

    // 表格：| ... | 行
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      // 收集连续的表格行
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      // 跳过表头分隔行（|---|---|）
      const dataLines = tableLines.filter((l) => !/^\|[\s\-:|]+\|$/.test(l));
      if (dataLines.length >= 2) {
        const headers = dataLines[0]
          .split("|")
          .filter(Boolean)
          .map((c) => c.replace(/\*\*/g, "").trim());
        const rows = dataLines.slice(1).map((row) =>
          row
            .split("|")
            .filter(Boolean)
            .map((c) => c.trim())
        );
        currentBlocks.push({ type: "table", headers, rows });
      }
      continue;
    }

    // - 列表项
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, "").trim());
        i++;
      }
      currentBlocks.push({ type: "ul", items });
      continue;
    }

    // 1. 有序列表
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, "").trim());
        i++;
      }
      currentBlocks.push({ type: "ol", items });
      continue;
    }

    // # heading (h1)
    if (/^#\s+/.test(line)) {
      const text = line.replace(/^#\s+/, "").trim();
      currentBlocks.push({ type: "h1", text });
      i++;
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 普通段落
    currentBlocks.push({ type: "p", text: line.trim() });
    i++;
  }

  // flush last section
  if (currentSection) {
    currentSection.blocks = currentBlocks;
    sections.push(currentSection);
  }

  return sections;
}

/* ================================================================== */
/*  内联 Markdown 渲染工具                                               */
/* ================================================================== */

/** 将粗体 `**text**` 和内联代码 `` `code` `` 转为 JSX */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "var(--text-primary)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="text-xs px-1 py-0.5 rounded"
          style={{
            background: "var(--border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // 链接 [text](url)
    const linkMatch = part.match(/^\[(.+)\]\((.+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors duration-200"
          style={{ color: "var(--text-secondary)" }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

/* ================================================================== */
/*  GuidelinePage 组件                                                  */
/* ================================================================== */

/**
 * 操作指南页面 — 完整渲染用户操作手册
 *
 * - Apple 极简风格，与主应用视觉一致
 * - 左侧固定目录（桌面端），右侧内容区
 * - 截图根据当前 locale 自动选择 cn/en 版本
 * - 支持浅色/深色双主题
 */
export function GuidelinePage() {
  const { locale, t } = useTranslation();
  const homeHref = buildLocalePath("/", locale);

  // 当前目录高亮锚点（当前实现暂未启用滚动同步）
  const [activeSection] = useState<string>("");

  /** 指南页 JSON-LD 结构化数据 */
  const guidelineJsonLd = useMemo(() => {
    const isZh = locale === "zh";
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: isZh ? "DeepSeek API 用量分析仪表盘 — 用户操作手册" : "DeepSeek API Usage Analytics Dashboard — User Guide",
      description: isZh
        ? "完整的 DeepSeek API 用量分析仪表盘操作指南。学习如何导出 CSV、上传文件、浏览所有仪表盘视图，包含分步说明和截图。"
        : "Complete user guide for the DeepSeek API Usage Analytics Dashboard. Learn how to export CSVs, upload files, and navigate all dashboard views with step-by-step instructions and screenshots.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: isZh ? "导出 CSV 文件" : "Export CSV Files",
          text: isZh
            ? "前往 DeepSeek 平台用量页面，选择月份并导出 amount-*.csv 和 cost-*.csv 文件。"
            : "Go to DeepSeek Platform Usage page, select month and export amount-*.csv and cost-*.csv files.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: isZh ? "上传 CSV 文件" : "Upload CSV Files",
          text: isZh
            ? "将所有 CSV 文件拖拽到仪表盘页面的上传区域。支持多月份同时上传，自动配对合并。"
            : "Drag all CSV files onto the dashboard upload area. Multiple months are auto-paired and merged.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: isZh ? "查看分析结果" : "View Analytics",
          text: isZh
            ? "即刻查看费用图表、各 Key 用量明细、缓存命中分析和使用趋势，所有数据在浏览器本地处理。"
            : "Instantly see cost charts, per-key breakdowns, cache hit analysis, and usage trends — all processed locally.",
        },
      ],
    };
  }, [locale]);

  /** 解析内容（根据当前语言加载对应版本的操作手册） */
  const sections = useMemo(() => {
    const rawContent = getManualContent(locale);
    return parseContent(rawContent);
  }, [locale]);

  /** 获取截图的 locale 版本路径 */
  const getScreenshotSrc = useCallback(
    (id: number): string => {
      const base = SCREENSHOT_MAP[id];
      if (!base) return "";
      const localeSuffix = locale === "zh" ? "cn" : "en";
      return `/guideline/${base}-${localeSuffix}.png`;
    },
    [locale]
  );

  /** 渲染单个 ContentBlock */
  function renderBlock(block: ContentBlock, idx: number) {
    switch (block.type) {
      case "h1":
        return (
          <h1
            key={idx}
            className="text-2xl font-bold tracking-tight mb-6"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
            translate="no"
          >
            {block.text}
          </h1>
        );

      case "h2":
        return (
          <h2
            key={idx}
            id={block.id}
            className="text-lg font-bold tracking-tight mt-12 mb-4 pb-2"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {block.text}
          </h2>
        );

      case "h3":
        return (
          <h3
            key={idx}
            id={block.id}
            className="text-base font-semibold mt-8 mb-3"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            {block.text}
          </h3>
        );

      case "h4":
        return (
          <h4
            key={idx}
            className="text-sm font-semibold mt-6 mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {block.text}
          </h4>
        );

      case "h5":
        return (
          <h5
            key={idx}
            className="text-sm font-semibold mt-5 mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {block.text}
          </h5>
        );

      case "h6":
        return (
          <h6
            key={idx}
            className="text-xs font-semibold uppercase tracking-wide mt-4 mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {block.text}
          </h6>
        );

      case "p":
        return (
          <p
            key={idx}
            className="text-sm leading-relaxed mb-3 text-pretty"
            style={{ color: "var(--text-secondary)" }}
          >
            {renderInline(block.text)}
          </p>
        );

      case "blockquote":
        return (
          <blockquote
            key={idx}
            className="border-l-2 pl-4 my-3 text-sm"
            style={{
              borderLeftColor: "var(--border)",
              color: "var(--text-tertiary)",
            }}
          >
            {renderInline(block.text)}
          </blockquote>
        );

      case "hr":
        return (
          <hr
            key={idx}
            className="my-8"
            style={{ borderColor: "var(--border)" }}
          />
        );

      case "screenshot": {
        const src = getScreenshotSrc(block.id);
        if (!src) return null;
        return (
          <figure key={idx} className="my-6">
            <div
              className="relative w-full rounded-subtle overflow-hidden"
              style={{
                border: `1px solid var(--border)`,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Image
                src={src}
                alt={block.description || `Screenshot ${block.id}`}
                width={1200}
                height={675}
                className="w-full h-auto"
                unoptimized
              />
            </div>
            {block.description && (
              <figcaption
                className="text-xs mt-2 text-center"
                style={{ color: "var(--text-tertiary)" }}
              >
                {block.description}
              </figcaption>
            )}
          </figure>
        );
      }

      case "ul":
        return (
          <ul
            key={idx}
            className="list-disc pl-5 mb-3 space-y-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {block.items.map((item, j) => (
              <li key={j} className="text-sm leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );

      case "ol":
        return (
          <ol
            key={idx}
            className="list-decimal pl-5 mb-3 space-y-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {block.items.map((item, j) => (
              <li key={j} className="text-sm leading-relaxed">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );

      case "table":
        return (
          <div key={idx} className="overflow-x-auto my-4">
            <table
              className="w-full text-sm"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid var(--border)` }}>
                  {block.headers.map((h, j) => (
                    <th
                      key={j}
                      className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr
                    key={j}
                    style={{ borderBottom: `1px solid var(--border)` }}
                  >
                    {row.map((cell, k) => (
                      <td
                        key={k}
                        className="px-3 py-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guidelineJsonLd),
        }}
      />
      <TitleBar />

      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex gap-12">
          {/* 左侧目录 — 桌面端固定 */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav
              className="sticky top-24"
              style={{ maxHeight: "calc(100vh - 6rem)", overflowY: "auto" }}
            >
              {/* 返回首页 — 固定在侧边栏顶部 */}
              <Link
                href={homeHref}
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 mb-5 hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t.guideline.backToHome}
              </Link>

              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.guideline.toc}
              </p>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.anchorId}>
                    <a
                      href={`#${section.anchorId}`}
                      className="block text-xs py-1.5 transition-colors duration-200 rounded-subtle px-2"
                      style={{
                        color:
                          activeSection === section.anchorId
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                        background:
                          activeSection === section.anchorId
                            ? "var(--bg-surface-hover)"
                            : "transparent",
                      }}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* 右侧内容区 */}
          <main className="flex-1 min-w-0 pb-16">
            {sections.map((section) => (
              <section key={section.anchorId} id={section.anchorId} className="scroll-mt-20">
                <h2
                  className="text-lg font-bold tracking-tight mt-12 mb-4 pb-2"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {section.title}
                </h2>
                {section.blocks.map((block, idx) =>
                  renderBlock(block, idx)
                )}
              </section>
            ))}

            {/* 文档尾注 */}
            <hr className="my-12" style={{ borderColor: "var(--border)" }} />
            <p
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              {t.guideline.footerNote.split("{githubLink}")[0]}
              <a
                href="https://github.com/GavinCnod/deepseek-api-usage-analysis/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors duration-200"
                style={{ color: "var(--text-secondary)" }}
              >
                GitHub Issues
              </a>
              {t.guideline.footerNote.split("{githubLink}")[1]}
            </p>
          </main>
        </div>
      </div>

      <FooterBar />
    </div>
  );
}

/* ================================================================== */
/*  操作手册原始内容（Markdown）— 双语版本                                 */
/* ================================================================== */

/**
 * 返回完整的用户操作手册 Markdown 内容（双语版本）
 *
 * 根据 locale 参数返回对应语言的 Markdown 内容。
 *
 * 截图占位使用约定格式：
 *   > **[截图占位 - XX]**
 *   > *描述文本*
 *
 * 解析器会自动替换为对应 locale 的截图。
 */
function getManualContent(locale: string): string {
  if (locale === "zh") {
    return getManualContentZh();
  }
  return getManualContentEn();
}

/** 中文版操作手册内容 */
function getManualContentZh(): string {
  return `# DeepSeek API 用量分析仪表盘 — 用户操作手册

> 版本：v0.7.0 | 适用语言：中文 / English | 最后更新：2026-08-13

---

## 一、概述

DeepSeek API 用量分析仪表盘是一款**纯浏览器端运行**的数据可视化工具。您只需将 DeepSeek 平台导出的月度 CSV 账单文件拖拽到页面中，即可立即获得：

- **费用分析**：总费用、每日费用趋势、各 API Key 费用占比
- **用量分析**：总 Token 数、各 Key 用量明细、请求次数
- **缓存分析**：缓存命中率、每日命中率趋势、各 Key 命中/未命中对比
- **趋势分析**：在费用 / Token / 命中率 / 请求数四个维度间自由切换查看
- **社交媒体分享**：每个标签页可生成信息图分享图片，一键复制到微信/飞书/钉钉

**核心特点**：所有数据解析和图表渲染均在您的浏览器本地完成，CSV 文件不会上传到任何服务器，保障您的账单数据隐私。

> **[截图占位 - 01]**

---

## 二、快速开始

### 2.1 从 DeepSeek 平台导出数据

1. 登录 [DeepSeek 平台](https://platform.deepseek.com)
2. 进入「用量（Usage）」页面
3. 选择需要分析的月份，点击「导出（Export）」
4. 每个月会下载一个 **ZIP 压缩包**，内含两个 CSV 文件：
   - \`amount-YYYY-M.csv\` — 用量明细文件（包含 Token 消耗、请求次数、缓存命中/未命中等数据）
   - \`cost-YYYY-M.csv\` — 费用明细文件（包含按日的费用数据）

> **请注意**：ZIP 可以直接拖入上传区域，无需手动解压。两个 CSV 文件缺一不可——如果缺少 cost 文件，费用相关的图表将无法生成。

> **[截图占位 - 02]**

### 2.2 上传文件

1. 打开仪表盘页面（默认为落地页状态）
2. 将下载的 **ZIP 压缩包直接拖拽**到页面中央的上传区域（无需解压）
3. 也可以拖拽解压后的 CSV 文件，或**点击上传区域**通过系统文件选择器选择文件
4. 上传区域会显示「正在处理 CSV…」的加载状态
5. 处理完成后，页面将自动切换到仪表盘视图

> **支持同时上传多个月份**：一次性拖入所有月份的 ZIP（或 CSV）文件，系统会自动解压 ZIP、按文件名配对（如 \`amount-2026-5.csv\` + \`cost-2026-5.csv\`）并进行合并。

> **[截图占位 - 03]**

### 2.3 查看分析结果

上传完成后，页面会自动展示：

- 顶部 **KPI 指标卡**（总费用、总 Token 数、缓存命中率、活跃 API Key 数量）
- 通过下方标签页切换不同分析视图
- 如果有多个模型，可以使用模型筛选器单独查看某个模型的数据

---

## 三、导航栏使用说明

顶部导航栏固定在页面顶部，落地页和仪表盘页面共用。包含以下元素：

| 元素 | 说明 |
|------|------|
| **Logo 图标** | 左侧显示仪表盘应用图标 |
| **应用名称** | 「DeepSeek API 用量分析」|
| **GitHub 图标** | 点击跳转到项目 GitHub 仓库 |
| **语言切换器** | Apple 风格胶囊分段控件，支持 EN / 中文 |
| **主题切换器** | 太阳/月亮图标按钮，切换浅色/深色主题 |

导航栏底部有一条细分割线，背景为页面主色调，始终浮动在最上层。

> **[截图占位 - 04]**

---

## 四、仪表盘界面说明

上传 CSV 文件成功解析后，页面自动从落地页切换到仪表盘视图。

> **[截图占位 - 16]**

---

### 4.1 操作栏

位于页面上方，包含两部分：

**左侧 — 文件信息**：
- 显示文件名标签（如 \`2026-5\` 或 \`2026-5 ~ 2026-6\`，多月份时显示范围）
- 显示日期范围（如 \`2026-05-01 — 2026-05-31\`）

**右侧 — 操作按钮**：
- **加载其他文件**：点击触发文件选择器，可加载新的 CSV 文件（替换当前数据）
- **清除**（红色文字）：清空当前所有数据，返回落地页

> **[截图占位 - 17]**

---

### 4.2 错误与警告提示

#### 错误横幅

当 CSV 解析出现严重错误时显示，包含：

- 错误类型标题（如「CSV 格式无法识别」「CSV 解析错误」「空文件」「上传不完整」）
- 错误详细描述
- 错误所在行号和列号（如有）

视觉样式：淡红色背景 + 红色边框 + 红色文字。

#### 警告横幅

当数据存在非致命问题时显示，每条警告为独立横幅：

- 可能出现的警告类型：日期不匹配、缺少费用数据、缓存数据不完整、数据结构不一致

视觉样式：淡黄色背景 + 黄色边框 + 琥珀色文字。

---

### 4.3 KPI 指标卡

采用「无卡片」设计：4 列通栏大数字 + 细标签，底部以细横线分割。

| 指标 | 内容 |
|------|------|
| **总费用** | 格式化的货币金额，副行显示日期范围 |
| **总 Token 数** | 格式化的 Token 数量，副行显示模型数量 |
| **缓存命中率** | 百分比，副行显示由缓存节省的 Token 数 |
| **活跃 API Key** | 数字，无副行 |

> **[截图占位 - 20]**

---

### 4.4 标签导航与模型筛选

#### 标签导航

Apple 风格下划线标签，5 个标签页：

| 中文 | English |
|------|---------|
| 总览 | Overview |
| 按自定义项目 | By Custom Projects |
| 按 Key | By Key |
| 缓存 | Cache |
| 趋势 | Trends |

- 选中标签：底部 2px 边框 + 主色文字
- 未选中标签：无底部边框 + 三级文字颜色
- 切换时有渐入动画

#### 模型筛选器

当数据包含 2 个及以上模型时自动显示。Apple 风格胶囊分段控件：

- **全部模型**：默认选中，显示所有模型合并数据
- **单个模型名**：点击后仅显示该模型的数据

视觉：圆角胶囊组，选中项为深色填充 + 白色文字，未选中项透明白底 + 灰色文字。

---

### 4.5 总览视图

#### Hero 大数字

- **大数字**：超大粗体总费用金额
- **标签**：「总费用」
- **日期范围**：数据覆盖的时间范围

#### 每日费用柱状图

- 类型：ECharts 柱状图
- 内容：每日费用汇总，深色柱形，微圆角顶部
- 交互：支持悬停提示（显示具体日期和费用金额）
- x 轴超过 15 天时自动旋转日期标签

#### 各 Key 费用环形图

- 类型：ECharts 环形图（donut）
- 内容：各 API Key 费用占比
- 图例：垂直排列在右侧
- 交互：悬停高亮显示标签

> **[截图占位 - 23]**

---

### 4.6 按 Key 视图

#### Hero 大数字

- **大数字**：活跃 API Key 数量
- **标签**：「活跃 API Key」
- **副行**：Key 数量和模型数量

#### 各 Key 详情表格

通栏表格，包含以下列：

| 列名 | 说明 |
|------|------|
| API Key 名称 | 主色加粗文字 |
| Token 数 | 次级色右对齐 |
| 费用 | 主色加粗右对齐 |
| 缓存命中 | 颜色编码：>40% 绿色、20-40% 琥珀色、<20% 红色 |
| 请求数 | 次级色右对齐 |
| 费用占比条 | 浅背景轨道 + 深色填充条，宽度按费用比例计算 |

表格行 hover 时有极淡的背景色变化。

> **[截图占位 - 24]**

---

### 4.7 缓存视图

#### 有缓存数据时

##### Hero 大数字
- **大数字**：缓存命中率百分比
- **标签**：「缓存命中率」
- **副行**：由缓存提供的 Token 数量

##### 每日缓存命中率趋势图

- 类型：ECharts 折线图
- 内容：每日缓存命中率变化趋势（0-100%）
- 样式：绿色线条 + 极淡绿色半透明面积填充

##### 各 Key 缓存命中/未命中堆叠柱状图

- 类型：ECharts 堆叠柱状图
- 内容：每个 Key 的缓存命中（绿色）和未命中（灰色）Token 数
- 图例：底部显示「缓存命中」「缓存未命中」

#### 无缓存数据时

- 中央图标 + 「未检测到缓存使用」标题
- 「在 DeepSeek API 调用中启用提示缓存以降低费用。」提示文字

> **[截图占位 - 26]**

---

### 4.8 趋势视图

#### Hero 大数字（动态）

- 跟随当前选中的指标动态显示汇总值
- 格式按指标类型自动切换：费用 / Token / 缓存命中率 / 请求数

#### 指标切换器

- 4 个纯文字标签：每日费用 / 每日 Token / 缓存命中率 / 请求次数
- 选中标签带底部下划线
- 切换时 Hero 大数字和图表同步更新

#### 多指标折线图

- 类型：ECharts 折线图
- 内容：当前选中指标的每日趋势
- 样式：深色线条 + 极淡渐变面积填充
- 日期超过 30 天时启用内置缩放

> **[截图占位 - 28]**

> **[截图占位 - 29]**

---

### 4.9 按自定义项目视图

将 API Key 按自定义项目分组汇总分析，适合多项目团队按业务线查看用量。

> **[截图占位 - 30]**

#### Hero 数字

- **大数字**：当前配置的项目总数量
- **标签**：\`个项目\`
- **副标题**：\`{n} 个 Key · {m} 个模型\`，与按 Key 视图风格一致

#### 配置按钮

- 位置：\`按项目\` 标题行右侧
- 图标：齿轮图标 + \`配置\` 文字按钮
- 点击弹出配置浮窗

#### 配置浮窗

- **项目列表**：每个项目卡片包含：
  - 项目名称输入框（可编辑）
  - 已分配的 Key 小药丸（可拖拽、可点击 × 移除）
  - 移除项目按钮（垃圾桶图标）
- **添加项目**：虚线边框按钮，点击新增空白项目卡片
- **未分配 Key 区域**：底部独立区域，显示所有未分配到任何项目的 Key
- **拖拽操作**：
  - 将 Key 从未分配区域拖拽到某个项目卡片 → 分配 Key 至该项目
  - 将 Key 从项目卡片拖拽到未分配区域 → 移除 Key 的分配
  - 将 Key 在不同项目之间拖拽 → 重新分配
  - 拖入时目标区域高亮（accent 色边框 + 浅色背景）
- **保存 / 取消**：保存时过滤空名称项目，写入浏览器本地存储

#### 数据表格

布局与按 Key 视图一致：

| 列 | 说明 |
|----|------|
| Project | 项目名称（已配置项目为主色文字，未分类为三级文字） |
| Tokens | 完整 Token 数（逗号分隔，无缩写后缀） |
| Cost | 完整费用金额（¥ 符号 + 两位小数，可点击复制） |
| Cache Hit | 缓存命中率百分比（绿色 > 40%，琥珀色 20-40%，红色 < 20%） |
| Requests | 请求次数 |
| 占比条 | 费用横向占比条（未分类项半透明） |

- **未分类项**：只在实际有数据时才显示，始终排在表格末尾
- **排序**：按费用从高到低排列，未分类项始终在最后

> 项目配置保存在浏览器本地存储（localStorage），跨标签页自动同步。

---

## 五、全局功能说明

### 5.1 语言切换

位置：顶部导航栏右侧，Apple 风格胶囊分段控件。

- **EN**：切换到英文界面
- **中文**：切换到中文界面

语言偏好自动保存到浏览器本地存储，下次访问时自动恢复。首次访问时根据浏览器语言自动检测。

---

### 5.2 主题切换（浅色/深色）

位置：顶部导航栏最右侧，圆形图标按钮。

- **浅色模式**：冷灰纸质感背景，深色文字
- **深色模式**：纯黑背景，浅色文字

主题偏好自动保存到浏览器本地存储，并优先跟随系统偏好。

---

### 5.3 多月份合并

支持同时上传多个月份的 ZIP 或 CSV 文件，合并规则如下：

1. 如果上传的是 ZIP，系统首先解压提取其中的 CSV 文件
2. 系统读取每个文件名，提取年份-月份键
3. 将同名月份下的 amount 和 cost 文件自动配对
4. 配对成功后，所有月份数据合并为一个连续的 CSV 文本进行解析
5. 文件标签自动更新为范围格式

> **提示**：如果文件命名不规范，系统将退回到按前缀分组的兜底逻辑。

---

### 5.4 社交媒体分享

每个标签页均可生成一张 1200×630 的信息图分享图片，方便在微信、飞书、钉钉、Twitter 等社交平台传播。

**使用步骤：**

1. 在任意标签页的导航栏右侧，点击 **分享图标**（节点连线图标）
2. 在弹出窗口中填写：
   - **你的名字 / 团队名字**：显示为图片上大号 "From XXX" 署名（必填，自动记忆）
   - **自定义文案**：可选，以引文样式显示在卡片右上角（带示例占位文字）
3. 下方预览区实时显示卡片效果
4. 点击 **「生成并复制」**，图片自动复制到剪贴板，可直接粘贴到微信/飞书/钉钉
5. 也可点击 **「PNG」** 按钮下载图片文件

**卡片内容：**

- 顶部：应用名称 + 当前标签页名称 + "From XXX" 署名 + 自定义文案（如有）
- 左侧：标签页核心指标（总览=总费用 / 项目=项目数 / Key=Key数 / 缓存=命中率 / 趋势=总费用）+ KPI 数值
- 右侧：对应标签页的迷你 ECharts 图表（柱状图/折线图/横向柱状图）
- 底部：数据日期范围 + 应用 Logo + 二维码（指向 deepseek-usage.xyz）+ 品牌水印

> **提示**：复制到剪贴板后，在微信/飞书/钉钉的输入框中直接 \`Ctrl+V\`（或右键粘贴）即可发送图片。支持浅色/深色双主题。

---

## 六、CSV 文件格式说明

### amount CSV 格式

| 列名 | 说明 |
|------|------|
| \`utc_date\` | UTC 日期 |
| \`model\` | 模型名称 |
| \`api_key_name\` | API Key 名称 |
| \`api_key\` | API Key 值 |
| \`type\` | 类型枚举 |
| \`price\` | 单价（request_count 类型为空） |
| \`amount\` | 数量 |

### cost CSV 格式

| 列名 | 说明 |
|------|------|
| \`utc_date\` | UTC 日期 |
| \`model\` | 模型名称 |
| \`cost\` | 费用（按日汇总） |
| \`currency\` | 货币单位 |

### 注意事项

- 文件必须为 UTF-8 编码
- 列名必须完全匹配（大小写敏感）
- 可选列会被忽略，不会影响解析

---

## 七、隐私与安全说明

| 维度 | 说明 |
|------|------|
| **数据存储** | CSV 文件内容仅在浏览器内存中处理，不会写入磁盘或上传到任何服务器 |
| **网络请求** | 整个应用为静态站点，除初次加载页面资源外，不会发起任何数据上传请求 |
| **第三方依赖** | 所有依赖均在浏览器端运行，不通过外部 API 传输数据 |
| **开源透明** | 项目完全开源（GitHub），所有人都可以审查代码，验证隐私声明 |

---

## 八、常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 上传后无反应 | 文件不是 CSV 或 ZIP 格式 | 确认文件后缀为 .csv 或 .zip，不要上传 Excel 或 PDF |
| 显示「文件过大」警告 | 单个文件超过 50 MB | 正常 DeepSeek 月度导出通常小于 1 MB；如果文件异常大，请检查是否误选了其他文件 |
| 显示 CSV 格式无法识别 | 列名不匹配或文件损坏 | 确认从 DeepSeek 官方平台导出，不要修改 ZIP 内的文件内容 |
| 费用数据显示为 0 | 缺少 cost CSV 文件 | 确保 ZIP 包含当月完整的 amount 和 cost，或单独上传缺失文件 |
| 上传 ZIP 无反应 | ZIP 内无 CSV 文件 | 确认 ZIP 包内包含 .csv 文件，不要上传仅有其他格式的压缩包 |
| 图表中某一天无数据 | 当天没有 API 调用 | 正常现象，不影响其他天数据 |
| 缓存视图显示未检测到缓存使用 | API 调用未启用 prompt caching | 在调用 DeepSeek API 时开启提示缓存功能 |
| 显示上传不完整 | 某个月份只有 amount 或只有 cost | 补充缺失的文件重新上传 |
| 多月份合并后数据异常 | 文件命名不规范 | 确保 ZIP 内文件名或直接上传的 CSV 文件名为标准格式 |
`;
}

/** 英文版操作手册内容 */
function getManualContentEn(): string {
  return `# DeepSeek API Usage Analytics Dashboard — User Guide

> Version: v0.6.5 | Language: English / 中文 | Last Updated: 2026-07-12

---

## 1. Overview

The DeepSeek API Usage Analytics Dashboard is a **purely browser-side** data visualization tool. Simply drag your monthly CSV billing files exported from the DeepSeek Platform onto the page to instantly get:

- **Cost Analysis**: Total cost, daily cost trends, per API Key cost breakdown
- **Usage Analysis**: Total tokens, per-key usage details, request counts
- **Cache Analysis**: Cache hit rate, daily hit rate trends, per-key hits vs. misses comparison
- **Trend Analysis**: Freely switch between four metrics — cost / tokens / hit rate / requests
- **Social Media Sharing**: Generate infographic share images from each tab, one-click copy to WeChat/Feishu/DingTalk

**Key Feature**: All data parsing and chart rendering happens locally in your browser. CSV files are never uploaded to any server, ensuring your billing data privacy.

> **[截图占位 - 01]**

---

## 2. Quick Start

### 2.1 Export Data from DeepSeek Platform

1. Log in to [DeepSeek Platform](https://platform.deepseek.com)
2. Go to the "Usage" page
3. Select the month you want to analyze, click "Export"
4. Each month downloads a **ZIP archive** containing two CSV files:
   - \`amount-YYYY-M.csv\` — Usage details (tokens consumed, request counts, cache hit/miss data)
   - \`cost-YYYY-M.csv\` — Cost details (daily cost data)

> **Note**: The ZIP can be dragged directly into the upload area — no manual extraction needed. Both CSV files are required. Without the cost file, cost-related charts cannot be generated.

> **[截图占位 - 02]**

### 2.2 Upload Files

1. Open the dashboard page (landing page by default)
2. **Drag the downloaded ZIP archive directly** onto the upload area in the center of the page (no extraction needed)
3. You can also drag extracted CSV files, or **click the upload area** to select files via the system file picker
4. The upload area will show a "Processing CSV\u2026" loading state
5. Once processing is complete, the page automatically switches to the dashboard view

> **Multi-month support**: Drag in all monthly ZIP (or CSV) files at once — the system auto-extracts ZIPs, pairs files by filename (e.g., \`amount-2026-5.csv\` + \`cost-2026-5.csv\`), and merges them.

> **[截图占位 - 03]**

### 2.3 View Analytics

After upload completes, the page automatically displays:

- Top **KPI cards** (total cost, total tokens, cache hit rate, active API Keys)
- Switch between different analysis views via the tab bar below
- If multiple models are detected, use the model filter to view data for a specific model

---

## 3. Navigation Bar

The top navigation bar is fixed at the top of the page and shared between the landing page and dashboard views. It includes:

| Element | Description |
|---------|-------------|
| **Logo Icon** | Dashboard app icon on the left |
| **App Name** | "DeepSeek API Usage Analytics" |
| **GitHub Icon** | Click to open the project's GitHub repository |
| **Language Switcher** | Apple-style pill segmented control, supports EN / 中文 |
| **Theme Switcher** | Sun/Moon icon button to toggle light/dark theme |

The navigation bar has a thin bottom border and floats above all content.

> **[截图占位 - 04]**

---

## 4. Dashboard Interface

After CSV files are successfully parsed, the page automatically switches from the landing page to the dashboard view.

> **[截图占位 - 16]**

---

### 4.1 Action Bar

Located at the top of the page, with two sections:

**Left — File Info**:
- Displays the filename label (e.g., \`2026-5\` or \`2026-5 ~ 2026-6\` for multiple months)
- Displays the date range (e.g., \`2026-05-01 — 2026-05-31\`)

**Right — Action Buttons**:
- **Load Different Files**: Click to open the file picker and load new CSV files (replaces current data)
- **Clear** (red text): Clears all current data and returns to the landing page

> **[截图占位 - 17]**

---

### 4.2 Error and Warning Messages

#### Error Banners

Displayed when CSV parsing encounters critical errors, including:

- Error type title (e.g., "CSV Format Not Recognized", "CSV Parse Error", "Empty File", "Incomplete Upload")
- Detailed error description
- Row and column number where the error occurred (if applicable)

Visual style: light red background + red border + red text.

#### Warning Banners

Displayed when data has non-critical issues, each warning shown as an independent banner:

- Possible warning types: date mismatch, missing cost data, incomplete cache data, schema drift

Visual style: light amber background + amber border + amber text.

---

### 4.3 KPI Cards

"No-card" design: 4-column full-width large numbers + fine labels, separated by thin horizontal dividers.

| Metric | Content |
|--------|---------|
| **Total Cost** | Formatted currency amount, subtitle shows date range |
| **Total Tokens** | Formatted token count, subtitle shows model count |
| **Cache Hit Rate** | Percentage, subtitle shows tokens saved by cache |
| **Active API Keys** | Count, no subtitle |

> **[截图占位 - 20]**

---

### 4.4 Tab Navigation and Model Filter

#### Tab Navigation

Apple-style underline tabs, 5 tabs:

| English | 中文 |
|---------|------|
| Overview | 总览 |
| By Custom Projects | 按自定义项目 |
| By Key | 按 Key |
| Cache | 缓存 |
| Trends | 趋势 |

- Selected tab: 2px bottom border + primary text color
- Unselected tab: no bottom border + tertiary text color
- Smooth fade-in transition on tab switch

#### Model Filter

Automatically displayed when data contains 2 or more models. Apple-style pill segmented control:

- **All Models**: Default selection, shows merged data for all models
- **Individual Model Name**: Click to view data for that specific model

Visual: rounded pill group, selected item has dark fill + white text, unselected items have transparent background + gray text.

---

### 4.5 Overview View

#### Hero Number

- **Large number**: Extra-large bold total cost amount
- **Label**: "Total Cost"
- **Date range**: Time range covered by the data

#### Daily Cost Bar Chart

- Type: ECharts bar chart
- Content: Daily cost totals, dark bars with slightly rounded tops
- Interaction: hover tooltips (showing specific date and cost amount)
- X-axis labels auto-rotate when more than 15 days

#### Cost by Key Donut Chart

- Type: ECharts donut chart
- Content: Per API Key cost proportions
- Legend: vertically aligned on the right
- Interaction: hover highlights labels

> **[截图占位 - 23]**

---

### 4.6 By Key View

#### Hero Number

- **Large number**: Active API Key count
- **Label**: "Active API Keys"
- **Subtitle**: Key count and model count

#### Per-Key Details Table

Full-width table with the following columns:

| Column | Description |
|--------|-------------|
| API Key Name | Primary color, bold |
| Tokens | Secondary color, right-aligned |
| Cost | Primary color, bold, right-aligned |
| Cache Hit | Color-coded: >40% green, 20-40% amber, <20% red |
| Requests | Secondary color, right-aligned |
| Cost Bar | Light background track + dark fill bar, width proportional to cost |

Table rows have a subtle background color change on hover.

> **[截图占位 - 24]**

---

### 4.7 Cache View

#### With Cache Data

##### Hero Number
- **Large number**: Cache hit rate percentage
- **Label**: "Cache Hit Rate"
- **Subtitle**: Token count served from cache

##### Daily Cache Hit Rate Trend

- Type: ECharts line chart
- Content: Daily cache hit rate trend (0-100%)
- Style: green line + very light green semi-transparent area fill

##### Per-Key Cache Hits vs. Misses Stacked Bar Chart

- Type: ECharts stacked bar chart
- Content: Cache hits (green) and misses (gray) token counts per key
- Legend: "Cache Hits" and "Cache Misses" at the bottom

#### Without Cache Data

- Centered icon + "No Cache Usage Detected" title
- "Enable prompt caching in your DeepSeek API calls to reduce costs." hint text

> **[截图占位 - 26]**

---

### 4.8 Trends View

#### Hero Number (Dynamic)

- Dynamically displays the aggregate value for the currently selected metric
- Format auto-switches by metric type: cost / tokens / cache hit rate / requests

#### Metric Switcher

- 4 text labels: Daily Cost / Daily Tokens / Cache Hit Rate / Request Count
- Selected label has an underline
- Hero number and chart update synchronously on switch

#### Multi-Metric Line Chart

- Type: ECharts line chart
- Content: Daily trend for the currently selected metric
- Style: dark line + very light gradient area fill
- Built-in zoom enabled when date range exceeds 30 days

> **[截图占位 - 28]**

> **[截图占位 - 29]**

---

### 4.9 By Custom Projects View

Group API keys by custom project categories for team-level usage analysis across business lines.

> **[截图占位 - 30]**

#### Hero Number

- **Large number**: Total count of configured projects
- **Label**: \`Projects\`
- **Subtitle**: \`{n} key(s) · {m} model(s)\`, consistent with the By Key view

#### Configure Button

- Location: Right side of the \`By Project\` section title
- Icon: Gear icon + \`Configure\` text button
- Click opens the configuration modal

#### Configuration Modal

- **Project list**: Each project card contains:
  - Project name input (editable)
  - Assigned Key pills (draggable, click × to remove)
  - Remove project button (trash icon)
- **Add Project**: Dashed border button, click to add a blank project card
- **Unassigned Keys area**: Bottom section showing all keys not assigned to any project
- **Drag and drop**:
  - Drag a key from the unassigned area to a project card → assign key to that project
  - Drag a key from a project card to the unassigned area → remove assignment
  - Drag a key between project cards → reassign
  - Drop target highlights on drag-over (accent border + light background)
- **Save / Cancel**: Save filters out empty-name projects and writes to browser local storage

#### Data Table

Layout matches the By Key view:

| Column | Description |
|--------|-------------|
| Project | Project name (configured projects = primary color, uncategorized = tertiary) |
| Tokens | Full token count (comma-separated, no abbreviation suffix) |
| Cost | Full cost amount (¥ symbol + 2 decimals, clickable to copy) |
| Cache Hit | Cache hit rate percentage (green > 40%, amber 20-40%, red < 20%) |
| Requests | Request count |
| Bar | Cost proportion bar (semi-transparent for uncategorized items) |

- **Uncategorized row**: Only shown when it has data, always at the bottom
- **Sorting**: By cost descending, uncategorized always last

> Project configuration is saved in browser local storage with cross-tab auto-sync.

---

## 5. Global Features

### 5.1 Language Switching

Location: right side of the top navigation bar, Apple-style pill segmented control.

- **EN**: Switch to English interface
- **中文**: Switch to Chinese interface

Language preference is automatically saved to browser local storage and restored on the next visit. Auto-detected from browser language on first visit.

---

### 5.2 Theme Switching (Light/Dark)

Location: far right of the top navigation bar, circular icon button.

- **Light Mode**: Cold gray paper-texture background, dark text
- **Dark Mode**: Pure black background, light text

Theme preference is automatically saved to browser local storage, with system preference as the initial default.

---

### 5.3 Multi-Month Merge

Supports uploading multiple months of ZIP or CSV files simultaneously. Merge rules:

1. If ZIP files are uploaded, the system first extracts the CSV files inside
2. The system reads each filename and extracts the year-month key
3. Amount and cost files from the same month are automatically paired
4. After pairing, all monthly data is merged into a single continuous CSV text for parsing
5. The file label automatically updates to the range format

> **Tip**: If filenames don't follow the standard pattern, the system falls back to prefix-based grouping.

---

### 5.4 Social Media Sharing

Each dashboard tab can generate a 1200×630 infographic share image, ideal for sharing on WeChat, Feishu, DingTalk, Twitter, and other social platforms.

**Usage Steps:**

1. In any tab's navigation bar, click the **Share icon** (node-connection icon) on the right side
2. In the popup window, fill in:
   - **Your / Team Name**: displayed as a large "From XXX" signature on the image (required, auto-saved)
   - **Message**: optional, shown as a quote in the top-right corner of the card (with example placeholder text)
3. The preview area below shows the card in real time
4. Click **"Generate & Copy"** — the image is copied to clipboard, ready to paste directly into WeChat/Feishu/DingTalk
5. Alternatively, click **"PNG"** to download the image file

**Card Contents:**

- Top: App name + current tab label + "From XXX" signature + custom message (if any)
- Left: Tab-specific core metric (Overview=Total Cost / Projects=Project Count / Keys=Key Count / Cache=Hit Rate / Trends=Total Cost) + KPI values
- Right: Mini ECharts chart corresponding to the current tab (bar/line/horizontal bar)
- Bottom: Date range + App Logo + QR code (pointing to deepseek-usage.xyz) + brand watermark

> **Tip**: After copying, press \`Ctrl+V\` (or right-click paste) directly in a WeChat/Feishu/DingTalk input box to send the image. Supports both light and dark themes.

---

## 6. CSV File Format

### Amount CSV Format

| Column | Description |
|--------|-------------|
| \`utc_date\` | UTC date |
| \`model\` | Model name |
| \`api_key_name\` | API Key name |
| \`api_key\` | API Key value |
| \`type\` | Type enum |
| \`price\` | Unit price (empty for request_count type) |
| \`amount\` | Count |

### Cost CSV Format

| Column | Description |
|--------|-------------|
| \`utc_date\` | UTC date |
| \`model\` | Model name |
| \`cost\` | Cost (daily total) |
| \`currency\` | Currency unit |

### Notes

- Files must be UTF-8 encoded
- Column names must match exactly (case-sensitive)
- Optional columns are ignored and will not affect parsing

---

## 7. Privacy & Security

| Aspect | Description |
|--------|-------------|
| **Data Storage** | CSV file contents are processed only in browser memory — never written to disk or uploaded to any server |
| **Network Requests** | The entire app is a static site — aside from loading page resources initially, no data upload requests are made |
| **Third-Party Dependencies** | All dependencies run in the browser and do not transmit data through external APIs |
| **Open Source Transparency** | The project is fully open source (GitHub) — anyone can audit the code and verify privacy claims |

---

## 8. Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| No response after upload | File is not CSV or ZIP format | Ensure file extension is .csv or .zip — do not upload Excel or PDF files |
| "File too large" warning | A single file exceeds 50 MB | Normal DeepSeek monthly exports are typically under 1 MB; check if you selected the wrong file |
| "CSV Format Not Recognized" | Column names don't match or file is corrupted | Export from the official DeepSeek Platform; do not modify ZIP contents |
| Cost shows as 0 | Missing cost CSV file | Ensure the ZIP contains both amount and cost for the month, or upload the missing file separately |
| ZIP upload has no effect | ZIP contains no CSV files | Ensure the ZIP archive contains .csv files — do not upload archives with only other formats |
| Missing data for a specific day | No API calls on that day | Normal behavior — does not affect other days' data |
| Cache view shows "No Cache Usage Detected" | Prompt caching not enabled in API calls | Enable prompt caching in your DeepSeek API calls |
| "Incomplete Upload" shown | A month has only amount or only cost file | Add the missing file and re-upload |
| Data anomalies after multi-month merge | Non-standard filename format | Ensure filenames inside ZIP or directly uploaded CSVs follow the standard pattern |
`;
}

