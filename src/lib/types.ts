/** Raw row from amount CSV (amount-{year}-{month}.csv or date-range naming) */
export interface AmountRow {
  user_id: string;
  /** Billing date (YYYY-MM-DD), derived from start_time_iso (Beijing local day) or legacy utc_date */
  date: string;
  model: string;
  api_key_name: string;
  api_key: string;
  /** Pivoted: request_count | output_tokens | input_cache_hit_tokens | input_cache_miss_tokens */
  type: AmountType;
  /** Unit price in CNY */
  price: number;
  /** Token count or request count */
  amount: number;
}

/** The four types that appear in the amount CSV's pivoted `type` column */
export type AmountType =
  | "request_count"
  | "output_tokens"
  | "input_cache_hit_tokens"
  | "input_cache_miss_tokens";

/** Raw row from cost-{year}-{month}.csv */
export interface CostRow {
  user_id: string;
  /** Billing date (YYYY-MM-DD), derived from start_time_iso (Beijing local day) or legacy utc_date */
  date: string;
  model: string;
  wallet_type: string;
  /** Negative = charge */
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
  cacheHitRate: number;
  requestCount: number;
}

/** Top-level parsed result */
export interface ParseResult {
  daily: DailyUsage[];
  keys: KeyStats[];
  summary: {
    totalCost: number;
    totalTokens: number;
    totalCacheHitTokens: number;
    totalCacheMissTokens: number;
    cacheHitRate: number;
    activeKeys: number;
    dateRange: { start: string; end: string } | null;
    models: string[];
  };
  /** Warnings generated during parsing (non-fatal) */
  warnings: ParseWarning[];
}

export interface ParseWarning {
  type: "date_mismatch" | "no_cost_match" | "partial_cache_data" | "schema_drift";
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
