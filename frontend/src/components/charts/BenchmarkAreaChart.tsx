import React, { useMemo } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceDot,
} from "recharts";
import { formatPercent } from "../../utils/formatters";

interface BenchmarkAreaChartProps {
  portfolioData: { date: string; portfolio: number; nifty: number }[];
  benchmark: string;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const portfolio = payload.find((p: any) => p.dataKey === "portfolio")?.value;
    const nifty = payload.find((p: any) => p.dataKey === "nifty")?.value;
    const alpha = portfolio - nifty;

    return (
      <div className="bg-white p-4 border border-slate-100 shadow-sm rounded-xl">
        <p className="text-xs font-bold text-slate-500 uppercase mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-8">
            <span className="text-sm text-slate-600">Portfolio</span>
            <span className="text-sm font-bold text-slate-900">
              {portfolio.toFixed(1)} ({formatPercent(portfolio - 100)})
            </span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-sm text-slate-600">NIFTY 50</span>
            <span className="text-sm font-bold text-slate-900">
              {nifty.toFixed(1)} ({formatPercent(nifty - 100)})
            </span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-50 flex justify-between gap-8">
            <span className="text-sm font-medium text-slate-600">Alpha</span>
            <span
              className={`text-sm font-bold ${alpha >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {alpha >= 0 ? "+" : ""}
              {alpha.toFixed(1)}% {alpha >= 0 ? "beating ↑" : "trailing ↓"}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const BenchmarkAreaChart: React.FC<BenchmarkAreaChartProps> = ({
  portfolioData = [],
  benchmark,
  height = 300,
}) => {
  const chartData = useMemo(() => {
    if (!portfolioData) return [];
    return portfolioData.map((d) => ({
      ...d,
      // Range for alpha shading: only when portfolio > nifty
      alphaRange: d.portfolio > d.nifty ? [d.nifty, d.portfolio] : [d.nifty, d.nifty],
    }));
  }, [portfolioData]);

  const maxVal = useMemo(
    () => (portfolioData.length > 0 ? Math.max(...portfolioData.map((d) => d.portfolio)) : 0),
    [portfolioData],
  );
  const minVal = useMemo(
    () => (portfolioData.length > 0 ? Math.min(...portfolioData.map((d) => d.portfolio)) : 0),
    [portfolioData],
  );

  const maxPoint = portfolioData.find((d) => d.portfolio === maxVal);
  const minPoint = portfolioData.find((d) => d.portfolio === minVal);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 500 }}
          dy={10}
        />
        <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
        <Tooltip content={<CustomTooltip />} />

        {/* Alpha shading where portfolio > nifty */}
        <Area
          type="monotone"
          dataKey="alphaRange"
          stroke="none"
          fill="url(#colorAlpha)"
          connectNulls
          animationDuration={1500}
        />

        <Area
          type="monotone"
          dataKey="nifty"
          stroke="#10B981"
          strokeWidth={2}
          strokeDasharray="6 3"
          fill="none"
          animationDuration={1500}
        />

        <Area
          type="monotone"
          dataKey="portfolio"
          stroke="#6366F1"
          strokeWidth={2.5}
          fill="url(#colorPortfolio)"
          animationDuration={1500}
        />

        {maxPoint && (
          <ReferenceDot
            x={maxPoint.date}
            y={maxPoint.portfolio}
            r={4}
            fill="#6366F1"
            stroke="#fff"
            strokeWidth={2}
          />
        )}
        {minPoint && (
          <ReferenceDot
            x={minPoint.date}
            y={minPoint.portfolio}
            r={4}
            fill="#94A3B8"
            stroke="#fff"
            strokeWidth={2}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BenchmarkAreaChart);
