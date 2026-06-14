import React, { useMemo } from "react";
import { X, RefreshCw, Landmark, ArrowRight, Calculator } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import { FixedDeposit } from "../../store/deposit.store";

interface RenewalModalProps {
  fd: FixedDeposit;
}

const RenewalModal: React.FC<RenewalModalProps> = ({ fd }) => {
  const { closeRenewalModal } = useDepositStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeRenewalModal}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${fd.bankLogoColor} flex items-center justify-center text-xs font-bold text-white shadow-lg`}
            >
              {fd.bankLogoInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Renew FD — {fd.bankShortName}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {formatShortINR(fd.maturityValue)} available · Matures {fd.maturityDate}
              </p>
            </div>
          </div>
          <button
            onClick={closeRenewalModal}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              Renewal Amount
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="renewalAmount"
                    defaultChecked
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-bold text-slate-700">
                    Full Amount (Principal + Interest)
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-700 tabular-nums">
                  {formatINR(fd.maturityValue)}
                </span>
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer group hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="renewalAmount"
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-slate-600">Principal Only</span>
                </div>
                <span className="text-sm font-bold text-slate-700 tabular-nums">
                  {formatINR(fd.principal)}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Custom amount..."
                  className="w-full pl-7 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                Tenure
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none transition-all">
                <option>12 Months</option>
                <option selected>24 Months</option>
                <option>36 Months</option>
                <option>60 Months</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                FD Type
              </label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none transition-all">
                <option selected>Cumulative</option>
                <option>Payout</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Current Rates at {fd.bankShortName}
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 text-center p-2 rounded-xl bg-white border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-1">1 Yr</p>
                <p className="text-sm font-bold text-slate-700">7.40%</p>
              </div>
              <div className="flex-1 text-center p-2 rounded-xl bg-amber-50 border border-amber-200 ring-2 ring-amber-100">
                <p className="text-[10px] text-amber-600 font-bold mb-1">2 Yr</p>
                <p className="text-sm font-bold text-amber-700">7.60%</p>
              </div>
              <div className="flex-1 text-center p-2 rounded-xl bg-white border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-1">3 Yr</p>
                <p className="text-sm font-bold text-slate-700">7.25%</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-1">
                  Renewal Preview
                </p>
                <h4 className="text-xl font-bold tabular-nums">{formatINR(286728)}</h4>
                <p className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> +₹39,886 Interest
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-1">
                  Yield
                </p>
                <p className="text-sm font-bold">8.10% p.a.</p>
                <p className="text-[9px] text-indigo-400 uppercase tracking-widest mt-1">
                  Effective
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Calculator size={64} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-3">
          <button
            onClick={closeRenewalModal}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            className="px-10 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
            onClick={() => {
              alert("FD renewed successfully!");
              closeRenewalModal();
            }}
          >
            <RefreshCw size={16} /> Renew FD
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default RenewalModal;
