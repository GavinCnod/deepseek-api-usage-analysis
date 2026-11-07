import { describe, it, expect } from "vitest";
import { parseDeepSeekData } from "@/lib/parser";
import { concatMonthlyCSVs, normalizeCsvChunks, type CsvLike } from "@/lib/concatFiles";

const NEW_AMOUNT_CSV = `user_id,start_time_iso,end_time_iso,model,api_key_name,api_key,type,price,amount
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,ForCherry,sk-xxx,input_cache_miss_tokens,0.000003,7064
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,ForCherry,sk-xxx,request_count,,2
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,ForCherry,sk-xxx,output_tokens,0.000006,1890`;

const NEW_COST_CSV = `user_id,start_time_iso,end_time_iso,model,wallet_type,cost,currency
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,Paid,0.032532,CNY`;

const LEGACY_AMOUNT_CSV = `user_id,utc_date,model,api_key_name,api_key,type,price,amount
u1,2026-08-02,deepseek-v4-pro,ForCherry,sk-xxx,output_tokens,0.000006,1890
u1,2026-08-02,deepseek-v4-pro,ForCherry,sk-xxx,request_count,,2`;

const LEGACY_COST_CSV = `user_id,utc_date,model,cost,currency
u1,2026-08-02,deepseek-v4-pro,0.01,CNY`;

describe("parseDeepSeekData — new export format", () => {
  it("derives billing date from start_time_iso and joins cost", () => {
    const result = parseDeepSeekData(NEW_AMOUNT_CSV, NEW_COST_CSV);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(1);
    const day = result.daily[0];
    expect(day.date).toBe("2026-08-02");
    expect(day.model).toBe("deepseek-v4-pro");
    expect(day.apiKeyName).toBe("ForCherry");
    expect(day.requestCount).toBe(2);
    expect(day.outputTokens).toBe(1890);
    expect(day.inputCacheMissTokens).toBe(7064);
    expect(day.inputCacheHitTokens).toBe(0);
    expect(day.cost).toBeCloseTo(0.032532, 6);

    expect(result.summary.totalTokens).toBe(8954);
    expect(result.summary.totalCost).toBeCloseTo(0.032532, 6);
    expect(result.summary.dateRange).toEqual({ start: "2026-08-02", end: "2026-08-02" });
    expect(result.warnings).toEqual([]);
  });

  it("distributes cost proportionally across keys within a (date, model) group", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,api_key_name,api_key,type,price,amount
u1,2026-08-03T00:00:00+08:00,2026-08-04T00:00:00+08:00,deepseek-v4-pro,KeyA,sk-a,output_tokens,0.000006,9000
u1,2026-08-03T00:00:00+08:00,2026-08-04T00:00:00+08:00,deepseek-v4-pro,KeyB,sk-b,output_tokens,0.000006,1000`;
    const cost = `user_id,start_time_iso,end_time_iso,model,wallet_type,cost,currency
u1,2026-08-03T00:00:00+08:00,2026-08-04T00:00:00+08:00,deepseek-v4-pro,Paid,1.0,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    const keyA = result.daily.find((d) => d.apiKeyName === "KeyA");
    const keyB = result.daily.find((d) => d.apiKeyName === "KeyB");
    expect(keyA?.cost).toBeCloseTo(0.9, 6);
    expect(keyB?.cost).toBeCloseTo(0.1, 6);
    expect(result.summary.totalCost).toBeCloseTo(1.0, 6);
  });
});

describe("parseDeepSeekData — legacy utc_date format", () => {
  it("still parses legacy exports for backward compatibility", () => {
    const result = parseDeepSeekData(LEGACY_AMOUNT_CSV, LEGACY_COST_CSV);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(1);
    expect(result.daily[0].date).toBe("2026-08-02");
    expect(result.daily[0].cost).toBeCloseTo(0.01, 6);
    expect(result.daily[0].outputTokens).toBe(1890);
  });
});

describe("parseDeepSeekData — validation errors", () => {
  it("rejects amount CSV with neither start_time_iso nor utc_date", () => {
    const bad = `model,api_key_name,api_key,type,price,amount
deepseek-v4-pro,ForCherry,sk-xxx,output_tokens,0.000006,1890`;
    const result = parseDeepSeekData(bad, NEW_COST_CSV);
    expect("error" in result).toBe(true);
    if (!("error" in result)) return;
    expect(result.error.type).toBe("missing_columns");
    expect(result.error.message).toContain("start_time_iso");
  });

  it("rejects cost CSV with neither start_time_iso nor utc_date", () => {
    const bad = `model,cost,currency
deepseek-v4-pro,0.01,CNY`;
    const result = parseDeepSeekData(NEW_AMOUNT_CSV, bad);
    expect("error" in result).toBe(true);
    if (!("error" in result)) return;
    expect(result.error.type).toBe("missing_columns");
    expect(result.error.message).toContain("start_time_iso");
  });

  it("skips rows with an unknown type and keeps recognized rows", () => {
    const mixed = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,deepseek-v4-pro,ForCherry,sk-xxx,output_tokens,0.000006,1890
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,deepseek-v4-pro,ForCherry,sk-xxx,web_search_req,0.005,1`;
    const result = parseDeepSeekData(mixed, NEW_COST_CSV);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(1);
    expect(result.daily[0].outputTokens).toBe(1890);
    expect(result.warnings.some((w) => w.type === "unknown_type")).toBe(true);
  });
});

describe("parseDeepSeekData — web tool billing", () => {
  const WEB_TOOL_AMOUNT = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,deepseek-flash,deepseek-flash,KeyA,sk-a,input_cache_miss_tokens,0.000002,1000
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,KeyA,sk-a,function_call,0.005,14
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-fetch,KeyA,sk-a,function_call,0.005,1`;

  const WEB_TOOL_COST = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,deepseek-flash,deepseek-flash,Paid,0.002,CNY
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Granted,0.07,CNY
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-fetch,Granted,0.005,CNY`;

  it("parses function_call rows into the synthetic web-tool dimension", () => {
    const result = parseDeepSeekData(WEB_TOOL_AMOUNT, WEB_TOOL_COST);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(3);
    const search = result.daily.find((d) => d.toolName === "search");
    const fetch = result.daily.find((d) => d.toolName === "fetch");

    expect(search?.model).toBe("__web_tools__");
    expect(search?.toolCallCount).toBe(14);
    expect(search?.cost).toBeCloseTo(0.07, 6);
    expect(fetch?.toolCallCount).toBe(1);
    expect(fetch?.cost).toBeCloseTo(0.005, 6);

    expect(result.summary.models).toEqual(["deepseek-flash"]);
    expect(result.summary.toolNames).toEqual(["fetch", "search"]);
    expect(result.summary.totalTokens).toBe(1000);
    expect(result.summary.totalTokenCost).toBeCloseTo(0.002, 6);
    expect(result.summary.totalToolCost).toBeCloseTo(0.075, 6);
    expect(result.summary.totalToolCalls).toBe(15);
    expect(result.summary.totalCost).toBeCloseTo(0.077, 6);

    expect(result.keys).toHaveLength(1);
    expect(result.keys[0].totalCost).toBeCloseTo(0.077, 6);
    expect(result.keys[0].toolCost).toBeCloseTo(0.075, 6);
    expect(result.keys[0].toolCallCount).toBe(15);
    expect(result.warnings).toEqual([]);
  });

  it("falls back to amount price × amount when cost CSV has no tool rows", () => {
    const cost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,deepseek-flash,deepseek-flash,Paid,0.002,CNY`;

    const result = parseDeepSeekData(WEB_TOOL_AMOUNT, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.summary.totalToolCost).toBeCloseTo(0.075, 6);
    expect(result.summary.totalCost).toBeCloseTo(0.077, 6);
    expect(result.warnings.some((w) => w.type === "tool_cost_mismatch")).toBe(false);
  });

  it("keeps a tool-only key in keys and activeKeys", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,ToolOnly,sk-t,function_call,0.005,14`;
    const cost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Granted,0.07,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(1);
    expect(result.daily[0].model).toBe("__web_tools__");
    expect(result.summary.models).toEqual([]);
    expect(result.summary.activeKeys).toBe(1);
    expect(result.summary.totalTokens).toBe(0);
    expect(result.summary.totalCost).toBeCloseTo(0.07, 6);
    expect(result.keys).toHaveLength(1);
    expect(result.keys[0].apiKeyName).toBe("ToolOnly");
    expect(result.keys[0].toolCallCount).toBe(14);
  });

  it("normalizes server-tool-search and tool-search to the same kind", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,server-tool-search,KeyA,sk-a,function_call,0.005,1`;
    const cost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,server-tool-search,Granted,0.005,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily[0].toolName).toBe("search");
    expect(result.summary.toolNames).toEqual(["search"]);
    expect(result.summary.totalToolCost).toBeCloseTo(0.005, 6);
  });

  it("uses the cost CSV tool amount when it differs from the amount estimate", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,KeyA,sk-a,function_call,0.005,14`;
    const cost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Granted,0.10,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily[0].cost).toBeCloseTo(0.1, 6);
    expect(result.summary.totalToolCost).toBeCloseTo(0.1, 6);
    expect(result.warnings.some((w) => w.type === "tool_cost_mismatch")).toBe(true);
  });

  it("distributes a date-level tool cost when the cost CSV has no name column", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,KeyA,sk-a,function_call,0.005,14`;
    const cost = `user_id,start_time_iso,end_time_iso,model,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,Granted,0.07,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(1);
    expect(result.daily[0].cost).toBeCloseTo(0.07, 6);
    expect(result.summary.totalToolCost).toBeCloseTo(0.07, 6);
  });

  it("keeps a tool cost row with no matching usage row as Unattributed", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,deepseek-flash,deepseek-flash,KeyA,sk-a,output_tokens,0.000004,100`;
    const cost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,deepseek-flash,deepseek-flash,Paid,0.0004,CNY
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,,tool-search,Granted,0.005,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    const unattributed = result.daily.find((d) => d.apiKeyName === "Unattributed");
    expect(unattributed?.cost).toBeCloseTo(0.005, 6);
    expect(result.summary.totalToolCost).toBeCloseTo(0.005, 6);
    expect(result.warnings.some((w) => w.type === "unattributed_tool_cost")).toBe(true);
  });

  it("aggregates hourly amount rows into one Beijing-local day", () => {
    const amount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-11-07T09:00:00+08:00,2026-11-07T10:00:00+08:00,deepseek-flash,deepseek-flash,KeyA,sk-a,output_tokens,0.000004,100
u1,2026-11-07T10:00:00+08:00,2026-11-07T11:00:00+08:00,deepseek-flash,deepseek-flash,KeyA,sk-a,output_tokens,0.000004,200`;
    const cost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-11-07T00:00:00+08:00,2026-11-08T00:00:00+08:00,deepseek-flash,deepseek-flash,Paid,0.0012,CNY`;

    const result = parseDeepSeekData(amount, cost);
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.daily).toHaveLength(1);
    expect(result.daily[0].date).toBe("2026-11-07");
    expect(result.daily[0].outputTokens).toBe(300);
    expect(result.daily[0].cost).toBeCloseTo(0.0012, 6);
  });
});

describe("concatMonthlyCSVs — filename pairing", () => {
  const csv = (name: string, body: string): CsvLike => ({
    name,
    text: () => Promise.resolve(`h\n${body}`),
  });

  it("normalizes mixed legacy/new headers in either order", () => {
    const oldAmount = `user_id,utc_date,model,api_key_name,api_key,type,price,amount
u1,2026-07-01,deepseek-v4-pro,KeyA,sk-a,output_tokens,0.000006,100`;
    const newAmount = `user_id,start_time_iso,end_time_iso,model,name,api_key_name,api_key,type,price,amount
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,deepseek-v4-pro,KeyA,sk-a,output_tokens,0.000006,200`;
    const oldCost = `user_id,utc_date,model,cost,currency
u1,2026-07-01,deepseek-v4-pro,0.0006,CNY`;
    const newCost = `user_id,start_time_iso,end_time_iso,model,name,wallet_type,cost,currency
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,deepseek-v4-pro,Paid,0.0012,CNY`;

    for (const [amounts, costs] of [
      [[oldAmount, newAmount], [oldCost, newCost]],
      [[newAmount, oldAmount], [newCost, oldCost]],
    ] as const) {
      const mergedAmount = normalizeCsvChunks([...amounts]);
      const mergedCost = normalizeCsvChunks([...costs]);
      const result = parseDeepSeekData(mergedAmount, mergedCost);

      expect("error" in result).toBe(false);
      if ("error" in result) return;

      expect(result.daily).toHaveLength(2);
      expect(result.daily.map((d) => d.date)).toEqual(["2026-07-01", "2026-08-02"]);
      expect(result.daily.map((d) => d.outputTokens)).toEqual([100, 200]);
    }
  });

  it("pairs new date-range filenames across two periods", async () => {
    const files = [
      csv("amount-2026-08-01_2026-08-17.csv", "a1"),
      csv("cost-2026-08-01_2026-08-17.csv", "c1"),
      csv("amount-2026-07-01_2026-07-31.csv", "a2"),
      csv("cost-2026-07-01_2026-07-31.csv", "c2"),
    ];
    const result = await concatMonthlyCSVs(files);
    expect(result.monthCount).toBe(2);
    expect(result.label).toBe("2026-07 ~ 2026-08");
    expect(result.amountText).toContain("a1");
    expect(result.amountText).toContain("a2");
    expect(result.costText).toContain("c1");
    expect(result.costText).toContain("c2");
  });

  it("still pairs legacy amount-{year}-{month} filenames", async () => {
    const files = [
      csv("amount-2026-5.csv", "a1"),
      csv("cost-2026-5.csv", "c1"),
      csv("amount-2026-06.csv", "a2"),
      csv("cost-2026-06.csv", "c2"),
    ];
    const result = await concatMonthlyCSVs(files);
    expect(result.monthCount).toBe(2);
    expect(result.label).toBe("2026-05 ~ 2026-06");
  });

  it("keeps a single new-format range file pair intact", async () => {
    const files = [
      csv("amount-2026-08-01_2026-08-17.csv", "a1"),
      csv("cost-2026-08-01_2026-08-17.csv", "c1"),
    ];
    const result = await concatMonthlyCSVs(files);
    expect(result.monthCount).toBe(1);
    expect(result.label).toBe("2026-08");
    expect(result.amountText).toContain("a1");
    expect(result.costText).toContain("c1");
  });
});