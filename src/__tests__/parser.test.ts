import { describe, it, expect } from "vitest";
import { parseDeepSeekData } from "@/lib/parser";
import { concatMonthlyCSVs, type CsvLike } from "@/lib/concatFiles";

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

  it("rejects rows with an invalid type", () => {
    const bad = `user_id,start_time_iso,end_time_iso,model,api_key_name,api_key,type,price,amount
u1,2026-08-02T00:00:00+08:00,2026-08-03T00:00:00+08:00,deepseek-v4-pro,ForCherry,sk-xxx,bogus_type,0.000006,1890`;
    const result = parseDeepSeekData(bad, NEW_COST_CSV);
    expect("error" in result).toBe(true);
    if (!("error" in result)) return;
    expect(result.error.type).toBe("malformed_row");
  });
});

describe("concatMonthlyCSVs — filename pairing", () => {
  const csv = (name: string, body: string): CsvLike => ({
    name,
    text: () => Promise.resolve(`h\n${body}`),
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