import { Holding } from "../../../api/mf.api";
import React from "react";
import { Search, Filter, ArrowUpDown, Download, Plus } from "lucide-react";
import { useMFStore } from "../../../store/mutualfund.store";
import DirectRegularAlert from "../_components/DirectRegularAlert";
import MFHoldingsTable from "../_components/MFHoldingsTable";

const HoldingsTab = ({ funds }: { funds: Holding[] }) => {
  const {
    setShowAddFundModal,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    planTypeFilter,
    setPlanTypeFilter
  } = useMFStore();

  return (
    <div className="px-6 py-4 space-y-4">
      <DirectRegularAlert funds={funds} />

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search funds..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer font-medium text-slate-600"
            >
              <option value="all">All Categories</option>
              <option value="equity">Equity</option>
              <option value="debt">Debt</option>
              <option value="hybrid">Hybrid</option>
              <option value="elss">ELSS</option>
              <option value="index">Index</option>
            </select>
            <select
              value={planTypeFilter}
              onChange={(e) => setPlanTypeFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer font-medium text-slate-600"
            >
              <option value="all">All Plans</option>
              <option value="direct">Direct</option>
              <option value="regular">Regular</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
            <ArrowUpDown size={18} />
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowAddFundModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg"
          >
            <Plus size={16} />
            Add Fund
          </button>
        </div>
      </div>

      <MFHoldingsTable funds={funds} />
    </div>
  );
};

export default React.memo(HoldingsTab);
