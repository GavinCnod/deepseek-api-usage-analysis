/** Raw row from amount CSV (amount-{year}-{month}.csv or date-range naming) */
export interface AmountRow {
  user_id: string;
  /** Billing date (YYYY-MM-DD), derived from start_time_iso (Beijing local day) or legacy utc_date */
  date: string;
  model: string;
  /** New `name` column: equals model for token rows, tool name for function_call rows */
  name: string;
  api_key_name: string;
  api_key: string;
  /** Pivoted: request_count | output_tokens | input_cache_hit_tokens | input_cache_miss_tokens | function_call */
  type: AmountType;
  /** Unit price in CNY */
  price: number;
  /** Token count, request count, or tool call count */
  amount: number;
}

/** The types that appear in the amount CSV's pivoted `type` column */
export type AmountType =
  | "request_count"
  | "output_tokens"
  | "input_cache_hit_tokens"
  | "input_cache_miss_tokens"
  | "function_call";

/** Raw row from cost-{year}-{month}.csv */
export interface CostRow {
  user_id: string;
  /** Billing date (YYYY-MM-DD), derived from start_time_iso (Beijing local day) or legacy utc_date */
  date: string;
  model: string;
  /** New optional `name` column: equals model for token rows, tool name for function_call rows */
  name: string;
  wallet_type: string;
  /** Signed amount in the export; the dashboard uses the absolute value as the charge */
  cost: number;
  currency: string;
}

/** One day of usage for a specific key + model, after pivoting the amount CSV */
export interface DailyUsage {
  date: string;
  model: string;
  apiKeyName: string;
  apiKey: string;
  requestCount: number;
  outputTokens: number;
  inputCacheHitTokens: number;
  inputCacheMissTokens: number;
  /**
   * Synthetic web-tool dimension only. Empty for real model rows.
   * Normalized to "search" | "fetch" | raw tool name.
   */
  toolName: string;
  /** Synthetic web-tool dimension only. Zero for real model rows. */
  toolCallCount: number;
  pricePerOutputToken: number;
  pricePerInputToken: number | null;
  /** Matched cost from the cost CSV (absolute value, in CNY). May be null if no cost row matched. */
  cost: number | null;
}

/** Aggregated stats for one API key across the entire period */
export interface KeyStats {
  apiKeyName: string;
  totalTokens: number;
  outputTokens: number;
  inputCacheHitTokens: number;
  inputCacheMissTokens: number;
  totalCost: number;
  toolCost: number;
  toolCallCount: number;
  cacheHitRate: number;
  requestCount: number;
}

/** Top-level parsed result */
export interface ParseResult {
  daily: DailyUsage[];
  keys: KeyStats[];
  summary: {
    /** Total bill: token/model cost + web tool cost */
    totalCost: number;
    /** Model token cost only */
    totalTokenCost: number;
    /** Web tool cost only */
    totalToolCost: number;
    /** Total web tool calls */
    totalToolCalls: number;
    totalTokens: number;
    totalCacheHitTokens: number;
    totalCacheMissTokens: number;
    cacheHitRate: number;
    activeKeys: number;
    dateRange: { start: string; end: string } | null;
    /** Real models only, excludes the synthetic web-tool dimension */
    models: string[];
    /** Normalized web tool names: search / fetch / other */
    toolNames: string[];
  };
  /** Warnings generated during parsing (non-fatal) */
  warnings: ParseWarning[];
}

export interface ParseWarning {
  type:
    | "date_mismatch"
    | "no_cost_match"
    | "partial_cache_data"
    | "schema_drift"
    | "unknown_type"
    | "tool_cost_mismatch"
    | "unattributed_tool_cost";
  message: string;
}

/** Possible error from parsing */
export interface ParseError {
  type: "missing_columns" | "malformed_row" | "empty_file" | "incomplete_upload";
  message: string;
  /** Row number for malformed_row */
  row?: number;
  /** Column name for malformed_row */
  column?: string;
}
