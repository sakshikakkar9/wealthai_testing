import { Holding } from "../../../api/mf.api";
import React from "react";
import { useMFStore } from "../../../store/mutualfund.store";
import { formatShortINR } from "../../../utils/formatters";

const SIPCard = ({ fund }: { fund: Holding }) => {
  const { openSIPModify } = useMFStore();
  const isPaused = false;
  const progress = (12 / (12 + 12)) * 100; // Just for visual

  return (
    <div
      className={`bg-white rounded-2xl border transition-all ${isPaused ? "bg-amber-50/30 border-amber-200" : "border-slate-100 shadow-sm"}`}
    >
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm`}
          >
            {(fund.fund_house || "MF").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">{fund.scheme_name}</div>
            <div className="text-[10px] text-slate-500 font-medium">
              SIP date: 1st of month
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"}`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${isPaused ? "text-amber-600" : "text-emerald-600"}`}
          >
            active
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              Amount
            </div>
            <div className="text-base font-bold text-slate-900">
              {formatShortINR(0)}/mo
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              XIRR
            </div>
            <div className="text-base font-bold text-emerald-600">15.4%</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
            <span>TOTAL INVESTED: {formatShortINR(parseFloat(fund.invested_amount))}</span>
            <span>12 instalments</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isPaused ? "bg-amber-400" : "bg-indigo-600"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-medium border-t border-slate-50 pt-3">
          <div className="text-slate-500">
            Next: <span className="text-slate-900 font-bold">01 Jun 2026</span>
          </div>
          <div className="text-slate-400 italic">Started: 2025-06-01</div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-3 gap-2">
        <button
          onClick={() => window.alert("Pause SIP")}
          className="text-[10px] font-bold text-slate-600 hover:text-amber-600 py-1 transition-colors"
        >
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <button
          onClick={() => openSIPModify(fund.id)}
          className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 border-x border-slate-200 py-1 transition-colors"
        >
          ✎ Modify
        </button>
        <button
          onClick={() => window.alert("Stop SIP")}
          className="text-[10px] font-bold text-slate-600 hover:text-red-600 py-1 transition-colors"
        >
          ⊘ Stop
        </button>
      </div>
    </div>
  );
};

export default React.memo(SIPCard);
