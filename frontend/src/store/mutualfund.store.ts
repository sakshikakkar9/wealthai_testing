import { create } from "zustand";
import {
  fetchMFHoldings,
  fetchMFSummary,
  createMFHoldingAPI,
  updateMFHoldingAPI,
  deleteMFHoldingAPI,
  Holding,
  MFSummary,
  AddHoldingPayload,
} from "../api/mf.api";

export type MFCategory =
  | "large_cap"
  | "mid_cap"
  | "small_cap"
  | "flexi_cap"
  | "multi_cap"
  | "elss"
  | "index"
  | "debt"
  | "hybrid"
  | "international"
  | "sectoral";

export type MFPlanType = "direct" | "regular";
export type MFOption = "growth" | "idcw";
export type MFTab = "overview" | "holdings" | "sip" | "analytics" | "transactions" | "tax";

export type SIPStatus = "active" | "paused" | "stopped" | "completed";

export interface MutualFundSummary {
  totalFunds: number;
  activeSIPs: number;
  pausedSIPs: number;
  totalInvested: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainPct: number;
  xirr: number;
  monthlySIPAmount: number;
  nextSIPDate: string | null;
  nextSIPAmount: number;
  dividendYTD: number;
  regularPlanFunds: number;
  regularPlanAnnualCommission: number;
  weightedAvgExpenseRatio: number;
  annualExpenseCostINR: number;
  hasELSS: boolean;
  todayChange: number;
  todayChangePct: number;
}

interface MFState {
  holdings: Holding[];
  summary: MutualFundSummary | null;
  isLoading: boolean;
  error: string | null;
  activeTab: MFTab;
  setActiveTab: (t: MFTab) => void;
  categoryFilter: MFCategory | "all";
  setCategoryFilter: (c: MFCategory | "all") => void;
  planTypeFilter: MFPlanType | "all";
  setPlanTypeFilter: (p: MFPlanType | "all") => void;
  amcFilter: string;
  setAmcFilter: (a: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortField: string;
  sortDir: "asc" | "desc";
  setSort: (f: string) => void;
  currentPage: number;
  setPage: (p: number) => void;
  pageSize: number;
  totalItems: number;
  selectedRows: Set<string>;
  toggleRow: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  activeFundId: string | null;
  setActiveFund: (id: string | null) => void;
  showAddFundModal: boolean;
  setShowAddFundModal: (v: boolean) => void;
  showSIPModifyModal: boolean;
  modifyingSIPId: string | null;
  openSIPModify: (id: string) => void;
  closeSIPModify: () => void;
  selectedOverlapFunds: string[];
  toggleOverlapFund: (id: string) => void;
  txTypeFilter: string;
  setTxTypeFilter: (t: string) => void;
  txDateFilter: string;
  setTxDateFilter: (d: string) => void;
  txPage: number;
  setTxPage: (p: number) => void;
  taxFY: string;
  setTaxFY: (fy: string) => void;
  addHolding: (data: AddHoldingPayload) => Promise<void>;
  updateHolding: (id: string, data: Partial<AddHoldingPayload>) => Promise<void>;
  deleteHolding: (id: string) => Promise<void>;
  loadData: () => Promise<void>;
}

export const useMFStore = create<MFState>((set, get) => ({
  holdings: [],
  summary: null,
  isLoading: false,
  error: null,
  totalItems: 0,
  activeTab: "overview",
  setActiveTab: (t) => set({ activeTab: t }),
  categoryFilter: "all",
  setCategoryFilter: (c) => {
    set({ categoryFilter: c, currentPage: 1 });
    get().loadData();
  },
  planTypeFilter: "all",
  setPlanTypeFilter: (p) => {
    set({ planTypeFilter: p, currentPage: 1 });
    get().loadData();
  },
  amcFilter: "all",
  setAmcFilter: (a) => {
    set({ amcFilter: a, currentPage: 1 });
    get().loadData();
  },
  searchQuery: "",
  setSearchQuery: (q) => {
    set({ searchQuery: q, currentPage: 1 });
    get().loadData();
  },
  sortField: "current_value",
  sortDir: "desc",
  setSort: (f) => {
    set((s) => ({
      sortField: f,
      sortDir: s.sortField === f && s.sortDir === "desc" ? "asc" : "desc",
      currentPage: 1,
    }));
    get().loadData();
  },
  currentPage: 1,
  setPage: (p) => {
    set({ currentPage: p });
    get().loadData();
  },
  pageSize: 20,
  selectedRows: new Set(),
  toggleRow: (id) =>
    set((s) => {
      const n = new Set(s.selectedRows);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return { selectedRows: n };
    }),
  selectAll: (ids) => set({ selectedRows: new Set(ids) }),
  clearSelection: () => set({ selectedRows: new Set() }),
  activeFundId: null,
  setActiveFund: (id) => set({ activeFundId: id }),
  showAddFundModal: false,
  setShowAddFundModal: (v) => set({ showAddFundModal: v }),
  showSIPModifyModal: false,
  modifyingSIPId: null,
  openSIPModify: (id) => set({ showSIPModifyModal: true, modifyingSIPId: id }),
  closeSIPModify: () => set({ showSIPModifyModal: false, modifyingSIPId: null }),
  selectedOverlapFunds: [],
  toggleOverlapFund: (id) =>
    set((s) => {
      const arr = s.selectedOverlapFunds.includes(id)
        ? s.selectedOverlapFunds.filter((x) => x !== id)
        : s.selectedOverlapFunds.length < 5
          ? [...s.selectedOverlapFunds, id]
          : s.selectedOverlapFunds;
      return { selectedOverlapFunds: arr };
    }),
  txTypeFilter: "all",
  setTxTypeFilter: (t) => set({ txTypeFilter: t, txPage: 1 }),
  txDateFilter: "1Y",
  setTxDateFilter: (d) => set({ txDateFilter: d, txPage: 1 }),
  txPage: 1,
  setTxPage: (p) => set({ txPage: p }),
  taxFY: "2025-26",
  setTaxFY: (fy) => set({ taxFY: fy }),

  addHolding: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createMFHoldingAPI(data);
      if (res.success) {
        await get().loadData();
      } else {
        throw new Error("Failed to add holding");
      }
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateHolding: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await updateMFHoldingAPI(id, data);
      if (res.success) {
        await get().loadData();
      } else {
        throw new Error("Failed to update holding");
      }
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteHolding: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await deleteMFHoldingAPI(id);
      if (res.success) {
        await get().loadData();
      } else {
        throw new Error("Failed to delete holding");
      }
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const filters = {
        category: get().categoryFilter,
        plan_type: get().planTypeFilter,
        search: get().searchQuery,
        sort: get().sortField,
        sortDir: get().sortDir.toUpperCase() as "ASC" | "DESC",
        page: get().currentPage,
        limit: get().pageSize,
      };

      const [holdingsRes, summaryRes] = await Promise.all([
        fetchMFHoldings(filters),
        fetchMFSummary(),
      ]);

      set({
        holdings: (holdingsRes as any).data || [],
        totalItems: (holdingsRes as any).pagination?.total || 0,
        summary: summaryRes
          ? {
              totalFunds: (summaryRes as any).total_funds || 0,
              activeSIPs: (summaryRes as any).active_sips || 0,
              pausedSIPs: 0,
              totalInvested: parseFloat((summaryRes as any).total_invested || "0"),
              totalCurrentValue: parseFloat((summaryRes as any).total_current_value || "0"),
              totalGainLoss: parseFloat((summaryRes as any).total_gain_loss || "0"),
              totalGainPct: parseFloat((summaryRes as any).total_gain_pct || "0"),
              xirr: (summaryRes as any).xirr || 0, // TODO: wire to backend xirr calculation
              monthlySIPAmount: parseFloat((summaryRes as any).monthly_sip_amount || "0"),
              nextSIPDate: (summaryRes as any).next_sip_date || null,
              nextSIPAmount: parseFloat((summaryRes as any).next_sip_amount || "0"),
              dividendYTD: 0,
              regularPlanFunds: 0,
              regularPlanAnnualCommission: 0,
              weightedAvgExpenseRatio: 0,
              annualExpenseCostINR: 0,
              hasELSS: false,
              todayChange: parseFloat((summaryRes as any).today_change || "0"),
              todayChangePct: parseFloat((summaryRes as any).today_change_pct || "0"),
            }
          : null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
