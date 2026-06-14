import React from "react";
import { formatShortINR } from "../../../utils/formatters";

interface Goal {
  name: string;
  percent: number;
  saved: number;
  target: number;
  color: string;
  targetYear: number;
}

interface Props {
  goals: Goal[];
}

const GoalRings: React.FC<Props> = ({ goals }) => {
  const colorMap: Record<string, string> = {
    indigo: "#6366F1",
    emerald: "#10B981",
    amber: "#F59E0B",
  };

  const bgColorMap: Record<string, string> = {
    indigo: "bg-indigo-100",
    emerald: "bg-emerald-100",
    amber: "bg-amber-100",
  };

  const progressColorMap: Record<string, string> = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };

  const ringGlowMap: Record<string, string> = {
    indigo: "ring-indigo-200",
    emerald: "ring-emerald-200",
    amber: "ring-amber-200",
  };

  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.name} className="flex gap-4 group cursor-pointer">
          {/* Goal Ring */}
          <div
            className={`
              w-14 h-14 rounded-full shrink-0 flex items-center justify-center relative
              transition-all duration-200 group-hover:ring-2 group-hover:ring-offset-2 ${ringGlowMap[goal.color]}
            `}
            style={{
              background: `conic-gradient(${colorMap[goal.color]} ${goal.percent}%, #f1f5f9 0%)`,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner">
              <span className="text-[10px] font-bold text-slate-700">{goal.percent}%</span>
            </div>
          </div>

          {/* Goal Info */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">{goal.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Target: {formatShortINR(goal.target)} by {goal.targetYear}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-700">
                  {formatShortINR(goal.saved)} saved
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`h-1.5 w-full rounded-full ${bgColorMap[goal.color]}`}>
              <div
                className={`h-full rounded-full ${progressColorMap[goal.color]}`}
                style={{ width: `${goal.percent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalRings;
