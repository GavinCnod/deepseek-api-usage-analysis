import type { Locale } from "@/i18n";

/**
 * Format a cost value in CNY.
 * EN: ¥12,345.67  or ¥12.35K
 * ZH: ¥12,345.67  or ¥1.23万
 */
export function formatCost(yuan: number, locale: Locale): string {
  if (locale === "zh" && yuan >= 10000) {
    return `¥${(yuan / 10000).toFixed(2)}万`;
  }
  if (locale === "en" && yuan >= 10000) {
    return `¥${(yuan / 1000).toFixed(2)}K`;
  }
  return `¥${yuan.toFixed(2)}`;
}

/**
 * Format small costs without rounding them away.
 * Useful for per-call web tool charges (¥0.005) where formatCost would show ¥0.01.
 */
export function formatCostPrecise(yuan: number): string {
  if (yuan === 0) return "¥0.00";
  if (yuan < 0.01) {
    return `¥${yuan.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}`;
  }
  return `¥${yuan.toFixed(2)}`;
}

/**
 * Format a token count.
 * EN: 1.2M / 1K / 123
 * ZH: 1.234亿 / 1.2万 / 123
 */
export function formatTokens(n: number, locale?: Locale): string {
  if (locale === "zh") {
    if (n >= 100_000_000) {
      return `${Number((n / 100_000_000).toFixed(3))}亿`;
    }
    if (n >= 10_000) {
      return `${Number((n / 10_000).toFixed(1))}万`;
    }
  }
  if (n >= 1_000_000) return `${Number((n / 1_000_000).toFixed(1))}M`;
  if (n >= 1_000) return `${Number((n / 1_000).toFixed(0))}K`;
  return String(n);
}

/**
 * Format a ratio (0–1) as a percentage string.
 */
export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/**
 * Format a cost as a full number with no suffix abbreviation.
 * Always 2 decimals, comma-separated thousands.
 */
export function formatCostFull(yuan: number): string {
  return `¥${yuan.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a token count as a full number with no suffix abbreviation.
 * Comma-separated thousands.
 */
export function formatTokensFull(n: number): string {
  return n.toLocaleString("en-US");
}
