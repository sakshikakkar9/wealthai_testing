import React from "react";
import { Badge } from "../ui/badge";
import { formatINR, formatPercent } from "../../utils/formatters";
import { Progress } from "../ui/progress";

interface GoalSummary {
  goal: string;
  currentValue: number;
  targetValue: number;
  color: string;
}

interface Props {
  summaries: GoalSummary[];
  activeGoal: string | null;
  onSelectGoal: (goal: string | null) => void;
}

const GoalFilterBar: React.FC<Props> = ({ summaries, activeGoal, onSelectGoal }) => {
  const goals = ["Retirement", "Education", "Emergency", "Growth", "Dividend"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectGoal(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            activeGoal === null
              ? "bg-slate-900 text-white border-slate-900 shadow-md"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          All Assets
        </button>
        {goals.map((goal) => (
          <button
            key={goal}
            onClick={() => onSelectGoal(goal)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeGoal === goal
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaries.map((s) => {
          const progress = Math.min((s.currentValue / s.targetValue) * 100, 100);
          return (
            <div
              key={s.goal}
              className={`p-4 rounded-2xl border transition-all ${
                activeGoal === s.goal
                  ? "bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-100"
                  : "bg-white/50 border-slate-100 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {s.goal}
                </span>
                <Badge variant="outline" className="text-[9px] font-bold">
                  {progress.toFixed(0)}%
                </Badge>
              </div>
              <div className="text-lg font-bold text-slate-900 mb-1">
                {formatINR(s.currentValue)}
              </div>
              <div className="text-[10px] text-slate-500 mb-3">
                Target: {formatINR(s.targetValue)}
              </div>
              <Progress
                value={progress}
                className="h-1.5"
                //@ts-ignore - Custom color logic if supported by UI
                indicatorClassName={s.color}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalFilterBar;
