import React from "react";
import { Plus, Pause, Play, History, ChevronRight, TrendingUp } from "lucide-react";
import { formatINR, formatShortINR, formatPercent } from "../../../utils/formatters";

const SIPTrackerPanel: React.FC = () => {
  const SIP_SCHEDULES = [
    {
      id: "sip001",
      holdingName: "Mirae Asset Large Cap",
      ticker: "MF-MIRAE",
      account: "rahul",
      amount: 10000,
      frequency: "Monthly",
      nextDate: "01 Jun 2026",
      startDate: "01 Jun 2024",
      instalments: 24,
      completed: 23,
      pending: 1,
      totalInvested: 230000,
      currentValue: 269420,
      xirr: 24.2,
      status: "active",
    },
    {
      id: "sip002",
      holdingName: "Parag Parikh Flexi Cap",
      ticker: "MF-PPFAS",
      account: "priya",
      amount: 15000,
      frequency: "Monthly",
      nextDate: "05 Jun 2026",
      startDate: "05 Dec 2024",
      instalments: 18,
      completed: 18,
      pending: 0,
      totalInvested: 270000,
      currentValue: 349200,
      xirr: 28.4,
      status: "active",
    },
    {
      id: "sip003",
      holdingName: "Axis Bluechip Fund",
      ticker: "MF-AXIS",
      account: "rahul",
      amount: 8000,
      frequency: "Monthly",
      nextDate: "10 Jun 2026",
      startDate: "10 Jun 2025",
      instalments: 12,
      completed: 10,
      pending: 1,
      totalInvested: 80000,
      currentValue: 88040,
      xirr: 15.8,
      status: "paused",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <TrendingUp size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">SIP / STP Tracker</h3>
        </div>
        <button className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Active: 2 · Paused: 1
          </span>
        </div>

        {SIP_SCHEDULES.map((sip) => (
          <div
            key={sip.id}
            className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${sip.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    {sip.holdingName}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                  {formatINR(sip.amount)}/month · {sip.ticker}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-bold ${sip.xirr > 20 ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {formatPercent(sip.xirr)}
                </span>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  XIRR
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-[10px] font-medium">
                <span className="text-slate-400 uppercase tracking-wider">Progress</span>
                <span className="text-slate-700 font-bold">
                  {sip.completed} / {sip.instalments}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(sip.completed / sip.instalments) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-medium italic">Next: {sip.nextDate}</span>
                <span className="text-slate-900 font-bold">{formatShortINR(sip.currentValue)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/50">
              <button
                onClick={() => window.alert("Coming soon")}
                className="flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
              >
                {sip.status === "active" ? <Pause size={12} /> : <Play size={12} />}
                {sip.status === "active" ? "PAUSE" : "RESUME"}
              </button>
              <button
                onClick={() => window.alert("Coming soon")}
                className="flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
              >
                <History size={12} />
                HISTORY
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="px-5 py-3 border-t border-slate-50 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 transition-colors">
        VIEW ALL SCHEDULES <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default SIPTrackerPanel;
