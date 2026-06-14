import React, { useMemo } from "react";
import { useDepositStore } from "../../../store/deposit.store";
import { computeCumulativeFD, computeNonCumulativeFD } from "../../../utils/fdCalculations";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";

const FDCalculatorPanel: React.FC = () => {
  const { calcPrincipal, calcRate, calcTenureMonths, calcType, calcFrequency, setCalcField } =
    useDepositStore();

  const results = useMemo(() => {
    if (calcType === "cumulative") {
      return computeCumulativeFD(calcPrincipal, calcRate, calcTenureMonths);
    } else {
      return computeNonCumulativeFD(calcPrincipal, calcRate, calcTenureMonths, calcFrequency);
    }
  }, [calcPrincipal, calcRate, calcTenureMonths, calcType, calcFrequency]);

  const gainPct = ((results.totalInterest / calcPrincipal) * 100).toFixed(1);

  return (
    <WidgetCard title="FD Calculator" subtitle="Compute maturity value instantly">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Principal Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                value={calcPrincipal}
                onChange={(e) => setCalcField("calcPrincipal", Number(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-300 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.05"
              value={calcRate}
              onChange={(e) => setCalcField("calcRate", Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-300 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Tenure (Months)
            </label>
            <input
              type="number"
              value={calcTenureMonths}
              onChange={(e) => setCalcField("calcTenureMonths", Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-300 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              FD Type
            </label>
            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setCalcField("calcType", "cumulative")}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  calcType === "cumulative"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Cumulative
              </button>
              <button
                onClick={() => setCalcField("calcType", "non_cumulative")}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  calcType === "non_cumulative"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Payout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Maturity Amount
            </p>
            <h2 className="text-3xl font-bold mb-4 tabular-nums">
              {formatINR(results.maturityValue)}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Total Interest
                </p>
                <p className="text-sm font-bold text-emerald-400">
                  +{formatINR(results.totalInterest)} ({gainPct}%)
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Effective Yield
                </p>
                <p className="text-sm font-bold text-amber-400">
                  {"effectiveYield" in results ? results.effectiveYield : calcRate}% p.a.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(calcPrincipal / results.maturityValue) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest px-0.5">
                <span>{formatShortINR(calcPrincipal)} Principal</span>
                <span>{formatShortINR(results.maturityValue)} Maturity</span>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <path d="M16 10h.01" />
              <path d="M12 10h.01" />
              <path d="M8 10h.01" />
              <path d="M12 14h.01" />
              <path d="M8 14h.01" />
              <path d="M12 18h.01" />
              <path d="M8 18h.01" />
            </svg>
          </div>
        </div>

        <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2">
          Compare with best market rates
        </button>
      </div>
    </WidgetCard>
  );
};

export default React.memo(FDCalculatorPanel);
