import React from "react";
import {
  X,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { usePortfolioStore, AssetClass } from "../../../store/portfolio.store";
import { formatINR, formatShortINR, formatPercent, formatNumber } from "../../../utils/formatters";
import AreaPortfolioChart from "../../../components/charts/AreaPortfolioChart";
import Badge from "../../../components/common/Badge";
import PortfolioTagManager from "./PortfolioTagManager";

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

interface Props {
  holding: Holding | null;
}

const KPI_CHIPS = [
  { label: "52W High", value: "₹1,980" },
  { label: "52W Low", value: "₹1,312" },
  { label: "Beta", value: "1.12" },
  { label: "P/E", value: "28.4x" },
  { label: "Div Yield", value: "1.8%" },
  { label: "Mkt Cap", value: "₹7.9 L Cr" },
];

const HoldingDetailSlideout: React.FC<Props> = ({ holding }) => {
  const { setActiveHolding } = usePortfolioStore();

  if (!holding) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-xl z-[60] overflow-y-auto transition-transform duration-300 transform translate-x-0`}
    >
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveHolding(null)}
            className="p-1 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900">{holding.ticker || holding.name}</h2>
              <span className="text-slate-400 text-xs font-medium">· {holding.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${holding.assetClass === "equity" ? "bg-indigo-500" : "bg-emerald-500"}`}
              />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {holding.assetClass} · {holding.account}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <MoreHorizontal size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Value Section */}
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {formatINR(holding.currentValue)}
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 text-sm font-bold ${holding.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {holding.gainLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatShortINR(Math.abs(holding.gainLoss))} ({holding.gainPct.toFixed(2)}%)
            </div>
            <span className="text-slate-300">·</span>
            <div className="text-sm font-bold text-indigo-600">XIRR {holding.xirr.toFixed(1)}%</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {["1W", "1M", "3M", "1Y", "All"].map((range) => (
              <button
                key={range}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${range === "1Y" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-50"}`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="h-[200px] -mx-2">
            <AreaPortfolioChart />
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Holdings Details
          </h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">Quantity</div>
              <div className="font-bold text-slate-900 tabular-nums">
                {formatNumber(holding.quantity)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">Avg Cost</div>
              <div className="font-bold text-slate-900 tabular-nums">
                {formatINR(holding.avgCost)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">Current Price</div>
              <div className="font-bold text-slate-900 tabular-nums">
                {formatINR(holding.currentPrice)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium text-slate-400 uppercase">Day P&L</div>
              <div
                className={`font-bold tabular-nums flex items-center gap-1 ${holding.dayChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {holding.dayChange >= 0 ? "+" : ""}
                {formatShortINR(holding.dayChange)}
                <span className="text-[10px] opacity-70">({holding.dayChangePct.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Key Metrics
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {KPI_CHIPS.map((chip) => (
              <div
                key={chip.label}
                className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
              >
                <div className="text-[9px] font-bold text-slate-400 uppercase truncate mb-1">
                  {chip.label}
                </div>
                <div className="text-xs font-bold text-slate-700 truncate">{chip.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Recent Transactions
            </h3>
            <button className="text-[10px] font-bold text-indigo-600 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Plus size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Buy 50 @ ₹1,280</div>
                  <div className="text-[10px] text-slate-400">12 Mar 2026 · Rahul</div>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-900">₹64,000</div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Tags
          </h3>
          <PortfolioTagManager tags={holding.tags} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
            <Plus size={16} />
            Add Transaction
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">
            <Edit size={16} />
            Edit Holding
          </button>
          <button className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-100 col-span-2 mt-2">
            <Trash2 size={16} />
            Delete Asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldingDetailSlideout;
