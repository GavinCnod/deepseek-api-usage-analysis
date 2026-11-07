import { describe, it, expect } from "vitest";
import { estimateToolCost, TOOL_PRICING } from "@/lib/modelPricing";

describe("Search / Fetch pricing", () => {
  it("uses the official CNY price per 1,000 successful requests", () => {
    expect(estimateToolCost(1_000, TOOL_PRICING.search.cnyPer1000)).toBe(5);
    expect(estimateToolCost(1_000, TOOL_PRICING.fetch.cnyPer1000)).toBe(5);
    expect(estimateToolCost(0, TOOL_PRICING.search.cnyPer1000)).toBe(0);
  });

  it("uses the official USD price independently of CNY", () => {
    expect(estimateToolCost(1_000, TOOL_PRICING.search.usdPer1000)).toBe(0.75);
    expect(estimateToolCost(1_000, TOOL_PRICING.fetch.usdPer1000)).toBe(0.75);
  });

  it("scales linearly with call volume", () => {
    expect(estimateToolCost(2_500, TOOL_PRICING.search.cnyPer1000)).toBe(12.5);
  });
});
