import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { formatShortINR } from "../../utils/formatters";

interface Props {
  // We make data optional using '?' so TypeScript knows it might be missing initially
  data?: { name: string; value: number; color: string }[];
  totalLabel?: string;
}

const DonutAllocationChart: React.FC<Props> = ({ data = [], totalLabel = "Total" }) => {
  // 1. SAFE REDUCE: By setting data = [] above, data will never be undefined here
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-slate-100 shadow-md rounded-lg">
          <p className="text-xs font-bold text-slate-900">
            {payload[0].name}: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  // 2. EARLY RETURN: If data is empty, show a clean message instead of an empty broken chart
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center text-slate-400 text-sm">
        No allocation data available
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-900 drop-shadow-sm">{total}%</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">{totalLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-slate-500 font-medium truncate flex-1">
              {item.name}
            </span>
            <span className="text-[10px] font-bold text-slate-700">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DonutAllocationChart);
