import React from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { formatINR } from "./mfUtils";
import { useMFStore } from "../../../store/mutualfund.store";
import { Holding } from "../../../api/mf.api";

interface Props {
  fund: Holding;
}

const FundCard: React.FC<Props> = ({ fund }) => {
  const { setActiveFund } = useMFStore();
  const dayChangePct = parseFloat(fund.day_change_percent);

  return (
    <div
      onClick={() => setActiveFund(fund.id)}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm`}
          >
            {(fund.fund_house || "MF").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
              {fund.scheme_name}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {fund.display_category}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-900">{formatINR(fund.current_value)}</div>
          <div
            className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${dayChangePct >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {dayChangePct >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {dayChangePct}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Returns
          </p>
          <p className="text-xs font-bold text-emerald-600">+{fund.gain_pct}%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">XIRR</p>
          <p className="text-xs font-bold text-indigo-600">15.4%</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {fund.active_sip_count > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            {fund.active_sip_count > 0 ? `SIP active` : "Lump sum only"}
          </span>
        </div>
        <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default React.memo(FundCard);
