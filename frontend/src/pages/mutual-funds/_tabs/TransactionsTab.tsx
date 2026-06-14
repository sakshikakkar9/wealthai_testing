import React from "react";
import { Search, Filter, Download } from "lucide-react";
import FolioSummaryStrip from "../_components/FolioSummaryStrip";
import MFTransactionTable from "../_components/MFTransactionTable";

const TransactionsTab = () => {
  return (
    <div className="px-6 py-4 space-y-4 pb-8">
      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {["All", "Purchase", "SIP", "STP", "SWP", "Redemption"].map((t) => (
              <button
                key={t}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  t === "All"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64 shadow-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <FolioSummaryStrip />
      <MFTransactionTable />
    </div>
  );
};

export default React.memo(TransactionsTab);
