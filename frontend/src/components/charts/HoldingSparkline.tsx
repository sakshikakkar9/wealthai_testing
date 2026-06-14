import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  data: number[];
  positive?: boolean;
}

const HoldingSparkline: React.FC<Props> = ({ data, positive = true }) => {
  const chartData = data.map((value, index) => ({ value, index }));
  const color = positive ? "#10B981" : "#EF4444";
  const gradientId = `sparkline-gradient-${positive ? "emerald" : "red"}`;

  return (
    <div className="w-10 h-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(HoldingSparkline);
