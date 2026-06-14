import React, { useMemo, useEffect, useState } from "react";
import {
  Plus,
  Upload,
  Search,
  Activity,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useDashboardStore } from "../../store/dashboard.store";
import { useTransactionStore, TxType, TxStatus, DateFilter } from "../../store/transaction.store";
import { formatINR, formatShortINR } from "../../utils/formatters";
import WidgetCard from "../../components/common/WidgetCard";

// Components
import TransactionTable from "./_components/TransactionTable";
import TransactionFormModal from "./_components/TransactionFormModal";
import ImportWizard from "./_components/ImportWizard";
import AuditLogDrawer from "./_components/AuditLogDrawer";
import CorporateActionModal from "./_components/CorporateActionModal";
import SIPTrackerPanel from "./_components/SIPTrackerPanel";
import DividendTracker from "./_components/DividendTracker";
import ExpenseTracker from "./_components/ExpenseTracker";
import BulkEditBar from "./_components/BulkEditBar";
import CashflowTimelineChart from "../../components/charts/CashflowTimelineChart";
import IncomeWaterfallChart from "../../components/charts/IncomeWaterfallChart";

// Interfaces
export interface Transaction {
  id: string;
  date: string;
  type: TxType;
  status: TxStatus;
  holdingId: string;
  holdingName: string;
  ticker?: string;
  assetClass: string;
  account: string;
  quantity?: number;
  price?: number;
  amount: number;
  charges?: number;
  netAmount: number;
  notes?: string;
  broker?: string;
  referenceNo?: string;
  sipId?: string;
  sipInstalment?: number;
  ratio?: string;
  exDate?: string;
  recordDate?: string;
  ratePerUnit?: number;
  taxDeducted?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const TransactionSummaryBanner = ({ stats }: { stats: any[] }) => {
  const { openFormModal, toggleImportWizard } = useTransactionStore();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-indigo-100 font-medium mt-1">
              Consolidated history across all modules
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleImportWizard}
              className="flex items-center gap-2 border border-white/40 rounded-xl px-5 py-2.5 text-sm font-bold bg-white/5 hover:bg-white/10 transition-all"
            >
              <Upload size={18} /> Import
            </button>
            <button
              onClick={() => openFormModal()}
              className="flex items-center gap-2 bg-white text-indigo-600 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 transition-all active:scale-95"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${s.tint || "bg-white/15"} backdrop-blur-md rounded-2xl px-6 py-3 min-w-[160px] border border-white/10`}
            >
              <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="text-lg font-bold">
                {typeof s.value === "number" ? formatShortINR(s.value) : s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TransactionFilterBar = ({ count }: { count: number }) => {
  const {
    activeTxType,
    setActiveTxType,
    dateFilter,
    setDateFilter,
    activeSidePanel,
    setActiveSidePanel,
    searchQuery,
    setSearchQuery,
  } = useTransactionStore();

  const tabs: { label: string; value: TxType | "all"; count?: number }[] = [
    { label: "All", value: "all", count },
    { label: "Buy/Sell", value: "buy" },
    { label: "SIP/STP/SWP", value: "sip" },
    { label: "Dividend", value: "dividend" },
    { label: "Interest", value: "interest" },
    { label: "Corporate", value: "bonus" },
    { label: "Expense/Tax", value: "expense" },
  ];

  return (
    <div className="sticky top-0 z-20 bg-[#F2F0EF]/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTxType(tab.value)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${
                  activeTxType === tab.value ||
                  (tab.value === "buy" && (activeTxType === "buy" || activeTxType === "sell"))
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }
              `}
            >
              {tab.label} {tab.count !== undefined && <span className="ml-1.5 opacity-60">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-4xl">
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </div>

            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option>All Assets</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="1Y">Past 12 Months</option>
              <option value="FY">Financial Year</option>
              <option value="6M">Past 6 Months</option>
              <option value="3M">Past 3 Months</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "sip" ? null : "sip")}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeSidePanel === "sip" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
            >
              SIP Tracker
            </button>
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "dividend" ? null : "dividend")}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeSidePanel === "dividend" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
            >
              Income
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionsPage: React.FC = () => {
  const { setActiveNav } = useDashboardStore();
  const {
    showFormModal,
    showImportWizard,
    showAuditLog,
    showCorporateAction,
    activeSidePanel,
    activeTxType,
    searchQuery,
  } = useTransactionStore();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveNav("transactions");
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:3000/api/v1/transaction/all', {
           headers: { 'Authorization': 'Bearer mock-token' }
        });
        const json = await res.json();
        if (json.success) {
          setTransactions(json.data.map((t: any) => ({
             id: t.id,
             date: new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
             type: t.type.toLowerCase(),
             status: t.status,
             holdingName: t.module,
             amount: Number(t.amount),
             netAmount: Number(t.amount),
             assetClass: t.module,
             account: "Default",
             createdAt: t.date,
             updatedAt: t.date,
             createdBy: "System"
          })));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTransactions();
  }, [setActiveNav]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (activeTxType !== "all") {
        if (activeTxType === "buy" && !["buy", "sell", "buy", "sell"].includes(tx.type)) return false;
        if (activeTxType === "sip" && !["sip", "stp", "swp"].includes(tx.type)) return false;
        if (activeTxType === "dividend" && tx.type !== "dividend") return false;
        if (activeTxType === "interest" && tx.type !== "interest") return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return tx.holdingName.toLowerCase().includes(query) || tx.type.toLowerCase().includes(query);
      }
      return true;
    });
  }, [transactions, activeTxType, searchQuery]);

  const stats = [
    { label: "Total Transactions", value: transactions.length },
    { label: "Value Transacted", value: transactions.reduce((s, x) => s + x.amount, 0) },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden font-sans antialiased text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <TransactionSummaryBanner stats={stats} />
          <TransactionFilterBar count={transactions.length} />

          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row px-6 py-6 gap-6 pb-24">
              {activeSidePanel && (
                <div className="w-full lg:w-[340px] shrink-0 space-y-4">
                  {activeSidePanel === "sip" && <SIPTrackerPanel />}
                  {activeSidePanel === "dividend" && <DividendTracker />}
                  {activeSidePanel === "expense" && <ExpenseTracker />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <TransactionTable transactions={filteredTransactions} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <BulkEditBar />
      {showFormModal && <TransactionFormModal />}
      {showImportWizard && <ImportWizard />}
      {showAuditLog && <AuditLogDrawer />}
      {showCorporateAction && <CorporateActionModal />}
    </div>
  );
};

export default TransactionsPage;
