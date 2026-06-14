import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";

const UnderlyingStocksPanel = () => {
  const stocks = [
    { stock: "HDFC Bank", pct: 9.34, fundCount: 4 },
    { stock: "Infosys", pct: 7.22, fundCount: 3 },
    { stock: "TCS", pct: 5.84, fundCount: 3 },
    { stock: "Reliance", pct: 5.38, fundCount: 2 },
    { stock: "ICICI Bank", pct: 4.52, fundCount: 2 },
    { stock: "Kotak Bank", pct: 2.12, fundCount: 1 },
    { stock: "Bajaj Hold.", pct: 1.68, fundCount: 1 },
    { stock: "Alphabet", pct: 1.46, fundCount: 1 },
  ];

  return (
    <WidgetCard title="Underlying Stocks" subtitle="Combined exposure across all MFs">
      <div className="space-y-4">
        {stocks.map((s, i) => (
          <div key={s.stock} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold w-4">#{i + 1}</span>
                <span className="font-bold text-slate-700">{s.stock}</span>
              </div>
              <span className="font-bold text-slate-900">{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex items-center">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${s.pct * 10}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {Array.from({ length: s.fundCount }).map((_, idx) => (
                  <div key={idx} className="w-3 h-3 rounded-full bg-emerald-100 border border-white" />
                ))}
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                · {s.fundCount} funds
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-medium text-center">
          Concentration Risk: <span className="text-emerald-600 font-bold">Low</span>. No single
          stock exceeds 10% combined exposure.
        </p>
      </div>
    </WidgetCard>
  );
};

export default React.memo(UnderlyingStocksPanel);
