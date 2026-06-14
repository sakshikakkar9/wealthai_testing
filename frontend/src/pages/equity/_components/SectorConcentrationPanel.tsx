import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import SectorHeatmap from "../../dashboard/_components/SectorHeatmap";
import { useEquityStore } from "../../../store/equity.store";

interface Props {
  holdings: any[];
}

const SectorConcentrationPanel: React.FC<Props> = ({ holdings }) => {
  const { setSectorFilter } = useEquityStore();

  const sectorWeights = holdings.reduce((acc: any, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.weight;
    return acc;
  }, {});

  const heatmapData = Object.entries(sectorWeights).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  return (
    <WidgetCard
      title="Sector Exposure"
      subtitle="Equity allocation"
      action={
        <button className="text-[10px] font-bold text-indigo-600 hover:underline">
          Rebalance →
        </button>
      }
    >
      <div className="h-48 mb-6">
        <SectorHeatmap data={heatmapData} onSectorClick={(sector) => setSectorFilter(sector)} />
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 text-xs py-1 items-start">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <span className="text-slate-600">
            <span className="font-bold text-slate-900">IT overweight:</span> 28% vs NIFTY 50
            benchmark 15.4% (+12.6%)
          </span>
        </div>
        <div className="flex gap-2 text-xs py-1 items-start">
          <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-slate-600">
            <span className="font-bold text-slate-900">Banking within range:</span> 22% vs benchmark
            27%
          </span>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(SectorConcentrationPanel);
