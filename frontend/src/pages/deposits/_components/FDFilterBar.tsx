import React from "react";
import { Search, ArrowUpDown, Plus } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { FDType, FDStatus } from "../../store/deposit.store";

const FDFilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    accountFilter,
    setAccountFilter,
    sortField,
    setSort,
    setShowNewFDModal,
  } = useDepositStore();

  const quickFilters = [
    { label: "All 5", active: statusFilter === "all", onClick: () => setStatusFilter("all") },
    {
      label: "Maturing soon 1",
      active: statusFilter === "maturing_soon",
      onClick: () => setStatusFilter("maturing_soon"),
      variant: "warning",
    },
    {
      label: "Active 4",
      active: statusFilter === "active",
      onClick: () => setStatusFilter("active"),
    },
    { label: "Tax-saver 1", active: false, onClick: () => {} }, // Mocked
    { label: "Monthly payout 2", active: typeFilter === "non_cumulative", onClick: () => {} }, // Mocked
    { label: "Cumulative 3", active: typeFilter === "cumulative", onClick: () => {} }, // Mocked
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 mb-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search FDs, banks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as FDType | "all")}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">Type: All</option>
          <option value="cumulative">Cumulative</option>
          <option value="non_cumulative">Non-Cumulative</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FDStatus | "all")}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">Status: All</option>
          <option value="active">Active</option>
          <option value="maturing_soon">Maturing Soon</option>
          <option value="matured">Matured</option>
        </select>

        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">Account: All</option>
          <option value="rahul">Rahul Kumar</option>
          <option value="priya">Priya Kumar</option>
          <option value="joint">Joint</option>
        </select>

        <button
          onClick={() => setSort("days_left")}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
        >
          <ArrowUpDown size={14} /> Sort: Days left
        </button>

        <button
          onClick={() => setShowNewFDModal(true)}
          className="bg-amber-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> New FD
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickFilters.map((filter, i) => (
          <button
            key={i}
            onClick={filter.onClick}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap border ${
              filter.active
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FDFilterBar;
