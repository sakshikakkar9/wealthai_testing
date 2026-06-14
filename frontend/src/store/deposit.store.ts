import { create } from "zustand";
import {
  fetchDepositsFromAPI,
  createDepositAPI,
  updateDepositAPI,
  deleteDepositAPI
} from "../api/deposits.api";

export type FDType = "cumulative" | "non_cumulative";
export type FDCategory = "bank" | "corporate" | "tax_saver" | "nbfc";
export type InterestFrequency = "monthly" | "quarterly" | "half_yearly" | "annual" | "at_maturity";
export type FDStatus = "active" | "maturing_soon" | "matured" | "broken" | "renewed";

export interface FixedDeposit {
  id: string;
  fdNumber: string; // 'HDFC-3421-FD'
  bankName: string;
  bankShortName: string; // 'HDFC', 'PNB'
  bankLogoInitials: string; // 'HB', 'PB'
  bankLogoColor: string; // Tailwind bg class
  category: FDCategory;
  type: FDType;
  interestFrequency: InterestFrequency;
  account: string; // account id from ACCOUNTS
  nominee: string;
  isJointHolder: boolean;
  jointHolderName?: string;

  principal: number;
  interestRate: number; // % p.a.
  startDate: string; // 'DD MMM YYYY'
  maturityDate: string;
  tenureMonths: number;
  daysRemaining: number; // computed
  status: FDStatus;

  // Computed values
  accruedInterest: number; // interest earned so far
  maturityValue: number; // principal + total interest at maturity
  currentValue: number; // principal + accrued interest today

  // Interest details
  interestEarnedTillDate: number;
  interestRemainingToEarn: number;
  totalInterestAtMaturity: number;

  // Tax
  tdsDeducted: number;
  tdsRate: number; // 10% standard, 20% without PAN
  form15GSubmitted: boolean;
  form15HSubmitted: boolean;
  isTaxSaver: boolean; // Section 80C
  lockInPeriod?: number; // months (5yr tax-saver = 60)

  // DICGC
  dicgcCovered: boolean;
  dicgcLimit: number; // 500000

  // Renewal
  autoRenewal: boolean;
  renewalCount: number;
  previousRate?: number;
  renewalHistory: {
    date: string;
    principal: number;
    rate: number;
    tenureMonths: number;
  }[];

  // Penalty on premature withdrawal
  prematureWithdrawalPenalty: number; // % deducted from rate

  // Notes
  notes?: string;
  linkedGoal?: string;
}

export type SortField =
  | "bank"
  | "principal"
  | "rate"
  | "maturity_date"
  | "days_left"
  | "accrued_interest"
  | "maturity_value"
  | "tds_deducted";

interface DepositState {
  // Filters
  typeFilter: FDType | "all";
  setTypeFilter: (t: FDType | "all") => void;
  categoryFilter: FDCategory | "all";
  setCategoryFilter: (c: FDCategory | "all") => void;
  statusFilter: FDStatus | "all";
  setStatusFilter: (s: FDStatus | "all") => void;
  accountFilter: string;
  setAccountFilter: (a: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

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

  // Active FD detail
  activeFDId: string | null;
  setActiveFD: (id: string | null) => void;

  // Modals
  showNewFDModal: boolean;
  setShowNewFDModal: (v: boolean) => void;

  showRenewalModal: boolean;
  renewalFDId: string | null;
  openRenewalModal: (id: string) => void;
  closeRenewalModal: () => void;

  showBreakFDModal: boolean;
  breakFDId: string | null;
  openBreakFDModal: (id: string) => void;
  closeBreakFDModal: () => void;

  // Calculator state
  calcPrincipal: number;
  calcRate: number;
  calcTenureMonths: number;
  calcType: FDType;
  calcFrequency: InterestFrequency;
  setCalcField: (field: string, value: number | string) => void;

  // Data
  deposits: FixedDeposit[];
  isLoading: boolean;
  error: string | null;
  fetchDeposits: () => Promise<void>;
  addDeposit: (data: any) => Promise<boolean>;
  updateDeposit: (id: string, data: any) => Promise<boolean>;
  deleteDeposit: (id: string) => Promise<boolean>;
}

export const useDepositStore = create<DepositState>((set, get) => ({
  typeFilter: "all",
  setTypeFilter: (t) => set({ typeFilter: t, currentPage: 1 }),
  categoryFilter: "all",
  setCategoryFilter: (c) => set({ categoryFilter: c, currentPage: 1 }),
  statusFilter: "all",
  setStatusFilter: (s) => set({ statusFilter: s, currentPage: 1 }),
  accountFilter: "all",
  setAccountFilter: (a) => set({ accountFilter: a, currentPage: 1 }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
  sortField: "days_left",
  sortDir: "asc",
  setSort: (f) =>
    set((s) => ({
      sortField: f,
      sortDir: s.sortField === f && s.sortDir === "asc" ? "desc" : "asc",
      currentPage: 1,
    })),
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
  currentPage: 1,
  setPage: (p) => set({ currentPage: p }),
  activeFDId: null,
  setActiveFD: (id) => set({ activeFDId: id }),
  showNewFDModal: false,
  setShowNewFDModal: (v) => set({ showNewFDModal: v }),
  showRenewalModal: false,
  renewalFDId: null,
  openRenewalModal: (id) => set({ showRenewalModal: true, renewalFDId: id }),
  closeRenewalModal: () => set({ showRenewalModal: false, renewalFDId: null }),
  showBreakFDModal: false,
  breakFDId: null,
  openBreakFDModal: (id) => set({ showBreakFDModal: true, breakFDId: id }),
  closeBreakFDModal: () => set({ showBreakFDModal: false, breakFDId: null }),
  calcPrincipal: 200000,
  calcRate: 7.25,
  calcTenureMonths: 36,
  calcType: "cumulative",
  calcFrequency: "at_maturity",
  setCalcField: (field, value) => set((s) => ({ ...s, [field]: value })),

  deposits: [],
  isLoading: false,
  error: null,
  fetchDeposits: async () => {
    const { typeFilter, statusFilter, searchQuery, sortField } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await fetchDepositsFromAPI({
        type: typeFilter,
        status: statusFilter,
        search: searchQuery,
        sort: sortField,
      });
      // response is { data: [...], pagination: {...} } based on service
      const rawData = response.data || [];

      const mappedDeposits: FixedDeposit[] = rawData.map((d: any) => ({
        id: d.id,
        fdNumber: d.fdNumber || d.account_number,
        bankName: d.bank_name || d.institution_name,
        bankShortName: (d.bank_name || d.institution_name || "").split(" ")[0],
        bankLogoInitials: (d.bank_name || d.institution_name || "B").substring(0, 1),
        bankLogoColor: "bg-blue-600",
        category: d.tenure_months >= 60 ? "tax_saver" : "bank",
        type: d.interest_type === "non_cumulative" ? "non_cumulative" : "cumulative",
        interestFrequency: d.compounding_freq || "at_maturity",
        account: d.account_type || "FD",
        nominee: d.nominee_name || "N/A",
        isJointHolder: false,
        principal: Number(d.principal_amount),
        interestRate: Number(d.interest_rate),
        startDate: d.start_date,
        maturityDate: d.maturity_date,
        tenureMonths: d.tenure_months,
        daysRemaining: d.days_left || 0,
        status: d.status,
        accruedInterest: Number(d.accrued_interest) || 0,
        maturityValue: Number(d.maturity_amount) || 0,
        currentValue: Number(d.current_value) || 0,
        interestEarnedTillDate: Number(d.accrued_interest) || 0,
        interestRemainingToEarn: (Number(d.maturity_amount) || 0) - (Number(d.current_value) || 0),
        totalInterestAtMaturity: (Number(d.maturity_amount) || 0) - (Number(d.principal_amount) || 0),
        tdsDeducted: Number(d.estimated_tds) || 0,
        tdsRate: 10,
        form15GSubmitted: false,
        form15HSubmitted: false,
        isTaxSaver: d.tenure_months >= 60,
        dicgcCovered: true,
        dicgcLimit: 500000,
        autoRenewal: d.maturity_action === "auto_renew",
        renewalCount: 0,
        renewalHistory: [],
        prematureWithdrawalPenalty: 1,
      }));

      set({ deposits: mappedDeposits, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  addDeposit: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createDepositAPI(data);
      if (result.success) {
        await get().fetchDeposits();
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
  updateDeposit: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateDepositAPI(id, data);
      if (result.success) {
        await get().fetchDeposits();
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
  deleteDeposit: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await deleteDepositAPI(id);
      if (result.success) {
        await get().fetchDeposits();
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
