import React from "react";
import { Plus, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { formatINR, formatShortINR, formatPercent } from "../../../utils/formatters";
import { useEquityStore, Benchmark } from "../../../store/equity.store";

interface Props {
  summary: {
    totalCurrentValue: number;
    totalGainLoss: number;
    totalGainPct: number;
    xirr: number;
    todayChange: number;
    todayChangePct: number;
    benchmarkReturn: number;
    alpha: number;
    beatBenchmark: boolean;
  };
  totalStocks: number;
  totalCompanies: number;
}

const EquityCommandBanner: React.FC<Props> = ({ summary, totalStocks, totalCompanies }) => {
  const { activeBenchmark, setActiveBenchmark, setShowAddModal } = useEquityStore();

  const BENCHMARKS: { id: Benchmark; label: string }[] = [
    { id: "NIFTY50", label: "NIFTY 50" },
    { id: "SENSEX", label: "SENSEX" },
    { id: "NIFTY500", label: "NIFTY 500" },
    { id: "NIFTYMIDCAP", label: "Midcap" },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Equity Portfolio</h1>
          <p className="text-indigo-100 text-sm opacity-90">
            {totalStocks} stocks · {totalCompanies} companies ·{" "}
            {formatShortINR(summary.totalCurrentValue)} value
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 border border-white/40 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            <Plus size={18} />
            Add Stock
          </button>
          <button className="flex items-center gap-2 border border-white/40 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors">
            <RefreshCw size={16} />
            Sync
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100/70">
            Total Value
          </span>
          <span className="text-lg font-bold">{formatShortINR(summary.totalCurrentValue)}</span>
        </div>
        <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100/70">
            Total Gain
          </span>
          <span className="text-lg font-bold">
            +{formatShortINR(summary.totalGainLoss)}
            <span className="text-sm font-medium ml-1.5">
              {formatPercent(summary.totalGainPct)}
            </span>
          </span>
        </div>
        <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100/70">
            XIRR
          </span>
          <span className="text-lg font-bold">{summary.xirr.toFixed(1)}%</span>
        </div>
        <div
          className={`border rounded-xl px-4 py-2 flex flex-col ${summary.beatBenchmark ? "bg-emerald-500/30 border-emerald-300/40" : "bg-white/15 border-white/25"}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100/70">
            Performance
          </span>
          <span className="text-lg font-bold flex items-center gap-1.5">
            Beat {activeBenchmark === "none" ? "Market" : activeBenchmark}{" "}
            {summary.beatBenchmark ? "↑" : "↓"}
          </span>
        </div>
        <div
          className={`bg-white/15 border border-white/25 rounded-xl px-4 py-2 flex flex-col ${summary.todayChange >= 0 ? "text-white" : "text-red-100"}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100/70">
            Today
          </span>
          <span className="text-lg font-bold flex items-center gap-1.5">
            {summary.todayChange >= 0 ? (
              <TrendingUp size={16} className="text-emerald-300" />
            ) : (
              <TrendingDown size={16} className="text-red-300" />
            )}
            {summary.todayChange >= 0 ? "+" : ""}
            {formatINR(summary.todayChange)}
            <span className="text-sm font-medium">({formatPercent(summary.todayChangePct)})</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs text-indigo-100/70">
        <div className="flex items-center gap-4">
          <span>vs {activeBenchmark === "none" ? "Market" : activeBenchmark} (1Y):</span>
          <span className="text-white font-medium">Portfolio +31.5%</span>
          <span className="text-white font-medium">
            {activeBenchmark} {formatPercent(summary.benchmarkReturn)}
          </span>
          <span className="flex items-center gap-1">
            Alpha <span className="text-white font-bold">+{summary.alpha.toFixed(1)}%</span> ↑
          </span>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          {BENCHMARKS.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBenchmark(b.id)}
              className={`px-2 py-0.5 rounded transition-colors ${activeBenchmark === b.id ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/10 text-white"}`}
            >
              {b.label}
              {activeBenchmark === b.id ? " ✓" : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EquityCommandBanner);
