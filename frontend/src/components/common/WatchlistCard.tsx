import { X } from "lucide-react";
import { motion } from "framer-motion";
import PnLSparkline from "../charts/PnLSparkline";
import type { AssetClassKey } from "./AssetCard";

const CLASS_LABEL: Record<AssetClassKey, string> = {
  equity: "Equity",
  mf: "MF",
  fd: "FD",
  bonds: "Bond",
  gold: "Gold",
  realestate: "Real Estate",
  cash: "Cash",
};
const CLASS_BADGE: Record<AssetClassKey, string> = {
  equity: "bg-indigo-600 text-white",
  mf: "bg-emerald-600 text-white",
  fd: "bg-amber-500 text-white",
  bonds: "bg-blue-500 text-white",
  gold: "bg-yellow-500 text-black",
  realestate: "bg-purple-600 text-white",
  cash: "bg-zinc-600 text-white",
};

interface Props {
  id: string;
  name: string;
  ticker: string;
  assetClass: AssetClassKey;
  currentPrice: string;
  changePercent: string;
  isPositive: boolean;
  sparklineData: number[];
  onRemove: (id: string) => void;
  onAddToPortfolio: (id: string, assetClass: AssetClassKey) => void;
}

export default function WatchlistCard({
  id,
  name,
  ticker,
  assetClass,
  currentPrice,
  changePercent,
  isPositive,
  sparklineData,
  onRemove,
  onAddToPortfolio,
}: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="group rounded-xl border border-white/[0.07] bg-[#18181B] p-4 transition-all hover:border-[#6366F1]/35"
    >
      <div className="flex items-start justify-between">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${CLASS_BADGE[assetClass]}`}
        >
          {CLASS_LABEL[assetClass]}
        </span>
        <button
          onClick={() => onRemove(id)}
          className="rounded-full p-1 text-white/40 opacity-0 transition hover:bg-white/[0.05] hover:text-white group-hover:opacity-100"
          aria-label="Remove"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-zinc-400">{ticker}</p>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-xl font-semibold text-white">{currentPrice}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isPositive ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/15 text-[#EF4444]"
          }`}
        >
          {changePercent}
        </span>
      </div>

      <div className="mt-2">
        <PnLSparkline data={sparklineData} isPositive={isPositive} height={40} />
      </div>

      <button
        onClick={() => onAddToPortfolio(id, assetClass)}
        className="mt-3 w-full rounded-lg border border-white/[0.07] py-2 text-xs font-medium text-white/80 transition hover:border-[#6366F1] hover:text-white"
      >
        + Add to Portfolio
      </button>
    </motion.div>
  );
}
