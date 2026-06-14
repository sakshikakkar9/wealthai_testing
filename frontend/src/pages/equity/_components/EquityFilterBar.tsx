import React from "react";
import { Search, ChevronDown, Download, Filter } from "lucide-react";
import { useEquityStore, GroupBy } from "../../../store/equity.store";

interface Props {
  sectors: string[];
}

const EquityFilterBar: React.FC<Props> = ({ sectors }) => {
  const {
    searchQuery,
    setSearchQuery,
    sectorFilter,
    setSectorFilter,
    marketCapFilter,
    setMarketCapFilter,
    groupBy,
    setGroupBy,
    showFundamentals,
    toggleFundamentals,
  } = useEquityStore();

  return (
    <div className="sticky top-0 z-10 bg-[#F2F0EF] border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sector Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-slate-300 transition-colors">
              {sectorFilter || "All Sectors"}
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              <button
                onClick={() => setSectorFilter(null)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
              >
                All Sectors
              </button>
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => setSectorFilter(s)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Market Cap Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-slate-300 transition-colors">
              {marketCapFilter === "all"
                ? "All Caps"
                : marketCapFilter.charAt(0).toUpperCase() + marketCapFilter.slice(1) + " Cap"}
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              {["all", "large", "mid", "small"].map((f) => (
                <button
                  key={f}
                  onClick={() => setMarketCapFilter(f as any)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                >
                  {f === "all" ? "All Caps" : f.charAt(0).toUpperCase() + f.slice(1) + " Cap"}
                </button>
              ))}
            </div>
          </div>

          {/* Group By Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-slate-300 transition-colors">
              Group by:{" "}
              {groupBy === "none"
                ? "None"
                : groupBy
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
              <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              {["none", "sector", "market_cap", "gain_loss"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupBy(g as GroupBy)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                >
                  {g === "none"
                    ? "None"
                    : g
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-300 mx-1" />

        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg">
            All
          </button>
          <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">
            ▲ Gainers
          </button>
          <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">
            ▼ Losers
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleFundamentals}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${showFundamentals ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
        >
          {showFundamentals ? "Hide" : "Show"} Fundamentals
        </button>
        <button
          onClick={() => window.alert("Export coming soon")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 transition-all shadow-sm"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
};

export default React.memo(EquityFilterBar);
