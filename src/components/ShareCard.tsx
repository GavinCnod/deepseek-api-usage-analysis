"use client";

/**
 * 社交媒体分享卡片组件
 *
 * 为 5 个 tab 分别设计 1200×630 的信息图卡片，用于社交媒体分享。
 * 布局：左上三行信息 + 右侧 Tab 标签 → 左侧 Hero/KPI + 右侧 ECharts 图表 → 底部日期/Logo/QR/水印。
 * 通过 onChartsReady 回调通知父组件所有图表已渲染完毕。
 */

import { useMemo, useCallback, useRef } from "react";
import ReactECharts from "echarts-for-react";
import type { ParseResult, DailyUsage } from "@/lib/types";
import type { Locale } from "@/i18n";
import type { ShareCardData } from "@/lib/shareCardData";

// ============================================================================
// 常量
// ============================================================================

export const CARD_W = 1200;
export const CARD_H = 630;

// ============================================================================
// Props
// ============================================================================

export interface ShareCardStrings {
  tabLabel: string;
  appName: string;
  kpiTotalCost: string;
  kpiTotalTokens: string;
  kpiCacheHitRate: string;
  kpiActiveKeys: string;
  kpiModels: string;
  projectsLabel: string;
  keysLabel: string;
  tokensSavedLabel: string;
  uncategorizedLabel: string;
  cacheHitsLabel: string;
  cacheMissesLabel: string;
  peakLabel: string;
  lowestLabel: string;
  dailyAverageLabel: string;
  generatedBy: string;
  scanToVisit: string;
  costHeader: string;
  tokensHeader: string;
}

export interface ShareCardProps {
  /** 完整解析结果（用于图表数据） */
  result: ParseResult;
  /** 提取好的分享数据 */
  data: ShareCardData;
  /** 用户/团队名称 */
  fromName: string;
  /** 可选自定义文案 */
  customMessage?: string;
  /** 当前主题 */
  theme: "light" | "dark";
  /** 当前语言 */
  locale: Locale;
  /** 二维码 Data URL */
  qrDataUrl: string;
  /** 翻译字符串 */
  s: ShareCardStrings;
  /** 所有图表渲染完毕回调 */
  onChartsReady?: () => void;
}

// ============================================================================
// 主题色
// ============================================================================

function themeColors(isDark: boolean) {
  return {
    bg: isDark ? "#000000" : "#F5F5F7",
    bgSurface: isDark ? "#1C1C1E" : "#FFFFFF",
    textPrimary: isDark ? "#F5F5F7" : "#1D1D1F",
    textSecondary: isDark ? "#98989D" : "#86868B",
    textTertiary: isDark ? "#636366" : "#98989D",
    border: isDark ? "#38383A" : "#E5E5EA",
    positive: isDark ? "#34D399" : "#059669",
    chartGrid: isDark ? "#2C2C2E" : "#E5E5EA",
    chartText: isDark ? "#98989D" : "#86868B",
    chartLine: isDark ? "#F5F5F7" : "#1D1D1F",
    chartArea: isDark ? "rgba(245,245,247,0.06)" : "rgba(29,29,31,0.03)",
    barColor: isDark ? "#F5F5F7" : "#1D1D1F",
    cacheHitColor: isDark ? "#34D399" : "#059669",
    cacheMissColor: isDark ? "#636366" : "#D2D2D7",
  };
}

// ============================================================================
// 格式化
// ============================================================================

/** 用 Canvas 精确测量文本宽度，用于 JS 侧截断（避免 html2canvas CSS 截断问题） */
function truncateText(text: string, maxWidth: number, fontSize: number, maxLines: number): string {
  if (typeof document === "undefined") return text;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text;
  ctx.font = `italic ${fontSize}px "Hubot Sans", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`;

  let result = "";
  let currentLine = "";
  let lines = 0;

  for (const char of text) {
    const testLine = currentLine + char;
    if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
      lines++;
      if (lines >= maxLines) {
        // 已达最大行数：给当前行加省略号
        while (ctx.measureText(currentLine + "...").width > maxWidth && currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
        }
        return result + currentLine + "...";
      }
      result += currentLine + "\n";
      currentLine = char;
    } else {
      currentLine += char;
    }
  }
  return result + currentLine;
}

function fmtCost(yuan: number, locale: Locale): string {
  if (locale === "zh" && yuan >= 10000) return `¥${(yuan / 10000).toFixed(2)}万`;
  if (locale === "en" && yuan >= 10000) return `¥${(yuan / 1000).toFixed(2)}K`;
  return `¥${yuan.toFixed(2)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
}

function fmtPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function fmtRange(start: string, end: string): string {
  return `${start}  —  ${end}`;
}

// ============================================================================
// ECharts 配置生成器
// ============================================================================

/** Overview / Trends 每日费用柱状图或折线图 */
function buildDailyCostChart(
  daily: DailyUsage[],
  type: "bar" | "line",
  c: ReturnType<typeof themeColors>,
) {
  const dates = [...new Set(daily.map((d) => d.date))].sort();
  const byDate = new Map<string, number>();
  for (const d of daily) byDate.set(d.date, (byDate.get(d.date) ?? 0) + (d.cost ?? 0));

  return {
    grid: { top: 10, right: 12, bottom: 28, left: 44 },
    xAxis: {
      type: "category" as const,
      data: dates,
      axisLabel: { fontSize: 9, color: c.chartText, rotate: dates.length > 20 ? 45 : 0 },
      axisLine: { lineStyle: { color: c.chartGrid } },
    },
    yAxis: {
      type: "value" as const,
      axisLabel: { fontSize: 9, color: c.chartText, formatter: (v: number) => `¥${v}` },
      splitLine: { lineStyle: { color: c.chartGrid } },
    },
    series: [{
      type,
      data: dates.map((d) => +(byDate.get(d) ?? 0).toFixed(4)),
      ...(type === "bar"
        ? { itemStyle: { color: c.barColor, borderRadius: [3, 3, 0, 0] } }
        : {
            smooth: true,
            lineStyle: { color: c.chartLine, width: 2 },
            itemStyle: { color: c.chartLine },
            areaStyle: { color: c.chartArea },
          }),
    }],
  };
}

/** Keys / Projects 横向柱状图 */
function buildHorizontalBarChart(
  items: { name: string; value: number }[],
  valueFormatter: (v: number) => string,
  c: ReturnType<typeof themeColors>,
) {
  const data = [...items].reverse(); // ECharts 从下往上渲染
  return {
    grid: { top: 4, right: 16, bottom: 4, left: 100, containLabel: false },
    xAxis: {
      type: "value" as const,
      axisLabel: { fontSize: 9, color: c.chartText, formatter: valueFormatter },
      splitLine: { lineStyle: { color: c.chartGrid } },
    },
    yAxis: {
      type: "category" as const,
      data: data.map((d) => d.name),
      axisLabel: { fontSize: 10, color: c.textPrimary, width: 90, overflow: "truncate" as const },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [{
      type: "bar",
      data: data.map((d) => d.value),
      itemStyle: { color: c.barColor, borderRadius: [0, 3, 3, 0] },
      barMaxWidth: 20,
    }],
  };
}

/** Cache 每日命中率折线图 */
function buildCacheHitRateChart(
  daily: DailyUsage[],
  c: ReturnType<typeof themeColors>,
) {
  const dates = [...new Set(
    daily
      .filter((d) => d.inputCacheHitTokens + d.inputCacheMissTokens > 0)
      .map((d) => d.date)
  )].sort();
  const hitsByDate = new Map<string, number>();
  const missesByDate = new Map<string, number>();
  for (const d of daily) {
    hitsByDate.set(d.date, (hitsByDate.get(d.date) ?? 0) + d.inputCacheHitTokens);
    missesByDate.set(d.date, (missesByDate.get(d.date) ?? 0) + d.inputCacheMissTokens);
  }

  return {
    grid: { top: 10, right: 12, bottom: 28, left: 44 },
    xAxis: {
      type: "category" as const,
      data: dates,
      axisLabel: { fontSize: 9, color: c.chartText, rotate: dates.length > 20 ? 45 : 0 },
      axisLine: { lineStyle: { color: c.chartGrid } },
    },
    yAxis: {
      type: "value" as const,
      min: 0, max: 1,
      axisLabel: { fontSize: 9, color: c.chartText, formatter: (v: number) => `${(v * 100).toFixed(0)}%` },
      splitLine: { lineStyle: { color: c.chartGrid } },
    },
    series: [{
      type: "line",
      data: dates.map((d) => {
        const h = hitsByDate.get(d) ?? 0;
        const m = missesByDate.get(d) ?? 0;
        return h + m > 0 ? +(h / (h + m)).toFixed(4) : 0;
      }),
      smooth: true,
      lineStyle: { color: c.cacheHitColor, width: 2 },
      itemStyle: { color: c.cacheHitColor },
      areaStyle: { color: c.chartArea },
    }],
  };
}

// ============================================================================
// 主组件
// ============================================================================

export default function ShareCard({
  result, data, fromName, customMessage, theme, locale, qrDataUrl, s, onChartsReady,
}: ShareCardProps) {
  const isDark = theme === "dark";
  const c = themeColors(isDark);

  // 图表就绪计数
  const readyCountRef = useRef(0);
  const expectedCharts = 1; // 每个卡片 1 个图表
  const handleChartReady = useCallback(() => {
    readyCountRef.current += 1;
    if (readyCountRef.current >= expectedCharts) {
      onChartsReady?.();
    }
  }, [onChartsReady]);

  const dateRangeStr = (() => {
    if ("dateRange" in data && data.dateRange)
      return fmtRange(data.dateRange.start, data.dateRange.end);
    return null;
  })();

  // 截断自定义文案（JS 侧截断，末尾加空行避免 html2canvas 裁边）
  const truncatedMessage = customMessage ? truncateText(`\u201c${customMessage}\u201d`, 420, 16, 2) + "\n" : null;
  const chartOption = useMemo(() => {
    switch (data.tab) {
      case "overview":
        return buildDailyCostChart(result.daily, "bar", c);
      case "trends":
        return buildDailyCostChart(result.daily, "line", c);
      case "projects":
        return buildHorizontalBarChart(
          data.topProjects
            .filter((p) => p.totalCost > 0)
            .map((p) => ({ name: p.name, value: p.totalCost })),
          (v: number) => `¥${v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(0)}`,
          c,
        );
      case "keys":
        return buildHorizontalBarChart(
          data.topKeys
            .filter((k) => k.totalCost > 0)
            .map((k) => ({ name: k.name, value: k.totalCost })),
          (v: number) => `¥${v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(0)}`,
          c,
        );
      case "cache":
        return buildCacheHitRateChart(result.daily, c);
    }
  }, [data, result.daily, c]);

  // 构建 KPI 网格项（统一格式）
  const kpiItems: { value: string; label: string }[] = (() => {
    switch (data.tab) {
      case "overview":
        return [
          { value: fmtTokens(data.totalTokens), label: s.kpiTotalTokens },
          { value: fmtPercent(data.cacheHitRate), label: s.kpiCacheHitRate },
          { value: String(data.activeKeys), label: s.kpiActiveKeys },
          { value: String(data.modelCount), label: s.kpiModels },
        ];
      case "projects": {
        const totalCost = data.topProjects.reduce((sum, p) => sum + p.totalCost, 0);
        const totalTokens = data.topProjects.reduce((sum, p) => sum + p.totalTokens, 0);
        return [
          { value: fmtCost(totalCost, locale), label: s.kpiTotalCost },
          { value: fmtTokens(totalTokens), label: s.kpiTotalTokens },
          { value: `${data.keyCount} Keys`, label: s.kpiActiveKeys },
        ];
      }
      case "keys":
        return [
          { value: fmtCost(data.totalCost, locale), label: s.kpiTotalCost },
          { value: fmtTokens(data.topKeys.reduce((s, k) => s + k.totalTokens, 0)), label: s.kpiTotalTokens },
          { value: String(data.modelCount), label: s.kpiModels },
        ];
      case "cache":
        return [
          { value: fmtTokens(data.hitTokens), label: s.cacheHitsLabel },
          { value: fmtTokens(data.missTokens), label: s.cacheMissesLabel },
          { value: fmtTokens(data.tokensSaved), label: s.tokensSavedLabel },
        ];
      case "trends":
        return [
          { value: fmtCost(data.peakValue, locale), label: s.peakLabel },
          { value: fmtCost(data.lowestValue, locale), label: s.lowestLabel },
          { value: fmtCost(data.dailyAverage, locale), label: s.dailyAverageLabel },
        ];
    }
  })();

  // 渲染 Hero + KPI（左侧列，左对齐）
  const renderHero = () => {
    const heroText = (() => {
      switch (data.tab) {
        case "overview": return fmtCost(data.totalCost, locale);
        case "projects": return String(data.projectCount);
        case "keys": return String(data.keyCount);
        case "cache": return fmtPercent(data.cacheHitRate);
        case "trends": return fmtCost(data.totalValue, locale);
      }
    })();
    const heroLabel = (() => {
      switch (data.tab) {
        case "overview": return s.kpiTotalCost;
        case "projects": return s.projectsLabel;
        case "keys": return s.keysLabel;
        case "cache": return s.kpiCacheHitRate;
        case "trends": return data.tab === "trends" ? (data as { metricLabel: string }).metricLabel : "";
      }
    })();
    const heroColor = data.tab === "cache" ? c.positive : c.textPrimary;

    return (
      <div>
        {/* Hero 大数字 */}
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.04em", color: heroColor }}>
          {heroText}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: c.textSecondary, marginTop: 4 }}>
          {heroLabel}
        </div>

        {/* KPI 两列网格 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginTop: 20 }}>
          {kpiItems.map((item, i) => (
            <div key={i} style={{ minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: c.textPrimary, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {item.value}
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, color: c.textTertiary, marginTop: 2, letterSpacing: "0.03em", textTransform: "uppercase" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="share-card-root"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: c.bg,
        fontFamily: '"Hubot Sans", -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif',
        padding: "40px 52px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ================================================================ */}
      {/* 第一行：Header */}
      {/* ================================================================ */}
      <div style={{ marginBottom: 16 }}>
        {/* 第一行：App 名称 · Tab 标签（左） + 自定义文案（右上角） */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: c.textPrimary, letterSpacing: "-0.02em" }}>
            {s.appName}
            <span style={{ fontWeight: 500, color: c.textTertiary, marginLeft: 8 }}>
              &middot; {s.tabLabel}
            </span>
          </div>
          {truncatedMessage && (
            <span style={{
              fontSize: 16, fontStyle: "italic", color: c.textTertiary,
              lineHeight: 1.4, maxWidth: 420, textAlign: "right",
              whiteSpace: "pre-line",
            }}>
              {truncatedMessage}
            </span>
          )}
        </div>

        {/* 第二行：From XXX — 大号字体 */}
        <div style={{ fontSize: 42, fontWeight: 700, color: c.textPrimary, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 4 }}>
          From {fromName}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 第二行：Hero/KPI（左）+ 图表（右） */}
      {/* ================================================================ */}
      <div style={{ display: "flex", gap: 40, flex: 1, alignItems: "center", minHeight: 0 }}>
        {/* 左侧：Hero + KPI */}
        <div style={{ width: 300, flexShrink: 0 }}>
          {renderHero()}
        </div>

        {/* 右侧：图表 */}
        <div style={{ flex: 1, height: "100%", minWidth: 0 }}>
          {chartOption && (
            <ReactECharts
              option={chartOption}
              style={{ width: "100%", height: "100%" }}
              opts={{ renderer: "canvas" }}
              onChartReady={() => {
                // 延迟一小段时间确保渲染完成
                setTimeout(() => handleChartReady(), 200);
              }}
            />
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 第三行：Footer */}
      {/* ================================================================ */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
        {/* 日期范围 */}
        <div>
          {dateRangeStr && (
            <span style={{ fontSize: 12, color: c.textTertiary, letterSpacing: "0.02em" }}>
              {dateRangeStr}
            </span>
          )}
        </div>

        {/* 水印文字 + Logo + QR */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* 水印文字 */}
          <span style={{ fontSize: 9, color: c.textTertiary, opacity: 0.4, textAlign: "right", lineHeight: 1.4 }}>
            {s.generatedBy}<br />deepseek-usage.xyz
          </span>

          {/* 应用 Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element -- 分享卡片会被 html2canvas 捕获为 PNG，固定尺寸静态资源直接使用 img 更稳定。 */}
          <img
            src="/ds-usage-logo.png"
            alt="Logo"
            width={44}
            height={44}
            style={{ borderRadius: 6, display: "block" }}
          />

          {/* 二维码 */}
          {/* eslint-disable-next-line @next/next/no-img-element -- 二维码为运行时 data URL，直接使用 img 可避免 next/image 对导出截图链路的额外干预。 */}
          <img
            src={qrDataUrl}
            alt="QR"
            width={44}
            height={44}
            style={{ display: "block", borderRadius: 4 }}
          />
        </div>
      </div>
    </div>
  );
}
