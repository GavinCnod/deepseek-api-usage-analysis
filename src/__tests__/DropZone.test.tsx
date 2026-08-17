import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DropZone from "@/components/DropZone";
import { extractZipCsvs, concatMonthlyCSVs } from "@/lib/concatFiles";

// Mock dependencies
vi.mock("@/lib/DataContext", () => ({
  useData: () => ({
    loadFiles: vi.fn(),
    loading: false,
  }),
}));

vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: {
      dropzone: {
        processing: "Processing CSVs…",
        title: "Drop your CSVs here",
        hint: "amount-*.csv + cost-*.csv",
        privacy: "Files stay in your browser",
        oversizedTitle: "File too large",
        oversizedHint: "File {name} is {size} MB",
        processingError: "Processing Error",
      },
    },
    locale: "en",
  }),
}));

// Mock concatFiles — each test configures extractZipCsvs/concatMonthlyCSVs behavior
vi.mock("@/lib/concatFiles", () => ({
  MAX_UPLOAD_SIZE_BYTES: 50 * 1024 * 1024,
  extractZipCsvs: vi.fn(),
  concatMonthlyCSVs: vi.fn(),
}));

/** Trigger file selection on the hidden input with the given file name. */
function triggerUpload(fileName: string) {
  const file = new File(["dummy,csv,data"], fileName, { type: "text/csv" });
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  expect(input).toBeDefined();
  Object.defineProperty(input, "files", { value: [file] });
  fireEvent.change(input);
}

describe("DropZone — error handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the drop zone with title", () => {
    render(<DropZone />);
    expect(screen.getByText("Drop your CSVs here")).toBeDefined();
  });

  it("shows error banner when concatFiles throws during upload", async () => {
    (extractZipCsvs as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("ZIP extraction failed")
    );
    render(<DropZone />);

    triggerUpload("amount-2026-5.csv");

    await waitFor(() => {
      expect(screen.getByText("Processing Error")).toBeDefined();
    }, { timeout: 3000 });
  });

  it("clears concatError when clicking the drop zone again", async () => {
    (extractZipCsvs as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("ZIP extraction failed")
    );
    render(<DropZone />);

    triggerUpload("amount-2026-5.csv");

    await waitFor(() => {
      expect(screen.getByText("Processing Error")).toBeDefined();
    }, { timeout: 3000 });

    // Click the drop zone — should clear the error
    const dropZone = document.querySelector(".cursor-pointer") as HTMLElement;
    fireEvent.click(dropZone);

    await waitFor(() => {
      expect(screen.queryByText("Processing Error")).toBeNull();
    });
  });

  it("returns to the idle upload state after a successful concat (parse may fail async)", async () => {
    (extractZipCsvs as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { name: "amount-2026-5.csv", text: () => Promise.resolve("a\n1") },
      { name: "cost-2026-5.csv", text: () => Promise.resolve("c\n1") },
    ]);
    (concatMonthlyCSVs as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      amountText: "a\n1",
      costText: "c\n1",
      label: "2026-5",
    });

    render(<DropZone />);

    triggerUpload("amount-2026-5.csv");

    // Busy spinner should appear during processing...
    await waitFor(() => {
      expect(screen.getByText("Processing CSVs…")).toBeDefined();
    }, { timeout: 3000 });

    // ...then clear back to the idle state (concat succeeded, reading reset).
    await waitFor(() => {
      expect(screen.getByText("Drop your CSVs here")).toBeDefined();
    }, { timeout: 3000 });
  });
});