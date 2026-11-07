"use client";

import { useMemo } from "react";
import { useData } from "@/lib/DataContext";
import { isWebToolModel } from "@/lib/dataKeys";
import { useTranslation } from "@/i18n";
import { formatCost, formatCostPrecise, formatTokens, formatPercent } from "@/lib/format";
import { useTheme } from "@/lib/ThemeContext";
import CopyButton from "@/components/CopyButton";

/**
 * Key 详情表格视图
 *
 * Apple 极简风格 — 不包裹卡片，通栏表格。
 * 行 hover 用极淡底色；进度条使用哑光黑/白。
 * 颜色通过 CSS 变量驱动。
 * 顶部 Hero 大数字展示活跃 Key 数量。
 */
export default function KeyView() {
  const { filteredResult: result } = useData();
  const { locale, t } = useTranslation();
  const { theme } = useTheme();
  const keys = result?.keys;
  const daily = result?.daily;

  const isDark = theme === "dark";
  const maxCost = Math.max(...(keys ?? []).map((k) => k.totalCost), 1);

  const modelCount = useMemo(
    () => new Set((daily ?? []).filter((d) => !isWebToolModel(d.model)).map((d) => d.model)).size,
    [daily]
  );

  if (!result || !keys || !daily) return null;

  if (keys.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t.empty?.keys ?? "No API keys found in the data."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero — 大数字活跃 Key 数 */}
      <div className="text-center mb-12 pt-4">
        <div
          className="text-5xl sm:text-6xl md:text-[5rem] font-bold leading-none tracking-tighter"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}
        >
          {keys.length}
        </div>
        <p className="text-sm font-semibold mt-3" style={{ color: "var(--text-secondary)" }}>
          {t.kpi.activeKeys}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          {t.keys.heroSubtitle
            .replace("{keys}", String(keys.length))
            .replace("{models}", String(modelCount))}
        </p>
      </div>

      <h3
        className="text-[11px] font-semibold uppercase tracking-widest mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {t.keys.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border)` }}>
              <th
                className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.keys.apiKeyName}
              </th>
              <th
                className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.keys.tokens}
              </th>
              <th
                className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.keys.cost}
              </th>
              <th
                className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.keys.cacheHit}
              </th>
              <th
                className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.keys.requests}
              </th>
              <th
                className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t.keys.tools}
              </th>
              <th className="px-3 py-2.5 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr
                key={k.apiKeyName}
                className="group transition-colors duration-150"
                style={{ borderBottom: `1px solid var(--border)` }}
              >
                <td
                  className="px-3 py-3 font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {k.apiKeyName}
                </td>
                <td
                  className="px-3 py-3 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {formatTokens(k.totalTokens, locale)}
                </td>
                <td
                  className="px-3 py-3 text-right font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CopyButton
                    value={k.totalCost}
                    name={k.apiKeyName}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-70"
                  >
                    {formatCost(k.totalCost, locale)}
                  </CopyButton>
                </td>
                <td className="px-3 py-3 text-right">
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: k.cacheHitRate > 0.4
                        ? "var(--positive)"
                        : k.cacheHitRate > 0.2
                          ? "var(--warning-text)"
                          : "var(--danger)",
                    }}
                  >
                    {formatPercent(k.cacheHitRate)}
                  </span>
                </td>
                <td
                  className="px-3 py-3 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {k.requestCount.toLocaleString()}
                </td>
                <td
                  className="px-3 py-3 text-right text-xs"
                  style={{ color: k.toolCost > 0 ? "var(--text-secondary)" : "var(--text-tertiary)" }}
                >
                  {k.toolCost > 0
                    ? k.toolCallCount > 0
                      ? `${k.toolCallCount.toLocaleString()} · ${formatCostPrecise(k.toolCost)}`
                      : formatCostPrecise(k.toolCost)
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  <div
                    className="w-24 h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(k.totalCost / maxCost) * 100}%`,
                        background: isDark ? "var(--text-primary)" : "var(--accent)",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
