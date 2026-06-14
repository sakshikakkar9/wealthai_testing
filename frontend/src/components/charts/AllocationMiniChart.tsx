import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface Slice {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: Slice[];
  size?: number;
}

export default function AllocationMiniChart({ data, size = 64 }: Props) {
  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="100%"
            paddingAngle={1}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((s) => (
              <Cell key={s.name} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
