import React from "react";
import { AreaChart, Area, ResponsiveContainer, Definitions, LinearGradient } from "recharts";

interface Props {
  data: number[]; // sync success counts per hour, last 24h
  color?: string; // default indigo
}

const SyncActivitySparkline: React.FC<Props> = ({ data, color = "#4f46e5" }) => {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className="w-full h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
            fill="url(#colorValue)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(SyncActivitySparkline);
