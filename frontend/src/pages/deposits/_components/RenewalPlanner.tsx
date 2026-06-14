import React from "react";
import { FixedDeposit } from "../../store/deposit.store";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";
import { ArrowRight, RefreshCw, LogOut, TrendingUp, Flame } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";

interface RenewalPlannerProps {
  fds: FixedDeposit[];
}

const RenewalPlanner: React.FC<RenewalPlannerProps> = ({ fds }) => {
  const { openRenewalModal, openBreakFDModal } = useDepositStore();

  const maturingSoon = fds
    .filter((f) => f.daysRemaining <= 90)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  if (maturingSoon.length === 0) {
    const nextMaturity = [...fds].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];

    return (
      <WidgetCard title="Renewal Planner" subtitle="FDs maturing in next 90 days">
        <div className="py-10 flex flex-col items-center justify-center text-center px-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <TrendingUp size={24} className="text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-800 mb-1">
            ✓ No FDs maturing in the next 90 days
          </p>
          {nextMaturity && (
            <p className="text-[11px] text-slate-500">
              Your next maturity is {nextMaturity.bankName} FD on {nextMaturity.maturityDate} (
              {nextMaturity.daysRemaining} days)
            </p>
          )}
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard title="Renewal Planner" subtitle="FDs maturing in next 90 days">
      <div className="space-y-4">
        {maturingSoon.map((fd) => (
          <div key={fd.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${fd.bankLogoColor} flex items-center justify-center text-xs font-bold text-white shadow-sm`}
                >
                  {fd.bankLogoInitials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {fd.bankShortName} FD {fd.tenureMonths / 12}yr
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {formatINR(fd.principal)} @ {fd.interestRate}%
                  </p>
                </div>
              </div>
              <div className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 flex items-center gap-1">
                <Flame size={10} /> {fd.daysRemaining} days
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Maturity</p>
                <p className="text-xs font-bold text-slate-700">{fd.maturityDate}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Net Payout</p>
                <p className="text-xs font-bold text-slate-900">{formatINR(fd.maturityValue)}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Best renewal rates today
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">7.40%</span>
                    <span className="text-slate-500">{fd.bankShortName}</span>
                    <span className="text-slate-400">1 yr</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    +{formatShortINR(18267)} int.
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-amber-700">8.00%</span>
                    <span className="text-amber-600">AU SFB</span>
                    <span className="text-amber-500">1 yr</span>
                    <div className="bg-amber-100 text-amber-700 text-[8px] rounded-full px-1.5 py-0.5 font-bold uppercase">
                      Best
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    +{formatShortINR(19747)} int.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => openRenewalModal(fd.id)}
                className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} /> Renew
              </button>
              <button className="px-3 bg-white border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
                Compare
              </button>
              <button
                onClick={() => openBreakFDModal(fd.id)}
                className="px-3 bg-white border border-slate-200 text-red-600 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
              >
                <LogOut size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default React.memo(RenewalPlanner);
