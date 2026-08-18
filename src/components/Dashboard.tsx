"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useData, ALL_MODELS } from "@/lib/DataContext";
import { useTranslation } from "@/i18n";
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/concatFiles";
import { trackEvent } from "@/lib/analytics";
import TitleBar from "./TitleBar";
import FooterBar from "./FooterBar";
import RecommendedToolsSection from "./RecommendedToolsSection";
import LandingPage from "./LandingPage";
import KPICards from "./KPICards";
import KeyView from "./KeyView";
import ProjectView from "./ProjectView";
import ErrorDisplay, { WarningBanner } from "./ErrorDisplay";
import ShareButton from "./ShareButton";
import type { ShareTab } from "@/lib/shareCardData";

/**
 * 图表视图（依赖 ECharts，~1.4MB）按需加载：
 * 仅在用户上传数据并进入仪表盘后才拉取，避免拖累落地页首屏 JS。
 */
const OverviewView = dynamic(() => import("./OverviewView"), { ssr: false });
const CacheView = dynamic(() => import("./CacheView"), { ssr: false });
const TrendsView = dynamic(() => import("./TrendsView"), { ssr: false });

type Tab = "overview" | "projects" | "keys" | "cache" | "trends";

/**
 * 主仪表盘组件
 *
 * Apple 极简风格重构：
 * - 冷灰纸质感背景（#F5F5F7 / #000000）
 * - 大留白、呼吸感间距
 * - "无卡片"式布局：通栏模块 + 细横线分割
 * - 微圆角、弥散阴影（仅在必须时使用）
 * - 文字主色深炭黑，辅色优雅灰
 * - 完整的 light/dark 双主题支持
 */
export default function Dashboard() {
  const { result, fileName, loadFiles, clear, selectedModel, setSelectedModel } = useData();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("overview");
  const reuploadRef = useRef<HTMLInputElement>(null);
  /** 重新上传时的文件过大警告 */
  const [reuploadSizeError, setReuploadSizeError] = useState<{ name: string; sizeMB: string } | null>(null);
  const [reuploadConcatError, setReuploadConcatError] = useState<string | null>(null);
  const mountedRef = useRef(false);

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: t.tabs.overview },
    { key: "keys", label: t.tabs.keys },
    { key: "cache", label: t.tabs.cache },
    { key: "trends", label: t.tabs.trends },
    { key: "projects", label: t.tabs.projects },
  ];

  const handleReupload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const fileArr = Array.from(files);

      // 检查文件大小，防止 ZIP 炸弹/超大文件导致浏览器卡死
      const oversized = fileArr.find((f) => f.size > MAX_UPLOAD_SIZE_BYTES);
      if (oversized) {
        setReuploadSizeError({
          name: oversized.name,
          sizeMB: (oversized.size / 1024 / 1024).toFixed(1),
        });
        e.target.value = "";
        return;
      }
      setReuploadSizeError(null);
      setReuploadConcatError(null);

      try {
        const { concatMonthlyCSVs, extractZipCsvs } = await import("@/lib/concatFiles");
        const csvEntries = await extractZipCsvs(fileArr);
        if (csvEntries.length === 0) return;
        const result = await concatMonthlyCSVs(csvEntries);
        loadFiles(result.amountText, result.costText, result.label);
        trackEvent("upload_csv");
      } catch (err) {
        setReuploadConcatError(err instanceof Error ? err.message : String(err));
      }
      e.target.value = "";
    },
    [loadFiles]
  );

  // Track tab switches (skip initial mount)
  useEffect(() => {
    if (mountedRef.current) {
      trackEvent("tab_switch", { event_label: tab });
    } else {
      mountedRef.current = true;
    }
  }, [tab]);

  // 上传前状态：展示 Landing 落地页
  if (!result) {
    return <LandingPage />;
  }

  // 数据加载后：完整仪表盘
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      <TitleBar />

      {/* 语义化 H1：对屏幕阅读器和搜索引擎可见，视觉隐藏 */}
      <h1 className="sr-only">{t.app.title}</h1>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Action bar — 文件信息 + 操作按钮 */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {fileName}
              {result.summary.dateRange && (
                <span className="ml-2">
                  · {result.summary.dateRange.start} — {result.summary.dateRange.end}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <input
              ref={reuploadRef}
              type="file"
              multiple
              accept=".csv,.zip"
              className="hidden"
              onChange={handleReupload}
            />
            <button
              onClick={() => {
                setReuploadSizeError(null);
                setReuploadConcatError(null);
                reuploadRef.current?.click();
              }}
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {t.header.loadDifferent}
            </button>
            <button
              onClick={clear}
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: "var(--danger)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = "1";
              }}
            >
              {t.header.clear}
            </button>
          </div>
        </div>

        <ErrorDisplay />
        <WarningBanner />

        {/* 重新上传文件解析错误横幅 */}
        {reuploadConcatError && (
          <div
            className="mb-6 p-4 rounded-subtle text-sm flex items-start gap-3"
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error-border)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 mt-0.5" style={{ color: "var(--error-text)" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-semibold mb-1" style={{ color: "var(--error-text)" }}>
                {t.dropzone.processingError ?? "Processing Error"}
              </p>
              <p style={{ color: "var(--error-text)", opacity: 0.85 }}>
                {reuploadConcatError}
              </p>
            </div>
          </div>
        )}

        {/* 重新上传文件过大警告 */}
        {reuploadSizeError && (
          <div
            className="mb-6 p-4 rounded-subtle text-sm flex items-start gap-3"
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error-border)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 mt-0.5" style={{ color: "var(--error-text)" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-semibold mb-1" style={{ color: "var(--error-text)" }}>
                {t.dropzone.oversizedTitle}
              </p>
              <p style={{ color: "var(--error-text)", opacity: 0.85 }}>
                {t.dropzone.oversizedHint
                  .replace("{name}", reuploadSizeError.name)
                  .replace("{size}", reuploadSizeError.sizeMB)}
              </p>
            </div>
          </div>
        )}

        {/* KPI 指标 */}
        <KPICards />

        {/* Tab 导航 — Apple 风格下划线 */}
        <nav className="flex items-center gap-8 mb-10" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex gap-8">
            {TABS.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={`pb-3 text-xs font-semibold tracking-wide uppercase transition-all duration-200 border-b-2 -mb-px ${
                  tab === tabItem.key
                    ? "border-accent"
                    : "border-transparent"
                }`}
                style={{
                  color: tab === tabItem.key
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                }}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
          {/* 分享按钮 */}
          <div className="pb-3 -mb-px ml-auto">
            <ShareButton tab={tab as ShareTab} label={t.share?.share ?? "Share"} />
          </div>
        </nav>

        {/* 模型筛选 — Apple 风格分段控件 / 胶囊按钮 */}
        {result.summary.models.length > 1 && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-1 p-1 rounded-full" style={{ background: "var(--border)" }}>
              <button
                onClick={() => setSelectedModel(ALL_MODELS)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                style={{
                  background: selectedModel === ALL_MODELS ? "var(--text-primary)" : "transparent",
                  color: selectedModel === ALL_MODELS ? "var(--accent-inverse)" : "var(--text-tertiary)",
                }}
              >
                {t.modelFilter.allModels}
              </button>
              {result.summary.models.map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                  style={{
                    background: selectedModel === model ? "var(--text-primary)" : "transparent",
                    color: selectedModel === model ? "var(--accent-inverse)" : "var(--text-tertiary)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModel !== model)
                      (e.target as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModel !== model)
                      (e.target as HTMLElement).style.color = "var(--text-tertiary)";
                  }}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 内容区 */}
        <div className="animate-fade-in">
          {tab === "overview" && <OverviewView />}
          {tab === "projects" && <ProjectView />}
          {tab === "keys" && <KeyView />}
          {tab === "cache" && <CacheView />}
          {tab === "trends" && <TrendsView />}
        </div>
      </div>

      <RecommendedToolsSection maxWidth="6xl" />
      <FooterBar />
    </div>
  );
}
