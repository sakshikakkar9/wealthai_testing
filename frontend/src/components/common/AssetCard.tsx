import { MoreHorizontal, Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import PnLSparkline from "../charts/PnLSparkline";

export type AssetClassKey = "equity" | "mf" | "fd" | "bonds" | "gold" | "realestate" | "cash";

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
  ticker?: string;
  assetClass: AssetClassKey;
  account: string;
  tag?: string;
  currentValue: string;
  investedValue: string;
  pnl: string;
  pnlPercent: string;
  isPositive: boolean;
  xirr?: string;
  weight?: string;
  sparklineData: number[];
  selected: boolean;
  anySelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AssetCard({
  id,
  name,
  ticker,
  assetClass,
  account,
  tag,
  currentValue,
  investedValue,
  pnl,
  pnlPercent,
  isPositive,
  xirr,
  sparklineData,
  selected,
  anySelected,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`group relative rounded-xl border p-4 transition-all ${
        selected
          ? "border-[#6366F1] bg-[#6366F1]/[0.05]"
          : "border-white/[0.07] bg-[#18181B] hover:border-[#6366F1]/35 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.15)]"
      }`}
    >
      {/* Top row: badges + checkbox */}
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CLASS_BADGE[assetClass]}`}
        >
          {CLASS_LABEL[assetClass]}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/70">
            {account}
          </span>
          <button
            onClick={() => onSelect(id)}
            className={`flex h-5 w-5 items-center justify-center rounded border transition ${
              selected
                ? "border-[#6366F1] bg-[#6366F1] text-white opacity-100"
                : `border-white/20 ${anySelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`
            }`}
            aria-label="Select"
          >
            {selected && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6.5L5 9L10 3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="mt-3">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-zinc-400">{ticker ?? CLASS_LABEL[assetClass]}</p>
      </div>

      {/* Value */}
      <div className="mt-3 text-right">
        <p className="text-xl font-semibold text-white">{currentValue}</p>
        <p className="text-xs text-zinc-400">Invested {investedValue}</p>
      </div>

      {/* P&L row */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-[#EF4444]" />
          )}
          <span
            className={`text-sm font-medium ${isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
          >
            {pnl}
          </span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isPositive ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/15 text-[#EF4444]"
          }`}
        >
          {pnlPercent}
        </span>
        {xirr && <span className="text-[11px] text-zinc-400">XIRR {xirr}</span>}
      </div>

      {/* Sparkline */}
      <div className="mt-2">
        <PnLSparkline data={sparklineData} isPositive={isPositive} height={40} />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        {tag ? (
          <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/60">
            {tag}
          </span>
        ) : (
          <span />
        )}

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md p-1 text-zinc-400 hover:bg-white/[0.05] hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-white/[0.07] bg-[#1F1F23] py-1 text-xs shadow-xl">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(id);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-white/80 hover:bg-white/[0.05]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDel(true);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-[#EF4444] hover:bg-white/[0.05]"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-white/80 hover:bg-white/[0.05]"
              >
                Move account
              </button>
            </div>
          )}
        </div>
      </div>

      {confirmDel && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#18181B]/95 p-4 text-center backdrop-blur-sm">
          <p className="text-sm text-white">Remove this holding?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDel(false)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.05]"
            >
              No
            </button>
            <button
              onClick={() => {
                setConfirmDel(false);
                onDelete(id);
              }}
              className="rounded-lg bg-[#EF4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#EF4444]/90"
            >
              Yes, remove
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
