import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TooltipProps } from "recharts";
import { formatINR } from "../../utils/formatters";

export interface AccrualData {
  month: string;
  accrued: number;
  tds: number;
}

interface InterestAccrualAreaChartProps {
  data: AccrualData[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const accrued = Number(payload.find((p) => p.dataKey === "accrued")?.value) || 0;
    const tds = Number(payload.find((p) => p.dataKey === "tds")?.value) || 0;
    const net = accrued - tds;

    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Accrued Interest</span>
            <span className="font-bold text-amber-600">{formatINR(accrued)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">TDS Deduction</span>
            <span className="font-bold text-red-500">-{formatINR(tds)}</span>
          </div>
          <div className="pt-1 border-t border-slate-50 flex justify-between gap-4 mt-1">
            <span className="font-bold text-slate-700">Net Accrued</span>
            <span className="font-bold text-emerald-600">{formatINR(net)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const InterestAccrualAreaChart: React.FC<InterestAccrualAreaChartProps> = ({ data, height }) => {
  return (
    <ResponsiveContainer width="100%" height={height ?? 200}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAccrued" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D97706" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#94A3B8" }}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="accrued"
          stroke="#D97706"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorAccrued)"
        />
        <Area type="monotone" dataKey="tds" stroke="none" fill="#EF4444" fillOpacity={0.4} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default React.memo(InterestAccrualAreaChart);
