import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { CouponEvent } from "../../pages/bonds/_data/bonds.data";
import { formatShortINR, formatINR } from "../../utils/formatters";
import WidgetCard from "../common/WidgetCard";
import { BarChart3, Calendar } from "lucide-react";

interface Props {
  schedule: CouponEvent[];
  height?: number;
}

const TYPE_COLORS: Record<string, string> = {
  Govt: "#4f46e5",
  Corporate: "#0891b2",
  SGB: "#d97706",
  SDL: "#059669",
};

const CouponYieldChart: React.FC<Props> = ({ schedule, height = 280 }) => {
  const [view, setView] = useState<"bar" | "calendar">("bar");

  const { chartData, totalIncome, calendarMonths } = useMemo(() => {
    const months: Record<
      string,
      {
        name: string;
        Govt: number;
        Corporate: number;
        SGB: number;
        SDL: number;
        "T-Bill": number;
        events: CouponEvent[];
      }
    > = {};
    const now = new Date("2026-05-15");
    let total = 0;

    // Initialize next 12 months for bar chart
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = d.toLocaleString("default", { month: "short", year: "2-digit" });
      
      months[monthKey] = {
        name: monthKey,
        Govt: 0,
        Corporate: 0,
        SGB: 0,
        SDL: 0,
        "T-Bill": 0,
        events: [],
      };
    }

    // Initialize next 3 months for calendar view
    const calMonths = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      calMonths.push({
        date: d,
        monthName: d.toLocaleString("default", { month: "long" }),
        year: d.getFullYear(),
        daysInMonth: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
        startDay: d.getDay(),
      });
    }

    schedule.forEach((event) => {
      const d = new Date(event.coupon_date);
      const monthKey = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const monthData = months[monthKey];
      
      if (monthData) {
        const type = event.bond_type;
        if (type === "Govt") monthData.Govt += event.coupon_amount;
        else if (type === "Corporate") monthData.Corporate += event.coupon_amount;
        else if (type === "SGB") monthData.SGB += event.coupon_amount;
        else if (type === "SDL") monthData.SDL += event.coupon_amount;
        else if (type === "T-Bill") monthData["T-Bill"] += event.coupon_amount;

        monthData.events.push(event);
        total += event.coupon_amount;
      }
    });

    return {
      chartData: Object.values(months),
      totalIncome: total,
      calendarMonths: calMonths,
    };
  }, [schedule]);

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl min-w-[180px]">
          <p className="text-xs font-bold text-slate-800 mb-2">{data.name} Coupons</p>
          <div className="space-y-2">
            {data.events.map((ev: CouponEvent, i: number) => (
              <div key={i} className="flex justify-between items-start gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-700 font-medium leading-tight">
                    {ev.bond_name}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {new Date(ev.coupon_date).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">
                  {formatShortINR(ev.coupon_amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CalendarView = () => (
    <div className="grid grid-cols-1 gap-6 max-h-[264px] overflow-y-auto custom-scrollbar pr-1">
      {calendarMonths.map((m, mIdx) => (
        <div key={mIdx} className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            {m.monthName} {m.year}
          </h4>
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div
                key={day}
                className="text-[8px] font-bold text-slate-300 text-center uppercase py-1"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: m.startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: m.daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${m.year}-${String(m.date.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayCoupons = schedule.filter((s) => s.coupon_date === dateStr);

              return (
                <div
                  key={dayNum}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg border text-[10px] font-medium relative group ${
                    dayCoupons.length > 0
                      ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                      : "bg-white border-transparent text-slate-600"
                  }`}
                >
                  {dayNum}
                  {dayCoupons.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayCoupons.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          title={`${c.bond_name} · ${formatINR(c.coupon_amount)}`}
                          className="w-1 h-1 rounded-full shrink-0 bg-[var(--dot-color)]"
                          style={{ "--dot-color": TYPE_COLORS[c.bond_type] } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <WidgetCard
      title="Coupon Schedule123"
      subtitle={view === "bar" ? "Next 12 months · Income by month" : "Next 3 months calendar"}
      action={
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView("bar")}
            className={`p-1.5 rounded-md transition-all ${view === "bar" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <BarChart3 size={14} />
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`p-1.5 rounded-md transition-all ${view === "calendar" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Calendar size={14} />
          </button>
        </div>
      }
    >
      <div className="absolute top-0 right-0 -mt-10 mr-5">
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100">
          Next 12M: {formatShortINR(totalIncome)}
        </span>
      </div>

      <div className="w-full mt-4 h-[var(--chart-height)] [--chart-height:264px] animate-in fade-in duration-300">
        {view === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 9 }}
                dy={5}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar
                dataKey="Govt"
                stackId="a"
                fill={TYPE_COLORS.Govt}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="Corporate"
                stackId="a"
                fill={TYPE_COLORS.Corporate}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="SDL"
                stackId="a"
                fill={TYPE_COLORS.SDL}
                radius={[0, 0, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="SGB"
                stackId="a"
                fill={TYPE_COLORS.SGB}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <CalendarView />
        )}
      </div>
    </WidgetCard>
  );
};

export default React.memo(CouponYieldChart);