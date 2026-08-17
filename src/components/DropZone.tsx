"use client";

import { useState, useCallback, useRef, type DragEvent } from "react";
import { useData } from "@/lib/DataContext";
import { useTranslation } from "@/i18n";
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/concatFiles";
import { trackEvent } from "@/lib/analytics";

/**
 * 拖拽上传区域
 *
 * Apple 极简风格 — 大留白、虚线边框、hover 微交互。
 * 移除原本的异形圆角，改用克制的微圆角。
 * 颜色通过 CSS 变量驱动，自动适配 light/dark 双主题。
 *
 * 包含 ZIP 炸弹防护：单文件超过 50 MB 将显示警告并拒绝处理。
 */
export default function DropZone() {
  const { loadFiles, loading } = useData();
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [reading, setReading] = useState(false);
  /** 文件过大警告信息：{fileName, sizeMB}，null 表示无警告 */
  const [sizeError, setSizeError] = useState<{ name: string; sizeMB: string } | null>(null);
  const [concatError, setConcatError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const busy = loading || reading;

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArr = Array.from(files);
      const hasRelevant = fileArr.some(
        (f) => f.name.endsWith(".csv") || f.name.toLowerCase().endsWith(".zip")
      );
      if (!hasRelevant) return;

      // 检查文件大小，防止 ZIP 炸弹/超大文件导致浏览器卡死
      const oversized = fileArr.find((f) => f.size > MAX_UPLOAD_SIZE_BYTES);
      if (oversized) {
        setSizeError({
          name: oversized.name,
          sizeMB: (oversized.size / 1024 / 1024).toFixed(1),
        });
        return;
      }

      // 清除之前的警告
      setSizeError(null);
      setConcatError(null);
      setReading(true);
      try {
        const { concatMonthlyCSVs, extractZipCsvs } = await import("@/lib/concatFiles");
        const csvEntries = await extractZipCsvs(fileArr);
        if (csvEntries.length === 0) {
          setReading(false);
          return;
        }
        const result = await concatMonthlyCSVs(csvEntries);
        loadFiles(result.amountText, result.costText, result.label);
        // 解析在 DataContext 中异步进行（setTimeout），失败不会抛到这里；
        // 复位 reading 后由 loadFiles 同步置位的 loading 继续覆盖 busy，
        // 解析失败时（result 仍为 null）UI 能恢复正常可上传状态。
        setReading(false);
        trackEvent("upload_csv");
      } catch (err) {
        setConcatError(err instanceof Error ? err.message : String(err));
        setReading(false);
      }
    },
    [loadFiles]
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => {
          setSizeError(null);
          setConcatError(null);
          fileInputRef.current?.click();
        }}
        className="p-16 text-center cursor-pointer transition-[background,border-color] duration-300"
        style={{
          border: dragOver
            ? "2px dashed var(--dropzone-drag-border)"
            : "2px dashed var(--border)",
          borderRadius: "6px",
          background: dragOver
            ? "color-mix(in srgb, var(--dropzone-drag-bg) 45%, transparent)"
            : "color-mix(in srgb, var(--dropzone-bg) 45%, transparent)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.zip"
          className="hidden"
          onChange={onChange}
        />
        {busy ? (
          <div>
            <div
              className="inline-block w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mb-4"
              style={{ borderColor: "var(--text-tertiary)", borderTopColor: "transparent" }}
            />
            <p className="font-medium text-base" style={{ color: "var(--text-secondary)" }}>
              {t.dropzone.processing}
            </p>
          </div>
        ) : (
          <div>
            <p
              className="font-bold text-xl mb-2"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              {t.dropzone.title}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {t.dropzone.hint}
            </p>
            <p className="text-xs mt-4" style={{ color: "var(--text-tertiary)" }}>
              {t.dropzone.privacy}
            </p>
          </div>
        )}
      </div>

      {/* 文件解析错误横幅 */}
      {concatError && (
        <div
          className="mt-4 p-4 rounded-subtle text-sm flex items-start gap-3"
          style={{
            background: "var(--error-bg)",
            border: "1px solid var(--error-border)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5"
            style={{ color: "var(--error-text)" }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="font-semibold mb-1" style={{ color: "var(--error-text)" }}>
              {t.dropzone.processingError ?? "Processing Error"}
            </p>
            <p style={{ color: "var(--error-text)", opacity: 0.85 }}>
              {concatError}
            </p>
          </div>
        </div>
      )}

      {/* 文件过大警告横幅 */}
      {sizeError && (
        <div
          className="mt-4 p-4 rounded-subtle text-sm flex items-start gap-3"
          style={{
            background: "var(--error-bg)",
            border: "1px solid var(--error-border)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5"
            style={{ color: "var(--error-text)" }}
          >
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
                .replace("{name}", sizeError.name)
                .replace("{size}", sizeError.sizeMB)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
