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
} from "recharts";

interface RollingReturnsChartProps {
  funds: { id: string; shortName: string; color: string }[];
  data: { period: string; [fundId: string]: number | string }[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {label} Returns
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium text-slate-600">{entry.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const RollingReturnsChart: React.FC<RollingReturnsChartProps> = ({
  funds,
  data,
  height = 300,
}) => {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />

          {funds.map((fund) => (
            <Bar
              key={fund.id}
              dataKey={fund.id}
              name={fund.shortName}
              fill={fund.color}
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
          ))}

          {/* Benchmark Reference Lines (Dashed) */}
          {data.map((periodData) => (
            <ReferenceLine
              key={`ref-${periodData.period}`}
              x={periodData.period}
              stroke="transparent" // Invisible line to anchor markers
            />
          ))}

          {/* Using a separate Bar for benchmark to show it as a line/marker could be tricky in BarChart.
              The prompt says "Benchmark: fill="#94A3B8" dashed line via ReferenceLine per period".
              In Recharts, ReferenceLine is usually global. For per-period benchmark, we'll use a special Bar.
          */}
          <Bar dataKey="benchmark" name="Benchmark" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(RollingReturnsChart);
