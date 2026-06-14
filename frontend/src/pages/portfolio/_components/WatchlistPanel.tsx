import React from "react";
import { Plus, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";

const WATCHLIST_DATA = [
  { ticker: "WIPRO", name: "Wipro Ltd", price: 542, change: +1.2 },
  { ticker: "LTIM", name: "LTIMindtree", price: 5840, change: -0.8 },
  { ticker: "KOTAKBANK", name: "Kotak Mahindra", price: 1892, change: +0.4 },
  { ticker: "DMART", name: "Avenue Supermarts", price: 3620, change: -0.3 },
  { ticker: "PIDILITIND", name: "Pidilite Ind.", price: 2840, change: +1.1 },
];

const WatchlistPanel: React.FC = () => {
  return (
    <WidgetCard
      title="Watchlist"
      action={
        <div className="flex gap-3">
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors">
            <Plus size={12} />
            Add
          </button>
          <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            View All
            <ArrowRight size={12} />
          </button>
        </div>
      }
    >
      <div className="divide-y divide-slate-50">
        {WATCHLIST_DATA.map((item) => (
          <div
            key={item.ticker}
            className="group flex items-center justify-between py-3 hover:bg-slate-50 -mx-5 px-5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-bold text-slate-900">{item.ticker}</div>
                <div className="text-[10px] text-slate-400 font-medium">{item.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden group-hover:block animate-in fade-in slide-in-from-right-2 duration-200">
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  Add to portfolio
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="text-right group-hover:hidden">
                <div className="text-sm font-bold text-slate-900 tabular-nums">
                  ₹{item.price.toLocaleString("en-IN")}
                </div>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] font-bold tabular-nums ${item.change >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {item.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {item.change >= 0 ? "+" : ""}
                  {item.change}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default WatchlistPanel;
