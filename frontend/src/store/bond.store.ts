import { create } from "zustand";
import { fetchBondsFromAPI, updateBondAPI, deleteBondAPI } from "../api/bonds.api";
import { type Bond } from "../pages/bonds/_data/bonds.data";
import { type BondType, type BondStatus, type BondRating } from "../pages/bonds/_data/bonds.data";
import { MaturityBucketLabel } from "../utils/bondUtils";
import { BondColumnId, DEFAULT_VISIBLE_COLUMNS } from "../pages/bonds/_components/BondTable";

export type BondSortField =
  | "bond_name"
  | "bond_type"
  | "rating"
  | "invested_amount"
  | "current_value"
  | "gain_loss_pct"
  | "coupon_rate"
  | "ytm"
  | "maturity_date"
  | "days_to_maturity"
  | "status";

export type SortDirection = "asc" | "desc";

interface BondFilters {
  bondType: BondType | "All";
  status: BondStatus | "All";
  rating: BondRating | "All";
  maturityBucket: MaturityBucketLabel | "All";
}

interface BondState {
  // Data
  bonds: Bond[];
  loadBonds: () => Promise<void>; 
  fetchHoldings: () => Promise<void>; // 🎯 Exposed explicit syncing handler alias for forms!
  addBonds: (newBonds: Bond[]) => void;
  updateBond: (id: string, updates: Partial<Bond>) => Promise<void>;
  deleteBond: (id: string) => Promise<void>;

  // Detail drawer
  selectedBondId: string | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;

  // Modals
  showAddModal: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;

  showViewModal: boolean;
  showEditModal: boolean;
  showDeleteConfirm: boolean;
  openViewModal: (id: string) => void;
  closeViewModal: () => void;
  openEditModal: (id: string) => void;
  closeEditModal: () => void;
  openDeleteConfirm: (id: string) => void;
  closeDeleteConfirm: () => void;

  // Import state
  importLoading: boolean;
  setImportLoading: (loading: boolean) => void;
  importError: string | null;
  setImportError: (error: string | null) => void;

  // Table sort
  sortField: BondSortField;
  sortDirection: SortDirection;
  setSort: (field: BondSortField) => void;

  // Filters
  filters: BondFilters;
  setFilter: <K extends keyof BondFilters>(key: K, value: BondFilters[K]) => void;
  resetFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // View toggle
  activeView: "table" | "cards";
  setActiveView: (v: "table" | "cards") => void;

  // Column visibility
  visibleColumns: Set<BondColumnId>;
  toggleColumn: (col: BondColumnId) => void;
  resetColumns: () => void;

  // Bulk selection
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Loading state
  isLoading: boolean;
  setLoading: (v: boolean) => void;
}

const DEFAULT_FILTERS: BondFilters = {
  bondType: "All",
  status: "All",
  rating: "All",
  maturityBucket: "All",
};

export const useBondStore = create<BondState>((set, get) => ({
  // Data
  bonds: [], 
  
  loadBonds: async () => { 
    set({ isLoading: true });
    try {
      const response = await fetchBondsFromAPI();
      
      // 🔍 Safely look inside the nested response structure from your API wrapper
      let extractedBonds: Bond[] = [];
      if (response && typeof response === "object") {
        if (Array.isArray(response)) {
          extractedBonds = response;
        } else if (Array.isArray((response as any).data)) {
          extractedBonds = (response as any).data;
        } else if (Array.isArray((response as any).bonds)) {
          extractedBonds = (response as any).bonds;
        }
      }

      set({ bonds: extractedBonds });
    } catch (error) {
      console.error("Store error loading live database data:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Linked Syncing Handle: Direct reference to fetch fresh database entries reactively
  fetchHoldings: async () => {
    await get().loadBonds();
  },

  addBonds: (newBonds) => set((s) => ({ bonds: [...newBonds, ...s.bonds] })),
  
  updateBond: async (id, updates) => {
    try {
      await updateBondAPI(id, updates);
      // Re-fetch all holdings to ensure computed fields and UI mappings are fully synchronized
      await get().loadBonds();
    } catch (error) {
      console.error("Store error updating bond:", error);
      throw error;
    }
  },
    
  deleteBond: async (id) => {
    try {
      await deleteBondAPI(id);
      // Re-fetch all holdings to ensure state is accurately reflected
      await get().loadBonds();
    } catch (error) {
      console.error("Store error deleting bond:", error);
      throw error;
    }
  },

  selectedBondId: null,
  openDetail: (id) => set({ selectedBondId: id }),
  closeDetail: () => set({ selectedBondId: null }),

  showAddModal: false,
  openAddModal: () => set({ showAddModal: true }),
  closeAddModal: () => set({ showAddModal: false }),

  showViewModal: false,
  showEditModal: false,
  showDeleteConfirm: false,
  openViewModal: (id) => set({ selectedBondId: id, showViewModal: true }),
  closeViewModal: () => set({ showViewModal: false, selectedBondId: null }),
  openEditModal: (id) => set({ selectedBondId: id, showEditModal: true }),
  closeEditModal: () => set({ showEditModal: false, selectedBondId: null }),
  openDeleteConfirm: (id) => set({ selectedBondId: id, showDeleteConfirm: true }),
  closeDeleteConfirm: () => set({ showDeleteConfirm: false, selectedBondId: null }),

  importLoading: false,
  setImportLoading: (loading) => set({ importLoading: loading }),
  importError: null,
  setImportError: (error) => set({ importError: error }),

  sortField: "current_value",
  sortDirection: "desc",
  setSort: (field) =>
    set((s) => ({
      sortField: field,
      sortDirection: s.sortField === field && s.sortDirection === "desc" ? "asc" : "desc",
    })),

  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((s) => ({
      filters: { ...s.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  activeView: "table",
  setActiveView: (v) => set({ activeView: v }),

  visibleColumns: new Set(DEFAULT_VISIBLE_COLUMNS),
  toggleColumn: (col) =>
    set((s) => {
      const next = new Set(s.visibleColumns);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return { visibleColumns: next };
    }),
  resetColumns: () => set({ visibleColumns: new Set(DEFAULT_VISIBLE_COLUMNS) }),

  selectedIds: new Set(),
  toggleSelect: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),

  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),
}));