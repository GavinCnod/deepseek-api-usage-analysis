import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { DataProvider, useData, WEB_TOOLS_MODEL } from "@/lib/DataContext";

// Mock only the parser entry point; keep the real aggregation helpers so the
// filter behavior can be tested without duplicating summary logic.
vi.mock("@/lib/parser", async () => {
  const actual = await vi.importActual<typeof import("@/lib/parser")>("@/lib/parser");
  return {
    ...actual,
    parseDeepSeekData: vi.fn(),
  };
});

import { parseDeepSeekData } from "@/lib/parser";

const mockParseDeepSeekData = parseDeepSeekData as ReturnType<typeof vi.fn>;

describe("DataContext — loadFiles error handling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockParseDeepSeekData.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DataProvider>{children}</DataProvider>
  );

  it("sets loading: true when loadFiles is called", () => {
    mockParseDeepSeekData.mockReturnValue({
      daily: [{ date: "2026-06-01", model: "deepseek-chat", apiKeyName: "test-key", apiKey: "sk-xxx", requestCount: 10, outputTokens: 100, inputCacheHitTokens: 0, inputCacheMissTokens: 0, pricePerOutputToken: 0.001, pricePerInputToken: null, cost: 0.1 }],
      keys: [],
      summary: {
        totalCost: 0.1,
        totalTokens: 100,
        totalCacheHitTokens: 0,
        totalCacheMissTokens: 0,
        cacheHitRate: 0,
        activeKeys: 1,
        dateRange: { start: "2026-06-01", end: "2026-06-01" },
        models: ["deepseek-chat"],
      },
      warnings: [],
    });

    const { result } = renderHook(() => useData(), { wrapper });

    act(() => {
      result.current.loadFiles("fake-amount", "fake-cost", "test.csv");
    });

    expect(result.current.loading).toBe(true);
  });

  it("sets result after successful parse and timer flush", () => {
    mockParseDeepSeekData.mockReturnValue({
      daily: [{ date: "2026-06-01", model: "deepseek-chat", apiKeyName: "test-key", apiKey: "sk-xxx", requestCount: 10, outputTokens: 100, inputCacheHitTokens: 0, inputCacheMissTokens: 0, pricePerOutputToken: 0.001, pricePerInputToken: null, cost: 0.1 }],
      keys: [],
      summary: {
        totalCost: 0.1,
        totalTokens: 100,
        totalCacheHitTokens: 0,
        totalCacheMissTokens: 0,
        cacheHitRate: 0,
        activeKeys: 1,
        dateRange: { start: "2026-06-01", end: "2026-06-01" },
        models: ["deepseek-chat"],
      },
      warnings: [],
    });

    const { result } = renderHook(() => useData(), { wrapper });

    act(() => {
      result.current.loadFiles("fake-amount", "fake-cost", "test.csv");
    });

    // Flush the setTimeout
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.summary.totalCost).toBe(0.1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("filters real models and web tools separately", () => {
    mockParseDeepSeekData.mockReturnValue({
      daily: [
        { date: "2026-11-07", model: "deepseek-chat", apiKeyName: "test-key", apiKey: "sk-xxx", requestCount: 10, outputTokens: 100, inputCacheHitTokens: 0, inputCacheMissTokens: 0, toolName: "", toolCallCount: 0, pricePerOutputToken: 0.001, pricePerInputToken: null, cost: 0.1 },
        { date: "2026-11-07", model: WEB_TOOLS_MODEL, apiKeyName: "test-key", apiKey: "sk-xxx", requestCount: 0, outputTokens: 0, inputCacheHitTokens: 0, inputCacheMissTokens: 0, toolName: "search", toolCallCount: 14, pricePerOutputToken: 0, pricePerInputToken: null, cost: 0.007 },
      ],
      keys: [],
      summary: {
        totalCost: 0.107,
        totalTokenCost: 0.1,
        totalToolCost: 0.007,
        totalToolCalls: 14,
        totalTokens: 100,
        totalCacheHitTokens: 0,
        totalCacheMissTokens: 0,
        cacheHitRate: 0,
        activeKeys: 1,
        dateRange: { start: "2026-11-07", end: "2026-11-07" },
        models: ["deepseek-chat"],
        toolNames: ["search"],
      },
      warnings: [],
    });

    const { result } = renderHook(() => useData(), { wrapper });

    act(() => {
      result.current.loadFiles("fake-amount", "fake-cost", "test.csv");
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.filteredResult?.summary.totalCost).toBeCloseTo(0.107, 6);

    act(() => {
      result.current.setSelectedModel("deepseek-chat");
    });

    expect(result.current.filteredResult?.daily).toHaveLength(1);
    expect(result.current.filteredResult?.summary.totalCost).toBeCloseTo(0.1, 6);
    expect(result.current.filteredResult?.summary.totalToolCost).toBe(0);
    expect(result.current.filteredResult?.summary.models).toEqual(["deepseek-chat"]);

    act(() => {
      result.current.setSelectedModel(WEB_TOOLS_MODEL);
    });

    expect(result.current.filteredResult?.daily).toHaveLength(1);
    expect(result.current.filteredResult?.daily[0].model).toBe(WEB_TOOLS_MODEL);
    expect(result.current.filteredResult?.summary.totalCost).toBeCloseTo(0.007, 6);
    expect(result.current.filteredResult?.summary.totalToolCost).toBeCloseTo(0.007, 6);
    expect(result.current.filteredResult?.summary.totalToolCalls).toBe(14);
    expect(result.current.filteredResult?.summary.models).toEqual(["deepseek-chat"]);
  });

  it("sets error state when parseDeepSeekData returns an error", () => {
    const parseError = { type: "empty_file" as const, message: "No data found" };
    mockParseDeepSeekData.mockReturnValue({ error: parseError });

    const { result } = renderHook(() => useData(), { wrapper });

    act(() => {
      result.current.loadFiles("", "", "empty.csv");
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toEqual(parseError);
    expect(result.current.loading).toBe(false);
  });

  it("catches synchronous throws from parseDeepSeekData and sets error", () => {
    mockParseDeepSeekData.mockImplementation(() => {
      throw new Error("Unexpected parser crash");
    });

    const { result } = renderHook(() => useData(), { wrapper });

    act(() => {
      result.current.loadFiles("bad-data", "bad-cost", "bad.csv");
    });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error!.type).toBe("malformed_row");
    expect(result.current.error!.message).toBe("Unexpected parser crash");
    expect(result.current.loading).toBe(false);
  });
});
