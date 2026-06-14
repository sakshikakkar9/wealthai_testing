import React from "react";
import { Plus, Calculator, AlertTriangle, ArrowRight } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { formatShortINR } from "../../../utils/formatters";

interface DepositCommandBannerProps {
  totalFDs: number;
  totalBanks: number;
  totalPrincipal: number;
  weightedAvgRate: number;
  totalMaturityValue: number;
  totalAccruedInterest: number;
  nearestMaturityDays: number;
  nearestMaturityBank: string;
  nearestMaturityValue: number;
}

const DepositCommandBanner: React.FC<DepositCommandBannerProps> = ({
  totalFDs,
  totalBanks,
  totalPrincipal,
  weightedAvgRate,
  totalMaturityValue,
  totalAccruedInterest,
  nearestMaturityDays,
  nearestMaturityBank,
  nearestMaturityValue,
}) => {
  const { setShowNewFDModal } = useDepositStore();

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-6 text-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Fixed Deposits</h1>
          <p className="text-amber-100 text-sm">
            {totalFDs} FDs · {totalBanks} banks · {formatShortINR(totalPrincipal)} corpus
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewFDModal(true)}
            className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> New FD
          </button>
          <button className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2">
            <Calculator size={16} /> FD Calculator
          </button>
        </div>
      </div>

      {nearestMaturityDays <= 90 && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 flex items-center justify-between transition-colors ${
            nearestMaturityDays <= 30
              ? "bg-white/20 border border-white/30"
              : "bg-amber-400/20 border border-amber-400/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-200" />
            <p className="text-sm font-medium">
              {nearestMaturityBank} FD matures in {nearestMaturityDays} days —{" "}
              {formatShortINR(nearestMaturityValue)} ready for action
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white hover:bg-white hover:text-amber-600 transition-colors flex items-center gap-1">
              Renew <ArrowRight size={12} />
            </button>
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white hover:bg-white hover:text-amber-600 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-8 text-sm">
        <div className="flex flex-col">
          <span className="text-amber-100 text-[10px] uppercase font-bold tracking-wider mb-0.5">
            Total Corpus
          </span>
          <span className="font-bold">{formatShortINR(totalPrincipal)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-amber-100 text-[10px] uppercase font-bold tracking-wider mb-0.5">
            Avg Rate
          </span>
          <span className="font-bold">{weightedAvgRate}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-amber-100 text-[10px] uppercase font-bold tracking-wider mb-0.5">
            Maturity Value
          </span>
          <span className="font-bold">{formatShortINR(totalMaturityValue)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-amber-100 text-[10px] uppercase font-bold tracking-wider mb-0.5">
            Interest Earned
          </span>
          <span className="font-bold">{formatShortINR(totalAccruedInterest)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-amber-100 text-[10px] uppercase font-bold tracking-wider mb-0.5">
            Next Maturity
          </span>
          <span className="font-bold">{nearestMaturityDays} days</span>
        </div>
      </div>
    </div>
  );
};

export default DepositCommandBanner;
