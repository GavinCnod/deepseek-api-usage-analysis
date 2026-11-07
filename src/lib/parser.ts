import Papa from "papaparse";
import type {
  AmountRow,
  AmountType,
  CostRow,
  DailyUsage,
  KeyStats,
  ParseResult,
  ParseWarning,
  ParseError,
} from "./types";
import { WEB_TOOLS_MODEL, isWebToolModel } from "./dataKeys";
import { normalizeToolKind } from "./toolNames";

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

const KNOWN_AMOUNT_TYPES = new Set([
  "request_count",
  "output_tokens",
  "input_cache_hit_tokens",
  "input_cache_miss_tokens",
  "function_call",
]);

/** Tool cost rows in cost CSV have an empty model and a tool-like name. */
function isToolLikeName(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return lower.endsWith("-search") || lower.endsWith("-fetch");
}

function isToolCostRow(c: CostRow): boolean {
  const model = c.model.trim();
  const name = c.name.trim();
  return model === "" || isToolLikeName(model) || isToolLikeName(name);
}

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
 * Unknown billing types are skipped with a warning so a future DeepSeek
 * billing item cannot take down the whole dashboard.
 */
function parseAmountCSV(
  text: string
): { rows: AmountRow[]; warnings: ParseWarning[] } | { error: ParseError } {
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

  const warnings: ParseWarning[] = [];
  const unknownTypes = new Set<string>();
  const rows: AmountRow[] = [];

  // Parse and validate each row
  for (let i = 0; i < result.data.length; i++) {
    const raw = result.data[i];
    const type = raw["type"]?.trim();
    const rowNumber = i + 2;

    if (!type || !KNOWN_AMOUNT_TYPES.has(type)) {
      unknownTypes.add(type || "(empty)");
      continue;
    }

    const model = raw["model"]?.trim() ?? "";
    const name = raw["name"]?.trim() ?? "";
    const priceRaw = raw["price"]?.trim() ?? "";
    const amount = parseInt(raw["amount"], 10);

    if (isNaN(amount)) {
      return {
        error: {
          type: "malformed_row",
          message: `Row ${rowNumber}: invalid amount "${raw["amount"]}"`,
          row: rowNumber,
          column: "amount",
        },
      };
    }

    if (type === "function_call") {
      const price = priceRaw === "" ? 0 : parseFloat(priceRaw);
      if (isNaN(price)) {
        return {
          error: {
            type: "malformed_row",
            message: `Row ${rowNumber}: invalid price "${priceRaw}"`,
            row: rowNumber,
            column: "price",
          },
        };
      }
      if (priceRaw === "") {
        warnings.push({
          type: "schema_drift",
          message: `Row ${rowNumber}: function_call row has no price; tool cost treated as 0.`,
        });
      }

      rows.push({
        user_id: raw["user_id"] ?? "",
        date: resolveDate(raw),
        model,
        name: name || model || "unknown-tool",
        api_key_name: raw["api_key_name"]?.trim() ?? "",
        api_key: raw["api_key"]?.trim() ?? "",
        type: "function_call",
        price,
        amount,
      });
      continue;
    }

    if (!model) {
      warnings.push({
        type: "schema_drift",
        message: `Row ${rowNumber}: ${type} row has no model; row skipped.`,
      });
      continue;
    }

    // request_count rows have no meaningful price — DeepSeek leaves it empty
    const price = priceRaw === "" && type === "request_count" ? 0 : parseFloat(priceRaw);
    if (isNaN(price)) {
      return {
        error: {
          type: "malformed_row",
          message: `Row ${rowNumber}: invalid price "${priceRaw}"`,
          row: rowNumber,
          column: "price",
        },
      };
    }

    rows.push({
      user_id: raw["user_id"] ?? "",
      date: resolveDate(raw),
      model,
      name: name || model,
      api_key_name: raw["api_key_name"]?.trim() ?? "",
      api_key: raw["api_key"]?.trim() ?? "",
      type: type as AmountType,
      price,
      amount,
    });
  }

  if (unknownTypes.size > 0) {
    warnings.push({
      type: "unknown_type",
      message: `Skipped unrecognized billing type(s): ${[...unknownTypes].join(", ")}. Some charges may be missing.`,
    });
  }

  if (rows.length === 0) {
    return {
      error: {
        type: "malformed_row",
        message: `No recognized usage rows. Skipped type(s): ${[...unknownTypes].join(", ") || "none"}.`,
      },
    };
  }

  return { rows, warnings };
}

/**
 * Parse and validate the cost CSV text.
 */
function parseCostCSV(
  text: string
): { rows: CostRow[]; warnings: ParseWarning[] } | { error: ParseError } {
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

  const warnings: ParseWarning[] = [];
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

    const model = raw["model"]?.trim() ?? "";
    const name = raw["name"]?.trim() ?? "";

    if (!model && !name) {
      warnings.push({
        type: "schema_drift",
        message: `Row ${i + 2}: cost row has empty model and name; treated as unattributed tool cost.`,
      });
    }

    rows.push({
      user_id: raw["user_id"] ?? "",
      date: resolveDate(raw),
      model,
      name,
      wallet_type: raw["wallet_type"]?.trim() ?? "",
      cost,
      currency: raw["currency"]?.trim() ?? "CNY",
    });
  }

  return { rows, warnings };
}

/**
 * Pivot amount rows: group by (date, model, api_key_name) and spread type→columns.
 * function_call rows are mapped to a synthetic `__web_tools__` model so they
 * never pollute the real model list and their cost can be attributed per key.
 */
function pivotAmountRows(rows: AmountRow[]): Map<string, DailyUsage> {
  const map = new Map<string, DailyUsage>();

  for (const r of rows) {
    if (r.type === "function_call") {
      const toolName = normalizeToolKind(r.name || r.model);
      const key = `${r.date}|${WEB_TOOLS_MODEL}|${r.api_key_name}|${toolName}`;
      let entry = map.get(key);
      if (!entry) {
        entry = {
          date: r.date,
          model: WEB_TOOLS_MODEL,
          toolName,
          apiKeyName: r.api_key_name,
          apiKey: r.api_key,
          requestCount: 0,
          outputTokens: 0,
          inputCacheHitTokens: 0,
          inputCacheMissTokens: 0,
          toolCallCount: 0,
          pricePerOutputToken: 0,
          pricePerInputToken: null,
          cost: 0,
        };
        map.set(key, entry);
      }

      entry.toolCallCount += r.amount;
      entry.cost = (entry.cost ?? 0) + r.price * r.amount;
      continue;
    }

    const key = `${r.date}|${r.model}|${r.api_key_name}`;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        date: r.date,
        model: r.model,
        toolName: "",
        apiKeyName: r.api_key_name,
        apiKey: r.api_key,
        requestCount: 0,
        outputTokens: 0,
        inputCacheHitTokens: 0,
        inputCacheMissTokens: 0,
        toolCallCount: 0,
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
 *
 * Token rows: cost CSV has (date, model) but NOT api_key_name. We distribute cost
 * proportionally across keys within each (date, model) group based on token usage.
 *
 * Tool rows: cost CSV has (date, name) but no api_key. We distribute by tool call
 * count within each (date, tool) group. If the cost file has no tool row, the
 * amount-derived price × amount value is kept as a fallback.
 */
function joinCosts(
  dailyMap: Map<string, DailyUsage>,
  costRows: CostRow[]
): ParseWarning[] {
  const warnings: ParseWarning[] = [];

  const tokenCostByDateModel = new Map<string, number>();
  const toolCostByDateKind = new Map<string, number>();
  const toolCostByDate = new Map<string, number>();
  let toolCostFileTotal = 0;

  for (const c of costRows) {
    if (isToolCostRow(c)) {
      const rawName = (c.name || c.model).trim();
      const cost = Math.abs(c.cost);
      toolCostFileTotal += cost;
      toolCostByDate.set(c.date, (toolCostByDate.get(c.date) ?? 0) + cost);

      // Keep a date-level pool even when the export omits the tool name.
      // Named rows get a more precise (date, kind) pool for allocation.
      if (rawName) {
        const kind = normalizeToolKind(rawName);
        const key = `${c.date}|${kind}`;
        toolCostByDateKind.set(key, (toolCostByDateKind.get(key) ?? 0) + cost);
      }
    } else {
      const key = `${c.date}|${c.model}`;
      tokenCostByDateModel.set(key, (tokenCostByDateModel.get(key) ?? 0) + Math.abs(c.cost));
    }
  }

  const toolEntries = [...dailyMap.values()].filter((d) => isWebToolModel(d.model));
  const toolAmountEstimateTotal = toolEntries.reduce((s, d) => s + (d.cost ?? 0), 0);

  // Aggregate total tokens by (date, model) for proportional distribution.
  // Synthetic tool rows are skipped — they have zero tokens and a separate cost pool.
  const tokensByDateModel = new Map<string, number>();
  for (const [, d] of dailyMap) {
    if (isWebToolModel(d.model)) continue;
    const key = `${d.date}|${d.model}`;
    tokensByDateModel.set(
      key,
      (tokensByDateModel.get(key) ?? 0) +
        d.outputTokens +
        d.inputCacheHitTokens +
        d.inputCacheMissTokens
    );
  }

  // Distribute token cost to each real daily entry
  for (const [, d] of dailyMap) {
    if (isWebToolModel(d.model)) continue;

    const costKey = `${d.date}|${d.model}`;
    const totalCostForGroup = tokenCostByDateModel.get(costKey);
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

  // Group synthetic tool entries by (date, tool kind)
  const toolGroups = new Map<string, DailyUsage[]>();
  for (const d of toolEntries) {
    const key = `${d.date}|${d.toolName}`;
    const group = toolGroups.get(key);
    if (group) group.push(d);
    else toolGroups.set(key, [d]);
  }

  const assignedToolEntries = new Set<DailyUsage>();
  const assignedCostByDate = new Map<string, number>();

  // First pass: cost rows that match a tool kind exactly
  for (const [key, entries] of toolGroups) {
    const groupCost = toolCostByDateKind.get(key);
    if (groupCost === undefined) continue;

    const totalCalls = entries.reduce((s, d) => s + d.toolCallCount, 0);
    for (const d of entries) {
      d.cost =
        totalCalls > 0
          ? groupCost * (d.toolCallCount / totalCalls)
          : groupCost / entries.length;
      assignedToolEntries.add(d);
    }

    const date = entries[0].date;
    assignedCostByDate.set(date, (assignedCostByDate.get(date) ?? 0) + groupCost);
  }

  // Orphan tool cost rows: keep the bill total even if amount rows are missing.
  for (const [key, groupCost] of toolCostByDateKind) {
    if (toolGroups.has(key)) continue;

    const [date, kind] = key.split("|");
    const entry: DailyUsage = {
      date,
      model: WEB_TOOLS_MODEL,
      toolName: kind,
      apiKeyName: "Unattributed",
      apiKey: "",
      requestCount: 0,
      outputTokens: 0,
      inputCacheHitTokens: 0,
      inputCacheMissTokens: 0,
      toolCallCount: 0,
      pricePerOutputToken: 0,
      pricePerInputToken: null,
      cost: groupCost,
    };
    dailyMap.set(`${date}|${WEB_TOOLS_MODEL}|Unattributed|${kind}`, entry);
    assignedCostByDate.set(date, (assignedCostByDate.get(date) ?? 0) + groupCost);
    warnings.push({
      type: "unattributed_tool_cost",
      message: `Tool cost for ${kind} on ${date} has no matching usage row; kept as Unattributed.`,
    });
  }

  // Second pass: unmatched entries share any remaining tool cost for the date.
  const unmatchedByDate = new Map<string, DailyUsage[]>();
  for (const d of toolEntries) {
    if (assignedToolEntries.has(d)) continue;
    const group = unmatchedByDate.get(d.date);
    if (group) group.push(d);
    else unmatchedByDate.set(d.date, [d]);
  }

  for (const [date, entries] of unmatchedByDate) {
    const dateTotal = toolCostByDate.get(date);
    if (dateTotal === undefined) continue;

    const remaining = Math.max(0, dateTotal - (assignedCostByDate.get(date) ?? 0));
    if (remaining <= 0) continue;

    const totalCalls = entries.reduce((s, d) => s + d.toolCallCount, 0);
    for (const d of entries) {
      d.cost =
        totalCalls > 0
          ? remaining * (d.toolCallCount / totalCalls)
          : remaining / entries.length;
    }
    assignedCostByDate.set(date, (assignedCostByDate.get(date) ?? 0) + remaining);
  }

  // If a date-level tool pool still has unmatched cost (e.g. the export omitted
  // the tool name and no usage rows exist), keep it as an Unattributed entry.
  for (const [date, dateTotal] of toolCostByDate) {
    const unassigned = dateTotal - (assignedCostByDate.get(date) ?? 0);
    if (unassigned <= 0.000001) continue;

    const entry: DailyUsage = {
      date,
      model: WEB_TOOLS_MODEL,
      toolName: "unknown-tool",
      apiKeyName: "Unattributed",
      apiKey: "",
      requestCount: 0,
      outputTokens: 0,
      inputCacheHitTokens: 0,
      inputCacheMissTokens: 0,
      toolCallCount: 0,
      pricePerOutputToken: 0,
      pricePerInputToken: null,
      cost: unassigned,
    };
    dailyMap.set(`${date}|${WEB_TOOLS_MODEL}|Unattributed|unknown-tool`, entry);
    assignedCostByDate.set(date, dateTotal);
    warnings.push({
      type: "unattributed_tool_cost",
      message: `Unassigned tool cost on ${date} was kept as Unattributed.`,
    });
  }

  if (
    toolCostFileTotal > 0 &&
    Math.abs(toolCostFileTotal - toolAmountEstimateTotal) > 0.01
  ) {
    warnings.push({
      type: "tool_cost_mismatch",
      message: `Cost file tool charges (¥${toolCostFileTotal.toFixed(4)}) differ from amount-derived tool charges (¥${toolAmountEstimateTotal.toFixed(4)}).`,
    });
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
 * Tool-only keys are included with zero tokens and their tool cost/call count.
 */
export function computeKeyStats(daily: DailyUsage[]): KeyStats[] {
  const map = new Map<string, {
    apiKeyName: string;
    totalTokens: number;
    outputTokens: number;
    inputCacheHitTokens: number;
    inputCacheMissTokens: number;
    totalCost: number;
    toolCost: number;
    toolCallCount: number;
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
        toolCost: 0,
        toolCallCount: 0,
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

    if (isWebToolModel(d.model)) {
      entry.toolCost += d.cost ?? 0;
      entry.toolCallCount += d.toolCallCount;
    }
  }

  return [...map.values()].map((e) => ({
    apiKeyName: e.apiKeyName,
    totalTokens: e.totalTokens,
    outputTokens: e.outputTokens,
    inputCacheHitTokens: e.inputCacheHitTokens,
    inputCacheMissTokens: e.inputCacheMissTokens,
    totalCost: e.totalCost,
    toolCost: e.toolCost,
    toolCallCount: e.toolCallCount,
    cacheHitRate:
      e.inputCacheHitTokens + e.inputCacheMissTokens > 0
        ? e.inputCacheHitTokens / (e.inputCacheHitTokens + e.inputCacheMissTokens)
        : 0,
    requestCount: e.requestCount,
  }));
}

/**
 * Build the top-level summary. Shared by the parser and the model filter so both
 * use the same tool/model split.
 */
export function summarizeDaily(daily: DailyUsage[]): ParseResult["summary"] {
  const toolRows = daily.filter((d) => isWebToolModel(d.model));
  const realRows = daily.filter((d) => !isWebToolModel(d.model));

  const totalCost = daily.reduce((s, d) => s + (d.cost ?? 0), 0);
  const totalToolCost = toolRows.reduce((s, d) => s + (d.cost ?? 0), 0);
  const totalToolCalls = toolRows.reduce((s, d) => s + d.toolCallCount, 0);
  const totalTokens = realRows.reduce(
    (s, d) => s + d.outputTokens + d.inputCacheHitTokens + d.inputCacheMissTokens,
    0
  );
  const totalCacheHit = realRows.reduce((s, d) => s + d.inputCacheHitTokens, 0);
  const totalCacheMiss = realRows.reduce((s, d) => s + d.inputCacheMissTokens, 0);

  const dates = [...new Set(daily.map((d) => d.date))].sort();
  const models = [...new Set(realRows.map((d) => d.model))].sort();
  const toolNames = [...new Set(toolRows.map((d) => d.toolName))].sort();

  return {
    totalCost,
    totalTokenCost: Math.max(0, totalCost - totalToolCost),
    totalToolCost,
    totalToolCalls,
    totalTokens,
    totalCacheHitTokens: totalCacheHit,
    totalCacheMissTokens: totalCacheMiss,
    cacheHitRate:
      totalCacheHit + totalCacheMiss > 0
        ? totalCacheHit / (totalCacheHit + totalCacheMiss)
        : 0,
    activeKeys: new Set(daily.map((d) => d.apiKeyName)).size,
    dateRange: dates.length > 0 ? { start: dates[0], end: dates[dates.length - 1] } : null,
    models,
    toolNames,
  };
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

  const warnings: ParseWarning[] = [
    ...amountResult.warnings,
    ...costResult.warnings,
  ];

  // Pivot and join
  const dailyMap = pivotAmountRows(amountResult.rows);
  warnings.push(...joinCosts(dailyMap, costResult.rows));

  const daily = [...dailyMap.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.apiKeyName.localeCompare(b.apiKeyName)
  );

  const keys = computeKeyStats(daily).sort((a, b) => b.totalCost - a.totalCost);
  const summary = summarizeDaily(daily);

  return {
    daily,
    keys,
    summary,
    warnings,
  };
}
