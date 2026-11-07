/**
 * 分享卡片数据提取模块
 *
 * 从 ParseResult 中提取各 tab 分享卡片所需的汇总数据。
 * 每个 tab 独立计算，返回用于 ShareCard 渲染的扁平数据结构。
 */

import type { ParseResult } from "./types";
import type { ProjectDef } from "./ProjectConfigContext";
import { UNCATEGORIZED } from "./ProjectConfigContext";

/** Dashboard 中的 Tab 类型 */
export type ShareTab = "overview" | "projects" | "keys" | "cache" | "trends";

// ============================================================================
// 各 tab 数据接口
// ============================================================================

export interface OverviewShareData {
  tab: "overview";
  totalCost: number;
  totalTokens: number;
  cacheHitRate: number;
  activeKeys: number;
  modelCount: number;
  dateRange: { start: string; end: string } | null;
  dailyAverageCost: number;
}

export interface ProjectShareData {
  tab: "projects";
  projectCount: number;
  keyCount: number;
  modelCount: number;
  dateRange: { start: string; end: string } | null;
  /** 全部已分类项目（按费用排序） */
  topProjects: { name: string; totalCost: number; totalTokens: number; requestCount: number }[];
}

export interface KeyShareData {
  tab: "keys";
  keyCount: number;
  modelCount: number;
  dateRange: { start: string; end: string } | null;
  totalCost: number;
  topKeys: { name: string; totalCost: number; totalTokens: number }[];
}

export interface CacheShareData {
  tab: "cache";
  cacheHitRate: number;
  hitTokens: number;
  missTokens: number;
  tokensSaved: number;
  dateRange: { start: string; end: string } | null;
}

export interface TrendsShareData {
  tab: "trends";
  metricLabel: string;
  totalValue: number;
  peakValue: number;
  lowestValue: number;
  dailyAverage: number;
  dateRange: { start: string; end: string } | null;
}

export type ShareCardData =
  | OverviewShareData
  | ProjectShareData
  | KeyShareData
  | CacheShareData
  | TrendsShareData;

// ============================================================================
// 数据提取函数
// ============================================================================

function extractOverviewData(result: ParseResult): OverviewShareData {
  const { summary, daily } = result;
  const days = daily.length > 0
    ? [...new Set(daily.map((d) => d.date))].length
    : 1;

  return {
    tab: "overview",
    totalCost: summary.totalCost,
    totalTokens: summary.totalTokens,
    cacheHitRate: summary.cacheHitRate,
    activeKeys: summary.activeKeys,
    modelCount: summary.models.length,
    dateRange: summary.dateRange,
    dailyAverageCost: summary.totalCost / days,
  };
}

function extractProjectData(
  result: ParseResult,
  config: ProjectDef[],
  uncategorizedLabel: string
): ProjectShareData {
  const { daily, summary } = result;
  const allKeys = [...new Set(daily.map((d) => d.apiKeyName))];

  const map = new Map<string, { name: string; totalCost: number; totalTokens: number; requestCount: number; isUncategorized: boolean }>();

  for (const p of config) {
    map.set(p.name, { name: p.name, totalCost: 0, totalTokens: 0, requestCount: 0, isUncategorized: false });
  }
  map.set(UNCATEGORIZED, { name: uncategorizedLabel, totalCost: 0, totalTokens: 0, requestCount: 0, isUncategorized: true });

  for (const d of daily) {
    const lowerName = d.apiKeyName.toLowerCase();
    let matched = UNCATEGORIZED;
    for (const p of config) {
      if (p.keyNames.some((k) => k.toLowerCase() === lowerName)) {
        matched = p.name;
        break;
      }
    }
    const entry = map.get(matched);
    if (!entry) continue;
    entry.totalTokens += d.outputTokens + d.inputCacheHitTokens + d.inputCacheMissTokens;
    entry.totalCost += d.cost ?? 0;
    entry.requestCount += d.requestCount;
  }

  const projects = Array.from(map.values())
    .filter((p) => !p.isUncategorized || p.totalTokens > 0 || p.totalCost > 0)
    .sort((a, b) => b.totalCost - a.totalCost);

  const activeCount = projects.filter((p) => !p.isUncategorized).length;

  return {
    tab: "projects",
    projectCount: activeCount,
    keyCount: allKeys.length,
    modelCount: summary.models.length,
    dateRange: summary.dateRange,
    topProjects: projects.slice(0, 8).map((p) => ({
      name: p.name,
      totalCost: p.totalCost,
      totalTokens: p.totalTokens,
      requestCount: p.requestCount,
    })),
  };
}

function extractKeyData(result: ParseResult): KeyShareData {
  const { keys, summary } = result;
  return {
    tab: "keys",
    keyCount: keys.length,
    modelCount: summary.models.length,
    dateRange: summary.dateRange,
    totalCost: summary.totalCost,
    topKeys: keys.slice(0, 8).map((k) => ({
      name: k.apiKeyName,
      totalCost: k.totalCost,
      totalTokens: k.totalTokens,
    })),
  };
}

function extractCacheData(result: ParseResult): CacheShareData {
  const { summary } = result;
  return {
    tab: "cache",
    cacheHitRate: summary.cacheHitRate,
    hitTokens: summary.totalCacheHitTokens,
    missTokens: summary.totalCacheMissTokens,
    tokensSaved: summary.totalCacheHitTokens,
    dateRange: summary.dateRange,
  };
}

function extractTrendsData(result: ParseResult, metricLabel: string): TrendsShareData {
  const { daily, summary } = result;
  const dateMap = new Map<string, number>();
  for (const d of daily) {
    dateMap.set(d.date, (dateMap.get(d.date) ?? 0) + (d.cost ?? 0));
  }
  const dailyCosts = [...dateMap.values()];
  const peakValue = dailyCosts.length > 0 ? Math.max(...dailyCosts) : 0;
  const lowestValue = dailyCosts.length > 0 ? Math.min(...dailyCosts) : 0;
  const days = dailyCosts.length || 1;

  return {
    tab: "trends",
    metricLabel,
    totalValue: summary.totalCost,
    peakValue,
    lowestValue,
    dailyAverage: summary.totalCost / days,
    dateRange: summary.dateRange,
  };
}

// ============================================================================
// 统一入口
// ============================================================================

export interface ShareCardDataOptions {
  tab: ShareTab;
  result: ParseResult;
  projectConfig?: ProjectDef[];
  uncategorizedLabel?: string;
  trendMetricLabel?: string;
}

export function extractShareCardData(options: ShareCardDataOptions): ShareCardData {
  const { tab, result, projectConfig = [], uncategorizedLabel = "Uncategorized", trendMetricLabel = "Daily Cost" } = options;

  switch (tab) {
    case "overview":
      return extractOverviewData(result);
    case "projects":
      return extractProjectData(result, projectConfig, uncategorizedLabel);
    case "keys":
      return extractKeyData(result);
    case "cache":
      return extractCacheData(result);
    case "trends":
      return extractTrendsData(result, trendMetricLabel);
  }
}
