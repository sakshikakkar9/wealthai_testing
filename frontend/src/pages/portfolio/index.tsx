import React, { useMemo, useEffect } from "react";
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

interface Transaction {
  id: string;
  holdingId: string;
  holdingName: string;
  type: "buy" | "sell" | "dividend" | "interest" | "sip";
  date: string;
  quantity?: number;
  price?: number;
  amount: number;
  account: string;
}

const ACCOUNTS = [
  { id: "all", label: "All Accounts", type: "aggregate", value: 12482450 },
  { id: "rahul", label: "Rahul Kumar", type: "individual", xirr: 18.4, value: 6840000 },
  { id: "priya", label: "Priya Kumar", type: "individual", xirr: 14.2, value: 2820000 },
  { id: "joint", label: "Joint Account", type: "joint", xirr: 16.1, value: 1880000 },
  { id: "huf", label: "HUF Account", type: "huf", xirr: 12.8, value: 910000 },
];

const PORTFOLIO_SUMMARY = {
  totalValue: 12482450,
  invested: 9420000,
  gainLoss: 3062450,
  gainLossPct: 32.51,
  todayChange: 18240,
  todayChangePct: 0.46,
  xirr: 18.4,
  dividendsYTD: 160000,
};

const HOLDINGS: Holding[] = [
  // EQUITY (8)
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
    weight: 3.03,
    sparkline: [310, 340, 320, 360, 380, 372, 378],
    sector: "IT",
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
    weight: 2.07,
    sparkline: [230, 244, 238, 256, 260, 262, 259],
    sector: "Banking",
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
    weight: 1.87,
    sparkline: [200, 210, 205, 225, 230, 228, 233],
    sector: "Energy",
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
    weight: 2.03,
    sparkline: [210, 225, 218, 244, 248, 250, 253],
    sector: "IT",
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
    weight: 1.93,
    sparkline: [268, 260, 252, 248, 244, 243, 241],
    sector: "FMCG",
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
    weight: 2.51,
    sparkline: [260, 275, 270, 300, 308, 310, 314],
    sector: "Banking",
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
    weight: 1.23,
    sparkline: [128, 138, 132, 148, 152, 152, 154],
    sector: "Pharma",
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
    weight: 2.94,
    sparkline: [320, 340, 334, 358, 362, 364, 367],
    sector: "Auto",
  },

  // MUTUAL FUNDS (5)
  {
    id: "h9",
    name: "Mirae Asset Large Cap",
    ticker: "MF-MIRAE",
    assetClass: "mutual_fund",
    account: "rahul",
    tags: ["equity-MF", "large-cap"],
    quantity: 1840.22,
    avgCost: 42.4,
    currentPrice: 61.8,
    currentValue: 113692,
    invested: 78000,
    gainLoss: 35692,
    gainPct: 45.8,
    xirr: 24.2,
    dayChange: 568,
    dayChangePct: 0.5,
    weight: 0.91,
    sparkline: [85, 92, 90, 105, 110, 112, 114],
  },
  {
    id: "h10",
    name: "Parag Parikh Flexi Cap",
    ticker: "MF-PPFAS",
    assetClass: "mutual_fund",
    account: "priya",
    tags: ["equity-MF", "flexi-cap"],
    quantity: 2210.54,
    avgCost: 38.6,
    currentPrice: 62.4,
    currentValue: 137930,
    invested: 85320,
    gainLoss: 52610,
    gainPct: 61.7,
    xirr: 28.4,
    dayChange: 690,
    dayChangePct: 0.5,
    weight: 1.11,
    sparkline: [100, 115, 112, 128, 134, 136, 138],
  },
  {
    id: "h11",
    name: "HDFC Short Term Debt",
    ticker: "MF-HDFC",
    assetClass: "mutual_fund",
    account: "huf",
    tags: ["debt-MF"],
    quantity: 4820.1,
    avgCost: 20.72,
    currentPrice: 23.44,
    currentValue: 113000,
    invested: 99920,
    gainLoss: 13080,
    gainPct: 13.1,
    xirr: 7.8,
    dayChange: 113,
    dayChangePct: 0.1,
    weight: 0.91,
    sparkline: [101, 103, 104, 110, 111, 112, 113],
  },
  {
    id: "h12",
    name: "SBI Nifty Index Fund",
    ticker: "MF-SBI",
    assetClass: "mutual_fund",
    account: "joint",
    tags: ["index", "equity-MF"],
    quantity: 3100.0,
    avgCost: 25.8,
    currentPrice: 34.2,
    currentValue: 106020,
    invested: 79980,
    gainLoss: 26040,
    gainPct: 32.6,
    xirr: 17.2,
    dayChange: 530,
    dayChangePct: 0.5,
    weight: 0.85,
    sparkline: [88, 92, 90, 100, 103, 104, 106],
  },
  {
    id: "h13",
    name: "Axis Bluechip Fund",
    ticker: "MF-AXIS",
    assetClass: "mutual_fund",
    account: "rahul",
    tags: ["equity-MF", "large-cap"],
    quantity: 2560.8,
    avgCost: 29.6,
    currentPrice: 38.8,
    currentValue: 99360,
    invested: 75800,
    gainLoss: 23560,
    gainPct: 31.1,
    xirr: 15.8,
    dayChange: 497,
    dayChangePct: 0.5,
    weight: 0.8,
    sparkline: [82, 87, 86, 95, 97, 98, 99],
  },

  // FIXED DEPOSITS (3)
  {
    id: "h14",
    name: "HDFC FD 3yr 7.25%",
    assetClass: "fd",
    account: "rahul",
    tags: ["FD", "safe"],
    quantity: 1,
    avgCost: 200000,
    currentPrice: 214520,
    currentValue: 214520,
    invested: 200000,
    gainLoss: 14520,
    gainPct: 7.26,
    xirr: 7.25,
    dayChange: 40,
    dayChangePct: 0.02,
    weight: 1.72,
    sparkline: [201, 203, 206, 208, 210, 212, 214],
    maturityDate: "15 Jun 2026",
    couponRate: 7.25,
  },
  {
    id: "h15",
    name: "PNB FD 1yr 7.1%",
    assetClass: "fd",
    account: "priya",
    tags: ["FD", "safe"],
    quantity: 1,
    avgCost: 75000,
    currentPrice: 79416,
    currentValue: 79416,
    invested: 75000,
    gainLoss: 4416,
    gainPct: 5.89,
    xirr: 7.1,
    dayChange: 15,
    dayChangePct: 0.02,
    weight: 0.64,
    sparkline: [76, 76, 77, 77, 78, 79, 79],
    maturityDate: "22 Nov 2026",
    couponRate: 7.1,
  },
  {
    id: "h16",
    name: "Axis FD 2yr 7.0%",
    assetClass: "fd",
    account: "joint",
    tags: ["FD", "safe"],
    quantity: 1,
    avgCost: 125000,
    currentPrice: 137800,
    currentValue: 137800,
    invested: 125000,
    gainLoss: 12800,
    gainPct: 10.24,
    xirr: 7.0,
    dayChange: 26,
    dayChangePct: 0.02,
    weight: 1.1,
    sparkline: [126, 128, 130, 132, 134, 136, 138],
    maturityDate: "04 Jan 2027",
    couponRate: 7.0,
  },

  // BONDS (2)
  {
    id: "h17",
    name: "ICICI Corp Bond 8.2%",
    assetClass: "bond",
    account: "huf",
    tags: ["bond", "AAA"],
    quantity: 15,
    avgCost: 9820,
    currentPrice: 10120,
    currentValue: 151800,
    invested: 147300,
    gainLoss: 4500,
    gainPct: 3.06,
    xirr: 8.2,
    dayChange: 152,
    dayChangePct: 0.1,
    weight: 1.22,
    sparkline: [148, 149, 150, 150, 151, 151, 152],
    maturityDate: "03 Nov 2026",
    couponRate: 8.2,
  },
  {
    id: "h18",
    name: "NHAI Infra Bond 7.6%",
    assetClass: "bond",
    account: "rahul",
    tags: ["bond", "AAA"],
    quantity: 10,
    avgCost: 9950,
    currentPrice: 10240,
    currentValue: 102400,
    invested: 99500,
    gainLoss: 2900,
    gainPct: 2.91,
    xirr: 7.6,
    dayChange: 102,
    dayChangePct: 0.1,
    weight: 0.82,
    sparkline: [100, 100, 101, 101, 102, 102, 102],
    maturityDate: "20 Mar 2028",
    couponRate: 7.6,
  },

  // GOLD / SGB (1)
  {
    id: "h19",
    name: "SGB Tranche IV 2.5%",
    assetClass: "gold",
    account: "rahul",
    tags: ["SGB", "gold"],
    quantity: 20,
    avgCost: 4750,
    currentPrice: 6820,
    currentValue: 136400,
    invested: 95000,
    gainLoss: 41400,
    gainPct: 43.6,
    xirr: 18.2,
    dayChange: 1364,
    dayChangePct: 1.01,
    weight: 1.09,
    sparkline: [112, 118, 115, 130, 134, 135, 136],
    maturityDate: "12 Aug 2026",
    couponRate: 2.5,
  },

  // REAL ESTATE (1)
  {
    id: "h20",
    name: "Embassy REIT Units",
    ticker: "EMBASSY",
    assetClass: "real_estate",
    account: "huf",
    tags: ["REIT"],
    quantity: 500,
    avgCost: 298,
    currentPrice: 382,
    currentValue: 191000,
    invested: 149000,
    gainLoss: 42000,
    gainPct: 28.2,
    xirr: 14.8,
    dayChange: 955,
    dayChangePct: 0.5,
    weight: 1.53,
    sparkline: [165, 172, 170, 182, 187, 189, 191],
    sector: "Real Estate",
  },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    holdingId: "h1",
    holdingName: "Infosys Ltd",
    type: "buy",
    date: "2026-05-15",
    quantity: 50,
    price: 1840,
    amount: 92000,
    account: "rahul",
  },
  {
    id: "t2",
    holdingId: "h4",
    holdingName: "TCS Ltd",
    type: "dividend",
    date: "2026-05-10",
    amount: 1680,
    account: "rahul",
  },
  {
    id: "t3",
    holdingId: "h9",
    holdingName: "Mirae Asset Large Cap",
    type: "sip",
    date: "2026-05-05",
    amount: 10000,
    account: "rahul",
  },
  {
    id: "t4",
    holdingId: "h2",
    holdingName: "HDFC Bank",
    type: "buy",
    date: "2026-04-22",
    quantity: 20,
    price: 1710,
    amount: 34200,
    account: "rahul",
  },
  {
    id: "t5",
    holdingId: "h14",
    holdingName: "HDFC FD 3yr 7.25%",
    type: "interest",
    date: "2026-04-15",
    amount: 3625,
    account: "rahul",
  },
  {
    id: "t6",
    holdingId: "h19",
    holdingName: "SGB Tranche IV 2.5%",
    type: "interest",
    date: "2026-04-01",
    amount: 1250,
    account: "rahul",
  },
  {
    id: "t7",
    holdingId: "h5",
    holdingName: "Asian Paints",
    type: "buy",
    date: "2026-03-28",
    quantity: 15,
    price: 2540,
    amount: 38100,
    account: "priya",
  },
  {
    id: "t8",
    holdingId: "h3",
    holdingName: "Reliance Industries",
    type: "sell",
    date: "2026-03-15",
    quantity: 10,
    price: 2980,
    amount: 29800,
    account: "joint",
  },
  {
    id: "t9",
    holdingId: "h10",
    holdingName: "Parag Parikh Flexi Cap",
    type: "sip",
    date: "2026-03-05",
    amount: 15000,
    account: "priya",
  },
  {
    id: "t10",
    holdingId: "h6",
    holdingName: "Bajaj Finance",
    type: "buy",
    date: "2026-02-18",
    quantity: 5,
    price: 7450,
    amount: 37250,
    account: "huf",
  },
  {
    id: "t11",
    holdingId: "h17",
    holdingName: "ICICI Corp Bond 8.2%",
    type: "interest",
    date: "2026-01-30",
    amount: 6200,
    account: "huf",
  },
  {
    id: "t12",
    holdingId: "h8",
    holdingName: "Maruti Suzuki",
    type: "buy",
    date: "2026-01-10",
    quantity: 2,
    price: 11800,
    amount: 23600,
    account: "joint",
  },
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

  useEffect(() => {
    setActiveNav("portfolio");
  }, [setActiveNav]);

  const filteredHoldings = useMemo(() => {
    return HOLDINGS.filter((h) => {
      const matchAsset = activeAssetClass === "all" || h.assetClass === activeAssetClass;
      const matchAccount = activeAccount === "all" || h.account === activeAccount;
      const matchSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.ticker && h.ticker.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTags = activeTags.length === 0 || activeTags.some((tag) => h.tags.includes(tag));
      return matchAsset && matchAccount && matchSearch && matchTags;
    });
  }, [activeAssetClass, activeAccount, searchQuery, activeTags]);

  const activeHoldingData = useMemo(() => {
    return HOLDINGS.find((h) => h.id === activeHolding) || null;
  }, [activeHolding]);

  const summary = useMemo(() => {
    if (activeAssetClass === "all") return PORTFOLIO_SUMMARY;

    const assets = HOLDINGS.filter((h) => h.assetClass === activeAssetClass);
    return {
      totalValue: assets.reduce((sum, h) => sum + h.currentValue, 0),
      invested: assets.reduce((sum, h) => sum + h.invested, 0),
      gainLoss: assets.reduce((sum, h) => sum + h.gainLoss, 0),
      gainLossPct:
        assets.length > 0
          ? (assets.reduce((sum, h) => sum + h.gainLoss, 0) /
              assets.reduce((sum, h) => sum + h.invested, 0)) *
            100
          : 0,
      todayChange: assets.reduce((sum, h) => sum + h.dayChange, 0),
      todayChangePct:
        assets.length > 0 ? assets.reduce((sum, h) => sum + h.dayChangePct, 0) / assets.length : 0,
      xirr: assets.length > 0 ? assets.reduce((sum, h) => sum + h.xirr, 0) / assets.length : 0,
      dividendsYTD: 160000, // Dummy
    };
  }, [activeAssetClass]);

  const assetClassCounts = useMemo(() => {
    const counts: Record<string, number> = { all: HOLDINGS.length };
    HOLDINGS.forEach((h) => {
      counts[h.assetClass] = (counts[h.assetClass] || 0) + 1;
    });
    return counts;
  }, []);

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
                    {formatINR(PORTFOLIO_SUMMARY.totalValue)}
                  </h1>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-1">
                    <TrendingUp size={14} />
                    +2.67%
                    <span className="font-normal opacity-80 ml-1">month</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-indigo-100 font-medium">
                  <div className="flex items-center gap-2">
                    <PieChart size={14} />
                    20 holdings · 5 accounts
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} />
                    {formatShortINR(PORTFOLIO_SUMMARY.gainLoss)} total gain
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
                  {/* 12 point white sparkline dummy */}
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
                { label: "Net Worth", value: formatShortINR(PORTFOLIO_SUMMARY.totalValue) },
                { label: "Invested", value: formatShortINR(PORTFOLIO_SUMMARY.invested) },
                { label: "Gain/Loss", value: `+${formatShortINR(PORTFOLIO_SUMMARY.gainLoss)}` },
                { label: "Today's P&L", value: `+${formatINR(PORTFOLIO_SUMMARY.todayChange)}` },
                { label: "XIRR", value: "18.4%" },
                {
                  label: "YTD Dividends",
                  value: formatShortINR(PORTFOLIO_SUMMARY.dividendsYTD),
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
                {activeAssetClass === "fd" ? (
                  <>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Wallet size={20} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Maturity Value
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">
                        {formatShortINR(summary.totalValue + summary.gainLoss)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Total projected value</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <TrendingUp size={20} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Avg Rate
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 tabular-nums">7.15%</div>
                      <div className="text-xs text-emerald-500 font-bold mt-1">
                        Weighted average
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Plus size={20} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Nearest Maturity
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">15 Jun</div>
                      <div className="text-xs text-amber-500 font-bold mt-1">In 12 days</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <ChevronRight size={20} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Interest YTD
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">₹22,540</div>
                      <div className="text-xs text-slate-400 mt-1">Accrued interest</div>
                    </div>
                  </>
                ) : (
                  <>
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
                        Next: ₹5,600 <span className="text-indigo-500 font-bold">12 Jun</span>
                      </div>
                    </div>
                  </>
                )}
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
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Badge variant="red" className="w-2 h-2 p-0 rounded-full" />
                          <span className="text-slate-500">
                            Equity 68% — over target (60%) by 8%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Badge variant="emerald" className="w-2 h-2 p-0 rounded-full" />
                          <span className="text-slate-500">Bonds within target range</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Badge variant="amber" className="w-2 h-2 p-0 rounded-full" />
                          <span className="text-slate-500">Cash underallocated vs target</span>
                        </div>
                      </div>
                    </div>
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
                  <div className="divide-y divide-slate-50">
                    {TRANSACTIONS.slice(0, 5).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-5 px-5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                              t.type === "buy"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : t.type === "dividend"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-100"
                            }`}
                          >
                            {t.type.toUpperCase().slice(0, 3)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{t.holdingName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {new Date(t.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })}{" "}
                              · <span className="uppercase">{t.account}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900 tabular-nums">
                            {formatINR(t.amount)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {t.quantity ? `${t.quantity} units` : "Direct payout"}
                          </div>
                        </div>
                      </div>
                    ))}
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
      <TransactionDrawer transactions={TRANSACTIONS} />
      <BulkActionBar />
    </div>
  );
};

export default PortfolioPage;
