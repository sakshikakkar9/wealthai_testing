import React from "react";
import { formatINR } from "../../../utils/formatters";

interface IncomeItem {
  initials: string;
  name: string;
  date: string;
  rate: string;
  est: number;
  color: string;
}

interface Props {
  items: IncomeItem[];
}

const IncomeList: React.FC<Props> = ({ items }) => {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  const totalEst = items.reduce((sum, item) => sum + item.est, 0);

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-12 px-2 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
        <div className="col-span-6">Company / Source</div>
        <div className="col-span-3 text-center">Date</div>
        <div className="col-span-3 text-right">Est. Total</div>
      </div>

      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 items-center px-2 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="col-span-6 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${colorMap[item.color] || "bg-slate-100 text-slate-600"}`}
              >
                {item.initials}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{item.rate}</div>
              </div>
            </div>
            <div className="col-span-3 text-center">
              <div className="text-xs font-bold text-slate-700">{item.date}</div>
            </div>
            <div className="col-span-3 text-right">
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {formatINR(item.est)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between px-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Total Expected
        </span>
        <span className="text-lg font-bold text-emerald-600 tabular-nums">
          {formatINR(totalEst)}
        </span>
      </div>
    </div>
  );
};

export default IncomeList;
