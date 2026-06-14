import { create } from "zustand";
import { fetchTransactionsFromAPI } from "../api/transaction.api";

export type TxType =
  | "buy"
  | "sell"
  | "sip"
  | "stp"
  | "swp"
  | "dividend"
  | "interest"
  | "bonus"
  | "split"
  | "rights"
  | "merger"
  | "expense"
  | "fee"
  | "tax";

export type TxStatus = "confirmed" | "pending" | "failed" | "cancelled";

export type ImportSource =
  | "csv"
  | "excel"
  | "pdf"
  | "zerodha"
  | "groww"
  | "upstox"
  | "kite"
  | "angel";

export type DateFilter = "today" | "1W" | "1M" | "3M" | "6M" | "1Y" | "FY" | "custom";

interface TransactionState {
  // Data
  transactions: any[];
  totalTransactions: number;
  isLoading: boolean;
  error: string | null;
  loadTransactions: () => Promise<void>;

  // Filters
  activeTxType: TxType | "all";
  setActiveTxType: (t: TxType | "all") => void;
  activeAccount: string;
  setActiveAccount: (id: string) => void;
  dateFilter: DateFilter;
  setDateFilter: (f: DateFilter) => void;
  customDateRange: { from: string; to: string };
  setCustomDateRange: (r: { from: string; to: string }) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeAssetClass: string;
  setActiveAssetClass: (c: string) => void;

  // Table
  sortField: string;
  sortDir: "asc" | "desc";
  setSort: (field: string) => void;
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  currentPage: number;
  setPage: (p: number) => void;
  pageSize: number;

  // Panels / Modals
  showFormModal: boolean;
  editingTxId: string | null;
  openFormModal: (id?: string) => void;
  closeFormModal: () => void;

  showImportWizard: boolean;
  importStep: 0 | 1 | 2 | 3;
  importSource: ImportSource | null;
  setImportSource: (s: ImportSource) => void;
  setImportStep: (n: 0 | 1 | 2 | 3) => void;
  toggleImportWizard: () => void;

  showAuditLog: boolean;
  auditTxId: string | null;
  openAuditLog: (id?: string) => void;
  closeAuditLog: () => void;

  showCorporateAction: boolean;
  toggleCorporateAction: () => void;

  activeSidePanel: "sip" | "dividend" | "expense" | null;
  setActiveSidePanel: (p: "sip" | "dividend" | "expense" | null) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  // Data
  transactions: [],
  totalTransactions: 0,
  isLoading: false,
  error: null,
  loadTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        activeTxType,
        activeAccount,
        dateFilter,
        customDateRange,
        searchQuery,
        activeAssetClass,
        sortField,
        sortDir,
        currentPage,
        pageSize,
      } = get();

      const data = await fetchTransactionsFromAPI({
        type: activeTxType,
        account: activeAccount,
        dateFilter,
        customRange: customDateRange,
        search: searchQuery,
        assetClass: activeAssetClass,
        sortField,
        sortDir,
        page: currentPage,
        pageSize,
      });

      set({
        transactions: data.transactions,
        totalTransactions: data.total,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Filters
  activeTxType: "all",
  setActiveTxType: (t) => {
    set({ activeTxType: t, currentPage: 1 });
    get().loadTransactions();
  },
  activeAccount: "all",
  setActiveAccount: (id) => {
    set({ activeAccount: id, currentPage: 1 });
    get().loadTransactions();
  },
  dateFilter: "1Y",
  setDateFilter: (f) => {
    set({ dateFilter: f, currentPage: 1 });
    get().loadTransactions();
  },
  customDateRange: { from: "", to: "" },
  setCustomDateRange: (r) => {
    set({ customDateRange: r, currentPage: 1 });
    get().loadTransactions();
  },
  searchQuery: "",
  setSearchQuery: (q) => {
    set({ searchQuery: q, currentPage: 1 });
    get().loadTransactions();
  },
  activeAssetClass: "all",
  setActiveAssetClass: (c) => {
    set({ activeAssetClass: c, currentPage: 1 });
    get().loadTransactions();
  },

  // Table
  sortField: "date",
  sortDir: "desc",
  setSort: (field) => {
    set((s) => ({
      sortField: field,
      sortDir: s.sortField === field && s.sortDir === "desc" ? "asc" : "desc",
      currentPage: 1,
    }));
    get().loadTransactions();
  },
  selectedRows: new Set(),
  toggleRow: (id) =>
    set((s) => {
      const next = new Set(s.selectedRows);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedRows: next };
    }),
  selectAll: (ids) => set({ selectedRows: new Set(ids) }),
  clearSelection: () => set({ selectedRows: new Set() }),
  currentPage: 1,
  setPage: (p) => {
    set({ currentPage: p });
    get().loadTransactions();
  },
  pageSize: 20,

  // Panels / Modals
  showFormModal: false,
  editingTxId: null,
  openFormModal: (id) => set({ showFormModal: true, editingTxId: id ?? null }),
  closeFormModal: () => {
    set({ showFormModal: false, editingTxId: null });
    get().loadTransactions();
  },
  showImportWizard: false,
  importStep: 0,
  importSource: null,
  setImportSource: (s) => set({ importSource: s }),
  setImportStep: (n) => set({ importStep: n }),
  toggleImportWizard: () =>
    set((s) => ({ showImportWizard: !s.showImportWizard, importStep: 0, importSource: null })),
  showAuditLog: false,
  auditTxId: null,
  openAuditLog: (id) => set({ showAuditLog: true, auditTxId: id ?? null }),
  closeAuditLog: () => set({ showAuditLog: false, auditTxId: null }),
  showCorporateAction: false,
  toggleCorporateAction: () => set((s) => ({ showCorporateAction: !s.showCorporateAction })),
  activeSidePanel: null,
  setActiveSidePanel: (p) => set({ activeSidePanel: p }),
}));
