import React from "react";
import {
  X,
  Calendar,
  Landmark,
  Shield,
  Lock,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  History,
  FileText,
} from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { FixedDeposit } from "../../store/deposit.store";
import { formatINR } from "../../../utils/formatters";
import Badge from "../../../components/common/Badge";

interface FDDetailSlideoutProps {
  fd: FixedDeposit;
}

const FDDetailSlideout: React.FC<FDDetailSlideoutProps> = ({ fd }) => {
  const { setActiveFD, openRenewalModal, openBreakFDModal } = useDepositStore();

  const progress = Math.min(100, 100 - (fd.daysRemaining / (fd.tenureMonths * 30)) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={() => setActiveFD(null)}
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl pointer-events-auto transition-transform duration-300 transform translate-x-0 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${fd.bankLogoColor} flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0`}
            >
              {fd.bankLogoInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{fd.bankName} FD</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={fd.type === "cumulative" ? "info" : "success"}>
                  {fd.type === "cumulative" ? "Cumulative" : "Non-Cumulative"}
                </Badge>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  #{fd.fdNumber}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveFD(null)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 pb-24">
          {fd.daysRemaining <= 30 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-red-800">Matures in {fd.daysRemaining} days</p>
                <p className="text-xs text-red-600 font-medium mt-0.5">
                  Your FD will mature on {fd.maturityDate}. Plan your renewal or withdrawal now.
                </p>
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Principal", value: formatINR(fd.principal), icon: Landmark },
              { label: "Rate", value: `${fd.interestRate}%`, icon: TrendingUp },
              { label: "Tenure", value: `${fd.tenureMonths}m`, icon: Calendar },
              { label: "Start Date", value: fd.startDate, icon: Calendar },
              { label: "Maturity", value: fd.maturityDate, icon: Calendar },
              { label: "Days Left", value: fd.daysRemaining.toString(), icon: Clock },
            ].map((metric, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {metric.label}
                </p>
                <p className="text-xs font-bold text-slate-800">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Earnings Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-700 font-medium">Accrued Interest</span>
                <span className="font-bold text-emerald-800">{formatINR(fd.accruedInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-emerald-700 font-medium">TDS Deducted</span>
                <span className="font-bold text-red-600">-{formatINR(fd.tdsDeducted)}</span>
              </div>
              <div className="pt-3 border-t border-emerald-100 flex justify-between items-center">
                <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
                  Maturity Value
                </span>
                <span className="text-lg font-bold text-emerald-900">
                  {formatINR(fd.maturityValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Maturity Progress
              </h3>
              <span className="text-sm font-bold text-slate-700">{progress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>{fd.startDate}</span>
              <span>{fd.maturityDate}</span>
            </div>
          </div>

          {/* DICGC Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield size={12} /> DICGC Safety
              </h3>
              <span className="text-[10px] font-bold text-emerald-600">SAFE</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">
                  Total Exposure at {fd.bankShortName}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {formatINR(fd.currentValue)} / ₹5L
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(fd.currentValue / 500000) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Linked Goal */}
          {fd.linkedGoal && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={12} /> Linked Goal
              </h3>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                    {fd.linkedGoal.includes("Home") ? "🏠" : "🎓"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{fd.linkedGoal}</p>
                    <p className="text-[10px] text-indigo-600 font-medium">
                      Target: ₹80L · On Track
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-indigo-400" />
              </div>
            </div>
          )}

          {/* Renewal History */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <History size={12} /> Renewal History
            </h3>
            {fd.renewalHistory.length > 0 ? (
              <div className="space-y-2">
                {fd.renewalHistory.map((history, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-700">{history.date}</p>
                      <p className="text-slate-500">
                        {history.tenureMonths} months @ {history.rate}%
                      </p>
                    </div>
                    <span className="font-bold text-slate-700">{formatINR(history.principal)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic px-1">
                First tenure — no renewals yet.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-3 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => openRenewalModal(fd.id)}
            className="bg-amber-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw size={16} /> Renew FD
          </button>
          <button
            onClick={() => openBreakFDModal(fd.id)}
            className="bg-white border border-slate-200 text-red-600 py-3 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Break FD
          </button>
          <button className="col-span-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest py-2 hover:text-slate-600 transition-colors flex items-center justify-center gap-1.5">
            <FileText size={12} /> View Bank Statements
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const Clock = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrendingUp = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default React.memo(FDDetailSlideout);
