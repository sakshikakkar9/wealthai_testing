import React from "react";
import { PieChart, Download, ArrowUpRight, TrendingUp } from "lucide-react";
import { formatINR, formatShortINR, formatPercent } from "../../../utils/formatters";

const DividendTracker: React.FC = () => {
  const upcoming = [
    {
      id: "1",
      ticker: "INFY",
      name: "Infosys Ltd",
      rate: 21,
      qty: 200,
      exDate: "20 May",
      payDate: "28 May",
      amount: 4200,
      tds: 630,
      net: 3570,
    },
    {
      id: "2",
      ticker: "TCS",
      name: "TCS Ltd",
      rate: 28,
      qty: 60,
      payDate: "10 Jun",
      amount: 1680,
      tds: 0,
      net: 1680,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <TrendingUp size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Income Tracker</h3>
        </div>
        <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
          <PieChart size={18} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        <div className="bg-emerald-600 rounded-2xl p-5 text-white mb-6 shadow-lg shadow-emerald-100">
          <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-1">
            YTD Received
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">{formatShortINR(284000)}</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={10} /> +12%
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-500/30 flex justify-between items-center text-[10px] font-medium text-emerald-100">
            <span>Pending this month</span>
            <span className="font-bold text-white">{formatINR(17175)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Upcoming (Next 30 Days)
          </h4>
          {upcoming.map((item) => (
            <div key={item.id} className="relative pl-4 border-l-2 border-emerald-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    [{item.ticker}] {item.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    ₹{item.rate}/share · {item.qty} shares
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900">{formatINR(item.amount)}</p>
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className="text-slate-400 font-medium italic">Pay Date: {item.payDate}</span>
                {item.tds > 0 && (
                  <span className="text-amber-600 font-bold">Est. TDS: {formatINR(item.tds)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            YTD Breakdown
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-600 font-medium">Dividends</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {formatShortINR(160000)} (56%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-slate-600 font-medium">Interest</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {formatShortINR(124000)} (44%)
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400 font-medium">Total TDS Deducted</span>
              <span className="text-xs font-bold text-red-600">{formatINR(42600)}</span>
            </div>
          </div>
        </div>
      </div>

      <button className="px-5 py-3 border-t border-slate-50 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 transition-colors">
        DOWNLOAD SCHEDULE <Download size={14} />
      </button>
    </div>
  );
};

export default DividendTracker;
