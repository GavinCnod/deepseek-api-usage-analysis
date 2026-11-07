"use client";

import { useData } from"@/lib/DataContext";
import { useTranslation } from"@/i18n";
import { formatCost, formatCostPrecise, formatTokens, formatPercent } from"@/lib/format";

/**
 * KPI 指标卡片
 *
 * Apple 极简风格 — "无卡片"设计：大数字 + 细标签。
 * 用微妙的横线分割组间，而非封闭卡片。
 * 大幅增加垂直间距，营造呼吸感。
 */
export default function KPICards() {
 const { result } = useData();
 const { locale, t } = useTranslation();
 if (!result) return null;

 const { summary } = result;

 const items = [
  {
  value: formatCost(summary.totalCost, locale),
  label: t.kpi.totalCost,
  sub: summary.dateRange
   ? `${summary.dateRange.start} — ${summary.dateRange.end}`
   :"",
  sub2: summary.totalToolCost > 0
   ? t.kpi.toolBreakdown
      .replace("{cost}", formatCostPrecise(summary.totalToolCost))
      .replace("{calls}", String(summary.totalToolCalls))
   : "",
  },
  {
  value: formatTokens(summary.totalTokens, locale),
  label: t.kpi.totalTokens,
  sub: t.kpi.models.replace("{count}", String(summary.models.length)),
  sub2: "",
  },
  {
  value: formatPercent(summary.cacheHitRate),
  label: t.kpi.cacheHitRate,
  sub: t.kpi.saved.replace("{tokens}", formatTokens(summary.totalCacheHitTokens, locale)),
  sub2: "",
  },
  {
  value: String(summary.activeKeys),
  label: t.kpi.activeKeys,
  sub:"",
  sub2: "",
  },
 ];

 return (
 <div className="mb-12 mt-4">
  <div className="grid grid-cols-2 lg:grid-cols-4">
  {items.map((item) => (
   <div key={item.label} className="px-0 py-5">
   <div
    className="text-3xl font-bold tracking-tight"
    style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
   >
    {item.value}
   </div>
   <div className="text-xs font-medium mt-2 uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
    {item.label}
   </div>
   {item.sub && (
    <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
    {item.sub}
    </div>
   )}
   {item.sub2 && (
    <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
    {item.sub2}
    </div>
   )}
   </div>
  ))}
  </div>
  {/* 底部通栏细横线分割 */}
  <hr style={{ borderColor: "var(--border)", marginTop: "0.5rem" }} />
 </div>
 );
}
