import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import { Bond } from "../../pages/bonds/_data/bonds.data";
import { formatShortINR } from "../../utils/formatters";
import WidgetCard from "../common/WidgetCard";
import { MaturityBucketLabel, getMaturityBucket, MATURITY_BUCKETS } from "../../utils/bondUtils";

interface Props {
  bonds: Bond[];
  height?: number;
  onBucketClick?: (bucket: MaturityBucketLabel) => void;
}

const BUCKET_COLORS = [
  "#f59e0b", // <6M
  "#f97316", // 6M-1Y
  "#6366f1", // 1-2Y
  "#4f46e5", // 2-3Y
  "#3730a3", // 3-5Y
  "#1e1b4b", // 5Y+
];

const MaturityLadderChart: React.FC<Props> = ({ bonds, height = 280, onBucketClick }) => {
  const chartData = useMemo(() => {
    const buckets = MATURITY_BUCKETS.map((b) => ({
      name: b.label,
      value: 0,
      bonds: [] as string[],
    }));

    bonds.forEach((bond) => {
      const bucketLabel = getMaturityBucket(bond.days_to_maturity);
      const bucket = buckets.find((b) => b.name === bucketLabel);
      if (bucket) {
        bucket.value += bond.invested_amount;
        bucket.bonds.push(bond.bond_name);
      }
    });

    return buckets;
  }, [bonds]);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl max-w-[200px]">
          <p className="text-xs font-bold text-slate-800 mb-2">{data.name} Maturity</p>
          <p className="text-xs text-indigo-600 font-bold mb-2">{formatShortINR(data.value)}</p>
          <div className="space-y-1">
            {data.bonds.map((name: string, i: number) => (
              <p key={i} className="text-[10px] text-slate-500 leading-tight">
                • {name}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <WidgetCard title="Maturity Ladder" subtitle="Principal due by year">
      <div className="w-full h-[var(--chart-height)] [--chart-height:280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              barSize={32}
              onClick={(data) => onBucketClick?.(data.name as MaturityBucketLabel)}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BUCKET_COLORS[index]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};

export default React.memo(MaturityLadderChart);
