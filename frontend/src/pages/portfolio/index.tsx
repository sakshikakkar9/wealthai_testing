import React, { useMemo, useEffect, useState } from "react";
import {
  Plus,
  Settings,
  Download,
  Search,
  TrendingUp,
  Wallet,
  PieChart,
  Activity,
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
import * as portfolioApi from "../../api/portfolio.api";

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
  { id: "all", label: "All Accounts", type: "aggregate", value: 0 },
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
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveNav("portfolio");
    const loadPortfolio = async () => {
      try {
        setIsLoading(true);
        const [sum, hld] = await Promise.all([
          portfolioApi.getPortfolioSummary(),
          portfolioApi.getHoldings()
        ]);
        setSummaryData(sum);

        // Map backend holdings to local interface
        if (Array.isArray(hld)) {
           const mapped: Holding[] = hld.map((h: any) => ({
             id: h.id,
             name: h.name || h.scheme_name || h.bond_name || h.bank_name,
             ticker: h.symbol || h.isin || h.ticker,
             assetClass: h.asset_class,
             account: h.account || "Default",
             tags: h.tags || [],
             quantity: Number(h.quantity || 1),
             avgCost: Number(h.avg_cost || h.avg_nav || h.principal_amount || 0),
             currentPrice: Number(h.current_price || h.current_nav || 0),
             currentValue: Number(h.current_value || 0),
             invested: Number(h.invested_amount || 0),
             gainLoss: Number(h.gain_loss || 0),
             gainPct: Number(h.gain_pct || 0),
             xirr: Number(h.xirr || 0),
             dayChange: Number(h.day_change || 0),
             dayChangePct: Number(h.day_change_percent || 0),
             weight: 0, // calc below
             sparkline: [100, 101, 102, 103, 104],
             sector: h.sector || h.category,
             maturityDate: h.maturity_date,
             couponRate: h.coupon_rate || h.interest_rate
           }));

           const totalVal = mapped.reduce((s, x) => s + x.currentValue, 0);
           mapped.forEach(x => x.weight = totalVal > 0 ? (x.currentValue / totalVal) * 100 : 0);
           setHoldings(mapped);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load portfolio");
      } finally {
        setIsLoading(false);
      }
    };
    loadPortfolio();
  }, [setActiveNav]);

  const filteredHoldings = useMemo(() => {
    return holdings.filter((h) => {
      const matchAsset = activeAssetClass === "all" || h.assetClass === activeAssetClass;
      const matchAccount = activeAccount === "all" || h.account === activeAccount;
      const matchSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.ticker && h.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTags = activeTags.length === 0 || activeTags.some((tag) => h.tags.includes(tag));
      return matchAsset && matchAccount && matchSearch && matchTags;
    });
  }, [holdings, activeAssetClass, activeAccount, searchQuery, activeTags]);

  const activeHoldingData = useMemo(() => {
    return holdings.find((h) => h.id === activeHolding) || null;
  }, [holdings, activeHolding]);

  const summary = useMemo(() => {
    const assets = activeAssetClass === "all" ? holdings : holdings.filter((h) => h.assetClass === activeAssetClass);
    const totalValue = assets.reduce((sum, h) => sum + h.currentValue, 0);
    const invested = assets.reduce((sum, h) => sum + h.invested, 0);
    const gainLoss = totalValue - invested;

    return {
      totalValue,
      invested,
      gainLoss,
      gainLossPct: invested > 0 ? (gainLoss / invested) * 100 : 0,
      todayChange: assets.reduce((sum, h) => sum + h.dayChange, 0),
      todayChangePct: assets.length > 0 ? assets.reduce((sum, h) => sum + h.dayChangePct, 0) / assets.length : 0,
      xirr: assets.length > 0 ? assets.reduce((sum, h) => sum + h.xirr, 0) / assets.length : 0,
      dividendsYTD: 0,
    };
  }, [holdings, activeAssetClass]);

  const assetClassCounts = useMemo(() => {
    const counts: Record<string, number> = { all: holdings.length };
    holdings.forEach((h) => {
      counts[h.assetClass] = (counts[h.assetClass] || 0) + 1;
    });
    return counts;
  }, [holdings]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load data</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
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
                    {formatINR(summary.totalValue)}
                  </h1>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-1">
                    <TrendingUp size={14} />
                    {formatPercent(summary.gainLossPct)}
                    <span className="font-normal opacity-80 ml-1">total</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-indigo-100 font-medium">
                  <div className="flex items-center gap-2">
                    <PieChart size={14} />
                    {holdings.length} holdings
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} />
                    {formatShortINR(summary.gainLoss)} total gain
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
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-8">
              {[
                { label: "Net Worth", value: formatShortINR(summary.totalValue) },
                { label: "Invested", value: formatShortINR(summary.invested) },
                { label: "Gain/Loss", value: `${summary.gainLoss >= 0 ? '+' : ''}${formatShortINR(summary.gainLoss)}` },
                { label: "Today's P&L", value: `${summary.todayChange >= 0 ? '+' : ''}${formatINR(summary.todayChange)}` },
                { label: "XIRR", value: `${summary.xirr.toFixed(1)}%` },
                { label: "YTD Dividends", value: "₹0" },
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
                      : formatShortINR(summary.totalValue)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {activeAssetClass === "all"
                      ? "Across all asset classes"
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
                    {formatShortINR(summary.gainLoss)}
                  </div>
                  <div className="text-xs text-emerald-500 font-bold mt-1">
                    +{summary.gainLossPct.toFixed(1)}%{" "}
                    <span className="text-slate-400 font-normal">
                      XIRR {summary.xirr.toFixed(1)}%
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
                    {summary.todayChange >= 0 ? "+" : ""}
                    {formatINR(summary.todayChange)}
                  </div>
                  <div
                    className={`text-xs font-bold mt-1 ${summary.todayChangePct >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {summary.todayChangePct >= 0 ? "+" : ""}
                    {summary.todayChangePct.toFixed(2)}%
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
                    {formatShortINR(summary.dividendsYTD)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Accrued or received
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
                    <DonutAllocationChart />
                  </div>
                </WidgetCard>
              </div>

              {/* Holdings Table */}
              <HoldingsTable holdings={filteredHoldings} />

              {/* Transactions + Watchlist */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                <WidgetCard
                  title="Recent Transactions"
                  action={
                    <button
                      onClick={() => setShowTransactions(true)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      View All
                      <ArrowRight size={12} />
                    </button>
                  }
                >
                   <div className="p-4 text-center text-slate-400 text-xs">
                     Use the transactions page to view full history
                   </div>
                </WidgetCard>

                <WatchlistPanel />
              </div>
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

function formatPercent(val: number) {
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
}

export default PortfolioPage;
