import React from "react";

interface OverlapHeatmapChartProps {
  funds: { id: string; shortName: string }[];
  matrix: Record<string, Record<string, number>>;
}

const OverlapHeatmapChart: React.FC<OverlapHeatmapChartProps> = ({ funds, matrix }) => {
  const getColorClass = (value: number) => {
    if (value === 0) return "bg-slate-50 text-slate-400";
    if (value <= 20) return "bg-emerald-100 text-emerald-700";
    if (value <= 40) return "bg-amber-100 text-amber-700";
    if (value <= 60) return "bg-orange-200 text-orange-800";
    if (value < 100) return "bg-red-200 text-red-800";
    return "bg-slate-200 text-slate-500"; // 100%
  };

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-1 min-w-[500px]"
        style={{
          gridTemplateColumns: `100px repeat(${funds.length}, 1fr)`,
        } as any}
      >
        {/* Header row */}
        <div className="h-10"></div>
        {funds.map((f) => (
          <div
            key={f.id}
            className="h-10 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center px-1"
          >
            {f.shortName}
          </div>
        ))}

        {/* Data rows */}
        {funds.map((rowFund) => (
          <React.Fragment key={rowFund.id}>
            <div className="h-12 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider pr-2">
              {rowFund.shortName}
            </div>
            {funds.map((colFund) => {
              const value = matrix[rowFund.id]?.[colFund.id] ?? 0;
              return (
                <div
                  key={`${rowFund.id}-${colFund.id}`}
                  className={`h-12 rounded flex flex-col items-center justify-center transition-colors ${getColorClass(value)}`}
                >
                  <span className="text-sm font-bold">{value}%</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">0-20% Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">21-40% Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">41-60% High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">61%+ Redundant</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverlapHeatmapChart);
