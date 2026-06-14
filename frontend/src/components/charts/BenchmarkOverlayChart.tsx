import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { formatPercent } from "../../utils/formatters";

interface DataPoint {
  date: string;
  portfolio: number;
  nifty: number;
  sensex: number;
}

interface Props {
  data: DataPoint[];
}

const BenchmarkOverlayChart: React.FC<Props> = ({ data }) => {
  const [benchmark, setBenchmark] = useState<"nifty" | "sensex" | "both">("nifty");
  const [timeFilter, setTimeFilter] = useState("1Y");

  // Normalize data to start at 100
  const normalizedData = React.useMemo(() => {
    if (data.length === 0) return [];
    const first = data[0];
    return data.map((d) => ({
      ...d,
      portfolio: (d.portfolio / first.portfolio) * 100,
      nifty: (d.nifty / first.nifty) * 100,
      sensex: (d.sensex / first.sensex) * 100,
    }));
  }, [data]);

  const lastPoint = normalizedData[normalizedData.length - 1];
  const alpha =
    benchmark === "nifty"
      ? lastPoint?.portfolio - lastPoint?.nifty
      : lastPoint?.portfolio - lastPoint?.sensex;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-slate-800 text-lg">Benchmark Overlay</h3>
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${alpha >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
            >
              <TrendingUp size={10} className={alpha < 0 ? "rotate-180" : ""} />
              {alpha >= 0 ? "Beating" : "Underperforming"}{" "}
              {benchmark === "both" ? "Nifty" : benchmark.toUpperCase()} by{" "}
              {Math.abs(alpha).toFixed(1)}%
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Relative performance normalized to 100 at start
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["1M", "3M", "6M", "1Y", "3Y"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeFilter === f ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["nifty", "sensex", "both"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBenchmark(b)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${benchmark === b ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              domain={["auto", "auto"]}
              tickFormatter={(val) => val.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [value.toFixed(2), ""]}
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
            <Line
              type="monotone"
              dataKey="portfolio"
              name="My Portfolio"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            {(benchmark === "nifty" || benchmark === "both") && (
              <Line
                type="monotone"
                dataKey="nifty"
                name="Nifty 50"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            {(benchmark === "sensex" || benchmark === "both") && (
              <Line
                type="monotone"
                dataKey="sensex"
                name="Sensex"
                stroke="#cbd5e1"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BenchmarkOverlayChart;
