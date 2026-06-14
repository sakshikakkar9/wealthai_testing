import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  data: number[];
  color?: string;
  positive?: boolean;
}

const SparklineChart: React.FC<Props> = ({ data, color, positive = true }) => {
  const chartData = data.map((val, idx) => ({ value: val, id: idx }));

  // Default colors based on positive/negative
  const strokeColor = color || (positive ? "#10B981" : "#EF4444");

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            fillOpacity={1}
            fill={`url(#gradient-${strokeColor})`}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(SparklineChart);
