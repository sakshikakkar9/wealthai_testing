import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { formatShortINR } from "../../utils/formatters";

interface Props {
  data: { date: string; value: number }[];
  height?: number;
  color?: string; // default: '#6366F1'
}

const AreaPortfolioChart: React.FC<Props> = ({ data, height = 280, color = "#6366F1" }) => {
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length && payload[0].value !== undefined) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="text-xs text-slate-400 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-slate-900">{formatShortINR(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const minVal = useMemo(() => Math.min(...data.map((d) => d.value)), [data]);
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.value)), [data]);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            dy={10}
          />
          <YAxis hide domain={[minVal - 1000000, maxVal + 1000000]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorValue)"
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(AreaPortfolioChart);
