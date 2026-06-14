import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import BenchmarkAreaChart from "../../../components/charts/BenchmarkAreaChart";
import { useEquityStore, Benchmark } from "../../../store/equity.store";

interface Props {
  portfolioData: { date: string; portfolio: number; nifty: number }[];
  summary: {
    totalGainPct: number;
    benchmarkReturn: number;
    alpha: number;
    totalCurrentValue: number;
  };
}

const BenchmarkComparisonCard: React.FC<Props> = ({ portfolioData, summary }) => {
  const { activeBenchmark, setActiveBenchmark } = useEquityStore();

  const BENCHMARKS: { id: Benchmark; label: string }[] = [
    { id: "NIFTY50", label: "NIFTY 50" },
    { id: "SENSEX", label: "SENSEX" },
    { id: "NIFTY500", label: "NIFTY 500" },
  ];

  return (
    <WidgetCard
      title="Portfolio vs Benchmark"
      subtitle="Indexed to 100 · 12 months"
      action={
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {BENCHMARKS.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBenchmark(b.id)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeBenchmark === b.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-6 flex gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Portfolio
          </span>
          <span className="text-lg font-bold text-indigo-600">
            +{summary.totalGainPct.toFixed(1)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {activeBenchmark}
          </span>
          <span className="text-lg font-bold text-emerald-600">
            +{summary.benchmarkReturn.toFixed(1)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Alpha
          </span>
          <span className="text-lg font-bold text-slate-900">+{summary.alpha.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Peak Value
          </span>
          <span className="text-lg font-bold text-slate-900">₹72.4L</span>
        </div>
      </div>

      <BenchmarkAreaChart portfolioData={portfolioData} benchmark={activeBenchmark} />
    </WidgetCard>
  );
};

export default React.memo(BenchmarkComparisonCard);
