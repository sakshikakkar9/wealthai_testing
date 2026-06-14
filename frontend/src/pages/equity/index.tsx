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

  const [equityHoldings, setEquityHoldings] = useState<EquityHolding[]>([
      {
        id: "h1",
        name: "Infosys Ltd",
        ticker: "INFY",
        assetClass: "equity",
        account: "rahul",
        tags: ["large-cap", "IT"],
        quantity: 200,
        avgCost: 1320,
        currentPrice: 1892,
        currentValue: 378400,
        invested: 264000,
        gainLoss: 114400,
        gainPct: 43.3,
        xirr: 22.1,
        dayChange: 3780,
        dayChangePct: 1.01,
        weight: 5.84,
        sparkline: [310, 340, 320, 360, 380, 372, 378],
        sector: "IT",
        pe: 28.4,
        pbv: 7.2,
        eps: 66.6,
        dividendYield: 1.8,
        beta: 0.82,
        marketCap: 780000,
        marketCapCategory: "large",
        roe: 31.4,
        week52High: 1980,
        week52Low: 1312,
        week52Position: 87,
        rsi14: 62,
        aboveMA200: true,
        aboveMA50: true,
        upcomingActions: [
          { type: "dividend", date: "28 May 2026", detail: "₹21/share — ex-date 20 May" },
        ],
        holdingDays: 480,
        isLTCG: true,
        unrealizedGain: 114400,
        unrealizedTax: 11440,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
      {
        id: "h2",
        name: "HDFC Bank",
        ticker: "HDFCBANK",
        assetClass: "equity",
        account: "rahul",
        tags: ["large-cap", "banking"],
        quantity: 150,
        avgCost: 1580,
        currentPrice: 1724,
        currentValue: 258600,
        invested: 237000,
        gainLoss: 21600,
        gainPct: 9.1,
        xirr: 8.4,
        dayChange: -1293,
        dayChangePct: -0.5,
        weight: 3.99,
        sparkline: [230, 244, 238, 256, 260, 262, 259],
        sector: "Banking",
        pe: 18.2,
        pbv: 2.8,
        eps: 94.7,
        dividendYield: 1.2,
        beta: 0.94,
        marketCap: 1310000,
        marketCapCategory: "large",
        roe: 16.8,
        week52High: 1880,
        week52Low: 1363,
        week52Position: 69,
        rsi14: 48,
        aboveMA200: true,
        aboveMA50: false,
        upcomingActions: [],
        holdingDays: 290,
        isLTCG: false,
        unrealizedGain: 21600,
        unrealizedTax: 3240,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
      {
        id: "h3",
        name: "Reliance Industries",
        ticker: "RELIANCE",
        assetClass: "equity",
        account: "joint",
        tags: ["large-cap", "energy"],
        quantity: 80,
        avgCost: 2240,
        currentPrice: 2918,
        currentValue: 233440,
        invested: 179200,
        gainLoss: 54240,
        gainPct: 30.3,
        xirr: 14.2,
        dayChange: 2334,
        dayChangePct: 1.01,
        weight: 3.6,
        sparkline: [200, 210, 205, 225, 230, 228, 233],
        sector: "Energy",
        pe: 22.1,
        pbv: 2.4,
        eps: 132,
        dividendYield: 0.3,
        beta: 1.12,
        marketCap: 1980000,
        marketCapCategory: "large",
        roe: 10.8,
        week52High: 3024,
        week52Low: 2220,
        week52Position: 86,
        rsi14: 71,
        aboveMA200: true,
        aboveMA50: true,
        upcomingActions: [{ type: "agm", date: "15 Jun 2026", detail: "Annual General Meeting" }],
        holdingDays: 520,
        isLTCG: true,
        unrealizedGain: 54240,
        unrealizedTax: 5424,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
      {
        id: "h4",
        name: "TCS Ltd",
        ticker: "TCS",
        assetClass: "equity",
        account: "rahul",
        tags: ["large-cap", "IT"],
        quantity: 60,
        avgCost: 3420,
        currentPrice: 4218,
        currentValue: 253080,
        invested: 205200,
        gainLoss: 47880,
        gainPct: 23.3,
        xirr: 18.6,
        dayChange: 2531,
        dayChangePct: 1.01,
        weight: 3.91,
        sparkline: [210, 225, 218, 244, 248, 250, 253],
        sector: "IT",
        pe: 32.1,
        pbv: 14.8,
        eps: 131.4,
        dividendYield: 1.4,
        beta: 0.78,
        marketCap: 1550000,
        marketCapCategory: "large",
        roe: 48.2,
        week52High: 4380,
        week52Low: 3204,
        week52Position: 86,
        rsi14: 58,
        aboveMA200: true,
        aboveMA50: true,
        upcomingActions: [
          { type: "dividend", date: "10 Jun 2026", detail: "₹28/share — ex-date 2 Jun" },
        ],
        holdingDays: 410,
        isLTCG: true,
        unrealizedGain: 47880,
        unrealizedTax: 4788,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
      {
        id: "h5",
        name: "Asian Paints",
        ticker: "ASIANPAINT",
        assetClass: "equity",
        account: "priya",
        tags: ["large-cap", "FMCG"],
        quantity: 100,
        avgCost: 2680,
        currentPrice: 2412,
        currentValue: 241200,
        invested: 268000,
        gainLoss: -26800,
        gainPct: -10.0,
        xirr: -4.2,
        dayChange: -2412,
        dayChangePct: -0.99,
        weight: 3.72,
        sparkline: [268, 260, 252, 248, 244, 243, 241],
        sector: "FMCG",
        pe: 44.2,
        pbv: 11.6,
        eps: 54.6,
        dividendYield: 0.8,
        beta: 0.68,
        marketCap: 231000,
        marketCapCategory: "large",
        roe: 26.4,
        week52High: 2840,
        week52Low: 2280,
        week52Position: 23,
        rsi14: 32,
        aboveMA200: false,
        aboveMA50: false,
        upcomingActions: [],
        holdingDays: 180,
        isLTCG: false,
        unrealizedGain: -26800,
        unrealizedTax: 0,
        taxHarvestOpportunity: true,
        taxSaving: 4020,
      },
      {
        id: "h6",
        name: "Bajaj Finance",
        ticker: "BAJFINANCE",
        assetClass: "equity",
        account: "huf",
        tags: ["large-cap", "NBFC"],
        quantity: 40,
        avgCost: 6200,
        currentPrice: 7840,
        currentValue: 313600,
        invested: 248000,
        gainLoss: 65600,
        gainPct: 26.5,
        xirr: 19.8,
        dayChange: 3136,
        dayChangePct: 1.01,
        weight: 4.84,
        sparkline: [260, 275, 270, 300, 308, 310, 314],
        sector: "Banking",
        pe: 36.4,
        pbv: 6.8,
        eps: 215.4,
        dividendYield: 0.3,
        beta: 1.42,
        marketCap: 473000,
        marketCapCategory: "large",
        roe: 20.2,
        week52High: 8124,
        week52Low: 5880,
        week52Position: 86,
        rsi14: 68,
        aboveMA200: true,
        aboveMA50: true,
        upcomingActions: [
          { type: "dividend", date: "22 Apr 2026", detail: "₹36/share — ex-date 14 Apr" },
        ],
        holdingDays: 398,
        isLTCG: true,
        unrealizedGain: 65600,
        unrealizedTax: 6560,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
      {
        id: "h7",
        name: "Sun Pharma",
        ticker: "SUNPHARMA",
        assetClass: "equity",
        account: "rahul",
        tags: ["large-cap", "pharma"],
        quantity: 120,
        avgCost: 980,
        currentPrice: 1284,
        currentValue: 154080,
        invested: 117600,
        gainLoss: 36480,
        gainPct: 31.0,
        xirr: 16.4,
        dayChange: 1541,
        dayChangePct: 1.01,
        weight: 2.38,
        sparkline: [128, 138, 132, 148, 152, 152, 154],
        sector: "Pharma",
        pe: 31.2,
        pbv: 5.4,
        eps: 41.2,
        dividendYield: 0.6,
        beta: 0.58,
        marketCap: 308000,
        marketCapCategory: "large",
        roe: 18.6,
        week52High: 1340,
        week52Low: 984,
        week52Position: 83,
        rsi14: 64,
        aboveMA200: true,
        aboveMA50: true,
        upcomingActions: [
          { type: "bonus", date: "18 Mar 2026", detail: "1:5 bonus — record date 15 Mar" },
        ],
        holdingDays: 560,
        isLTCG: true,
        unrealizedGain: 36480,
        unrealizedTax: 3648,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
      {
        id: "h8",
        name: "Maruti Suzuki",
        ticker: "MARUTI",
        assetClass: "equity",
        account: "joint",
        tags: ["large-cap", "auto"],
        quantity: 30,
        avgCost: 9400,
        currentPrice: 12240,
        currentValue: 367200,
        invested: 282000,
        gainLoss: 85200,
        gainPct: 30.2,
        xirr: 21.3,
        dayChange: 3672,
        dayChangePct: 1.01,
        weight: 5.67,
        sparkline: [320, 340, 334, 358, 362, 364, 367],
        sector: "Auto",
        pe: 26.8,
        pbv: 4.8,
        eps: 456.8,
        dividendYield: 0.7,
        beta: 0.88,
        marketCap: 370000,
        marketCapCategory: "large",
        roe: 18.4,
        week52High: 12840,
        week52Low: 9108,
        week52Position: 82,
        rsi14: 66,
        aboveMA200: true,
        aboveMA50: true,
        upcomingActions: [
          { type: "dividend", date: "15 Mar 2026", detail: "₹125/share — ex-date 8 Mar" },
        ],
        holdingDays: 440,
        isLTCG: true,
        unrealizedGain: 85200,
        unrealizedTax: 8520,
        taxHarvestOpportunity: false,
        taxSaving: 0,
      },
  ]);

  useEffect(() => {
    setActiveNav('equity');
    getBenchmarkData('Nifty 50').then(setBenchmarkData);

    setLoadingHoldings(true);
    equityApi.getHoldings()
      .then((res) => {
        if (res?.data?.length) {
          // Map API response shape to EquityHolding shape
          // API returns: { id, company_name, symbol, quantity, avg_buy_price, current_price,
          //                invested_amount, current_value, unrealised_pnl }
          // For now keep all other EquityHolding fields from the matching mock row (by symbol),
          // just update the numeric values from the real API.
          setEquityHoldings(prev => prev.map(h => {
            const live = res.data.find((r: any) => r.symbol === h.ticker);
            if (!live) return h;
            return { ...h,
              quantity: live.quantity,
              avgCost: Number(live.avg_buy_price),
              currentPrice: Number(live.current_price),
              invested: Number(live.invested_amount),
              currentValue: Number(live.current_value),
              gainLoss: Number(live.unrealised_pnl),
            };
          }));
        }
      })
      .catch((err) => { /* silently keep mock data */ console.error('Equity holdings fetch failed:', err);})
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
    () => ({
      totalStocks: 8,
      totalCurrentValue: 2199600,
      totalInvested: 1601000,
      totalGainLoss: 598600,
      totalGainPct: 37.4,
      todayChange: 13289,
      todayChangePct: 0.61,
      xirr: 21.4,
      dividendYTD: 14220,
      ltcgRealized: 82400,
      stcgRealized: 24600,
      ltcgTax: 8240,
      stcgTax: 3690,
      totalUnrealizedGain: 444400,
      totalUnrealizedTax: 39900,
      harvestablelosses: 26800,
      potentialTaxSaving: 4020,
      wtdAvgPE: 27.8,
      wtdAvgDivYield: 0.94,
      wtdAvgBeta: 0.92,
      benchmarkReturn: 8.7,
      alpha: 12.7,
      beatBenchmark: true,
    }),
    [],
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
  }, [equityHoldings, searchQuery, sectorFilter, marketCapFilter, sortField, sortDir]);

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

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          {/* SECTION 1 — Command banner */}
          <EquityCommandBanner summary={EQUITY_SUMMARY} totalStocks={8} totalCompanies={8} />

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
