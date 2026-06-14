import React, { useMemo } from "react";

const ReturnsCalendar: React.FC = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Simplified dummy data generation for Mar-May 2026
  const generateReturns = (count: number) => {
    return Array.from({ length: count }, () => {
      const rand = Math.random();
      if (rand > 0.95) return 1.25; // > +1%
      if (rand > 0.6) return 0.45; // 0 to +1%
      if (rand > 0.55) return 0; // 0%
      if (rand > 0.2) return -0.35; // -1% to 0%
      return -1.15; // < -1%
    });
  };

  const MARCH_RETURNS = useMemo(() => [null, null, ...generateReturns(29)], []);
  const APRIL_RETURNS = useMemo(() => generateReturns(30), []);
  const MAY_RETURNS = useMemo(() => generateReturns(29), []);

  const getCellClasses = (val: number | null, index: number) => {
    const isWeekend = (index + 1) % 7 === 6 || (index + 1) % 7 === 0;
    if (isWeekend) return "bg-slate-50 text-slate-300";
    if (val === null) return "bg-transparent";
    if (val > 1) return "bg-emerald-500 text-white";
    if (val > 0) return "bg-emerald-100 text-emerald-800";
    if (val === 0) return "bg-slate-100 text-slate-400";
    if (val > -1) return "bg-red-100 text-red-700";
    return "bg-red-500 text-white";
  };

  const renderMonth = (name: string, returns: (number | null)[]) => (
    <div className="mb-4">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
        {name}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {returns.map((ret, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-md text-[10px] flex items-center justify-center font-medium transition-transform hover:scale-110 cursor-default ${getCellClasses(ret, i)}`}
            title={ret !== null ? `${ret}%` : ""}
          >
            {ret !== null && !((i + 1) % 7 === 6 || (i + 1) % 7 === 0)
              ? ret > 0
                ? "▲"
                : ret < 0
                  ? "▼"
                  : "•"
              : ""}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-[10px] font-bold text-slate-400 text-center uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[220px]">
        {renderMonth("March", MARCH_RETURNS)}
        {renderMonth("April", APRIL_RETURNS)}
        {renderMonth("May", MAY_RETURNS)}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500" />
          <div className="w-3 h-3 rounded bg-red-100" />
          <div className="w-3 h-3 rounded bg-slate-100" />
          <div className="w-3 h-3 rounded bg-emerald-100" />
          <div className="w-3 h-3 rounded bg-emerald-500" />
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Loss ← Returns → Gain</span>
      </div>
    </div>
  );
};

export default ReturnsCalendar;
