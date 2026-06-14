import React from "react";
import { Plus, ArrowRight } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import { useEquityStore } from "../../../store/equity.store";

interface WatchlistItem {
  ticker: string;
  name: string;
  ltp: number;
  change: number;
  pe: number;
  week52Position: number;
}

interface Props {
  items: WatchlistItem[];
}

const EquityWatchlist: React.FC<Props> = ({ items }) => {
  const { setShowAddModal } = useEquityStore();

  return (
    <WidgetCard
      title="Watchlist"
      action={
        <div className="flex gap-4">
          <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            + Add
          </button>
          <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1">
            View All <ArrowRight size={10} />
          </button>
        </div>
      }
    >
      <div className="divide-y divide-slate-50 -mx-5 px-5">
        {items.map((item) => (
          <div key={item.ticker} className="py-4 group relative">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-700 rounded font-mono text-[10px] px-2 py-0.5 font-bold">
                  {item.ticker}
                </span>
                <span className="text-sm font-bold text-slate-900">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">
                  ₹{item.ltp.toLocaleString("en-IN")}
                </div>
                <div
                  className={`text-[10px] font-bold ${item.change >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(1)}%↑
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <span className="text-[10px] text-slate-500 font-medium">PE {item.pe}x</span>
                <span className="text-[10px] text-slate-500 font-medium">RSI 54</span>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 bottom-4 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg px-2.5 py-1.5 border border-indigo-100 flex items-center gap-1 shadow-sm"
              >
                <Plus size={12} /> Add to portfolio
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 text-center">
        <span className="text-[10px] text-slate-400 font-medium italic">
          Prices auto-update every 15 min during market hours
        </span>
      </div>
    </WidgetCard>
  );
};

export default React.memo(EquityWatchlist);
