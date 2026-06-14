import React, { useState, useRef, useEffect } from "react";
import { useBondStore } from "../../../store/bond.store";
import { DEFAULT_VISIBLE_COLUMNS, BondColumnId } from "./BondTable";
import { Search, Table, LayoutGrid, X, Columns, Check } from "lucide-react";
import { BondType, BondStatus, BondRating } from "../_data/bonds.data";
import { MATURITY_BUCKETS, MaturityBucketLabel } from "../../../utils/bondUtils";

const BondFilters: React.FC = () => {
  const {
    filters,
    setFilter,
    resetFilters,
    searchQuery,
    setSearchQuery,
    activeView,
    setActiveView,
    visibleColumns,
    toggleColumn,
  } = useBondStore();

  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const columnToggleRef = useRef<HTMLDivElement>(null);

  const isFiltered =
    filters.bondType !== "All" ||
    filters.status !== "All" ||
    filters.rating !== "All" ||
    filters.maturityBucket !== "All";

  // Handle outside click for column toggle popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnToggleRef.current && !columnToggleRef.current.contains(event.target as Node)) {
        setShowColumnToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columnLabels: Record<BondColumnId, string> = {
    bond_name: "Bond Name",
    bond_type: "Type",
    rating: "Rating",
    invested_amount: "Invested",
    current_value: "Current Value",
    gain_loss_pct: "Gain / Loss",
    coupon_rate: "Coupon Rate",
    ytm: "YTM",
    maturity_date: "Maturity",
    status: "Status",
    actions: "Actions",
  };

  return (
    <div className="sticky top-0 z-10 bg-[#F2F0EF] border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search bonds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        {/* Dropdowns */}
        <select
          value={filters.bondType}
          onChange={(e) => setFilter("bondType", e.target.value as BondType | "All")}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">Type: All</option>
          <option value="Govt">Govt</option>
          <option value="Corporate">Corporate</option>
          <option value="SDL">SDL</option>
          <option value="SGB">SGB</option>
          <option value="T-Bill">T-Bill</option>
        </select>

        <select
          value={filters.rating}
          onChange={(e) => setFilter("rating", e.target.value as BondRating | "All")}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">Rating: All</option>
          <option value="AAA">AAA</option>
          <option value="AA+">AA+</option>
          <option value="AA">AA</option>
          <option value="AA-">AA-</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="BBB+">BBB+</option>
        </select>

        <select
          value={filters.maturityBucket}
          onChange={(e) =>
            setFilter("maturityBucket", e.target.value as MaturityBucketLabel | "All")
          }
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">Maturity: All</option>
          {MATURITY_BUCKETS.map((bucket) => (
            <option key={bucket.label} value={bucket.label}>
              {bucket.label}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value as BondStatus | "All")}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Matured">Matured</option>
          <option value="Called">Called</option>
          <option value="Sold">Sold</option>
        </select>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-2 rounded-xl text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Column Toggle */}
        <div className="relative" ref={columnToggleRef}>
          <button
            onClick={() => setShowColumnToggle(!showColumnToggle)}
            className={`flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium transition-all ${
              showColumnToggle
                ? "border-indigo-400 ring-2 ring-indigo-500/20 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Columns size={14} />
            Columns
          </button>

          {showColumnToggle && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 p-2 py-3 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-3 pb-2 mb-2 border-b border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Visible Columns
                </span>
              </div>
              <div className="space-y-0.5">
                {DEFAULT_VISIBLE_COLUMNS.map((col: BondColumnId) => (
                  <button
                    key={col}
                    onClick={() => toggleColumn(col)}
                    className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors group"
                  >
                    <span
                      className={`text-xs ${visibleColumns.has(col) ? "text-slate-700 font-medium" : "text-slate-400"}`}
                    >
                      {columnLabels[col]}
                    </span>
                    {visibleColumns.has(col) && <Check size={14} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setActiveView("table")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "table"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Table size={14} />
            Table
          </button>
          <button
            onClick={() => setActiveView("cards")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "cards"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid size={14} />
            Cards
          </button>
        </div>
      </div>
    </div>
  );
};

export default BondFilters;
