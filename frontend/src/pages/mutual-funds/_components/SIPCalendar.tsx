import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";

const SIPCalendar = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Dummy calendar for June 2026
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const sipDays = [1, 5, 15]; // SIP dates from dummy data
  const pausedSipDays = [10];
  const today = 29; // Assuming today is 29th May (per dummy nav date)

  return (
    <WidgetCard
      title="SIP Calendar"
      subtitle="Jun 2026"
      action={
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider px-2">
            Jun 2026
          </span>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <ChevronRight size={16} />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-2">
            {d}
          </div>
        ))}
        {/* Empty cells for start of month - June 2026 starts on Monday */}
        {calendarDays.map((d) => {
          const isSIP = sipDays.includes(d);
          const isPaused = pausedSipDays.includes(d);
          const isToday = d === today;

          return (
            <div
              key={d}
              className={`
                h-10 rounded-lg flex items-center justify-center text-xs font-bold relative group cursor-pointer transition-all
                ${isToday ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-slate-700 hover:bg-slate-50"}
                ${isSIP ? "bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200" : ""}
                ${isPaused ? "bg-amber-50 text-amber-600" : ""}
              `}
            >
              {d}
              {isSIP && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-white" />
              )}
              {isPaused && (
                <div className="absolute -top-1 -right-1 text-[8px] bg-amber-500 text-white rounded-full w-3 h-3 flex items-center justify-center border border-white">
                  ⏸
                </div>
              )}

              {/* Tooltip placeholder */}
              {isSIP && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-xl">
                    SIP Due:{" "}
                    {d === 1
                      ? "Mirae Large Cap"
                      : d === 5
                        ? "PPFAS Flexi Cap"
                        : "SBI Nifty Index"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500" /> Active
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" /> Paused
          </div>
        </div>
        <div>
          This month's SIP outflow: <span className="font-bold text-slate-900">₹33,000</span>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(SIPCalendar);
