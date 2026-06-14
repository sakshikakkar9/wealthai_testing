import React, { useMemo } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";

interface Props {
  holdings: { weight: number; sector: string; name: string; ticker: string }[];
}

const DiversificationScore: React.FC<Props> = ({ holdings }) => {
  const scoreData = useMemo(() => {
    // Herfindahl-Hirschman Index (HHI) for portfolio concentration
    const hhi = holdings.reduce((sum, h) => sum + Math.pow(h.weight, 2), 0);
    const maxHHI = 10000; // single stock
    const minHHI = 10000 / holdings.length; // perfect equal weight (100/N)^2 * N = 10000/N
    const score = Math.round(100 - ((hhi - minHHI) / (maxHHI - minHHI)) * 100);

    const sectors = new Set(holdings.map((h) => h.sector));
    const topHoldings = [...holdings].sort((a, b) => b.weight - a.weight).slice(0, 2);

    let colorClass = "text-emerald-600";
    let bgClass = "bg-emerald-500";
    if (score < 60) {
      colorClass = "text-red-600";
      bgClass = "bg-red-500";
    } else if (score < 80) {
      colorClass = "text-amber-600";
      bgClass = "bg-amber-500";
    }

    return { score, colorClass, bgClass, sectorsCount: sectors.size, topHoldings };
  }, [holdings]);

  return (
    <WidgetCard title="Diversification Score">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-4xl font-bold ${scoreData.colorClass}`}>{scoreData.score}</span>
          <span className="text-slate-400 font-bold">/ 100</span>
          <span className="text-sm font-medium text-slate-500 ml-auto">Good diversification</span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-full rounded-full ${scoreData.bgClass} transition-all duration-1000`}
            style={{ width: `${scoreData.score}%` }}
          />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <CheckCircle size={14} className="text-emerald-500" />
            {scoreData.sectorsCount} sectors covered
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <CheckCircle size={14} className="text-emerald-500" />
            No single stock &gt; 20%
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            {holdings.reduce(
              (sum, h) => (h.sector === "IT" || h.sector === "Banking" ? sum + h.weight : sum),
              0,
            ) > 40 ? (
              <AlertTriangle size={14} className="text-amber-500" />
            ) : (
              <CheckCircle size={14} className="text-emerald-500" />
            )}
            IT + Banking ={" "}
            {Math.round(
              holdings.reduce(
                (sum, h) => (h.sector === "IT" || h.sector === "Banking" ? sum + h.weight : sum),
                0,
              ),
            )}
            % of equity
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <CheckCircle size={14} className="text-emerald-500" />
            All large cap (low volatility)
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Top Concentration
          </span>
          <div className="flex flex-wrap gap-2">
            {scoreData.topHoldings.map((h) => (
              <div
                key={h.ticker}
                className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100"
              >
                <span className="text-[10px] font-bold text-slate-700">{h.ticker}</span>
                <span className="text-[10px] font-bold text-indigo-600">
                  {h.weight.toFixed(1)}%
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
            ))}
            <span className="text-[10px] font-bold text-slate-400 self-center">...</span>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(DiversificationScore);
