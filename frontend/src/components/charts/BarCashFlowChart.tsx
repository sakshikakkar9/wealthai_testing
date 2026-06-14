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
  data: { month: string; income: number; expense: number }[];
  height?: number;
}

const BarCashFlowChart: React.FC<Props> = ({ data, height = 240 }) => {
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <span className="text-xs text-slate-400 capitalize">{entry.name}:</span>
              <span className="text-xs font-bold text-slate-900">
                {formatShortINR(entry.value as number)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
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
          <Bar name="income" dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar name="expense" dataKey="expense" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(BarCashFlowChart);
