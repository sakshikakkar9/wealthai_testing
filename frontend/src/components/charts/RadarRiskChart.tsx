import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface Props {
  currentData: { subject: string; value: number; fullMark: number }[];
  idealValue?: number; // default 50
}

const RadarRiskChart: React.FC<Props> = ({ currentData, idealValue = 50 }) => {
  // Add ideal benchmark data
  const data = currentData.map((item) => ({
    ...item,
    ideal: idealValue,
  }));

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: "#64748b", fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          <Radar
            name="Ideal"
            dataKey="ideal"
            stroke="#10B981"
            fill="none"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Radar
            name="Current"
            dataKey="value"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-medium text-slate-500">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full border border-emerald-500 border-dashed" />
          <span className="text-[10px] font-medium text-slate-500">Ideal</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RadarRiskChart);
