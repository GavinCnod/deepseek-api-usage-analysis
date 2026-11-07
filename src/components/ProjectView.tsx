"use client";

/**
 * Project 详情表格视图
 *
 * 按自定义项目分组展示用量数据。用户通过拖拽浮窗将解析出的 API Key
 * 分配到项目中，持久化到 localStorage。未分配的 Key 归入"未分类"。
 *
 * 布局与 KeyView 一致，使用完整数字显示（无 K/M/万 后缀）。
 * 花费数字可通过 CopyButton 一键复制。
 */

import { useMemo, useState, useRef, useCallback, type DragEvent } from "react";
import { useData } from "@/lib/DataContext";
import { useTranslation } from "@/i18n";
import { formatPercent, formatCostFull, formatCostPrecise, formatTokensFull } from "@/lib/format";
import { useTheme } from "@/lib/ThemeContext";
import { isWebToolModel } from "@/lib/dataKeys";
import { useProjectConfig, UNCATEGORIZED, type ProjectDef } from "@/lib/ProjectConfigContext";
import CopyButton from "@/components/CopyButton";

// ============================================================================
// 类型
// ============================================================================

interface ProjectStats {
  name: string;
  totalTokens: number;
  totalCost: number;
  toolCost: number;
  toolCallCount: number;
  cacheHitTokens: number;
  cacheMissTokens: number;
  requestCount: number;
  cacheHitRate: number;
  isUncategorized: boolean;
}

// ============================================================================
// 主组件
// ============================================================================

export default function ProjectView() {
  const { filteredResult: result } = useData();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { config, setConfig, matchProject } = useProjectConfig();
  const [showConfig, setShowConfig] = useState(false);
  const daily = result?.daily;
  const isDark = theme === "dark";

  // 从 daily 数据中提取所有唯一的 Key 名称
  const allKeys = useMemo(
    () => [...new Set((daily ?? []).map((d) => d.apiKeyName))].sort(),
    [daily]
  );

  // 按项目配置聚合 daily 数据
  const projects = useMemo((): ProjectStats[] => {
    if (!daily) return [];

    const map = new Map<string, {
      name: string;
      totalTokens: number;
      totalCost: number;
      toolCost: number;
      toolCallCount: number;
      cacheHitTokens: number;
      cacheMissTokens: number;
      requestCount: number;
      isUncategorized: boolean;
    }>();

    for (const p of config) {
      map.set(p.name, {
        name: p.name,
        totalTokens: 0, totalCost: 0,
        toolCost: 0, toolCallCount: 0,
        cacheHitTokens: 0, cacheMissTokens: 0,
        requestCount: 0, isUncategorized: false,
      });
    }
    map.set(UNCATEGORIZED, {
      name: t.projects.uncategorized,
      totalTokens: 0, totalCost: 0,
      toolCost: 0, toolCallCount: 0,
      cacheHitTokens: 0, cacheMissTokens: 0,
      requestCount: 0, isUncategorized: true,
    });

    for (const d of daily) {
      const matched = matchProject(d.apiKeyName);
      const entry = map.get(matched);
      if (!entry) continue;
      const totalTok = d.outputTokens + d.inputCacheHitTokens + d.inputCacheMissTokens;
      entry.totalTokens += totalTok;
      entry.totalCost += d.cost ?? 0;
      entry.cacheHitTokens += d.inputCacheHitTokens;
      entry.cacheMissTokens += d.inputCacheMissTokens;
      entry.requestCount += d.requestCount;
      if (isWebToolModel(d.model)) {
        entry.toolCost += d.cost ?? 0;
        entry.toolCallCount += d.toolCallCount;
      }
    }

    return Array.from(map.values())
      .map((p) => ({
        ...p,
        cacheHitRate: p.cacheHitTokens + p.cacheMissTokens > 0
          ? p.cacheHitTokens / (p.cacheHitTokens + p.cacheMissTokens) : 0,
      }))
      .filter((p) => !p.isUncategorized || p.totalTokens > 0 || p.totalCost > 0 || p.toolCallCount > 0)
      .sort((a, b) => {
        if (a.isUncategorized !== b.isUncategorized) return a.isUncategorized ? 1 : -1;
        return b.totalCost - a.totalCost;
      });
  }, [daily, config, matchProject, t.projects.uncategorized]);

  const maxCost = Math.max(...projects.map((p) => p.totalCost), 1);
  const activeCount = projects.filter((p) => !p.isUncategorized).length;
  const modelCount = result?.summary.models.length ?? 0;

  if (!result || !daily) return null;

  if (allKeys.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {t.empty?.projects ?? "No data yet. Upload CSVs and configure project groups."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12 pt-4">
        <div
          className="text-5xl sm:text-6xl md:text-[5rem] font-bold leading-none tracking-tighter"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}
        >
          {activeCount}
        </div>
        <p className="text-sm font-semibold mt-3" style={{ color: "var(--text-secondary)" }}>
          {t.projects.heroProjects}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          {t.keys.heroSubtitle
            .replace("{keys}", String(allKeys.length))
            .replace("{models}", String(modelCount))}
        </p>
        {activeCount === 0 && allKeys.length > 0 && (
          <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
            {t.projects.emptyHint}
          </p>
        )}
      </div>

      {/* 标题 + 配置按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-secondary)" }}
        >
          {t.projects.sectionTitle}
        </h3>
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors duration-200"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-tertiary)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          {t.projects.configure}
        </button>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--border)` }}>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>{t.projects.columnProject}</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>{t.keys.tokens}</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>{t.keys.cost}</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>{t.keys.cacheHit}</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>{t.keys.requests}</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>{t.keys.tools}</th>
              <th className="px-3 py-2.5 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.name} className="group transition-colors duration-150"
                style={{ borderBottom: `1px solid var(--border)` }}>
                <td className="px-3 py-3 font-semibold"
                  style={{ color: p.isUncategorized ? "var(--text-tertiary)" : "var(--text-primary)" }}>
                  {p.name}
                </td>
                <td className="px-3 py-3 text-right"
                  style={{ color: p.isUncategorized ? "var(--text-tertiary)" : "var(--text-secondary)" }}>
                  {formatTokensFull(p.totalTokens)}
                </td>
                <td className="px-3 py-3 text-right font-semibold"
                  style={{ color: p.isUncategorized ? "var(--text-tertiary)" : "var(--text-primary)" }}>
                  <CopyButton value={p.totalCost} name={p.name}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-70">
                    {formatCostFull(p.totalCost)}
                  </CopyButton>
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-xs font-medium" style={{
                    color: p.cacheHitRate > 0.4 ? "var(--positive)"
                      : p.cacheHitRate > 0.2 ? "var(--warning-text)" : "var(--danger)",
                  }}>{formatPercent(p.cacheHitRate)}</span>
                </td>
                <td className="px-3 py-3 text-right"
                  style={{ color: p.isUncategorized ? "var(--text-tertiary)" : "var(--text-secondary)" }}>
                  {p.requestCount.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right text-xs"
                  style={{ color: p.toolCost > 0 ? "var(--text-secondary)" : "var(--text-tertiary)" }}>
                  {p.toolCost > 0
                    ? p.toolCallCount > 0
                      ? `${p.toolCallCount.toLocaleString()} · ${formatCostPrecise(p.toolCost)}`
                      : formatCostPrecise(p.toolCost)
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  <div className="w-24 h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${(p.totalCost / maxCost) * 100}%`,
                      background: isDark ? "var(--text-primary)" : "var(--accent)",
                      opacity: p.isUncategorized ? 0.3 : 0.6,
                    }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 配置浮窗 */}
      {showConfig && (
        <ConfigModal
          config={config}
          allKeys={allKeys}
          onSave={(newConfig) => { setConfig(newConfig); setShowConfig(false); }}
          onClose={() => setShowConfig(false)}
          t={t}
        />
      )}
    </div>
  );
}

// ============================================================================
// 拖拽式配置浮窗
// ============================================================================

interface ConfigModalProps {
  config: ProjectDef[];
  /** 所有可用的 API Key 名称 */
  allKeys: string[];
  onSave: (config: ProjectDef[]) => void;
  onClose: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

/** 内部编辑态项目（带稳定 _id） */
interface DraftProject extends ProjectDef {
  _id: number;
}

function ConfigModal({ config, allKeys, onSave, onClose, t }: ConfigModalProps) {
  // 稳定 ID 计数器
  const idRef = useRef(config.length);
  // 深拷贝编辑态，附带 _id
  const [draft, setDraft] = useState<DraftProject[]>(() =>
    config.map((p, i) => ({ ...p, name: p.name, keyNames: [...p.keyNames], _id: i }))
  );

  // 拖拽高亮状态
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragOverUncat, setDragOverUncat] = useState(false);

  // 是否已修改（用于关闭时确认）
  const [hasChanges, setHasChanges] = useState(false);
  // 重复名称错误
  const [dupError, setDupError] = useState<string | null>(null);
  // 关闭确认对话框
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // 计算每个项目已分配的 key 和全局未分配 key
  const assignedSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of draft) {
      for (const k of p.keyNames) s.add(k.toLowerCase());
    }
    return s;
  }, [draft]);

  const unassignedKeys = useMemo(
    () => allKeys.filter((k) => !assignedSet.has(k.toLowerCase())),
    [allKeys, assignedSet]
  );

  // ====================================================================
  // 项目操作
  // ====================================================================

  const updateName = useCallback((index: number, name: string) => {
    setDraft((prev) => { const n = [...prev]; n[index] = { ...n[index], name }; return n; });
    setHasChanges(true);
    setDupError(null);
  }, []);

  const removeProject = useCallback((index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  }, []);

  const addProject = useCallback(() => {
    const newId = idRef.current++;
    setDraft((prev) => [...prev, { name: "", keyNames: [], _id: newId }]);
    setHasChanges(true);
  }, []);

  /** 将某个 key 从项目中移除（回到未分配池） */
  const removeKeyFromProject = useCallback((projIdx: number, keyName: string) => {
    setDraft((prev) => {
      const n = [...prev];
      n[projIdx] = { ...n[projIdx], keyNames: n[projIdx].keyNames.filter((k) => k !== keyName) };
      return n;
    });
    setHasChanges(true);
  }, []);

  // ====================================================================
  // 拖拽处理
  // ====================================================================

  /** 拖拽开始：在 dataTransfer 中存储 keyName */
  const onDragStart = useCallback((e: DragEvent, keyName: string) => {
    e.dataTransfer.setData("text/plain", keyName);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  /** 允许放置 */
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  /** 拖入项目区域 */
  const onDragEnterProject = useCallback((e: DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIdx(index);
  }, []);

  const onDragLeaveProject = useCallback((e: DragEvent) => {
    e.preventDefault();
    // 仅当真正离开容器时才清除高亮（排除移到子元素内的情况）
    const container = e.currentTarget as HTMLElement;
    if (!container.contains(e.relatedTarget as Node)) {
      setDragOverIdx(null);
    }
  }, []);

  /** 放置到某个项目 */
  const onDropToProject = useCallback((e: DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIdx(null);
    const keyName = e.dataTransfer.getData("text/plain");
    if (!keyName) return;

    setHasChanges(true);
    setDraft((prev) => {
      // 先从所有项目中移除该 key
      const cleaned = prev.map((p) => ({
        ...p,
        keyNames: p.keyNames.filter((k) => k !== keyName),
      }));
      // 添加到目标项目
      cleaned[index] = {
        ...cleaned[index],
        keyNames: [...cleaned[index].keyNames, keyName],
      };
      return cleaned;
    });
  }, []);

  /** 拖入未分配区域 */
  const onDragEnterUncat = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOverUncat(true);
  }, []);

  const onDragLeaveUncat = useCallback((e: DragEvent) => {
    e.preventDefault();
    // 仅当真正离开容器时才清除高亮
    const container = e.currentTarget as HTMLElement;
    if (!container.contains(e.relatedTarget as Node)) {
      setDragOverUncat(false);
    }
  }, []);

  /** 放置到未分配区域（从项目中移除） */
  const onDropToUncat = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOverUncat(false);
    const keyName = e.dataTransfer.getData("text/plain");
    if (!keyName) return;

    setHasChanges(true);
    setDraft((prev) =>
      prev.map((p) => ({
        ...p,
        keyNames: p.keyNames.filter((k) => k !== keyName),
      }))
    );
  }, []);

  // ====================================================================
  // 保存
  // ====================================================================

  /** 通过下拉菜单分配 key 到项目（键盘可访问性） */
  const assignKeyToProject = useCallback((keyName: string, projectIndex: number) => {
    setHasChanges(true);
    setDraft((prev) => {
      // 先从所有项目中移除该 key
      const cleaned = prev.map((p) => ({
        ...p,
        keyNames: p.keyNames.filter((k) => k !== keyName),
      }));
      // 添加到目标项目
      cleaned[projectIndex] = {
        ...cleaned[projectIndex],
        keyNames: [...cleaned[projectIndex].keyNames, keyName],
      };
      return cleaned;
    });
  }, []);

  const handleSave = useCallback(() => {
    const valid = draft.filter((p) => p.name.trim().length > 0);

    // 检查重复项目名称（大小写不敏感）
    const seen = new Set<string>();
    for (const p of valid) {
      const key = p.name.trim().toLowerCase();
      if (seen.has(key)) {
        setDupError(p.name.trim());
        return;
      }
      seen.add(key);
    }

    onSave(valid);
  }, [draft, onSave]);

  /** 尝试关闭：如有未保存修改先弹出确认 */
  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  /** 确认放弃修改并关闭 */
  const confirmClose = useCallback(() => {
    setShowCloseConfirm(false);
    onClose();
  }, [onClose]);

  /** 取消关闭确认（回到编辑） */
  const cancelCloseConfirm = useCallback(() => {
    setShowCloseConfirm(false);
  }, []);

  // ====================================================================
  // 渲染
  // ====================================================================

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl mx-4 p-6 rounded-subtle shadow-diffuse-md"
        style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <h2 className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {t.projects.modalTitle}
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
          {t.projects.dragHint}
        </p>
        <p className="text-[11px] mb-5" style={{ color: "var(--text-tertiary)" }}>
          {t.projects.keyboardHint}
        </p>

        {/* 重复名称错误提示 */}
        {dupError && (
          <div
            className="mb-4 p-2.5 rounded-subtle text-xs"
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error-border)",
              color: "var(--error-text)",
            }}
          >
            {t.projects.duplicateName}: &quot;{dupError}&quot;
          </div>
        )}

        {/* 项目列表 */}
        <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 mb-4">
          {draft.map((proj, i) => {
            const isDragOver = dragOverIdx === i;
            return (
              <div
                key={proj._id}
                className="p-3 rounded-subtle transition-all duration-150"
                style={{
                  border: isDragOver
                    ? `2px solid var(--accent)`
                    : `1px solid var(--border)`,
                  background: isDragOver
                    ? "color-mix(in srgb, var(--accent) 6%, var(--bg))"
                    : "var(--bg)",
                }}
                onDragOver={onDragOver}
                onDragEnter={(e) => onDragEnterProject(e, i)}
                onDragLeave={onDragLeaveProject}
                onDrop={(e) => onDropToProject(e, i)}
              >
                {/* 项目名 + 删除 */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder={t.projects.projectName}
                    className="flex-1 px-2.5 py-1.5 text-sm rounded-subtle outline-none font-medium"
                    style={{
                      color: "var(--text-primary)", background: "var(--bg-surface)",
                      border: `1px solid var(--border)`,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  />
                  <button onClick={() => removeProject(i)}
                    className="flex-shrink-0 p-1.5 rounded-subtle transition-colors duration-150"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--danger)";
                      e.currentTarget.style.background = "var(--danger-subtle)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }}
                    title={t.projects.removeProject}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>

                {/* 已分配的 Key pills */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-tertiary)" }}>
                    {t.projects.projectKeys}
                  </label>
                  <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
                    {proj.keyNames.length === 0 && (
                      <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        {t.projects.dropHere}
                      </span>
                    )}
                    {proj.keyNames.map((kn) => (
                      <KeyPill
                        key={kn}
                        name={kn}
                        draggable
                        onDragStart={(e) => onDragStart(e, kn)}
                        onRemove={() => removeKeyFromProject(i, kn)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 添加项目按钮 */}
        <button onClick={addProject}
          className="w-full py-2 text-xs font-medium rounded-subtle transition-colors duration-150 mb-4"
          style={{ color: "var(--text-secondary)", border: `1px dashed var(--border)`, background: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          + {t.projects.addProject}
        </button>

        {/* 未分配 Key 区域 */}
        <div
          className="p-3 rounded-subtle mb-5 transition-all duration-150"
          style={{
            border: dragOverUncat ? `2px solid var(--danger)` : `1px solid var(--border)`,
            background: dragOverUncat
              ? "color-mix(in srgb, var(--danger) 6%, var(--bg))"
              : "var(--bg)",
          }}
          onDragOver={onDragOver}
          onDragEnter={onDragEnterUncat}
          onDragLeave={onDragLeaveUncat}
          onDrop={onDropToUncat}
        >
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "var(--text-tertiary)" }}>
            {t.projects.unassignedKeys}
          </label>
          <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center">
            {unassignedKeys.length === 0 && (
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                —
              </span>
            )}
            {unassignedKeys.map((kn) => (
              <span key={kn} className="inline-flex items-center gap-0.5">
                <KeyPill
                  name={kn}
                  draggable
                  onDragStart={(e) => onDragStart(e, kn)}
                />
                {draft.length > 0 && (
                  <SelectProject
                    projects={draft}
                    onChange={(idx) => assignKeyToProject(kn, idx)}
                    t={t}
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center gap-3">
          <button onClick={() => {
            setDraft([]);
            setHasChanges(true);
            setDupError(null);
          }}
            className="text-xs font-medium transition-colors duration-150"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
          >
            {t.projects.resetConfig}
          </button>
          <div className="flex gap-3">
            <button onClick={handleClose}
              className="px-4 py-2 text-xs font-medium rounded-subtle transition-colors duration-150"
              style={{ color: "var(--text-secondary)", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              {t.projects.cancel}
            </button>
            <button onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-subtle transition-colors duration-150"
              style={{ color: "var(--accent-inverse)", background: "var(--text-primary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {t.projects.save}
            </button>
          </div>
        </div>

        {/* 关闭确认对话框 */}
        {showCloseConfirm && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-subtle"
            style={{ background: "rgba(0,0,0,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-5 rounded-subtle shadow-diffuse-md text-center mx-6"
              style={{ background: "var(--bg-surface)", border: `1px solid var(--border)` }}
            >
              <p className="text-sm font-medium mb-4" style={{ color: "var(--text-primary)" }}>
                {t.projects.unsavedChanges}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelCloseConfirm}
                  className="px-3 py-1.5 text-xs font-medium rounded-subtle transition-colors duration-150"
                  style={{ color: "var(--text-secondary)", background: "transparent" }}
                >
                  {t.projects.cancel}
                </button>
                <button
                  onClick={confirmClose}
                  className="px-3 py-1.5 text-xs font-semibold rounded-subtle transition-colors duration-150"
                  style={{ color: "var(--accent-inverse)", background: "var(--danger)" }}
                >
                  {t.projects.discard}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Key 名称小药丸组件
// ============================================================================

interface SelectProjectProps {
  projects: { name: string }[];
  onChange: (index: number) => void;
  t: ReturnType<typeof useTranslation>["t"];
}

/** 迷你下拉菜单：用于未分配 Key 的键盘可访问分配 */
function SelectProject({ projects, onChange, t }: SelectProjectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && idx >= 0) {
      onChange(idx);
      e.target.value = ""; // 重置为占位符
    }
  };

  return (
    <select
      onChange={handleChange}
      defaultValue=""
      className="text-[10px] rounded-full px-1.5 py-0.5 cursor-pointer outline-none appearance-none"
      style={{
        color: "var(--text-tertiary)",
        background: "var(--bg-surface)",
        border: `1px solid var(--border)`,
      }}
      aria-label={t.projects.assignTo}
    >
      <option value="" disabled>
        {t.projects.assignTo}
      </option>
      {projects.map((p, i) => (
        <option key={i} value={i}>
          {p.name || `(${t.projects.projectName})`}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// Key 名称小药丸组件
// ============================================================================

interface KeyPillProps {
  name: string;
  draggable?: boolean;
  onDragStart?: (e: DragEvent) => void;
  onRemove?: () => void;
}

function KeyPill({ name, draggable, onDragStart, onRemove }: KeyPillProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <span
      draggable={draggable}
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart?.(e);
      }}
      onDragEnd={() => setIsDragging(false)}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
        cursor-grab active:cursor-grabbing select-none transition-all duration-150"
      style={{
        color: isDragging ? "var(--accent)" : "var(--text-secondary)",
        background: "var(--bg-surface)",
        border: `1px solid ${isDragging ? "var(--accent)" : "var(--border)"}`,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 flex-shrink-0 rounded-full transition-colors duration-150"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
}
