import React from "react";
import { Wallet, TrendingUp, Landmark, ShieldCheck, LucideIcon } from "lucide-react";
import { formatShortINR } from "../../../utils/formatters";

interface DepositStatCardsProps {
  totalPrincipal: number;
  totalFDs: number;
  totalBanks: number;
  weightedAvgRate: number;
  minRate: number;
  maxRate: number;
  totalMaturityValue: number;
  totalInterest: number;
  interestYTD: number;
  tdsDeducted: number;
}

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  accentColor,
}: {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  accentColor: string;
}) => (
  <div
    className={`bg-white rounded-xl border border-slate-100 shadow-sm p-4 border-l-4 ${accentColor}`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
      <Icon size={16} className="text-slate-400" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-slate-900">{value}</span>
      <span className="text-[10px] text-slate-400 mt-1">{sub}</span>
    </div>
  </div>
);

const DepositStatCards: React.FC<DepositStatCardsProps> = ({
  totalPrincipal,
  totalFDs,
  totalBanks,
  weightedAvgRate,
  minRate,
  maxRate,
  totalMaturityValue,
  totalInterest,
  interestYTD,
  tdsDeducted,
}) => {
  return (
    <>
      <StatCard
        title="Total Corpus"
        value={formatShortINR(totalPrincipal)}
        sub={`${totalFDs} FDs · ${totalBanks} banks`}
        icon={Wallet}
        accentColor="border-amber-500"
      />
      <StatCard
        title="Avg Interest Rate"
        value={`${weightedAvgRate}% p.a.`}
        sub={`Wtd avg · Range ${minRate}-${maxRate}%`}
        icon={TrendingUp}
        accentColor="border-emerald-500"
      />
      <StatCard
        title="Total Maturity Value"
        value={formatShortINR(totalMaturityValue)}
        sub={`+${formatShortINR(totalInterest)} total interest`}
        icon={Landmark}
        accentColor="border-indigo-500"
      />
      <StatCard
        title="Interest Earned YTD"
        value={formatShortINR(interestYTD)}
        sub={`TDS ${formatShortINR(tdsDeducted)} deducted`}
        icon={ShieldCheck}
        accentColor="border-amber-500"
      />
    </>
  );
};

export default DepositStatCards;
