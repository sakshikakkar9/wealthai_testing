import { create } from "zustand";

export type AssetClass =
  | "all"
  | "equity"
  | "mutual_fund"
  | "fd"
  | "bond"
  | "gold"
  | "real_estate"
  | "cash";
export type SortField = "name" | "current_value" | "gain_loss" | "gain_pct" | "xirr" | "weight";
export type SortDir = "asc" | "desc";

interface PortfolioState {
  // Filters
  activeAssetClass: AssetClass;
  setActiveAssetClass: (c: AssetClass) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeAccount: string; // 'all' | account id
  setActiveAccount: (id: string) => void;
  activeTags: string[];
  toggleTag: (tag: string) => void;

  // Table
  sortField: SortField;
  sortDir: SortDir;
  setSort: (field: SortField) => void;
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // UI
  activeHolding: string | null; // holding id for slideout
  setActiveHolding: (id: string | null) => void;
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;
  showTransactions: boolean;
  setShowTransactions: (v: boolean) => void;
  watchlistOpen: boolean;
  setWatchlistOpen: (v: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  // Filters
  activeAssetClass: "all",
  setActiveAssetClass: (activeAssetClass) => set({ activeAssetClass }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  activeAccount: "all",
  setActiveAccount: (activeAccount) => set({ activeAccount }),
  activeTags: [],
  toggleTag: (tag) =>
    set((state) => ({
      activeTags: state.activeTags.includes(tag)
        ? state.activeTags.filter((t) => t !== tag)
        : [...state.activeTags, tag],
    })),

  // Table
  sortField: "current_value",
  sortDir: "desc",
  setSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDir: state.sortField === field && state.sortDir === "desc" ? "asc" : "desc",
    })),
  selectedRows: new Set(),
  toggleRow: (id) =>
    set((state) => {
      const newSelected = new Set(state.selectedRows);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { selectedRows: newSelected };
    }),
  selectAll: (ids) => set({ selectedRows: new Set(ids) }),
  clearSelection: () => set({ selectedRows: new Set() }),

  // UI
  activeHolding: null,
  setActiveHolding: (id) => set({ activeHolding: id }),
  showAddModal: false,
  setShowAddModal: (v) => set({ showAddModal: v }),
  showTransactions: false,
  setShowTransactions: (v) => set({ showTransactions: v }),
  watchlistOpen: false,
  setWatchlistOpen: (v) => set({ watchlistOpen: v }),
}));
