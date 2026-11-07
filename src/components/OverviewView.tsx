"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useData } from "@/lib/DataContext";
import { isWebToolModel } from "@/lib/dataKeys";
import { useTranslation } from "@/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { formatCost, formatCostPrecise } from "@/lib/format";
import { formatToolName } from "@/lib/toolNames";

/**
 * 总览视图：每日费用柱状图 + 各 Key 费用环形图
 *
 * Apple 极简风格 — 去除卡片容器，使用通栏模块 + 细横线分割。
 * ECharts 配色跟随全局 light/dark 主题。
 * 顶部 Hero 大数字展示总费用。
 */
export default function OverviewView() {
  const { filteredResult: result } = useData();
  const { locale, t } = useTranslation();
  const { theme } = useTheme();
  const daily = result?.daily;
  const keys = result?.keys;
  const summary = result?.summary;

  // 主题感知色
  const isDark = theme === "dark";
  const textColor = isDark ? "#98989D" : "#86868B";
  const gridColor = isDark ? "#2C2C2E" : "#E5E5EA";

  // 每日费用柱状图（模型 token 费用 + Web 工具费用堆叠）
  const hasTools =
    (summary?.totalToolCalls ?? 0) > 0 || (summary?.totalToolCost ?? 0) > 0;
  const dailyOption = useMemo(() => {
    if (!result || !daily) return {};

    const dates = [...new Set(daily.map((d) => d.date))].sort();
    const modelByDate = new Map<string, number>();
    const toolByDate = new Map<string, number>();
    for (const d of daily) {
      const target = isWebToolModel(d.model) ? toolByDate : modelByDate;
      target.set(d.date, (target.get(d.date) ?? 0) + (d.cost ?? 0));
    }

    const series = [
      {
        name: t.overview.modelCost,
        type: "bar" as const,
        stack: "cost",
        data: dates.map((d) => +(modelByDate.get(d) ?? 0).toFixed(4)),
        itemStyle: { color: isDark ? "#F5F5F7" : "#1D1D1F", borderRadius: [4, 4, 0, 0] },
      },
      ...(hasTools
        ? [{
            name: t.overview.webTools,
            type: "bar" as const,
            stack: "cost",
            data: dates.map((d) => +(toolByDate.get(d) ?? 0).toFixed(4)),
            itemStyle: { color: isDark ? "#98989D" : "#86868B", borderRadius: [4, 4, 0, 0] },
          }]
        : []),
    ];

    return {
      tooltip: {
        trigger: "axis" as const,
        valueFormatter: (v: unknown) => `¥${(v as number).toFixed(2)}`,
      },
      legend: hasTools
        ? {
            data: [t.overview.modelCost, t.overview.webTools],
            bottom: 0,
            textStyle: { fontSize: 10, color: textColor },
          }
        : undefined,
      grid: { top: 8, right: 16, bottom: hasTools ? 44 : 24, left: 48 },
      xAxis: {
        type: "category" as const,
        data: dates,
        axisLabel: { fontSize: 10, color: textColor, rotate: dates.length > 15 ? 45 : 0 },
        axisLine: { lineStyle: { color: gridColor } },
      },
      yAxis: {
        type: "value" as const,
        axisLabel: { fontSize: 10, color: textColor, formatter: (v: number) => `¥${v}` },
        splitLine: { lineStyle: { color: gridColor } },
      },
      series,
    };
  }, [result, daily, isDark, textColor, gridColor, hasTools, t.overview.modelCost, t.overview.webTools]);

  // 各 Key 费用环形图（donut）
  const donutOption = useMemo(() => {
    if (!result || !keys) return {};

    const data = keys.map((k) => ({
      name: k.apiKeyName,
      value: +k.totalCost.toFixed(4),
    }));

    // Apple 风格克制色调
    const palette = isDark
      ? ["#F5F5F7", "#D2D2D7", "#98989D", "#636366", "#48484A", "#38383A"]
      : ["#1D1D1F", "#636366", "#86868B", "#98989D", "#D2D2D7", "#E5E5EA"];

    return {
      tooltip: {
        trigger: "item" as const,
        valueFormatter: (v: unknown) => `¥${(v as number).toFixed(2)}`,
      },
      legend: {
        orient: "vertical" as const,
        right: 0,
        top: "center",
        textStyle: { fontSize: 11, color: textColor },
      },
      color: palette,
      series: [
        {
          type: "pie",
          radius: ["42%", "68%"],
          center: ["35%", "50%"],
          data,
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 12, fontWeight: "bold" as const },
          },
        },
      ],
    };
  }, [result, keys, isDark, textColor]);

  if (!result || !daily || !keys || !summary) return null;

  if (daily.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t.empty?.overview ?? "No data for the selected model. Try a different filter."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero — 大数字总费用 */}
      <div className="text-center mb-12 pt-4">
        <div
          className="text-5xl sm:text-6xl md:text-[5rem] font-bold leading-none tracking-tighter"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}
        >
          {formatCost(summary.totalCost, locale)}
        </div>
        <p className="text-sm font-semibold mt-3" style={{ color: "var(--text-secondary)" }}>
          {t.kpi.totalCost}
        </p>
        {summary.dateRange && (
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            {summary.dateRange.start} — {summary.dateRange.end}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div>
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.overview.dailyCost}
          </h3>
          <div aria-label={t.overview.dailyCost} role="img">
            <ReactECharts option={dailyOption} style={{ height: 300 }} />
          </div>
        </div>
        <div>
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.overview.costByKey}
          </h3>
          <div aria-label={t.overview.costByKey} role="img">
            <ReactECharts option={donutOption} style={{ height: 300 }} />
          </div>
        </div>
      </div>

      {hasTools && (
        <div
          className="flex flex-wrap items-baseline gap-x-5 gap-y-2 pt-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            {t.overview.webTools}
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {t.overview.toolCalls.replace("{calls}", String(summary.totalToolCalls))}
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {formatCostPrecise(summary.totalToolCost)}
          </span>
          {summary.totalToolCalls > 0 && (
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {t.overview.avgPerCall.replace(
                "{cost}",
                formatCostPrecise(summary.totalToolCost / summary.totalToolCalls)
              )}
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {summary.toolNames.map((name) => formatToolName(name, locale)).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
