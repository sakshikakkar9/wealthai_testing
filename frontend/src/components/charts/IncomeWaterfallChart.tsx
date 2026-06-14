import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatINR } from "../../utils/formatters";

interface IncomeWaterfallChartProps {
  data: {
    month: string;
    dividends: number;
    interest: number;
    sip_returns: number;
    other: number;
  }[];
  height?: number;
}

interface TooltipPayload {
  dataKey: string;
  name: string;
  value: number;
  color: string;
  payload: {
    month: string;
    dividends: number;
    interest: number;
    sip_returns: number;
    other: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry) => sum + entry.value, 0);

    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-slate-500">{entry.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-700">{formatINR(entry.value)}</span>
            </div>
          ))}
          <div className="pt-1.5 mt-1.5 border-t border-slate-50 flex items-center justify-between gap-8">
            <span className="text-xs font-bold text-slate-700">Total Income</span>
            <span className="text-sm font-bold text-emerald-600">{formatINR(total)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const IncomeWaterfallChart: React.FC<IncomeWaterfallChartProps> = ({ data, height = 260 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
          dy={10}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="dividends" name="Dividends" stackId="a" fill="#10B981" barSize={20} />
        <Bar dataKey="interest" name="Interest" stackId="a" fill="#F59E0B" barSize={20} />
        <Bar dataKey="sip_returns" name="SGB/Coupon" stackId="a" fill="#8B5CF6" barSize={20} />
        <Bar dataKey="other" name="Other" stackId="a" fill="#94A3B8" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(IncomeWaterfallChart);
