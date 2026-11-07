"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useData } from "@/lib/DataContext";
import { useTranslation } from "@/i18n";
import { formatTokens } from "@/lib/format";
import { useTheme } from "@/lib/ThemeContext";

/**
 * 缓存视图：命中率 Gauge + 每日趋势 + 各 Key 堆叠柱状图
 *
 * Apple 极简风格 — 大数字 gaguge 用纯排版呈现，不用 ECharts gauge。
 * 日趋势图与堆叠图使用克制单色 + 主题感知。
 */
export default function CacheView() {
    const { filteredResult: result } = useData();
    const { locale, t } = useTranslation();
    const { theme } = useTheme();
    const daily = result?.daily;
    const summary = result?.summary;
    const isDark = theme === "dark";
    const textColor = isDark ? "#98989D" : "#86868B";
    const gridColor = isDark ? "#2C2C2E" : "#E5E5EA";

    const hasCache =
        (summary?.totalCacheHitTokens ?? 0) + (summary?.totalCacheMissTokens ?? 0) > 0;
    const hasTokenUsage = (summary?.totalTokens ?? 0) > 0;

    // 每日缓存命中率趋势
    const trendOption = useMemo(() => {
        if (!result || !daily) return {};

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
            tooltip: {
                trigger: "axis" as const,
                formatter: (params: unknown) => {
                    const p = params as { axisValue: string; data: number }[];
                    return `${p[0]?.axisValue}<br/>${t.cache.hitRateTitle}: ${(p[0]?.data * 100).toFixed(1)}%`;
                },
            },
            grid: { top: 8, right: 16, bottom: 24, left: 40 },
            xAxis: {
                type: "category" as const,
                data: dates,
                axisLabel: { fontSize: 10, color: textColor, rotate: dates.length > 15 ? 45 : 0 },
                axisLine: { lineStyle: { color: gridColor } },
            },
            yAxis: {
                type: "value" as const,
                min: 0,
                max: 1,
                axisLabel: { fontSize: 10, color: textColor, formatter: (v: number) => `${(v * 100).toFixed(0)}%` },
                splitLine: { lineStyle: { color: gridColor } },
            },
            series: [
                {
                    type: "line",
                    data: dates.map((d) => {
                        const h = hitsByDate.get(d) ?? 0;
                        const m = missesByDate.get(d) ?? 0;
                        return h + m > 0 ? +(h / (h + m)).toFixed(4) : 0;
                    }),
                    smooth: true,
                    lineStyle: { color: isDark ? "#34D399" : "#059669", width: 2 },
                    itemStyle: { color: isDark ? "#34D399" : "#059669" },
                    areaStyle: {
                        color: isDark ? "rgba(52,211,153,0.08)" : "rgba(5,150,105,0.06)",
                    },
                },
            ],
        };
    }, [result, daily, t.cache.hitRateTitle, isDark, textColor, gridColor]);

    // 各 Key 缓存命中 / 未命中堆叠柱状图（含命中率）
    const byKeyOption = useMemo(() => {
        if (!result || !daily) return {};

        const keyNames = [...new Set(daily.map((d) => d.apiKeyName))].filter((key) =>
          daily.some(
            (d) => d.apiKeyName === key && d.inputCacheHitTokens + d.inputCacheMissTokens > 0
          )
        );
        const hits = keyNames.map((k) =>
            daily.filter((d) => d.apiKeyName === k).reduce((s, d) => s + d.inputCacheHitTokens, 0)
        );
        const misses = keyNames.map((k) =>
            daily.filter((d) => d.apiKeyName === k).reduce((s, d) => s + d.inputCacheMissTokens, 0)
        );
        // 计算每个 Key 的缓存命中率
        const hitRates = hits.map((h, i) => h + misses[i] > 0 ? h / (h + misses[i]) : 0);

        const hitColor = isDark ? "#34D399" : "#059669";
        const missColor = isDark ? "#636366" : "#D2D2D7";

        return {
            tooltip: {
                trigger: "axis" as const,
                formatter: (params: unknown) => {
                    const p = params as { seriesName: string; value: number; dataIndex: number }[];
                    let result = "";
                    for (const item of p) {
                        result += `${item.seriesName}: ${formatTokens(item.value)}<br/>`;
                    }
                    // 追加缓存命中率
                    const rate = hitRates[p[0]?.dataIndex ?? 0] ?? 0;
                    result += `${t.cache.hitRateTitle}: ${(rate * 100).toFixed(1)}%`;
                    return result;
                },
            },
            legend: {
                data: [t.cache.hits, t.cache.misses],
                bottom: 0,
                textStyle: { fontSize: 11, color: textColor },
            },
            grid: { top: 24, right: 16, bottom: 36, left: 48 },
            xAxis: {
                type: "category" as const,
                data: keyNames,
                axisLabel: { fontSize: 10, color: textColor, rotate: keyNames.length > 5 ? 20 : 0 },
                axisLine: { lineStyle: { color: gridColor } },
            },
            yAxis: {
                type: "value" as const,
                axisLabel: { fontSize: 10, color: textColor, formatter: (v: number) => formatTokens(v) },
                splitLine: { lineStyle: { color: gridColor } },
            },
            series: [
                {
                    name: t.cache.hits,
                    type: "bar",
                    stack: "cache",
                    data: hits,
                    itemStyle: { color: hitColor, borderRadius: [0, 0, 0, 0] },
                    label: {
                        show: true,
                        position: "top" as const,
                        formatter: (p: { dataIndex: number }) =>
                            `${(hitRates[p.dataIndex] * 100).toFixed(0)}%`,
                        fontSize: 10,
                        color: textColor,
                        distance: 4,
                    },
                },
                {
                    name: t.cache.misses,
                    type: "bar",
                    stack: "cache",
                    data: misses,
                    itemStyle: { color: missColor, borderRadius: [4, 4, 0, 0] },
                },
            ],
        };
    }, [result, daily, t.cache.hits, t.cache.misses, t.cache.hitRateTitle, isDark, textColor, gridColor]);

    if (!result || !summary) return null;

    if (!hasCache) {
        return (
            <div className="py-16 text-center">
                <div className="text-2xl mb-4 opacity-40">💡</div>
                <p className="font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                    {hasTokenUsage ? t.cache.noCacheTitle : t.cache.noTokenTitle}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {hasTokenUsage ? t.cache.noCacheHint : t.cache.noTokenHint}
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* 大数字 Gauge — 纯排版，不用 ECharts */}
            <div className="text-center mb-12 pt-4">
                <div
                    className="text-5xl sm:text-6xl md:text-[5rem] font-bold leading-none tracking-tighter"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}
                >
                    {(summary.cacheHitRate * 100).toFixed(1)}
                    <span className="text-2xl ml-1">%</span>
                </div>
                <p className="text-sm font-semibold mt-3" style={{ color: "var(--text-secondary)" }}>
                    {t.cache.hitRateTitle}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    {t.cache.servedFromCache.replace("{tokens}", formatTokens(summary.totalCacheHitTokens, locale))}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3
                        className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {t.cache.dailyHitRate}
                    </h3>
                    <div aria-label={t.cache.dailyHitRate} role="img">
                      <ReactECharts option={trendOption} style={{ height: 300 }} />
                    </div>
                </div>
                <div>
                    <h3
                        className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {t.cache.hitsVsMisses}
                    </h3>
                    <div aria-label={t.cache.hitsVsMisses} role="img">
                      <ReactECharts option={byKeyOption} style={{ height: 300 }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
