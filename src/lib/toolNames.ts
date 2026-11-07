/**
 * Web tool names vary by export/call path:
 * - tool-search / tool-fetch
 * - server-tool-search / server-tool-fetch
 * - future tool-* names
 *
 * Normalize to a stable kind for grouping and UI labels.
 */
export function normalizeToolKind(name: string): string {
  const lower = name.trim().toLowerCase();
  if (!lower) return "unknown-tool";
  if (lower === "search" || lower.endsWith("-search")) return "search";
  if (lower === "fetch" || lower.endsWith("-fetch")) return "fetch";
  return lower;
}

/** Human-readable label for a normalized tool kind. */
export function formatToolName(kind: string, locale: "en" | "zh"): string {
  if (kind === "search") return locale === "zh" ? "网页搜索" : "Web Search";
  if (kind === "fetch") return locale === "zh" ? "网页抓取" : "Web Fetch";
  return kind;
}
