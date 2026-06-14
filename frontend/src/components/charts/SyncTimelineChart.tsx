import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Props {
  data: { hour: string; success: number; failed: number; partial: number }[];
  height?: number;
}

const SyncTimelineChart: React.FC<Props> = ({ data, height = 200 }) => {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
            interval={2}
          />
          <YAxis hide />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0);
                return (
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-xl text-xs">
                    <p className="font-bold text-slate-900 mb-2">{label}</p>
                    <div className="space-y-1">
                      {payload.map(
                        (entry: { color: string; name: string; value: number }, index: number) => (
                          <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-slate-500 capitalize">{entry.name}:</span>
                            </div>
                            <span className="font-bold text-slate-900">{entry.value}</span>
                          </div>
                        ),
                      )}
                      <div className="pt-1 mt-1 border-t border-slate-50 flex items-center justify-between gap-4">
                        <span className="text-slate-400 font-medium">Total:</span>
                        <span className="font-bold text-indigo-600">{total}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="success"
            name="success"
            stackId="a"
            fill="#10B981"
            radius={[0, 0, 0, 0]}
            barSize={16}
          />
          <Bar
            dataKey="partial"
            name="partial"
            stackId="a"
            fill="#F59E0B"
            radius={[0, 0, 0, 0]}
            barSize={16}
          />
          <Bar
            dataKey="failed"
            name="failed"
            stackId="a"
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
          <ReferenceLine
            x="10:00" // Assuming 'Now' is around here based on data
            stroke="#6366f1"
            strokeDasharray="3 3"
            label={{
              value: "Now",
              position: "top",
              fill: "#6366f1",
              fontSize: 10,
              fontWeight: "bold",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(SyncTimelineChart);
