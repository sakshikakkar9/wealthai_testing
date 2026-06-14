import React from "react";

interface FiftyTwoWeekBarProps {
  low: number;
  high: number;
  current: number;
  position52w: number;
}

const FiftyTwoWeekBar: React.FC<FiftyTwoWeekBarProps> = ({ low, high, current, position52w }) => {
  const isNearHigh = position52w > 80;
  const isNearLow = position52w < 20;

  const barColor = isNearHigh ? "bg-emerald-500" : isNearLow ? "bg-red-500" : "bg-indigo-600";

  return (
    <div className="w-full space-y-1">
      <div className="h-1.5 w-full bg-slate-100 rounded-full relative">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${position52w}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white bg-slate-800 shadow-sm transition-all duration-1000"
          style={{ left: `${position52w}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <span>₹{low.toLocaleString("en-IN")}</span>
        <span className="text-slate-900 font-bold">₹{current.toLocaleString("en-IN")}</span>
        <span>₹{high.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
};

export default React.memo(FiftyTwoWeekBar);
