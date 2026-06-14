import React from "react";
import { formatINR } from "../../utils/formatters";
import { Card } from "../ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";

interface HoldingBreakdown {
  symbol: string;
  period: number;
  gain: number;
  type: "STCG" | "LTCG";
  tax: number;
}

interface Suggestion {
  symbol: string;
  suggestedAction: string;
  potentialSaving: number;
}

interface Props {
  summary: {
    stcg: number;
    ltcg: number;
    total: number;
  };
  breakdown: HoldingBreakdown[];
  suggestions: Suggestion[];
}

const TaxEstimatorPanel: React.FC<Props> = ({ summary, breakdown, suggestions }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Tax Estimator (FY 25-26)</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
          Mock Estimate
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            STCG Tax (20%)
          </p>
          <p className="text-lg font-bold text-slate-800">{formatINR(summary.stcg)}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            LTCG Tax (12.5%)
          </p>
          <p className="text-lg font-bold text-slate-800">{formatINR(summary.ltcg)}</p>
        </div>
        <div className="p-3 bg-indigo-600 rounded-xl">
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">
            Total Est. Tax
          </p>
          <p className="text-lg font-bold text-white">{formatINR(summary.total)}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Holding Breakdown
        </p>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {breakdown.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{item.symbol}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.type === "LTCG" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{item.period} days held</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-700">{formatINR(item.tax)}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated Tax</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-emerald-600" />
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              Tax-Loss Harvesting Suggestions
            </p>
          </div>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.symbol} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-emerald-900">{s.symbol}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">{s.suggestedAction}</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-white px-2 py-1 rounded-lg border border-emerald-100">
                  Save {formatINR(s.potentialSaving)}
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxEstimatorPanel;
