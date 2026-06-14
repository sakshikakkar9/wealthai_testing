import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useState } from "react";
import WatchlistCard from "../../components/common/WatchlistCard";
import type { AssetClassKey } from "../../components/common/AssetCard";
import { usePortfolioStore } from "../../store/portfolio.store";

interface WItem {
  id: string;
  name: string;
  ticker: string;
  assetClass: AssetClassKey;
  price: string;
  changePct: string;
  isPositive: boolean;
  spark: number[];
}

const WATCH: WItem[] = [
  {
    id: "w1",
    name: "Wipro",
    ticker: "WIPRO · NSE",
    assetClass: "equity",
    price: "₹478.20",
    changePct: "+1.24%",
    isPositive: true,
    spark: [100, 101, 100, 102, 103, 104, 105],
  },
  {
    id: "w2",
    name: "Bajaj Finance",
    ticker: "BAJFINANCE · NSE",
    assetClass: "equity",
    price: "₹7,842",
    changePct: "-0.87%",
    isPositive: false,
    spark: [100, 99, 98, 97, 96, 96, 95],
  },
  {
    id: "w3",
    name: "Titan Company",
    ticker: "TITAN · NSE",
    assetClass: "equity",
    price: "₹3,210",
    changePct: "+2.14%",
    isPositive: true,
    spark: [100, 101, 103, 105, 107, 109, 112],
  },
  {
    id: "w4",
    name: "Adani Ports",
    ticker: "ADANIPORTS · NSE",
    assetClass: "equity",
    price: "₹1,184",
    changePct: "+0.52%",
    isPositive: true,
    spark: [100, 100, 101, 102, 102, 103, 104],
  },
  {
    id: "w5",
    name: "Sun Pharma",
    ticker: "SUNPHARMA · NSE",
    assetClass: "equity",
    price: "₹1,678",
    changePct: "-0.31%",
    isPositive: false,
    spark: [100, 100, 99, 99, 100, 99, 99],
  },
  {
    id: "w6",
    name: "Nippon Nifty BeES",
    ticker: "NIFTYBEES · ETF",
    assetClass: "equity",
    price: "₹244.80",
    changePct: "+0.66%",
    isPositive: true,
    spark: [100, 101, 102, 102, 103, 103, 104],
  },
  {
    id: "w7",
    name: "Bank BeES",
    ticker: "BANKBEES · ETF",
    assetClass: "equity",
    price: "₹512.30",
    changePct: "-0.44%",
    isPositive: false,
    spark: [100, 99, 98, 98, 97, 97, 96],
  },
  {
    id: "w8",
    name: "Gold BeES",
    ticker: "GOLDBEES · ETF",
    assetClass: "gold",
    price: "₹66.40",
    changePct: "+0.28%",
    isPositive: true,
    spark: [100, 101, 102, 102, 103, 103, 104],
  },
  {
    id: "w9",
    name: "Quant Small Cap",
    ticker: "MF · NAV ₹218.40",
    assetClass: "mf",
    price: "NAV ₹218.40",
    changePct: "+0.8%",
    isPositive: true,
    spark: [100, 101, 102, 104, 105, 107, 109],
  },
  {
    id: "w10",
    name: "Axis Bluechip",
    ticker: "MF · NAV ₹52.10",
    assetClass: "mf",
    price: "NAV ₹52.10",
    changePct: "+0.4%",
    isPositive: true,
    spark: [100, 101, 101, 102, 102, 103, 103],
  },
  {
    id: "w11",
    name: "7.26% GOI 2032",
    ticker: "Yield 7.54%",
    assetClass: "bonds",
    price: "₹98.42",
    changePct: "+0.12%",
    isPositive: true,
    spark: [100, 100, 100, 101, 101, 101, 101],
  },
  {
    id: "w12",
    name: "Tata Capital NCD",
    ticker: "9.15% coupon",
    assetClass: "bonds",
    price: "₹1,014",
    changePct: "+0.05%",
    isPositive: true,
    spark: [100, 100, 100, 100, 101, 101, 101],
  },
];

const FILTERS: { key: "all" | "equity" | "mf" | "etf" | "bonds" | "gold"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "equity", label: "Equity" },
  { key: "mf", label: "MF" },
  { key: "etf", label: "ETF" },
  { key: "bonds", label: "Bonds" },
  { key: "gold", label: "Gold" },
];

export default function WatchlistTab() {
  const [list, setList] = useState(WATCH);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const openAddModal = usePortfolioStore((s) => s.openAddModal);

  const filtered = list.filter((w) => {
    if (filter === "all") return true;
    if (filter === "etf") return w.ticker.includes("ETF");
    return w.assetClass === filter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4"
    >
      {/* Top bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#18181B] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">My Watchlist</h3>
          <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-white/70">
            {list.length} items
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showAdd && (
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ticker..."
              className="h-8 w-64 rounded-lg border border-white/[0.07] bg-[#1F1F23] px-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#6366F1] focus:outline-none"
            />
          )}
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${filter === f.key ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.07] bg-[#18181B] py-16 text-center">
          <Star className="h-10 w-10 text-zinc-700" />
          <p className="text-base font-semibold text-white">Your watchlist is empty</p>
          <p className="text-sm text-zinc-400">Add assets you want to track before investing</p>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
          >
            + Add to Watchlist
          </button>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((w) => (
            <WatchlistCard
              key={w.id}
              id={w.id}
              name={w.name}
              ticker={w.ticker}
              assetClass={w.assetClass}
              currentPrice={w.price}
              changePercent={w.changePct}
              isPositive={w.isPositive}
              sparklineData={w.spark}
              onRemove={(id) => setList((xs) => xs.filter((x) => x.id !== id))}
              onAddToPortfolio={(_, cls) => openAddModal(cls)}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
