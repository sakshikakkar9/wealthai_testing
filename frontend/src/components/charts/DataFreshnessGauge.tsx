import React from "react";

interface Layer {
  label: string;
  freshness: number; // 0–100
  lastUpdate: string;
  color: string; // Tailwind class
}

interface Props {
  layers: Layer[];
}

const DataFreshnessGauge: React.FC<Props> = ({ layers }) => {
  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-5">
      {layers.map((layer, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{layer.label}</span>
            <span className="text-xs font-bold text-slate-900">{layer.freshness}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(layer.freshness)}`}
                style={{ width: `${layer.freshness}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap min-w-[70px] text-right">
              {layer.lastUpdate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(DataFreshnessGauge);
