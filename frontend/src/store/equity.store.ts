import { create } from "zustand";

export type Benchmark = "NIFTY50" | "SENSEX" | "NIFTY500" | "NIFTYMIDCAP" | "none";
export type GroupBy = "none" | "sector" | "market_cap" | "gain_loss";
export type SortField =
  | "name"
  | "ltp"
  | "current_value"
  | "gain_pct"
  | "gain_abs"
  | "day_change"
  | "xirr"
  | "weight"
  | "pe"
  | "dividend_yield"
  | "position_52w"
  | "invested";

interface EquityState {
  // Filters
  activeBenchmark: Benchmark;
  setActiveBenchmark: (b: Benchmark) => void;
  groupBy: GroupBy;
  setGroupBy: (g: GroupBy) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sectorFilter: string | null;
  setSectorFilter: (s: string | null) => void;
  marketCapFilter: "all" | "large" | "mid" | "small";
  setMarketCapFilter: (f: "all" | "large" | "mid" | "small") => void;

  // Table
  sortField: SortField;
  sortDir: "asc" | "desc";
  setSort: (f: SortField) => void;
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  currentPage: number;
  setPage: (p: number) => void;
  showFundamentals: boolean;
  toggleFundamentals: () => void;

  // Detail slideout
  activeStockId: string | null;
  setActiveStock: (id: string | null) => void;

  // Panels
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;
  taxPanelExpanded: boolean;
  setTaxPanelExpanded: (v: boolean) => void;
}

export const useEquityStore = create<EquityState>((set) => ({
  activeBenchmark: "NIFTY50",
  setActiveBenchmark: (b) => set({ activeBenchmark: b }),
  groupBy: "none",
  setGroupBy: (g) => set({ groupBy: g }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
  sectorFilter: null,
  setSectorFilter: (s) => set({ sectorFilter: s, currentPage: 1 }),
  marketCapFilter: "all",
  setMarketCapFilter: (f) => set({ marketCapFilter: f, currentPage: 1 }),
  sortField: "current_value",
  sortDir: "desc",
  setSort: (f) =>
    set((s) => ({
      sortField: f,
      sortDir: s.sortField === f && s.sortDir === "desc" ? "asc" : "desc",
      currentPage: 1,
    })),
  selectedRows: new Set(),
  toggleRow: (id) =>
    set((s) => {
      const n = new Set(s.selectedRows);
      n.has(id) ? n.delete(id) : n.add(id);
      return { selectedRows: n };
    }),
  selectAll: (ids) => set({ selectedRows: new Set(ids) }),
  clearSelection: () => set({ selectedRows: new Set() }),
  currentPage: 1,
  setPage: (p) => set({ currentPage: p }),
  showFundamentals: false,
  toggleFundamentals: () => set((s) => ({ showFundamentals: !s.showFundamentals })),
  activeStockId: null,
  setActiveStock: (id) => set({ activeStockId: id }),
  showAddModal: false,
  setShowAddModal: (v) => set({ showAddModal: v }),
  taxPanelExpanded: false,
  setTaxPanelExpanded: (v: boolean) => set({ taxPanelExpanded: v }),
}));
