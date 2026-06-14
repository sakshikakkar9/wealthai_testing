import React, { useMemo } from "react";
import { FixedDeposit } from "../../store/deposit.store";
import { computeDICGCExposure } from "../../../utils/fdCalculations";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";
import { ShieldCheck, Info } from "lucide-react";

interface DICGCInsuranceTrackerProps {
  fds: FixedDeposit[];
}

const DICGCInsuranceTracker: React.FC<DICGCInsuranceTrackerProps> = ({ fds }) => {
  const dicgcData = useMemo(() => {
    const exposure = computeDICGCExposure(fds);
    const banks = Object.entries(exposure)
      .map(([bank, data]) => ({
        bankShortName: bank,
        bankName: fds.find((f) => f.bankShortName === bank)?.bankName || bank,
        bankLogoInitials:
          fds.find((f) => f.bankShortName === bank)?.bankLogoInitials || bank.substring(0, 2),
        bankLogoColor: fds.find((f) => f.bankShortName === bank)?.bankLogoColor || "bg-slate-500",
        ...data,
      }))
      .sort((a, b) => b.totalDeposit - a.totalDeposit);

    const allSafe = banks.every((b) => b.withinLimit);
    const approachingLimit = banks.some((b) => b.percentOfLimit > 75);

    return { banks, allSafe, approachingLimit };
  }, [fds]);

  return (
    <WidgetCard title="DICGC Insurance Tracker" subtitle="₹5L coverage per depositor per bank">
      <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
        <span className="text-xs font-bold text-emerald-800">
          {dicgcData.allSafe
            ? "All 5 banks within ₹5L limit"
            : "Caution: Limit exceeded at some banks"}
        </span>
      </div>

      <div className="space-y-5">
        {dicgcData.banks.map((bank, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full ${bank.bankLogoColor} flex items-center justify-center text-[9px] font-bold text-white`}
                >
                  {bank.bankLogoInitials}
                </div>
                <span className="text-xs font-bold text-slate-700">{bank.bankName}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {formatShortINR(bank.totalDeposit)} / ₹5L
              </span>
            </div>

            <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  bank.percentOfLimit > 90
                    ? "bg-red-500"
                    : bank.percentOfLimit > 75
                      ? "bg-orange-500"
                      : bank.percentOfLimit > 50
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, bank.percentOfLimit)}%` }}
              />
            </div>

            <div className="flex justify-between items-center px-0.5">
              <span
                className={`text-[10px] font-bold ${
                  bank.percentOfLimit > 90
                    ? "text-red-600"
                    : bank.percentOfLimit > 75
                      ? "text-orange-600"
                      : bank.percentOfLimit > 50
                        ? "text-amber-600"
                        : "text-emerald-600"
                }`}
              >
                {bank.percentOfLimit}% covered
              </span>
              {!bank.withinLimit && (
                <span className="text-[10px] font-bold text-red-600 uppercase">Limit Exceeded</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 space-y-3">
        {dicgcData.approachingLimit && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
              ℹ Add new FD to ICICI with caution — currently at 62% of DICGC limit. Coverage
              includes principal + accrued interest.
            </p>
          </div>
        )}

        <div className="flex items-start gap-2">
          <Info size={12} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-400 leading-tight">
            DICGC (RBI subsidiary) insures up to ₹5L per bank. This includes all savings, current,
            and fixed deposits at that bank.
          </p>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(DICGCInsuranceTracker);
