import React, { useState } from "react";
import { X, AlertTriangle, LogOut, Info, ShieldAlert } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { formatINR } from "../../../utils/formatters";
import { FixedDeposit } from "../../store/deposit.store";

interface BreakFDModalProps {
  fd: FixedDeposit;
}

const BreakFDModal: React.FC<BreakFDModalProps> = ({ fd }) => {
  const { closeBreakFDModal } = useDepositStore();
  const [confirmText, setConfirmText] = useState("");

  const isConfirmed = confirmText === "BREAK";
  const penaltyRate = fd.interestRate - 1;
  const penaltyAmount = fd.accruedInterest * 0.14; // Mocked 14% loss of interest
  const payoutAmount = fd.principal + fd.accruedInterest - penaltyAmount;

  if (fd.isTaxSaver) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={closeBreakFDModal}
        />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Action Restricted</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                This is a tax-saver FD under Section 80C. Premature withdrawal is not allowed until
                the 5-year lock-in period ends on{" "}
                <span className="font-bold text-slate-700">{fd.maturityDate}</span>.
              </p>
            </div>
            <button
              onClick={closeBreakFDModal}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeBreakFDModal}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-red-50/30">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold">Break FD prematurely</h2>
          </div>
          <button
            onClick={closeBreakFDModal}
            className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-400 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <Info size={16} className="text-red-600 mt-0.5 shrink-0" />
            <p className="text-xs text-red-800 font-medium leading-relaxed">
              This FD is not yet mature. Breaking it incurs a{" "}
              <span className="font-bold text-red-900">1% penalty</span> on the interest rate.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Actual Rate
                </p>
                <p className="text-sm font-bold text-slate-700">{fd.interestRate}% p.a.</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">
                  Penalty Rate
                </p>
                <p className="text-sm font-bold text-red-700">{penaltyRate.toFixed(2)}% p.a.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Accrued Interest (Full)</span>
                <span className="font-bold">{formatINR(fd.accruedInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-red-400">Penalty Deduction</span>
                <span className="font-bold text-red-400">-{formatINR(penaltyAmount)}</span>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wider">Final Payout</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">
                  {formatINR(payoutAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 px-1">
              To confirm, type <span className="text-red-600">"BREAK"</span> below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type BREAK here"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex gap-3">
          <button
            onClick={closeBreakFDModal}
            className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!isConfirmed}
            onClick={() => {
              alert("FD broken successfully. Funds credited to your savings account.");
              closeBreakFDModal();
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
              isConfirmed
                ? "bg-red-600 text-white shadow-red-600/20 hover:bg-red-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <LogOut size={16} /> Break FD
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakFDModal;
