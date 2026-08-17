import Papa from "papaparse";
import type {
  AmountRow,
  CostRow,
  DailyUsage,
  KeyStats,
  ParseResult,
  ParseWarning,
  ParseError,
} from "./types";

const REQUIRED_AMOUNT_COLUMNS = [
  "start_time_iso",
  "model",
  "api_key_name",
  "api_key",
  "type",
  "price",
  "amount",
] as const;

/** Legacy column used by older DeepSeek exports, still supported for backward compatibility */
const LEGACY_DATE_COLUMN = "utc_date";

const REQUIRED_COST_COLUMNS = [
  "start_time_iso",
  "model",
  "cost",
  "currency",
] as const;

const VALID_AMOUNT_TYPES = new Set([
  "request_count",
  "output_tokens",
  "input_cache_hit_tokens",
  "input_cache_miss_tokens",
]);

/**
 * Resolve the billing date for a row.
 * New exports carry `start_time_iso` (ISO 8601, e.g. "2026-08-02T00:00:00+08:00") whose
 * date part is the Beijing-local billing day. Legacy exports carry `utc_date` instead.
 */
function resolveDate(raw: Record<string, string>): string {
  const iso = raw["start_time_iso"]?.trim() ?? "";
  if (iso) return iso.slice(0, 10);
  return raw[LEGACY_DATE_COLUMN]?.trim() ?? "";
}

/**
 * Validate that all required columns exist. The date column is satisfied by either
 * `start_time_iso` (new format) or the legacy `utc_date` column.
 */
function findMissingColumns(
  headers: string[],
  required: readonly string[]
): string[] {
  const missing: string[] = [];
  for (const col of required) {
    if (!headers.includes(col)) {
      if (col === "start_time_iso" && headers.includes(LEGACY_DATE_COLUMN)) continue;
      missing.push(col);
    }
  }
  return missing;
}

/**
 * Parse and validate the amount CSV text.
 * Returns raw rows or the first error encountered.
 */
function parseAmountCSV(text: string): { rows: AmountRow[] } | { error: ParseError } {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    return {
      error: {
        type: "malformed_row",
        message: `CSV parse error at row ${result.errors[0].row}: ${result.errors[0].message}`,
        row: result.errors[0].row ?? undefined,
      },
    };
  }

  if (result.data.length === 0) {
    return { error: { type: "empty_file", message: "Amount CSV has headers but no data rows." } };
  }

  // Validate columns
  const headers = result.meta.fields ?? [];
  const missing = findMissingColumns(headers, REQUIRED_AMOUNT_COLUMNS);
  if (missing.length > 0) {
    return {
      error: {
        type: "missing_columns",
        message: `Amount CSV missing required column: "${missing.join(", ")}". Found: ${headers.join(", ")}`,
      },
    };
  }

  // Parse and validate each row
  const rows: AmountRow[] = [];
  for (let i = 0; i < result.data.length; i++) {
    const raw = result.data[i];
    const type = raw["type"]?.trim();
    if (!type || !VALID_AMOUNT_TYPES.has(type)) {
      return {
        error: {
          type: "malformed_row",
          message: `Row ${i + 2}: invalid type "${type}". Expected one of: ${[...VALID_AMOUNT_TYPES].join(", ")}`,
          row: i + 2,
          column: "type",
        },
      };
    }

    const priceRaw = raw["price"]?.trim() ?? "";
    // request_count rows have no meaningful price — DeepSeek leaves it empty
    const price = priceRaw === "" && type === "request_count" ? 0 : parseFloat(priceRaw);
    const amount = parseInt(raw["amount"], 10);
    if (isNaN(price)) {
      return {
        error: {
          type: "malformed_row",
          message: `Row ${i + 2}: invalid price "${priceRaw}"`,
          row: i + 2,
          column: "price",
        },
      };
    }
    if (isNaN(amount)) {
      return {
        error: {
          type: "malformed_row",
          message: `Row ${i + 2}: invalid amount "${raw["amount"]}"`,
          row: i + 2,
          column: "amount",
        },
      };
    }

    rows.push({
      user_id: raw["user_id"] ?? "",
      date: resolveDate(raw),
      model: raw["model"]?.trim() ?? "",
      api_key_name: raw["api_key_name"]?.trim() ?? "",
      api_key: raw["api_key"]?.trim() ?? "",
      type: type as AmountRow["type"],
      price,
      amount,
    });
  }

  return { rows };
}

/**
 * Parse and validate the cost CSV text.
 */
function parseCostCSV(text: string): { rows: CostRow[] } | { error: ParseError } {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    return {
      error: {
        type: "malformed_row",
        message: `CSV parse error at row ${result.errors[0].row}: ${result.errors[0].message}`,
        row: result.errors[0].row ?? undefined,
      },
    };
  }

  if (result.data.length === 0) {
    return { error: { type: "empty_file", message: "Cost CSV has headers but no data rows." } };
  }

  const headers = result.meta.fields ?? [];
  const missing = findMissingColumns(headers, REQUIRED_COST_COLUMNS);
  if (missing.length > 0) {
    return {
      error: {
        type: "missing_columns",
        message: `Cost CSV missing required column: "${missing.join(", ")}". Found: ${headers.join(", ")}`,
      },
    };
  }

  const rows: CostRow[] = [];
  for (let i = 0; i < result.data.length; i++) {
    const raw = result.data[i];
    const cost = parseFloat(raw["cost"]);
    if (isNaN(cost)) {
      return {
        error: {
          type: "malformed_row",
          message: `Row ${i + 2}: invalid cost "${raw["cost"]}"`,
          row: i + 2,
          column: "cost",
        },
      };
    }

    rows.push({
      user_id: raw["user_id"] ?? "",
      date: resolveDate(raw),
      model: raw["model"]?.trim() ?? "",
      wallet_type: raw["wallet_type"]?.trim() ?? "",
      cost,
      currency: raw["currency"]?.trim() ?? "CNY",
    });
  }

  return { rows };
}

/**
 * Pivot amount rows: group by (date, model, api_key_name) and spread type→columns.
 */
function pivotAmountRows(rows: AmountRow[]): Map<string, DailyUsage> {
  const map = new Map<string, DailyUsage>();

  for (const r of rows) {
    const key = `${r.date}|${r.model}|${r.api_key_name}`;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        date: r.date,
        model: r.model,
        apiKeyName: r.api_key_name,
        apiKey: r.api_key,
        requestCount: 0,
        outputTokens: 0,
        inputCacheHitTokens: 0,
        inputCacheMissTokens: 0,
        pricePerOutputToken: 0,
        pricePerInputToken: null,
        cost: null,
      };
      map.set(key, entry);
    }

    // Track pricing (use the last seen — typically same across rows for a model)
    switch (r.type) {
      case "output_tokens":
        entry.outputTokens += r.amount;
        entry.pricePerOutputToken = r.price;
        break;
      case "input_cache_hit_tokens":
        entry.inputCacheHitTokens += r.amount;
        if (entry.pricePerInputToken === null && r.price > 0) {
          entry.pricePerInputToken = r.price;
        }
        break;
      case "input_cache_miss_tokens":
        entry.inputCacheMissTokens += r.amount;
        if (entry.pricePerInputToken === null && r.price > 0) {
          entry.pricePerInputToken = r.price;
        }
        break;
      case "request_count":
        entry.requestCount += r.amount;
        break;
    }
  }

  return map;
}

/**
 * Join cost rows onto the pivoted amount data.
 * Cost CSV has (date, model) but NOT api_key_name.
 * We distribute cost proportionally across keys within each (date, model) group
 * based on total token usage.
 */
function joinCosts(
  dailyMap: Map<string, DailyUsage>,
  costRows: CostRow[]
): ParseWarning[] {
  const warnings: ParseWarning[] = [];

  // Aggregate cost by (date, model)
  const costByDateModel = new Map<string, number>();
  for (const c of costRows) {
    const key = `${c.date}|${c.model}`;
    costByDateModel.set(key, (costByDateModel.get(key) ?? 0) + Math.abs(c.cost));
  }

  // Aggregate total tokens by (date, model) for proportional distribution
  const tokensByDateModel = new Map<string, number>();
  for (const [, d] of dailyMap) {
    const key = `${d.date}|${d.model}`;
    tokensByDateModel.set(
      key,
      (tokensByDateModel.get(key) ?? 0) +
        d.outputTokens +
        d.inputCacheHitTokens +
        d.inputCacheMissTokens
    );
  }

  // Distribute cost to each daily entry
  for (const [, d] of dailyMap) {
    const costKey = `${d.date}|${d.model}`;
    const totalCostForGroup = costByDateModel.get(costKey);
    const totalTokensForGroup = tokensByDateModel.get(costKey) ?? 0;

    if (totalCostForGroup === undefined) {
      if (d.outputTokens + d.inputCacheHitTokens + d.inputCacheMissTokens > 0) {
        warnings.push({
          type: "no_cost_match",
          message: `No cost data found for ${d.model} on ${d.date}`,
        });
      }
      d.cost = 0;
    } else if (totalTokensForGroup > 0) {
      const proportion =
        (d.outputTokens + d.inputCacheHitTokens + d.inputCacheMissTokens) / totalTokensForGroup;
      d.cost = totalCostForGroup * proportion;
    } else {
      d.cost = 0;
    }
  }

  // Check for date range mismatch
  if (dailyMap.size > 0 && costRows.length > 0) {
    const amountDates = new Set([...dailyMap.values()].map((d) => d.date));
    const costDates = new Set(costRows.map((c) => c.date));
    const amountOnly = [...amountDates].filter((d) => !costDates.has(d));
    if (amountOnly.length > 0) {
      warnings.push({
        type: "date_mismatch",
        message: `${amountOnly.length} day(s) have amount data but no cost data. Cost totals may be incomplete.`,
      });
    }
  }

  return warnings;
}

/**
 * Compute per-key aggregate statistics.
 */
export function computeKeyStats(daily: DailyUsage[]): KeyStats[] {
  const map = new Map<string, {
    apiKeyName: string;
    totalTokens: number;
    outputTokens: number;
    inputCacheHitTokens: number;
    inputCacheMissTokens: number;
    totalCost: number;
    requestCount: number;
  }>();

  for (const d of daily) {
    let entry = map.get(d.apiKeyName);
    if (!entry) {
      entry = {
        apiKeyName: d.apiKeyName,
        totalTokens: 0,
        outputTokens: 0,
        inputCacheHitTokens: 0,
        inputCacheMissTokens: 0,
        totalCost: 0,
        requestCount: 0,
      };
      map.set(d.apiKeyName, entry);
    }
    entry.totalTokens +=
      d.outputTokens + d.inputCacheHitTokens + d.inputCacheMissTokens;
    entry.outputTokens += d.outputTokens;
    entry.inputCacheHitTokens += d.inputCacheHitTokens;
    entry.inputCacheMissTokens += d.inputCacheMissTokens;
    entry.totalCost += d.cost ?? 0;
    entry.requestCount += d.requestCount;
  }

  return [...map.values()].map((e) => ({
    apiKeyName: e.apiKeyName,
    totalTokens: e.totalTokens,
    outputTokens: e.outputTokens,
    inputCacheHitTokens: e.inputCacheHitTokens,
    inputCacheMissTokens: e.inputCacheMissTokens,
    totalCost: e.totalCost,
    cacheHitRate:
      e.inputCacheHitTokens + e.inputCacheMissTokens > 0
        ? e.inputCacheHitTokens / (e.inputCacheHitTokens + e.inputCacheMissTokens)
        : 0,
    requestCount: e.requestCount,
  }));
}

/**
 * Main entry point. Takes the text content of both CSV files,
 * returns a structured ParseResult or a ParseError.
 */
export function parseDeepSeekData(
  amountCSVText: string,
  costCSVText: string
): ParseResult | { error: ParseError } {
  // Parse amount CSV
  const amountResult = parseAmountCSV(amountCSVText);
  if ("error" in amountResult) return amountResult;

  // Parse cost CSV
  const costResult = parseCostCSV(costCSVText);
  if ("error" in costResult) return costResult;

  // Pivot and join
  const dailyMap = pivotAmountRows(amountResult.rows);
  const warnings = joinCosts(dailyMap, costResult.rows);

  const daily = [...dailyMap.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.apiKeyName.localeCompare(b.apiKeyName)
  );

  const keys = computeKeyStats(daily).sort((a, b) => b.totalCost - a.totalCost);

  // Summary
  const totalCost = keys.reduce((s, k) => s + k.totalCost, 0);
  const totalTokens = keys.reduce((s, k) => s + k.totalTokens, 0);
  const totalCacheHit = keys.reduce((s, k) => s + k.inputCacheHitTokens, 0);
  const totalCacheMiss = keys.reduce((s, k) => s + k.inputCacheMissTokens, 0);

  const dates = [...new Set(daily.map((d) => d.date))].sort();
  const models = [...new Set(daily.map((d) => d.model))].sort();

  return {
    daily,
    keys,
    summary: {
      totalCost,
      totalTokens,
      totalCacheHitTokens: totalCacheHit,
      totalCacheMissTokens: totalCacheMiss,
      cacheHitRate:
        totalCacheHit + totalCacheMiss > 0
          ? totalCacheHit / (totalCacheHit + totalCacheMiss)
          : 0,
      activeKeys: keys.length,
      dateRange: dates.length > 0 ? { start: dates[0], end: dates[dates.length - 1] } : null,
      models,
    },
    warnings,
  };
}
