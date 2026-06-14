import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatShortINR } from "../../utils/formatters";

interface PnLData {
  month: string;
  unrealized: number;
  realized: number;
}

interface Props {
  data: PnLData[];
}

const PnLSplitChart: React.FC<Props> = ({ data }) => {
  const totalUnrealized = data[data.length - 1]?.unrealized || 0;
  const totalRealized = data[data.length - 1]?.realized || 0;
  const totalPnL = totalUnrealized + totalRealized;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">P&L Split</h3>
          <p className="text-xs text-slate-400 font-medium">Unrealized vs Realized over time</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Unrealized
          </p>
          <p className="text-lg font-bold text-indigo-600">{formatShortINR(totalUnrealized)}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Realized
          </p>
          <p className="text-lg font-bold text-emerald-600">{formatShortINR(totalRealized)}</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
            Total P&L
          </p>
          <p className="text-lg font-bold text-indigo-900">{formatShortINR(totalPnL)}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(val) => formatShortINR(val)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [formatShortINR(value), ""]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: "20px",
                fontSize: "10px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            />
            <Bar
              dataKey="unrealized"
              name="Unrealized"
              stackId="a"
              fill="#4f46e5"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="realized"
              name="Realized"
              stackId="a"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PnLSplitChart;
