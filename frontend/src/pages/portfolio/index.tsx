import React, { useMemo, useEffect, useState } from "react";
import {
  Plus,
  Settings,
  Download,
  Search,
  TrendingUp,
  Wallet,
  PieChart,
  TrendingDown,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useDashboardStore } from "../../store/dashboard.store";
import { AssetClass, usePortfolioStore } from "../../store/portfolio.store";
import { formatINR, formatShortINR } from "../../utils/formatters";
import DonutAllocationChart from "../../components/charts/DonutAllocationChart";
import WidgetCard from "../../components/common/WidgetCard";
import Badge from "../../components/common/Badge";

// Sub-components
import HoldingsTable from "./_components/HoldingsTable";
import TransactionDrawer from "./_components/TransactionDrawer";
import AddHoldingModal from "./_components/AddHoldingModal";
import FamilyAccountSwitcher from "./_components/FamilyAccountSwitcher";
import BulkActionBar from "./_components/BulkActionBar";
import WatchlistPanel from "./_components/WatchlistPanel";
import HoldingDetailSlideout from "./_components/HoldingDetailSlideout";
import TreemapChart from "../../components/charts/TreemapChart";
import { getPortfolioSummary, getPortfolioAllocation, getHoldings as fetchPortfolioHoldings } from "../../api/portfolio.api";

interface Holding {
  id: string;
  name: string;
  ticker?: string;
  assetClass: AssetClass;
  account: string;
  tags: string[];
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  invested: number;
  gainLoss: number;
  gainPct: number;
  xirr: number;
  dayChange: number;
  dayChangePct: number;
  weight: number;
  sparkline: number[];
  sector?: string;
  maturityDate?: string;
  couponRate?: number;
}

const ACCOUNTS = [
  { id: "all", label: "All Accounts", type: "aggregate", value: 12482450 },
  { id: "rahul", label: "Rahul Kumar", type: "individual", xirr: 18.4, value: 6840000 },
  { id: "priya", label: "Priya Kumar", type: "individual", xirr: 14.2, value: 2820000 },
  { id: "joint", label: "Joint Account", type: "joint", xirr: 16.1, value: 1880000 },
  { id: "huf", label: "HUF Account", type: "huf", xirr: 12.8, value: 910000 },
];

const PortfolioPage = () => {
  const { setActiveNav } = useDashboardStore();
  const {
    activeAssetClass,
    setActiveAssetClass,
    searchQuery,
    setSearchQuery,
    activeAccount,
    activeTags,
    activeHolding,
    setActiveHolding,
    setShowAddModal,
    setShowTransactions,
  } = usePortfolioStore();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [allocation, setAllocation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveNav("portfolio");
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, allocationRes, holdingsRes] = await Promise.all([
          getPortfolioSummary(),
          getPortfolioAllocation(),
          fetchPortfolioHoldings()
        ]);
        if (summaryRes.success) setSummary(summaryRes.data);
        if (allocationRes.success) {
            const colors = ["#6366F1", "#10B981", "#F59E0B", "#3B82F6", "#EAB308", "#8B5CF6", "#94A3B8"];
            setAllocation(allocationRes.data.map((item: any, index: number) => ({
              name: item.asset_class,
              value: parseFloat(item.allocation_pct),
              color: colors[index % colors.length]
            })));
        }
        if (holdingsRes?.success) {
            setHoldings(holdingsRes.data.map((h: any) => ({
                ...h,
                assetClass: h.asset_class,
                currentValue: Number(h.current_value),
                invested: Number(h.invested_amount),
                gainLoss: Number(h.gain_loss),
                gainPct: Number(h.gain_loss_pct),
                dayChange: Number(h.day_change),
                dayChangePct: Number(h.day_change_pct),
                weight: Number(h.weight),
                sparkline: h.sparkline || []
            })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setActiveNav]);

  const filteredHoldings = useMemo(() => {
    return holdings.filter((h) => {
      const matchAsset = activeAssetClass === "all" || h.assetClass === activeAssetClass;
      const matchAccount = activeAccount === "all" || h.account === activeAccount;
      const matchSearch =
        (h.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.ticker && h.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTags = activeTags.length === 0 || activeTags.some((tag) => (h.tags || []).includes(tag));
      return matchAsset && matchAccount && matchSearch && matchTags;
    });
  }, [activeAssetClass, activeAccount, searchQuery, activeTags, holdings]);

  const activeHoldingData = useMemo(() => {
    return holdings.find((h) => h.id === activeHolding) || null;
  }, [activeHolding, holdings]);

  const assetClassCounts = useMemo(() => {
    const counts: Record<string, number> = { all: holdings.length };
    holdings.forEach((h) => {
      counts[h.assetClass] = (counts[h.assetClass] || 0) + 1;
    });
    return counts;
  }, [holdings]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-page-bg)] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <main className="flex-1 overflow-y-auto">
          {/* SECTION A — Portfolio Summary Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 md:px-8 py-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-0">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 text-indigo-100 font-medium">
                  <Wallet size={16} />
                  My Portfolio
                </div>
                <div className="flex flex-wrap items-end gap-3 md:gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold tabular-nums">
                    {formatINR(summary?.grand_total_current_value || 0)}
                  </h1>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-1">
                    <TrendingUp size={14} />
                    {summary?.grand_gain_pct || "0.00"}%
                    <span className="font-normal opacity-80 ml-1">total</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-indigo-100 font-medium">
                  <div className="flex items-center gap-2">
                    <PieChart size={14} />
                    {holdings.length} holdings · 5 accounts
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} />
                    {formatShortINR(summary?.grand_total_gain || 0)} total gain
                  </div>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 lg:gap-6">
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-white text-indigo-600 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 transition-all"
                  >
                    <Plus size={18} />
                    Add Holding
                  </button>
                  <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all border border-white/10">
                    <Settings size={20} />
                  </button>
                </div>
                <div className="w-32 md:w-48 h-8 md:h-12">
                  <svg viewBox="0 0 100 30" className="w-full h-full">
                    <path
                      d="M0 25 L10 20 L20 22 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8 L90 2 L100 4"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-8">
              {[
                { label: "Net Worth", value: formatShortINR(summary?.grand_total_current_value || 0) },
                { label: "Invested", value: formatShortINR(summary?.grand_total_invested || 0) },
                { label: "Gain/Loss", value: `${summary?.grand_total_gain >= 0 ? "+" : ""}${formatShortINR(summary?.grand_total_gain || 0)}` },
                { label: "Today's P&L", value: `+₹18,240` },
                { label: "XIRR", value: "18.4%" },
                {
                  label: "YTD Dividends",
                  value: "₹1.6L",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider mb-1 opacity-70">
                    {metric.label}
                  </div>
                  <div className="text-lg font-bold tabular-nums">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B — Asset Class Filter Tabs + Search/Filter Bar */}
          <div className="sticky top-0 z-10 bg-[var(--color-page-bg)]/80 backdrop-blur-md border-b border-slate-200">
            {/* Row 1: Asset Tabs */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
              {(
                [
                  ["all", "All"],
                  ["equity", "Equity"],
                  ["mutual_fund", "Mutual Funds"],
                  ["fd", "FD"],
                  ["bond", "Bonds"],
                  ["gold", "Gold"],
                  ["real_estate", "Real Estate"],
                  ["cash", "Cash"],
                ] as [AssetClass, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveAssetClass(key)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                    activeAssetClass === key
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"
                  }`}
                >
                  {label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeAssetClass === key
                        ? "bg-indigo-400 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {assetClassCounts[key] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Row 2: Search/Action Bar */}
            <div className="px-6 pb-4 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative group w-full sm:w-auto">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Search holdings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-11 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-50 text-slate-600 shadow-sm">
                      Tags
                      <Badge variant="indigo" className="h-4 px-1">
                        {activeTags.length}
                      </Badge>
                    </button>
                  </div>
                  <FamilyAccountSwitcher accounts={ACCOUNTS} />
                  <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-50 text-slate-600 shadow-sm">
                    Sort ▾
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => alert("Export coming soon")}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
                >
                  <Download size={18} />
                  Export
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all whitespace-nowrap"
                >
                  <Plus size={18} />
                  Add Asset
                </button>
              </div>
            </div>
          </div>

          {/* SECTION C — Main content area with optional slideout */}
          <div className="flex gap-0 relative">
            <div
              className={`flex-1 px-4 md:px-6 py-6 space-y-6 transition-all duration-300 ${activeHolding ? "lg:mr-[420px]" : ""}`}
            >
              {/* Contextual Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {activeAssetClass === "all" ? "Holdings" : "Asset Value"}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {activeAssetClass === "all"
                      ? filteredHoldings.length
                      : formatShortINR(summary?.grand_total_current_value || 0)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {activeAssetClass === "all"
                      ? "Across 4 asset classes"
                      : "Current valuation"}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp size={20} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Gain
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                    {formatShortINR(summary?.grand_total_gain || 0)}
                  </div>
                  <div className="text-xs text-emerald-500 font-bold mt-1">
                    +{summary?.grand_gain_pct || "0.00"}%{" "}
                    <span className="text-slate-400 font-normal">
                      XIRR 18.4%
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <TrendingUp size={20} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Today's Move
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    +₹18,240
                  </div>
                  <div className="text-xs font-bold mt-1 text-emerald-500">
                    +0.46%
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ChevronRight size={20} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Dividends YTD
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    ₹1,60,000
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Next: ₹5,600 <span className="text-indigo-500 font-bold">12 Jun</span>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TreemapChart
                    data={filteredHoldings.map((h) => ({
                      id: h.id,
                      name: h.ticker || h.name,
                      value: h.currentValue,
                      gainPct: h.gainPct,
                      weight: h.weight,
                      assetClass: h.assetClass,
                    }))}
                    onSelect={setActiveHolding}
                  />
                </div>
                <WidgetCard title="Asset Allocation" subtitle="Portfolio breakdown by value">
                  <div className="h-64 flex flex-col justify-between">
                    <DonutAllocationChart data={allocation} />
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Badge variant="red" className="w-2 h-2 p-0 rounded-full" />
                          <span className="text-slate-500">
                            Asset allocation overview
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </WidgetCard>
              </div>

              {/* Holdings Table */}
              <HoldingsTable holdings={filteredHoldings} />
            </div>

            {/* Holding Detail Slideout */}
            {activeHolding && <HoldingDetailSlideout holding={activeHoldingData} />}
          </div>
        </main>
      </div>

      <AddHoldingModal />
      <TransactionDrawer transactions={[]} />
      <BulkActionBar />
    </div>
  );
};

export default PortfolioPage;
