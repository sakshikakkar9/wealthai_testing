import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { formatINR, formatShortINR } from "../../utils/formatters";

interface CashflowTimelineChartProps {
  data: { month: string; inflow: number; outflow: number; net: number }[];
  height?: number;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  payload: {
    month: string;
    inflow: number;
    outflow: number;
    net: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const inflow = payload.find((p) => p.dataKey === "inflow")?.value || 0;
    const outflow = payload.find((p) => p.dataKey === "outflow")?.value || 0;
    const net = payload.find((p) => p.dataKey === "net")?.value || 0;

    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-slate-500">Total Inflow</span>
            <span className="text-sm font-bold text-emerald-600">{formatINR(inflow)}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <span className="text-xs text-slate-500">Total Outflow</span>
            <span className="text-sm font-bold text-red-600">{formatINR(Math.abs(outflow))}</span>
          </div>
          <div className="pt-1.5 mt-1.5 border-t border-slate-50 flex items-center justify-between gap-8">
            <span className="text-xs font-bold text-slate-700">Net Cashflow</span>
            <span className={`text-sm font-bold ${net >= 0 ? "text-indigo-600" : "text-red-600"}`}>
              {formatINR(net)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CashflowTimelineChart: React.FC<CashflowTimelineChartProps> = ({ data, height = 260 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
        <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
        <Bar dataKey="inflow" fill="#10B981" barSize={14} radius={[4, 4, 0, 0]} />
        <Bar dataKey="outflow" fill="#EF4444" barSize={14} radius={[0, 0, 4, 4]} />
        <Line
          type="monotone"
          dataKey="net"
          stroke="#6366F1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(CashflowTimelineChart);
