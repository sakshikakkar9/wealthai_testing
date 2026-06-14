import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import { Bond, BondType } from "../../pages/bonds/_data/bonds.data";
import { formatShortINR } from "../../utils/formatters";
import WidgetCard from "../common/WidgetCard";

interface Props {
  bonds: Bond[];
  height?: number;
  onTypeClick?: (type: BondType) => void;
}

const TYPE_COLORS: Record<string, string> = {
  Govt: "#4f46e5",
  Corporate: "#0891b2",
  SDL: "#059669",
  SGB: "#d97706",
  "T-Bill": "#7c3aed",
};

const BondAllocationDonut: React.FC<Props> = ({ bonds, height = 280, onTypeClick }) => {
  const { data, totalValue } = useMemo(() => {
    const totals: Record<string, number> = {};
    let total = 0;

    bonds.forEach((bond) => {
      totals[bond.bond_type] = (totals[bond.bond_type] || 0) + bond.current_value;
      total += bond.current_value;
    });

    const chartData = Object.entries(totals)
      .map(([name, value]) => ({
        name: name as BondType,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        color: TYPE_COLORS[name] || "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);

    return { data: chartData, totalValue: total };
  }, [bonds]);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-xs font-bold text-slate-800 mb-1">{data.name}</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">{formatShortINR(data.value)}</span>
            <span className="font-semibold text-indigo-600">{data.percentage.toFixed(1)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <WidgetCard title="Allocation by Type" subtitle="By current value">
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full h-[var(--chart-height)] [--chart-height:280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={height * 0.25}
                outerRadius={height * 0.35}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                onClick={(data) => onTypeClick?.(data.name)}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total
            </span>
            <span className="text-xl font-bold text-slate-900">{formatShortINR(totalValue)}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
          {data.map((item) => (
            <button
              key={item.name}
              onClick={() => onTypeClick?.(item.name)}
              className="flex items-center gap-1.5 hover:opacity-75 transition-opacity"
            >
              <div
                className="w-2 h-2 rounded-full bg-[var(--item-color)]"
                style={{ "--item-color": item.color } as React.CSSProperties}
              />
              <span className="text-[11px] text-slate-500 font-medium">
                {item.name}:{" "}
                <span className="text-slate-700 font-bold">{item.percentage.toFixed(0)}%</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(BondAllocationDonut);
