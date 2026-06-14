import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { TooltipProps } from "recharts";
import { formatINR, formatShortINR } from "../../utils/formatters";

export interface IncomeProjectionData {
  month: string;
  principal_maturity: number;
  interest_payout: number;
  fd_ids: string[];
  event: "maturity" | "payout";
}

interface IncomeProjectionBarChartProps {
  data: IncomeProjectionData[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as IncomeProjectionData;
    const total = data.principal_maturity + data.interest_payout;

    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1">
          {data.principal_maturity > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-500">Principal Maturity</span>
              <span className="text-[10px] font-bold text-indigo-600">
                {formatINR(data.principal_maturity)}
              </span>
            </div>
          )}
          {data.interest_payout > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-500">Interest Payout</span>
              <span className="text-[10px] font-bold text-amber-600">
                {formatINR(data.interest_payout)}
              </span>
            </div>
          )}
          <div className="pt-1 border-t border-slate-50 flex items-center justify-between gap-4 mt-1">
            <span className="text-[10px] font-bold text-slate-700">Total Inflow</span>
            <span className="text-[10px] font-bold text-slate-900">{formatINR(total)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const IncomeProjectionBarChart: React.FC<IncomeProjectionBarChartProps> = ({ data, height }) => {
  return (
    <ResponsiveContainer width="100%" height={height ?? 260}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          dy={10}
        />
        <YAxis
          hide
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#94A3B8" }}
          tickFormatter={(val) => formatShortINR(val)}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
        <Bar
          dataKey="interest_payout"
          stackId="a"
          fill="#D97706"
          barSize={16}
          radius={data.every((d) => d.principal_maturity === 0) ? [4, 4, 0, 0] : [0, 0, 0, 0]}
        />
        <Bar
          dataKey="principal_maturity"
          stackId="a"
          fill="#6366F1"
          barSize={16}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(IncomeProjectionBarChart);
