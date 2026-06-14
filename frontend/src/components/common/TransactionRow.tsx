import { CheckCircle, Coins, Percent, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type TxType = "buy" | "sell" | "dividend" | "interest" | "sip" | "maturity";

interface Props {
  type: TxType;
  assetName: string;
  assetClass: string;
  date: string;
  amount: string;
  isCredit: boolean;
  units?: string;
  pricePerUnit?: string;
  account: string;
  status?: string;
}

const STYLE: Record<TxType, { bg: string; text: string; icon: LucideIcon; label: string }> = {
  buy: { bg: "bg-emerald-600/20", text: "text-emerald-400", icon: TrendingUp, label: "BUY" },
  sell: { bg: "bg-red-600/20", text: "text-red-400", icon: TrendingDown, label: "SELL" },
  dividend: { bg: "bg-amber-600/20", text: "text-amber-400", icon: Coins, label: "DIVIDEND" },
  interest: { bg: "bg-blue-600/20", text: "text-blue-400", icon: Percent, label: "INTEREST" },
  sip: { bg: "bg-indigo-600/20", text: "text-indigo-400", icon: RefreshCw, label: "SIP" },
  maturity: {
    bg: "bg-purple-600/20",
    text: "text-purple-400",
    icon: CheckCircle,
    label: "MATURITY",
  },
};

export default function TransactionRow({
  type,
  assetName,
  assetClass,
  amount,
  isCredit,
  units,
  pricePerUnit,
  account,
}: Props) {
  const s = STYLE[type];
  const Icon = s.icon;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#18181B] px-4 py-3 transition hover:border-white/[0.12]">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
        <Icon className={`h-4 w-4 ${s.text}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-white">{assetName}</p>
          <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] uppercase text-white/50">
            {assetClass}
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          <span className={`mr-2 font-medium ${s.text}`}>{s.label}</span>
          {units && pricePerUnit && (
            <span>
              {units} @ {pricePerUnit}
            </span>
          )}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isCredit ? "text-[#10B981]" : "text-[#EF4444]"}`}>
          {isCredit ? "+" : "-"}
          {amount}
        </p>
        <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/60">
          {account}
        </span>
      </div>
    </div>
  );
}
