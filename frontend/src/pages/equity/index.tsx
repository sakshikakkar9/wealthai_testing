import React, { useMemo, useEffect, useState } from "react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useDashboardStore } from "../../store/dashboard.store";
import { useEquityStore } from "../../store/equity.store";
import { formatINR, formatShortINR, formatPercent, formatNumber } from "../../utils/formatters";

// Components
import EquityCommandBanner from "./_components/EquityCommandBanner";
import EquityFilterBar from "./_components/EquityFilterBar";
import BenchmarkComparisonCard from "./_components/BenchmarkComparisonChart";
import ReturnsComparisonCard from "./_components/ReturnsComparisonBar";
import SectorConcentrationPanel from "./_components/SectorConcentrationPanel";
import MarketCapDistribution from "./_components/MarketCapDistribution";
import DiversificationScore from "./_components/DiversificationScore";
import EquityHoldingsTable from "./_components/EquityHoldingsTable";
import DailyMoversPanel from "./_components/DailyMoversPanel";
import CorporateActionsPanel from "./_components/CorporateActionsPanel";
import TaxIntelligencePanel from "./_components/TaxIntelligencePanel";
import FundamentalsSnapshot from "./_components/FundamentalsSnapshot";
import FiftyTwoWeekMap from "./_components/FiftyTwoWeekMap";
import EquityWatchlist from "./_components/EquityWatchlist";
import StockDetailSlideout from "./_components/StockDetailSlideout";
import AddHoldingModal from "../../components/common/AddHoldingModal";

// NEW Components
import RebalancingAlerts from "../../components/common/RebalancingAlerts";
import BenchmarkOverlayChart from "../../components/charts/BenchmarkOverlayChart";
import PnLSplitChart from "../../components/charts/PnLSplitChart";
import RiskMetricsPanel from "../../components/charts/RiskMetricsPanel";
import XIRRHoldingTable from "../../components/charts/XIRRHoldingTable";
import SectorHeatmap from "../../components/charts/SectorHeatmap";
import TaxEstimatorPanel from "../../components/charts/TaxEstimatorPanel";
import CorporateActionsFeed from "../../components/common/CorporateActionsFeed";
import GoalFilterBar from "../../components/common/GoalFilterBar";
import ReturnsAnalysisTable, { type ReturnHolding } from './_components/ReturnsAnalysisTable';
import HoldingViewModal from './_components/HoldingViewModal';
import HoldingEditModal from './_components/HoldingEditModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import * as equityApi from '../../api/equity.api';

// Mock Data & Libs
import {
  MOCK_EQUITY_HOLDINGS,
  MOCK_PORTFOLIO_HISTORY,
  MOCK_CORPORATE_ACTIONS,
} from "../../lib/mockEquityData";
import { detectDrift, suggestRebalancingTrades } from "../../lib/rebalancingEngine";
import {
  sharpeRatio,
  maxDrawdown,
  annualisedVolatility,
  sortinoRatio,
} from "../../lib/riskCalculations";
import {
  classifyHolding,
  stcgTax,
  ltcgTax,
  taxLossHarvestingSuggestions,
} from "../../lib/taxCalculations";
import { getBenchmarkData } from "../../api/benchmarkApi";
import { useGoals } from "../../hooks/useGoals";

// Types
export interface Holding {
  id: string;
  name: string;
  ticker?: string;
  assetClass: "equity";
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
  sector: string;
}

export interface EquityHolding extends Holding {
  // Fundamentals
  pe: number;
  pbv: number; // price to book value
  eps: number;
  dividendYield: number; // %
  beta: number;
  marketCap: number; // in crores
  marketCapCategory: "large" | "mid" | "small";
  roe: number; // return on equity %

  // 52W data
  week52High: number;
  week52Low: number;
  week52Position: number; // 0–100: where LTP sits in 52W range

  // Technical signals
  rsi14: number; // 0–100
  aboveMA200: boolean;
  aboveMA50: boolean;

  // Corporate actions upcoming
  upcomingActions: {
    type: "dividend" | "bonus" | "split" | "rights" | "agm";
    date: string;
    detail: string;
  }[];

  // Tax
  holdingDays: number;
  isLTCG: boolean; // holding > 365 days
  unrealizedGain: number;
  unrealizedTax: number; // estimated tax if booked today
  taxHarvestOpportunity: boolean; // loss that can be harvested
  taxSaving: number; // potential tax saving if harvested
}

const EquityPage = () => {
  const { setActiveNav } = useDashboardStore();
  const {
    activeStockId,
    showAddModal,
    searchQuery,
    sectorFilter,
    marketCapFilter,
    sortField,
    sortDir,
  } = useEquityStore();

  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const { tags } = useGoals();

  const [viewHolding,   setViewHolding]   = useState<ReturnHolding | null>(null);
  const [editHolding,   setEditHolding]   = useState<ReturnHolding | null>(null);
  const [deleteHolding, setDeleteHolding] = useState<ReturnHolding | null>(null);
  const [loadingHoldings, setLoadingHoldings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [equityHoldings, setEquityHoldings] = useState<EquityHolding[]>([]);

  useEffect(() => {
    setActiveNav('equity');
    getBenchmarkData('Nifty 50').then(setBenchmarkData);

    setLoadingHoldings(true);
    equityApi.getHoldings()
      .then((res) => {
        if (res?.success && res.data) {
          // Map API response shape to EquityHolding shape
          const mapped = res.data.map((live: any) => {
            // Find matching mock data for details not in current API
            const mock = MOCK_EQUITY_HOLDINGS.find(m => m.symbol === live.symbol) || MOCK_EQUITY_HOLDINGS[0];
            return {
              ...mock,
              id: live.id,
              name: live.company_name,
              ticker: live.symbol,
              quantity: Number(live.quantity),
              avgCost: Number(live.avg_buy_price),
              currentPrice: Number(live.current_price),
              invested: Number(live.invested_amount),
              currentValue: Number(live.current_value),
              gainLoss: Number(live.unrealised_pnl),
              gainPct: Number(live.invested_amount) > 0 ? (Number(live.unrealised_pnl) / Number(live.invested_amount)) * 100 : 0,
            };
          });
          setEquityHoldings(mapped);
        }
      })
      .catch((err) => {
        console.error('Equity holdings fetch failed:', err);
        setError("Failed to load equity holdings.");
      })
      .finally(() => setLoadingHoldings(false));
  }, [setActiveNav]);

  const returnHoldings: ReturnHolding[] = useMemo(() =>
    equityHoldings.map(h => ({
      id: h.id,
      company_name: h.name,
      symbol: h.ticker ?? '',
      quantity: h.quantity,
      avg_buy_price: h.avgCost,
      current_price: h.currentPrice,
      invested_amount: h.invested,
      current_value: h.currentValue,
      unrealised_pnl: h.gainLoss,
      sparkline: h.sparkline,
    })),
  [equityHoldings]);

  const handleEditSave = (id: string, data: { quantity: number; avg_buy_price: number; current_price: number }) => {
    setEquityHoldings(prev => prev.map(h => {
      if (h.id !== id) return h;
      const invested = data.quantity * data.avg_buy_price;
      const current  = data.quantity * data.current_price;
      return { ...h, quantity: data.quantity, avgCost: data.avg_buy_price,
               currentPrice: data.current_price, invested, currentValue: current,
               gainLoss: current - invested };
    }));
    equityApi.updateHolding(id, data).catch(console.error);
    setEditHolding(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteHolding) return;
    setEquityHoldings(prev => prev.filter(h => h.id !== deleteHolding.id));
    equityApi.deleteHolding(deleteHolding.id).catch(console.error);
    setDeleteHolding(null);
  };

  const EQUITY_SUMMARY = useMemo(
    () => {
      const totalInvested = equityHoldings.reduce((sum, h) => sum + h.invested, 0);
      const totalCurrentValue = equityHoldings.reduce((sum, h) => sum + h.currentValue, 0);
      const totalGainLoss = totalCurrentValue - totalInvested;
      return {
        totalStocks: equityHoldings.length,
        totalCurrentValue,
        totalInvested,
        totalGainLoss,
        totalGainPct: totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0,
        todayChange: 13289,
        todayChangePct: 0.61,
        xirr: 21.4,
        dividendYTD: 14220,
        ltcgRealized: 82400,
        stcgRealized: 24600,
        ltcgTax: 8240,
        stcgTax: 3690,
        totalUnrealizedGain: totalGainLoss,
        totalUnrealizedTax: totalGainLoss * 0.1, // simplified
        harvestablelosses: 26800,
        potentialTaxSaving: 4020,
        wtdAvgPE: 27.8,
        wtdAvgDivYield: 0.94,
        wtdAvgBeta: 0.92,
        benchmarkReturn: 8.7,
        alpha: 12.7,
        beatBenchmark: true,
      };
    },
    [equityHoldings],
  );

  const filteredHoldings = useMemo(() => {
    let list = [...equityHoldings];

    if (searchQuery) {
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.ticker?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (sectorFilter) {
      list = list.filter((h) => h.sector === sectorFilter);
    }

    if (marketCapFilter !== "all") {
      list = list.filter((h) => h.marketCapCategory === marketCapFilter);
    }

    if (activeGoal) {
      list = list.filter((h) => {
        const holdingTags = tags[h.ticker || ""] || [];
        return holdingTags.includes(activeGoal as any);
      });
    }

    list.sort((a, b) => {
      const aVal = a[sortField as keyof EquityHolding];
      const bVal = b[sortField as keyof EquityHolding];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return list;
  }, [equityHoldings, searchQuery, sectorFilter, marketCapFilter, sortField, sortDir, activeGoal, tags]);

  const activeStock = useMemo(
    () => equityHoldings.find((h) => h.id === activeStockId) || null,
    [equityHoldings, activeStockId],
  );

  const sectors = useMemo(
    () => Array.from(new Set(equityHoldings.map((h) => h.sector))),
    [equityHoldings],
  );

  const targets = useMemo(
    () => ({ IT: 0.3, Banking: 0.2, Energy: 0.15, FMCG: 0.15, Auto: 0.1, Pharma: 0.1 }),
    [],
  );

  const driftData = useMemo(() => {
    return detectDrift(
      equityHoldings.map((h) => ({
        symbol: h.ticker!,
        sector: h.sector,
        currentValue: h.currentValue,
      })),
      targets,
    );
  }, [equityHoldings, targets]);

  const rebalancingSuggestions = useMemo(() => {
    return suggestRebalancingTrades(driftData, EQUITY_SUMMARY.totalCurrentValue);
  }, [driftData, EQUITY_SUMMARY.totalCurrentValue]);

  const riskMetrics = useMemo(
    () => ({
      sharpeRatio: sharpeRatio([2.1, 1.8, -0.5, 3.2, 4.1, -1.2, 2.5]),
      maxDrawdown: maxDrawdown([100, 105, 103, 110, 115, 112, 118, 124, 120, 128]),
      volatility: annualisedVolatility([2.1, 1.8, -0.5, 3.2, 4.1, -1.2, 2.5]),
      sortinoRatio: sortinoRatio([2.1, 1.8, -0.5, 3.2, 4.1, -1.2, 2.5]),
    }),
    [],
  );

  const taxBreakdown = useMemo(
    () =>
      equityHoldings.map((h) => ({
        symbol: h.ticker!,
        period: h.holdingDays,
        gain: h.unrealizedGain,
        type: classifyHolding(new Date(Date.now() - h.holdingDays * 24 * 60 * 60 * 1000)) as
          | "STCG"
          | "LTCG",
        tax: h.unrealizedTax,
      })),
    [equityHoldings],
  );

  const taxSuggestions = useMemo(
    () =>
      taxLossHarvestingSuggestions(
        equityHoldings.map((h) => ({
          symbol: h.ticker!,
          buyDate: new Date(Date.now() - h.holdingDays * 24 * 60 * 60 * 1000),
          buyPrice: h.avgCost,
          currentPrice: h.currentPrice,
          quantity: h.quantity,
          gain: h.gainLoss,
        })),
      ),
    [equityHoldings],
  );

  const goalSummaries = useMemo(() => {
    const goals: ("Retirement" | "Education" | "Emergency" | "Growth" | "Dividend")[] = [
      "Retirement",
      "Education",
      "Emergency",
      "Growth",
      "Dividend",
    ];
    const targets = {
      Retirement: 50000000,
      Education: 25000000,
      Emergency: 1000000,
      Growth: 15000000,
      Dividend: 5000000,
    };
    const colors = {
      Retirement: "bg-indigo-600",
      Education: "bg-emerald-600",
      Emergency: "bg-rose-600",
      Growth: "bg-amber-600",
      Dividend: "bg-sky-600",
    };

    return goals.map((goal) => {
      const value = equityHoldings.reduce((acc, h) => {
        const holdingTags = tags[h.ticker || ""] || [];
        if (holdingTags.includes(goal)) {
          return acc + h.currentValue;
        }
        return acc;
      }, 0);

      return {
        goal,
        currentValue: value,
        targetValue: targets[goal],
        color: colors[goal],
      };
    });
  }, [equityHoldings, tags]);

  const sectorHeatmapData = useMemo(() => {
    const groups: Record<string, any[]> = {};
    equityHoldings.forEach((h) => {
      if (!groups[h.sector]) groups[h.sector] = [];
      groups[h.sector].push({ name: h.ticker, size: h.weight });
    });
    return Object.entries(groups).map(([name, items]) => ({
      name,
      size: items.reduce((s, i) => s + i.size, 0),
      weight: items.reduce((s, i) => s + i.size, 0) / 100,
      items,
    }));
  }, [equityHoldings]);

  if (error) {
    return (
      <div className="flex h-screen bg-[#F2F0EF] items-center justify-center">
        <div className="text-red-500 font-bold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          {/* SECTION 1 — Command banner */}
          <EquityCommandBanner summary={EQUITY_SUMMARY} totalStocks={equityHoldings.length} totalCompanies={equityHoldings.length} />

          {/* Returns Analysis — live data table */}
          <div className="px-6 py-4">
            {loadingHoldings
              ? <div className="bg-white rounded-2xl border border-slate-100 h-48 animate-pulse" />
              : <ReturnsAnalysisTable
                  holdings={returnHoldings}
                  onView={setViewHolding}
                  onEdit={setEditHolding}
                  onDelete={setDeleteHolding}
                />
            }
          </div>

          {/* Filter / toolbar */}
          <EquityFilterBar sectors={sectors} />

          {/* NEW: Goal Filter Bar & Summaries */}
          <div className="px-6 py-2">
            <GoalFilterBar
              summaries={goalSummaries}
              activeGoal={activeGoal}
              onSelectGoal={setActiveGoal}
            />
          </div>

          {/* NEW: Rebalancing Alerts */}
          <RebalancingAlerts drifts={driftData} suggestions={rebalancingSuggestions} />

          {/* NEW: Benchmark Overlay Chart */}
          <div className="px-6 py-4">
            <BenchmarkOverlayChart data={benchmarkData} />
          </div>

          {/* PERFORMANCE ROW */}
          <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PnLSplitChart data={MOCK_PORTFOLIO_HISTORY} />
            <RiskMetricsPanel metrics={riskMetrics} />
          </div>

          {/* SECTION 2 — Original Performance charts (Keep some existing layout) */}
          <div className="px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <BenchmarkComparisonCard portfolioData={benchmarkData} summary={EQUITY_SUMMARY} />
            </div>
            <ReturnsComparisonCard xirr={EQUITY_SUMMARY.xirr} alpha={EQUITY_SUMMARY.alpha} />
          </div>

          {/* NEW: XIRR Holding Table */}
          <div className="px-6 pb-4">
            <XIRRHoldingTable
              holdings={equityHoldings.map((h) => ({
                symbol: h.ticker!,
                buyDate: "2023-01-15", // Simplified
                buyPrice: h.avgCost,
                currentPrice: h.currentPrice,
                quantity: h.quantity,
                xirr: h.xirr,
                cagr: h.xirr - 2.5, // Mock CAGR
                sparkline: h.sparkline,
              }))}
            />
          </div>

          {/* SECTION 3 — Sector + concentration */}
          <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SectorConcentrationPanel holdings={equityHoldings} />
            <MarketCapDistribution
              data={{
                large: { value: 1363720, weight: 62, avgGain: 18.4 },
                mid: { value: 527904, weight: 24, avgGain: 31.2 },
                small: { value: 307976, weight: 14, avgGain: 24.8 },
              }}
            />
            <DiversificationScore holdings={equityHoldings.map(h => ({
              weight: h.weight,
              sector: h.sector,
              name: h.name,
              ticker: h.ticker ?? "",
            }))} />
          </div>

          {/* NEW: Sector Heatmap + Tax Estimator Row */}
          <div className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectorHeatmap data={sectorHeatmapData} />
            <TaxEstimatorPanel
              summary={{
                stcg: EQUITY_SUMMARY.stcgTax,
                ltcg: EQUITY_SUMMARY.ltcgTax,
                total: EQUITY_SUMMARY.stcgTax + EQUITY_SUMMARY.ltcgTax,
              }}
              breakdown={taxBreakdown}
              suggestions={taxSuggestions}
            />
          </div>

          {/* SECTION 4 — Holdings table (full width) */}
          <div className="px-6 pb-4">
            <EquityHoldingsTable holdings={filteredHoldings} />
          </div>

          {/* NEW: Corporate Actions Feed */}
          <div className="px-6 pb-4">
            <CorporateActionsFeed actions={MOCK_CORPORATE_ACTIONS as any} />
          </div>

          {/* SECTION 5 — Movers + alerts */}
          <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DailyMoversPanel variant="gainers" holdings={equityHoldings} />
            <DailyMoversPanel variant="losers" holdings={equityHoldings} />
            <CorporateActionsPanel
              actions={MOCK_CORPORATE_ACTIONS.map((a) => ({
                ticker: a.symbol,
                name: a.symbol,
                type: a.action.toLowerCase() as any,
                date: a.date,
                detail: a.detail,
                impact: "",
              }))}
            />
          </div>

          {/* SECTION 6 — Tax intelligence */}
          <div className="px-6 pb-4">
            <TaxIntelligencePanel
              summary={EQUITY_SUMMARY}
              harvestable={EQUITY_SUMMARY.harvestablelosses}
              saving={EQUITY_SUMMARY.potentialTaxSaving}
            />
          </div>

          {/* SECTION 7 — Fundamentals + 52W + watchlist */}
          <div className="px-6 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FundamentalsSnapshot summary={EQUITY_SUMMARY} />
            <FiftyTwoWeekMap holdings={equityHoldings} />
            <EquityWatchlist
              items={[
                {
                  ticker: "WIPRO",
                  name: "Wipro Ltd",
                  ltp: 542,
                  change: +1.2,
                  pe: 22.4,
                  week52Position: 62,
                },
                {
                  ticker: "LTIM",
                  name: "LTIMindtree",
                  ltp: 5840,
                  change: -0.8,
                  pe: 34.2,
                  week52Position: 44,
                },
                {
                  ticker: "KOTAKBANK",
                  name: "Kotak Mahindra Bank",
                  ltp: 1892,
                  change: +0.4,
                  pe: 20.8,
                  week52Position: 71,
                },
                {
                  ticker: "DMART",
                  name: "Avenue Supermarts",
                  ltp: 3620,
                  change: -0.3,
                  pe: 82.4,
                  week52Position: 38,
                },
                {
                  ticker: "PIDILITIND",
                  name: "Pidilite Industries",
                  ltp: 2840,
                  change: +1.1,
                  pe: 68.2,
                  week52Position: 58,
                },
              ]}
            />
          </div>
        </main>
      </div>

      {/* Slideout */}
      <StockDetailSlideout holding={activeStock} />

      {/* Modal */}
      {showAddModal && <AddHoldingModal />}

      {viewHolding   && <HoldingViewModal holding={viewHolding} onClose={() => setViewHolding(null)} />}
      {editHolding   && <HoldingEditModal holding={editHolding} onSave={handleEditSave} onClose={() => setEditHolding(null)} />}
      {deleteHolding && (
        <ConfirmDialog
          title="Delete Holding"
          description={`Remove ${deleteHolding.company_name} (${deleteHolding.symbol}) from your portfolio?`}
          confirmText="Delete" cancelText="Cancel" variant="destructive"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteHolding(null)}
        />
      )}
    </div>
  );
};

export default EquityPage;
