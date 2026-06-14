import { Holding } from "../../../api/mf.api";
import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import OverlapHeatmapChart from "../../../components/charts/OverlapHeatmapChart";

const OverlapHeatmapCard = ({ funds }: { funds: Holding[] }) => {
  const equityFunds = funds.filter((f) => f.category !== "debt");
  const matrix: Record<string, Record<string, number>> = {
    mf1: { mf1: 100, mf2: 18, mf4: 42, mf5: 38 },
    mf2: { mf1: 18, mf2: 100, mf4: 12, mf5: 22 },
    mf4: { mf1: 42, mf2: 12, mf4: 100, mf5: 48 },
    mf5: { mf1: 38, mf2: 22, mf4: 48, mf5: 100 },
  };

  return (
    <WidgetCard
      title="Portfolio Overlap Analysis"
      subtitle="How much do your funds share the same stocks?"
    >
      <div className="mb-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Select funds to compare
        </div>
        <div className="flex flex-wrap gap-2">
          {equityFunds.map((f) => (
            <button
              key={f.id}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
            >
              <CheckCircle2 size={12} />
              {f.scheme_name}
            </button>
          ))}
        </div>
      </div>

      <OverlapHeatmapChart
        funds={(equityFunds || []).map((f) => ({ id: f.id, shortName: f.scheme_name }))}
        matrix={matrix}
      />

      <div className="mt-6 space-y-3">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium leading-relaxed">
            <span className="font-bold uppercase">High overlap:</span> SBI Nifty Index and Axis
            Bluechip share 48% holdings. Both hold large HDFC Bank, Infosys, and TCS positions —
            consider switching one to reduce redundancy.
          </p>
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            PPFAS and debt funds have 0% overlap — providing excellent diversification to your
            equity core.
          </p>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(OverlapHeatmapCard);
