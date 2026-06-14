import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatINR, formatPercent } from "../../../utils/formatters";
import { useEquityStore } from "../../../store/equity.store";
import { EquityHolding } from "../index";

interface Props {
  variant: "gainers" | "losers";
  holdings: EquityHolding[];
}

const DailyMoversPanel: React.FC<Props> = ({ variant, holdings }) => {
  const { setActiveStock } = useEquityStore();

  const sortedMovers = [...holdings]
    .sort((a, b) => {
      return variant === "gainers"
        ? b.dayChangePct - a.dayChangePct
        : a.dayChangePct - b.dayChangePct;
    })
    .slice(0, 4);

  return (
    <WidgetCard
      title={variant === "gainers" ? "Today's Gainers" : "Today's Losers"}
      action={
        <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest">
          View All →
        </button>
      }
    >
      <div className="divide-y divide-slate-50 -mx-5 px-5">
        {sortedMovers.map((stock) => (
          <div
            key={stock.id}
            className="py-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setActiveStock(stock.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] ${variant === "gainers" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {stock.ticker?.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{stock.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {stock.sector}
                  </span>
                  <span className="text-[10px] text-slate-300">·</span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    CMP {formatINR(stock.currentPrice)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center justify-end gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${variant === "gainers" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
              >
                {variant === "gainers" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {formatPercent(stock.dayChangePct)}
              </div>
              <div
                className={`text-[11px] font-bold mt-1 ${variant === "gainers" ? "text-emerald-600" : "text-red-600"}`}
              >
                {stock.dayChange >= 0 ? "+" : ""}
                {formatINR(stock.dayChange)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default React.memo(DailyMoversPanel);
