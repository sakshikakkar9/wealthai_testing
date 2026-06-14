import React from "react";
import { Plus, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useMFStore, MutualFundSummary } from "../../../store/mutualfund.store";
import { formatINR } from "./mfUtils";
import { toast } from "sonner";

interface MFCommandBannerProps {
  summary: MutualFundSummary;
}

const MFCommandBanner: React.FC<MFCommandBannerProps> = ({ summary }) => {
  const { setShowAddFundModal } = useMFStore();

  const gainLoss = summary.totalGainLoss;
  const isPositive = gainLoss >= 0;
  const todayChange = summary.todayChange;
  const isTodayPositive = todayChange >= 0;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-5 text-white">
      <div className="flex flex-col gap-6">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mutual Funds</h1>
            <p className="text-emerald-50 text-sm font-medium">
              Portfolio Summary
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info("CAS Import coming soon")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all"
            >
              <Download size={16} />
              Import CAS
            </button>
            <button
              onClick={() => setShowAddFundModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl text-sm font-bold transition-all shadow-lg"
            >
              <Plus size={16} />
              Add Fund
            </button>
          </div>
        </div>

        {/* Bottom Row: 6 Metrics Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Total Invested */}
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
              Total Invested
            </span>
            <span className="text-lg font-bold">{formatINR(summary.totalInvested)}</span>
          </div>

          {/* Current Value */}
          <div className="flex flex-col border-l border-emerald-400/30 pl-6">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
              Current Value
            </span>
            <span className="text-lg font-bold">{formatINR(summary.totalCurrentValue)}</span>
          </div>

          {/* Gain / Loss */}
          <div className="flex flex-col border-l border-emerald-400/30 pl-6">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
              Gain / Loss
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold flex items-center gap-1`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {formatINR(Math.abs(gainLoss))}
              </span>
              <span className="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded">
                {isPositive ? "+" : ""}{summary.totalGainPct}%
              </span>
            </div>
          </div>

          {/* Today's Change */}
          <div className="flex flex-col border-l border-emerald-400/30 pl-6">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
              Today's Change
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold flex items-center gap-1`}>
                {isTodayPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {formatINR(Math.abs(todayChange))}
              </span>
              <span className="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded">
                {isTodayPositive ? "+" : ""}{summary.todayChangePct}%
              </span>
            </div>
          </div>

          {/* No. of Funds */}
          <div className="flex flex-col border-l border-emerald-400/30 pl-6">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
              No. of Funds
            </span>
            <span className="text-lg font-bold">{summary.totalFunds}</span>
          </div>

          {/* Active SIPs */}
          <div className="flex flex-col border-l border-emerald-400/30 pl-6">
            <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
              Active SIPs
            </span>
            <span className="text-lg font-bold">{summary.activeSIPs}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MFCommandBanner);
