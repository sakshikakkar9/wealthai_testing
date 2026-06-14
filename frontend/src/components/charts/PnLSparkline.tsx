import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface Props {
  data: number[];
  isPositive: boolean;
  height?: number;
}

export default function PnLSparkline({ data, isPositive, height = 40 }: Props) {
  const series = data.map((v, i) => ({ i, v }));
  const color = isPositive ? "#10B981" : "#EF4444";
  const id = `pnlspark-${isPositive ? "g" : "r"}-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
