import React from "react";
import { ArrowRightLeft, ArrowRight, RefreshCw } from "lucide-react";
import { formatShortINR } from "../../../utils/formatters";

interface Props {
  type: "STP" | "SWP";
  fromFund: string;
  toFund?: string;
  amount: number;
  date: number;
  status: "active" | "paused";
  frequency: string;
}

const STPSWPCard: React.FC<Props> = ({ type, fromFund, toFund, amount, date, status, frequency }) => {
  const isPaused = status === "paused";

  return (
    <div className={`bg-white rounded-2xl border ${isPaused ? 'bg-slate-50/50 border-slate-200 grayscale' : 'border-slate-100 shadow-sm'} p-5 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'STP' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
            <ArrowRightLeft size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">{type} Mandate</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-slate-300' : 'bg-emerald-500'}`} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-900">{formatShortINR(amount)}</div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{frequency}</div>
        </div>
      </div>

      <div className="space-y-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
          <span className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{fromFund}</span>
        </div>
        {toFund && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">To</span>
            <span className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{toFund}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Next Date</span>
          <span className="text-[10px] font-bold text-slate-900">{date} Jun 2026</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
          Modify
        </button>
      </div>
    </div>
  );
};

export default React.memo(STPSWPCard);
