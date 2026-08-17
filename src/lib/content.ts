/**
 * Blog 文章内容结构化类型
 *
 * 每篇文章的 en/zh 内容以 ArticleSection[] 存储，
 * ArticleRenderer 负责将它们渲染成 Apple-minimalist 排版。
 *
 * 段落中的 inline HTML（<strong>, <em>, <a>, <code>）通过 dangerouslySetInnerHTML 渲染 —
 * 内容来自项目自身的 translations / content 模块，不存在 XSS 风险。
 */

/** 段落内联内容块 */
export interface InlineSegment {
  text: string;
  strong?: boolean;
}

/** 富文本段落：由一个或多个 inline segment 组成 */
export interface RichParagraph {
  segments: ({
    type: "text";
    text: string;
  } | {
    type: "strong";
    text: string;
  } | {
    type: "link";
    text: string;
    href: string;
    internal?: boolean;
  } | {
    type: "code";
    text: string;
  } | {
    type: "em";
    text: string;
  })[];
}

/** 单个内容块 */
export type ContentBlock =
  | { type: "h3"; content: string }
  | { type: "p"; content: string }                          // 纯文本段落（支持 <strong> <em> <a> <code> HTML）
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "inline_code"; content: string }
  | { type: "compare_note"; content: string };

/** 文章的一个章节 */
export interface ArticleSection {
  heading: string;
  blocks: ContentBlock[];
}

/** 定价对比表行 */
export interface PricingRow {
  model: string;
  modelColor?: string;
  /** 单元格内容；数组时渲染为多行堆叠（如高峰/闲时 双币种） */
  input: string | string[];
  inputColor?: string;
  output: string | string[];
  outputColor?: string;
  cacheHit: string | string[];
  cacheHitColor?: string;
  notes: string;
}

/** 完整文章内容（单语言） */
export interface ArticleContent {
  sections: ArticleSection[];
  pricingTable?: {
    headers: string[];
    rows: PricingRow[];
  };
}
