import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { formatShortINR } from "../../utils/formatters";

interface Props {
  data: { month: string; dividends: number; interest: number; other: number }[];
  height?: number;
}

const StackedIncomeChart: React.FC<Props> = ({ data, height = 240 }) => {
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0);
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-xs text-slate-400 capitalize">{entry.name}:</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {formatShortINR(entry.value as number)}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-700">Total:</span>
            <span className="text-xs font-bold text-emerald-600">{formatShortINR(total)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
          <Bar name="dividends" dataKey="dividends" stackId="a" fill="#10B981" barSize={18} />
          <Bar name="interest" dataKey="interest" stackId="a" fill="#F59E0B" barSize={18} />
          <Bar
            name="other"
            dataKey="other"
            stackId="a"
            fill="#8B5CF6"
            barSize={18}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(StackedIncomeChart);
