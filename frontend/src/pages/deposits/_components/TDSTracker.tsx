import React from "react";
import { formatINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";
import { Download, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface TDSTrackerProps {
  totalInterestFY: number;
  tdsDeducted: number;
  tdsThresholdStatus: Record<
    string,
    { interest: number; threshold: number; tdsApplicable: boolean }
  >;
}

const TDSTracker: React.FC<TDSTrackerProps> = ({
  totalInterestFY,
  tdsDeducted,
  tdsThresholdStatus,
}) => {
  const netInterest = totalInterestFY - tdsDeducted;

  return (
    <WidgetCard title="TDS & Tax Compliance" subtitle="FY 2025-26 tracking">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Total Interest
          </span>
          <span className="text-sm font-bold text-slate-700">{formatINR(totalInterestFY)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            TDS Deducted
          </span>
          <span className="text-sm font-bold text-red-600">{formatINR(tdsDeducted)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Net Interest
          </span>
          <span className="text-sm font-bold text-emerald-600">{formatINR(netInterest)}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Bank</span>
          <span>Threshold Usage</span>
          <span>Status</span>
        </div>

        <div className="space-y-3">
          {Object.entries(tdsThresholdStatus).map(([bankId, status], i) => {
            const usage = (status.interest / status.threshold) * 100;
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">{bankId}</span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {formatINR(status.interest)} / {formatINR(status.threshold)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        usage > 100 ? "bg-red-500" : usage > 75 ? "bg-orange-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, usage)}%` }}
                    />
                  </div>
                  <div className="w-12 text-right">
                    {usage > 100 ? (
                      <span className="text-[10px] font-bold text-red-600">TDS</span>
                    ) : (
                      <CheckCircle2 size={12} className="text-emerald-500 ml-auto" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Form 15G / 15H Submission
        </h4>
        <div className="space-y-2">
          {Object.keys(tdsThresholdStatus)
            .slice(0, 3)
            .map((bank, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[11px] font-bold text-slate-700 uppercase">{bank}</span>
                  <span className="text-[10px] text-slate-400">Not submitted</span>
                </div>
                <button className="text-indigo-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
                  <Download size={10} /> Submit
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-slate-400">
        <Info size={12} className="mt-0.5 shrink-0" />
        <p className="text-[9px] leading-relaxed">
          TDS of 10% is deducted by banks if interest exceeds ₹40,000 (₹50,000 for seniors) per FY.
          Submit Form 15G/H to avoid TDS if your total income is below the exemption limit.
        </p>
      </div>
    </WidgetCard>
  );
};

export default React.memo(TDSTracker);
