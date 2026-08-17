/**
 * 将 DeepSeek CSV 文件按月配对并拼接，支持多月份分析。
 *
 * 文件名格式：amount-{year}-{month}.csv / cost-{year}-{month}.csv（旧式）
 * 或日期区间式：amount-{start}-{end}.csv / cost-{start}-{end}.csv（新式，如 amount-2026-08-01_2026-08-17.csv）
 * 示例：amount-2026-5.csv + cost-2026-5.csv → 月份键 "2026-5"
 *
 * 同时包含 ZIP 炸弹防护：单文件超过 50MB 将被拒绝处理。
 */

import JSZip from "jszip";

/** 单个文件上传大小上限（50 MB），用于防止 ZIP 炸弹导致浏览器卡死。 */
export const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;

/** Unified interface for CSV-like sources (File objects or extracted ZIP entries). */
export interface CsvLike {
  name: string;
  text: () => Promise<string>;
}

interface MonthPair {
  month: string;
  amountFile: CsvLike;
  costFile: CsvLike;
}

interface ConcatResult {
  /** Concatenated amount CSV text (headers only in the first chunk) */
  amountText: string;
  /** Concatenated cost CSV text (headers only in the first chunk) */
  costText: string;
  /** Human-readable label like "2026-5 ~ 2026-6" or just "2026-6" */
  label: string;
  /** Number of months successfully paired */
  monthCount: number;
}

/**
 * Strip the CSV header line from a chunk of CSV text.
 * Returns everything after the first newline.
 */
function stripHeader(text: string): string {
  const idx = text.indexOf("\n");
  if (idx === -1) return "";
  return text.slice(idx + 1);
}

/**
 * Parse year-month from a DeepSeek CSV filename.
 * Supports both naming conventions:
 * - Legacy: amount-2026-6.csv, cost-2026-06.csv
 * - New (date-range): amount-2026-08-01_2026-08-17.csv, cost-2026-08-01_2026-08-17.csv
 */
function extractMonth(filename: string): string | null {
  // New date-range pattern first: amount-2026-08-01_2026-08-17.csv → month of the start date
  const rangeMatch = filename.match(
    /(?:amount|cost)-(\d{4})-(\d{2})-(\d{2})_\d{4}-\d{2}-\d{2}\.csv$/i
  );
  if (rangeMatch) return `${rangeMatch[1]}-${rangeMatch[2]}`;

  // Legacy pattern: amount-2026-6.csv, cost-2026-06.csv
  const match = filename.match(/(?:amount|cost)-(\d{4})-(\d{1,2})\.csv$/i);
  if (!match) return null;
  const year = match[1];
  const month = match[2].padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Group files into (amount, cost) pairs by month.
 * Files that don't match the naming pattern are ignored.
 */
function pairFiles(files: CsvLike[]): MonthPair[] {
  const byMonth = new Map<string, { amount?: CsvLike; cost?: CsvLike }>();

  for (const f of files) {
    const month = extractMonth(f.name);
    if (!month) continue;
    let entry = byMonth.get(month);
    if (!entry) {
      entry = {};
      byMonth.set(month, entry);
    }
    if (f.name.startsWith("amount-")) {
      entry.amount = f;
    } else if (f.name.startsWith("cost-")) {
      entry.cost = f;
    }
  }

  // Only include months that have BOTH files
  const pairs: MonthPair[] = [];
  for (const [month, entry] of byMonth) {
    if (entry.amount && entry.cost) {
      pairs.push({ month, amountFile: entry.amount, costFile: entry.cost });
    }
  }

  // Sort by month ascending
  pairs.sort((a, b) => a.month.localeCompare(b.month));
  return pairs;
}

/**
 * Given a list of CSV-like sources (from drag-and-drop, file picker, or ZIP extraction),
 * pair them by month, read all files, and return concatenated CSV text.
 *
 * If only one month is found, behaves like the original single-month flow.
 * If no valid pairs are found, falls back to concatenating all CSVs as-is.
 */
export async function concatMonthlyCSVs(files: CsvLike[]): Promise<ConcatResult> {
  const pairs = pairFiles(files);

  // If we found paired months, use those
  if (pairs.length > 0) {
    const amountChunks: string[] = [];
    const costChunks: string[] = [];

    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      const [amountText, costText] = await Promise.all([
        p.amountFile.text(),
        p.costFile.text(),
      ]);

      // First file keeps its header; subsequent files have headers stripped
      amountChunks.push(i === 0 ? amountText : stripHeader(amountText));
      costChunks.push(i === 0 ? costText : stripHeader(costText));
    }

    const months = pairs.map((p) => p.month).sort();
    const label =
      months.length === 1
        ? months[0]
        : `${months[0]} ~ ${months[months.length - 1]}`;

    return {
      amountText: amountChunks.join(""),
      costText: costChunks.join(""),
      label,
      monthCount: pairs.length,
    };
  }

  // Fallback: no filename-pattern pairs found.
  // Try concatenating all CSVs (first of each prefix wins)
  const amountFiles = files.filter((f) => f.name.startsWith("amount-"));
  const costFiles = files.filter((f) => f.name.startsWith("cost-"));
  const otherCSVs = files.filter(
    (f) => f.name.endsWith(".csv") && !f.name.startsWith("amount-") && !f.name.startsWith("cost-")
  );

  const amountTexts = await Promise.all(amountFiles.map((f) => f.text()));
  const costTexts = await Promise.all(costFiles.map((f) => f.text()));
  const otherTexts = await Promise.all(otherCSVs.map((f) => f.text()));

  const amountText = amountTexts
    .map((t, i) => (i === 0 ? t : stripHeader(t)))
    .join("");
  const costText =
    costTexts.length > 0
      ? costTexts.map((t, i) => (i === 0 ? t : stripHeader(t))).join("")
      : otherTexts.map((t, i) => (i === 0 ? t : stripHeader(t))).join("");

  const label = files.find((f) => f.name.includes("amount-"))?.name ?? files[0]?.name ?? "unknown";

  return {
    amountText,
    costText,
    label: label.replace(/^amount-/, "").replace(/\.csv$/i, ""),
    monthCount: amountFiles.length || 1,
  };
}

/** Wrap a browser File object into the CsvLike interface. */
function wrapFileAsCsvLike(file: File): CsvLike {
  return {
    name: file.name,
    text: () => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) ?? "");
      reader.readAsText(file);
    }),
  };
}

/**
 * 从 ZIP 文件中提取 CSV 条目，并将普通 CSV 包装为 CsvLike 对象。
 *
 * 对于输入中的每个文件：
 * - 如果文件以 `.zip` 结尾：作为 ZIP 读取，提取其中的所有 `.csv` 文件
 * - 如果文件以 `.csv` 结尾：直接包装为 CsvLike
 * - 其他：忽略
 * - 超过 MAX_UPLOAD_SIZE_BYTES 的文件将被跳过（防御性检查）
 *
 * 返回扁平的 CsvLike 条目数组，可用于 concatMonthlyCSVs。
 */
export async function extractZipCsvs(files: File[]): Promise<CsvLike[]> {
  const result: CsvLike[] = [];

  for (const file of files) {
    // 防御性大小检查：跳过超大文件
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      console.warn(
        `[extractZipCsvs] 跳过超大文件 "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)} MB > 50 MB 上限)`
      );
      continue;
    }

    if (file.name.toLowerCase().endsWith(".zip")) {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const csvNames = Object.keys(zip.files).filter(
        (name) => !zip.files[name].dir && name.toLowerCase().endsWith(".csv")
      );

      for (const name of csvNames) {
        const zipEntry = zip.files[name];
        // Use the basename for pairing (strip any directory prefixes in the ZIP)
        const baseName = name.split("/").pop()!;
        result.push({
          name: baseName,
          text: () => zipEntry.async("string"),
        });
      }
    } else if (file.name.endsWith(".csv")) {
      result.push(wrapFileAsCsvLike(file));
    }
  }

  return result;
}
