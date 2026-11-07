"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { ParseResult, ParseError, ParseWarning } from "./types";
import { parseDeepSeekData, computeKeyStats, summarizeDaily } from "./parser";
import { ALL_MODELS } from "./dataKeys";

export { ALL_MODELS, WEB_TOOLS_MODEL } from "./dataKeys";

function filterResult(result: ParseResult | null, model: string): ParseResult | null {
  if (!result) return null;
  if (model === ALL_MODELS) return result;

  const filteredDaily = result.daily.filter((d) => d.model === model);
  const keys = computeKeyStats(filteredDaily).sort((a, b) => b.totalCost - a.totalCost);
  const summary = summarizeDaily(filteredDaily);

  return {
    daily: filteredDaily,
    keys,
    summary: {
      ...summary,
      // Keep the original model list for the filter UI.
      models: result.summary.models,
    },
    warnings: result.warnings,
  };
}

interface DataState {
  result: ParseResult | null;
  error: ParseError | null;
  warnings: ParseWarning[];
  loading: boolean;
  fileName: string;
  selectedModel: string;
}

interface DataContextValue extends DataState {
  loadFiles: (amountCSV: string, costCSV: string, fileName: string) => void;
  clear: () => void;
  setSelectedModel: (model: string) => void;
  filteredResult: ParseResult | null;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({
    result: null,
    error: null,
    warnings: [],
    loading: false,
    fileName: "",
    selectedModel: ALL_MODELS,
  });

  const setSelectedModel = useCallback((model: string) => {
    setState((s) => ({ ...s, selectedModel: model }));
  }, []);

  const filteredResult = useMemo(
    () => filterResult(state.result, state.selectedModel),
    [state.result, state.selectedModel]
  );

  const loadFiles = useCallback(
    (amountCSV: string, costCSV: string, fileName: string) => {
      setState((s) => ({ ...s, loading: true, error: null, selectedModel: ALL_MODELS }));
      // Use setTimeout to avoid blocking the UI during parsing
      setTimeout(() => {
        try {
          const parsed = parseDeepSeekData(amountCSV, costCSV);
          if ("error" in parsed) {
            setState({
              result: null,
              error: parsed.error,
              warnings: [],
              loading: false,
              fileName,
              selectedModel: ALL_MODELS,
            });
          } else {
            setState({
              result: parsed,
              error: null,
              warnings: parsed.warnings,
              loading: false,
              fileName,
              selectedModel: ALL_MODELS,
            });
          }
        } catch (err) {
          setState({
            result: null,
            error: {
              type: "malformed_row" as const,
              message: err instanceof Error ? err.message : "Unexpected parsing error",
            },
            warnings: [],
            loading: false,
            fileName,
            selectedModel: ALL_MODELS,
          });
        }
      }, 0);
    },
    []
  );

  const clear = useCallback(() => {
    setState({
      result: null,
      error: null,
      warnings: [],
      loading: false,
      fileName: "",
      selectedModel: ALL_MODELS,
    });
  }, []);

  return (
    <DataContext.Provider value={{ ...state, loadFiles, clear, setSelectedModel, filteredResult }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
