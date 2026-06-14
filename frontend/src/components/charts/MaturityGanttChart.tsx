import React, { useMemo } from "react";
import { FixedDeposit } from "../../store/deposit.store";
import { formatINR } from "../../utils/formatters";

interface MaturityGanttChartProps {
  fds: FixedDeposit[];
  height?: number;
}

const MaturityGanttChart: React.FC<MaturityGanttChartProps> = ({ fds, height }) => {
  const timelineData = useMemo(() => {
    const now = new Date();
    const timelineStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const timelineEnd = new Date(now.getFullYear(), now.getMonth() + 24, 1);
    const timelineDuration = timelineEnd.getTime() - timelineStart.getTime();

    const months: string[] = [];
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }));
    }

    const todayPosition = ((now.getTime() - timelineStart.getTime()) / timelineDuration) * 100;

    const bars = fds.map((fd) => {
      const start = new Date(fd.startDate);
      const end = new Date(fd.maturityDate);

      const leftPercent = Math.max(
        0,
        ((start.getTime() - timelineStart.getTime()) / timelineDuration) * 100,
      );
      const rightPercent = Math.min(
        100,
        ((end.getTime() - timelineStart.getTime()) / timelineDuration) * 100,
      );
      const widthPercent = Math.max(2, rightPercent - leftPercent);

      let bgColor = "bg-indigo-500";
      if (fd.daysRemaining < 30) bgColor = "bg-red-500";
      else if (fd.daysRemaining <= 90) bgColor = "bg-amber-500";

      return {
        id: fd.id,
        label: `${fd.bankShortName} FD`,
        left: leftPercent,
        width: widthPercent,
        bgColor,
        isTaxSaver: fd.isTaxSaver,
        fd,
      };
    });

    return { months, todayPosition, bars };
  }, [fds]);

  return (
    <div className="relative overflow-hidden pt-8 pb-4" style={{ height: height || "auto" }}>
      {/* Timeline Header */}
      <div className="flex border-b border-slate-100 mb-6 pb-2">
        <div className="w-28 flex-shrink-0" />
        <div className="flex-1 flex justify-between text-[10px] text-slate-400 font-medium px-2">
          {timelineData.months.map((m, i) => (
            <span key={i} className={i % 3 === 0 ? "" : "hidden sm:inline"}>
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Today line */}
        <div
          className="absolute top-0 bottom-0 border-l-2 border-dashed border-slate-300 z-10"
          style={{ left: `calc(7rem + ${timelineData.todayPosition}% * (100% - 7rem) / 100)` }}
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Today
          </span>
        </div>

        {/* Bars */}
        <div className="space-y-3">
          {timelineData.bars.map((bar) => (
            <div key={bar.id} className="flex items-center group h-8">
              <div className="w-28 text-right pr-3 text-xs font-medium text-slate-500 truncate">
                {bar.label}
              </div>
              <div className="flex-1 relative h-full">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-4 rounded-full ${bar.bgColor} ${
                    bar.isTaxSaver ? "opacity-80 repeating-bg-stripes" : ""
                  } shadow-sm transition-all duration-300 hover:h-6 group-hover:z-20 cursor-pointer`}
                  style={{
                    left: `${bar.left}%`,
                    width: `${bar.width}%`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-slate-200 mr-1" />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-slate-800 text-white text-[10px] rounded p-2 shadow-xl whitespace-nowrap">
                      <p className="font-bold">{bar.fd.bankName}</p>
                      <p>
                        {formatINR(bar.fd.principal)} @ {bar.fd.interestRate}%
                      </p>
                      <p>Maturity: {bar.fd.maturityDate}</p>
                      <p className="text-amber-400 font-medium">{bar.fd.daysRemaining} days left</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .repeating-bg-stripes {
          background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
          background-size: 10px 10px;
        }
      `,
        }}
      />
    </div>
  );
};

export default React.memo(MaturityGanttChart);
