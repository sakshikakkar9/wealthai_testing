import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
// 1. Changed back to a default import based on your build error
import SparklineChart from "../charts/SparklineChart";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  changeLabel: string;
  icon: LucideIcon;
  accentColor: "indigo" | "emerald" | "amber" | "red";
  sparklineData: number[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  changeLabel,
  icon: Icon, // Icon is scoped inside this function block
  accentColor,
  sparklineData,
}) => {
  const accentClasses = {
    indigo: "border-indigo-500 text-indigo-600 bg-indigo-50",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
    amber: "border-amber-500 text-amber-600 bg-amber-50",
    red: "border-red-500 text-red-600 bg-red-50",
  };

  const changeClasses = {
    positive: "text-emerald-500",
    negative: "text-red-500",
    neutral: "text-slate-400",
  };

  const TrendIcon = changeType === "positive" ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 relative overflow-hidden border-l-4 group">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${accentClasses[accentColor].split(" ")[0]}`}
      />

      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          {title}
        </span>
        <div
          className={`p-2 rounded-full ${accentClasses[accentColor].split(" ").slice(2).join(" ")}`}
        >
          <Icon size={20} className={accentClasses[accentColor].split(" ")[1]} />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium flex items-center gap-0.5 ${changeClasses[changeType]}`}
          >
            {changeType !== "neutral" && <TrendIcon size={14} />}
            {change}
          </span>
          <span className="text-xs text-slate-400">{changeLabel}</span>
        </div>
      </div>

      <div className="mt-4 h-[40px] -mx-5 -mb-5">
        <SparklineChart data={sparklineData} positive={changeType === "positive"} />
      </div>
    </div>
  );
};

export default React.memo(StatCard);