import { Grid3x3, Plus, Search, Table as TableIcon } from "lucide-react";
import {
  usePortfolioStore,
  type AssetClassFilter,
  type SortKey,
} from "../../store/portfolio.store";

const ASSET_PILLS: { key: AssetClassFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "equity", label: "Equity" },
  { key: "mf", label: "MF" },
  { key: "fd", label: "FD" },
  { key: "bonds", label: "Bonds" },
  { key: "gold", label: "Gold" },
  { key: "realestate", label: "RE" },
  { key: "cash", label: "Cash" },
];

const TAGS = ["all", "Core", "Tactical", "Long-term", "Dividend", "Speculative"];
const ACCOUNTS: { key: string; label: string }[] = [
  { key: "all", label: "All Accounts" },
  { key: "primary", label: "Primary" },
  { key: "joint", label: "Joint" },
  { key: "family", label: "Family" },
];
const SORTS: { key: SortKey; label: string }[] = [
  { key: "pnlpct", label: "Best Returns" },
  { key: "pnl", label: "Worst Returns" },
  { key: "value", label: "Highest Value" },
  { key: "name", label: "A–Z" },
  { key: "recent", label: "Recently Added" },
];

export default function FilterBar() {
  const {
    filterAssetClass,
    setFilterAssetClass,
    filterAccount,
    setFilterAccount,
    filterTag,
    setFilterTag,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    openAddModal,
  } = usePortfolioStore();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#18181B] p-3 lg:flex-row lg:items-center lg:justify-between">
      {/* LEFT */}
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ticker..."
            className="h-9 w-full rounded-lg border border-white/[0.07] bg-[#1F1F23] pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#6366F1] focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {ASSET_PILLS.map((p) => {
            const active = filterAssetClass === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setFilterAssetClass(p.key)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-100 ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="h-9 rounded-lg border border-white/[0.07] bg-[#1F1F23] px-3 text-xs text-white focus:outline-none"
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All Tags" : t}
            </option>
          ))}
        </select>

        <select
          value={filterAccount}
          onChange={(e) =>
            setFilterAccount(e.target.value as "all" | "primary" | "joint" | "family")
          }
          className="h-9 rounded-lg border border-white/[0.07] bg-[#1F1F23] px-3 text-xs text-white focus:outline-none"
        >
          {ACCOUNTS.map((a) => (
            <option key={a.key} value={a.key}>
              {a.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="h-9 rounded-lg border border-white/[0.07] bg-[#1F1F23] px-3 text-xs text-white focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-[#1F1F23] p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
              viewMode === "grid" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
            aria-label="Grid view"
          >
            <Grid3x3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
              viewMode === "table" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
            aria-label="Table view"
          >
            <TableIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => openAddModal()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Holding
        </button>
      </div>
    </div>
  );
}
