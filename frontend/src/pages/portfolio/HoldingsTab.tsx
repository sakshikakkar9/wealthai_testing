import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import AssetCard, { type AssetClassKey } from "../../components/common/AssetCard";
import FilterBar from "../../components/common/FilterBar";
import BulkActionBar from "../../components/common/BulkActionBar";
import { usePortfolioStore } from "../../store/portfolio.store";

interface Holding {
  id: string;
  name: string;
  ticker?: string;
  assetClass: AssetClassKey;
  account: string;
  accountKey: "primary" | "joint" | "family";
  tag?: string;
  currentValueNum: number;
  investedValueNum: number;
  pnlNum: number;
  currentValue: string;
  investedValue: string;
  pnl: string;
  pnlPercent: string;
  pnlPercentNum: number;
  isPositive: boolean;
  xirr?: string;
  weightPct: number;
  spark: number[];
}

const HOLDINGS: Holding[] = [
  // Equity
  {
    id: "h1",
    name: "Infosys",
    ticker: "INFY · NSE",
    assetClass: "equity",
    account: "Primary",
    accountKey: "primary",
    tag: "Core",
    currentValueNum: 442400,
    investedValueNum: 240000,
    pnlNum: 202400,
    currentValue: "₹4,42,400",
    investedValue: "₹2,40,000",
    pnl: "+₹2,02,400",
    pnlPercent: "+84.2%",
    pnlPercentNum: 84.2,
    isPositive: true,
    xirr: "22.4%",
    weightPct: 3.5,
    spark: [100, 110, 108, 118, 125, 128, 135],
  },
  {
    id: "h2",
    name: "Tata Consultancy",
    ticker: "TCS · NSE",
    assetClass: "equity",
    account: "Primary",
    accountKey: "primary",
    tag: "Core",
    currentValueNum: 194600,
    investedValueNum: 155000,
    pnlNum: 39600,
    currentValue: "₹1,94,600",
    investedValue: "₹1,55,000",
    pnl: "+₹39,600",
    pnlPercent: "+25.5%",
    pnlPercentNum: 25.5,
    isPositive: true,
    xirr: "14.2%",
    weightPct: 1.5,
    spark: [100, 102, 101, 105, 108, 110, 112],
  },
  {
    id: "h3",
    name: "Reliance Industries",
    ticker: "RELIANCE · NSE",
    assetClass: "equity",
    account: "Joint",
    accountKey: "joint",
    tag: "Long-term",
    currentValueNum: 284700,
    investedValueNum: 220000,
    pnlNum: 64700,
    currentValue: "₹2,84,700",
    investedValue: "₹2,20,000",
    pnl: "+₹64,700",
    pnlPercent: "+29.4%",
    pnlPercentNum: 29.4,
    isPositive: true,
    xirr: "18.1%",
    weightPct: 2.3,
    spark: [100, 98, 102, 108, 112, 118, 124],
  },
  {
    id: "h4",
    name: "Zomato",
    ticker: "ZOMATO · NSE",
    assetClass: "equity",
    account: "Primary",
    accountKey: "primary",
    tag: "Speculative",
    currentValueNum: 65000,
    investedValueNum: 74000,
    pnlNum: -9000,
    currentValue: "₹65,000",
    investedValue: "₹74,000",
    pnl: "-₹9,000",
    pnlPercent: "-12.4%",
    pnlPercentNum: -12.4,
    isPositive: false,
    xirr: "-6.2%",
    weightPct: 0.5,
    spark: [100, 96, 92, 95, 91, 89, 88],
  },
  {
    id: "h5",
    name: "HDFC Bank",
    ticker: "HDFCBANK · NSE",
    assetClass: "equity",
    account: "Family",
    accountKey: "family",
    tag: "Dividend",
    currentValueNum: 137920,
    investedValueNum: 126400,
    pnlNum: 11520,
    currentValue: "₹1,37,920",
    investedValue: "₹1,26,400",
    pnl: "+₹11,520",
    pnlPercent: "+9.1%",
    pnlPercentNum: 9.1,
    isPositive: true,
    xirr: "7.8%",
    weightPct: 1.1,
    spark: [100, 101, 103, 102, 105, 106, 108],
  },
  // MF
  {
    id: "h6",
    name: "Parag Parikh Flexi Cap",
    assetClass: "mf",
    account: "Primary",
    accountKey: "primary",
    tag: "Core",
    currentValueNum: 60961,
    investedValueNum: 42681,
    pnlNum: 18280,
    currentValue: "₹60,961",
    investedValue: "₹42,681",
    pnl: "+₹18,280",
    pnlPercent: "+42.8%",
    pnlPercentNum: 42.8,
    isPositive: true,
    xirr: "19.8%",
    weightPct: 0.5,
    spark: [100, 105, 110, 118, 125, 134, 142],
  },
  {
    id: "h7",
    name: "Mirae Asset Large Cap",
    assetClass: "mf",
    account: "Primary",
    accountKey: "primary",
    tag: "Core",
    currentValueNum: 121768,
    investedValueNum: 97400,
    pnlNum: 24368,
    currentValue: "₹1,21,768",
    investedValue: "₹97,400",
    pnl: "+₹24,368",
    pnlPercent: "+25.0%",
    pnlPercentNum: 25,
    isPositive: true,
    weightPct: 1.0,
    spark: [100, 104, 108, 112, 116, 120, 125],
  },
  {
    id: "h8",
    name: "SBI Small Cap",
    assetClass: "mf",
    account: "Joint",
    accountKey: "joint",
    tag: "Tactical",
    currentValueNum: 88040,
    investedValueNum: 72000,
    pnlNum: 16040,
    currentValue: "₹88,040",
    investedValue: "₹72,000",
    pnl: "+₹16,040",
    pnlPercent: "+22.3%",
    pnlPercentNum: 22.3,
    isPositive: true,
    weightPct: 0.7,
    spark: [100, 103, 108, 112, 116, 119, 122],
  },
  {
    id: "h9",
    name: "IDFC Sterling",
    assetClass: "mf",
    account: "Primary",
    accountKey: "primary",
    tag: "Tactical",
    currentValueNum: 18288,
    investedValueNum: 20000,
    pnlNum: -1712,
    currentValue: "₹18,288",
    investedValue: "₹20,000",
    pnl: "-₹1,712",
    pnlPercent: "-8.6%",
    pnlPercentNum: -8.6,
    isPositive: false,
    weightPct: 0.2,
    spark: [100, 98, 97, 96, 94, 93, 91],
  },
  // FD
  {
    id: "h10",
    name: "HDFC FD 3yr",
    ticker: "Matures 15 Jun 2025",
    assetClass: "fd",
    account: "Primary",
    accountKey: "primary",
    tag: "Core",
    currentValueNum: 214200,
    investedValueNum: 200000,
    pnlNum: 14200,
    currentValue: "₹2,14,200",
    investedValue: "₹2,00,000",
    pnl: "+₹14,200",
    pnlPercent: "+7.1%",
    pnlPercentNum: 7.1,
    isPositive: true,
    weightPct: 1.7,
    spark: [100, 101, 102, 103, 104, 106, 107],
  },
  {
    id: "h11",
    name: "SBI FD 1yr",
    ticker: "Matures 22 Nov 2025",
    assetClass: "fd",
    account: "Joint",
    accountKey: "joint",
    currentValueNum: 80100,
    investedValueNum: 75000,
    pnlNum: 5100,
    currentValue: "₹80,100",
    investedValue: "₹75,000",
    pnl: "+₹5,100",
    pnlPercent: "+6.8%",
    pnlPercentNum: 6.8,
    isPositive: true,
    weightPct: 0.6,
    spark: [100, 101, 102, 103, 104, 105, 106],
  },
  {
    id: "h12",
    name: "Axis FD 2yr",
    ticker: "Matures 4 Jan 2026",
    assetClass: "fd",
    account: "Primary",
    accountKey: "primary",
    tag: "Core",
    currentValueNum: 134250,
    investedValueNum: 125000,
    pnlNum: 9250,
    currentValue: "₹1,34,250",
    investedValue: "₹1,25,000",
    pnl: "+₹9,250",
    pnlPercent: "+7.4%",
    pnlPercentNum: 7.4,
    isPositive: true,
    weightPct: 1.1,
    spark: [100, 101, 102, 103, 104, 106, 107],
  },
  // Bonds
  {
    id: "h13",
    name: "ICICI Corp Bond",
    ticker: "Coupon 8.4% · Nov 2025",
    assetClass: "bonds",
    account: "Primary",
    accountKey: "primary",
    tag: "Dividend",
    currentValueNum: 154200,
    investedValueNum: 150000,
    pnlNum: 4200,
    currentValue: "₹1,54,200",
    investedValue: "₹1,50,000",
    pnl: "+₹4,200",
    pnlPercent: "+2.8%",
    pnlPercentNum: 2.8,
    isPositive: true,
    weightPct: 1.2,
    spark: [100, 101, 102, 102, 103, 103, 103],
  },
  {
    id: "h14",
    name: "Muthoot NCD",
    ticker: "Coupon 9.1% · Mar 2026",
    assetClass: "bonds",
    account: "Primary",
    accountKey: "primary",
    tag: "Dividend",
    currentValueNum: 105500,
    investedValueNum: 100000,
    pnlNum: 5500,
    currentValue: "₹1,05,500",
    investedValue: "₹1,00,000",
    pnl: "+₹5,500",
    pnlPercent: "+5.5%",
    pnlPercentNum: 5.5,
    isPositive: true,
    weightPct: 0.8,
    spark: [100, 101, 102, 103, 104, 105, 105],
  },
  // Gold
  {
    id: "h15",
    name: "SGB 2021-22 IV",
    assetClass: "gold",
    account: "Primary",
    accountKey: "primary",
    tag: "Long-term",
    currentValueNum: 62340,
    investedValueNum: 48420,
    pnlNum: 13920,
    currentValue: "₹62,340",
    investedValue: "₹48,420",
    pnl: "+₹13,920",
    pnlPercent: "+28.7%",
    pnlPercentNum: 28.7,
    isPositive: true,
    weightPct: 0.5,
    spark: [100, 105, 110, 115, 120, 125, 128],
  },
  {
    id: "h16",
    name: "GOLDBEES ETF",
    assetClass: "gold",
    account: "Primary",
    accountKey: "primary",
    tag: "Tactical",
    currentValueNum: 9900,
    investedValueNum: 7800,
    pnlNum: 2100,
    currentValue: "₹9,900",
    investedValue: "₹7,800",
    pnl: "+₹2,100",
    pnlPercent: "+26.9%",
    pnlPercentNum: 26.9,
    isPositive: true,
    weightPct: 0.1,
    spark: [100, 104, 109, 114, 120, 124, 127],
  },
  // RE
  {
    id: "h17",
    name: "Apartment — Noida Sec 62",
    assetClass: "realestate",
    account: "Primary",
    accountKey: "primary",
    tag: "Long-term",
    currentValueNum: 8200000,
    investedValueNum: 6800000,
    pnlNum: 1400000,
    currentValue: "₹82,00,000",
    investedValue: "₹68,00,000",
    pnl: "+₹14,00,000",
    pnlPercent: "+20.6%",
    pnlPercentNum: 20.6,
    isPositive: true,
    weightPct: 65.7,
    spark: [100, 104, 108, 112, 116, 118, 121],
  },
  {
    id: "h18",
    name: "Plot — Gurugram",
    assetClass: "realestate",
    account: "Joint",
    accountKey: "joint",
    tag: "Long-term",
    currentValueNum: 1550000,
    investedValueNum: 1200000,
    pnlNum: 350000,
    currentValue: "₹15,50,000",
    investedValue: "₹12,00,000",
    pnl: "+₹3,50,000",
    pnlPercent: "+29.2%",
    pnlPercentNum: 29.2,
    isPositive: true,
    weightPct: 12.4,
    spark: [100, 104, 110, 115, 120, 125, 129],
  },
  // Cash
  {
    id: "h19",
    name: "HDFC Savings",
    assetClass: "cash",
    account: "Primary",
    accountKey: "primary",
    currentValueNum: 240000,
    investedValueNum: 240000,
    pnlNum: 0,
    currentValue: "₹2,40,000",
    investedValue: "₹2,40,000",
    pnl: "₹0",
    pnlPercent: "0.0%",
    pnlPercentNum: 0,
    isPositive: true,
    weightPct: 1.9,
    spark: [100, 100, 100, 100, 100, 100, 100],
  },
  {
    id: "h20",
    name: "Zerodha Wallet",
    assetClass: "cash",
    account: "Primary",
    accountKey: "primary",
    currentValueNum: 42450,
    investedValueNum: 42450,
    pnlNum: 0,
    currentValue: "₹42,450",
    investedValue: "₹42,450",
    pnl: "₹0",
    pnlPercent: "0.0%",
    pnlPercentNum: 0,
    isPositive: true,
    weightPct: 0.3,
    spark: [100, 100, 100, 100, 100, 100, 100],
  },
];

function ClassPill({ k }: { k: AssetClassKey }) {
  const map: Record<AssetClassKey, string> = {
    equity: "bg-indigo-600",
    mf: "bg-emerald-600",
    fd: "bg-amber-500",
    bonds: "bg-blue-500",
    gold: "bg-yellow-500",
    realestate: "bg-purple-600",
    cash: "bg-zinc-600",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white ${map[k]}`}
    >
      {k}
    </span>
  );
}

export default function HoldingsTab() {
  const {
    filterAssetClass,
    filterAccount,
    filterTag,
    searchQuery,
    sortBy,
    viewMode,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    openAddModal,
    setEditingHolding,
  } = usePortfolioStore();

  let list = HOLDINGS.filter((h) => {
    if (filterAssetClass !== "all" && h.assetClass !== filterAssetClass) return false;
    if (filterAccount !== "all" && h.accountKey !== filterAccount) return false;
    if (filterTag !== "all" && h.tag !== filterTag) return false;
    if (
      searchQuery &&
      !`${h.name} ${h.ticker ?? ""}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sortBy) {
      case "pnlpct":
        return b.pnlPercentNum - a.pnlPercentNum;
      case "pnl":
        return a.pnlPercentNum - b.pnlPercentNum;
      case "value":
        return b.currentValueNum - a.currentValueNum;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totals = list.reduce(
    (acc, h) => ({
      inv: acc.inv + h.investedValueNum,
      cur: acc.cur + h.currentValueNum,
      pnl: acc.pnl + h.pnlNum,
    }),
    { inv: 0, cur: 0, pnl: 0 },
  );
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const anySelected = selectedIds.length > 0;
  const allOnPage = list.length > 0 && list.every((h) => selectedIds.includes(h.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4"
    >
      <FilterBar />

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.07] bg-[#18181B] py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-white/40">
            ∅
          </div>
          <p className="text-sm text-white/70">No holdings match your filters</p>
          <button
            onClick={() => {
              usePortfolioStore.setState({
                filterAssetClass: "all",
                filterAccount: "all",
                filterTag: "all",
                searchQuery: "",
              });
            }}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs text-white"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {list.map((h) => (
            <AssetCard
              key={h.id}
              id={h.id}
              name={h.name}
              ticker={h.ticker}
              assetClass={h.assetClass}
              account={h.account}
              tag={h.tag}
              currentValue={h.currentValue}
              investedValue={h.investedValue}
              pnl={h.pnl}
              pnlPercent={h.pnlPercent}
              isPositive={h.isPositive}
              xirr={h.xirr}
              sparklineData={h.spark}
              selected={selectedIds.includes(h.id)}
              anySelected={anySelected}
              onSelect={toggleSelect}
              onEdit={(id) => setEditingHolding(id)}
              onDelete={(id) => console.log("delete", id)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#18181B]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1F1F23] text-[11px] uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allOnPage}
                      onChange={() =>
                        allOnPage ? clearSelection() : selectAll(list.map((h) => h.id))
                      }
                    />
                  </th>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Type</th>
                  <th className="px-3 py-3 text-left">Account</th>
                  <th className="px-3 py-3 text-left">Tag</th>
                  <th className="px-3 py-3 text-right">Invested</th>
                  <th className="px-3 py-3 text-right">Current</th>
                  <th className="px-3 py-3 text-right">P&L</th>
                  <th className="px-3 py-3 text-right">P&L %</th>
                  <th className="px-3 py-3 text-right">XIRR</th>
                  <th className="px-3 py-3 text-left">Weight</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((h) => (
                  <tr key={h.id} className="border-t border-white/[0.05] hover:bg-white/[0.02]">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(h.id)}
                        onChange={() => toggleSelect(h.id)}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-white">{h.name}</p>
                      {h.ticker && <p className="text-xs text-white/40">{h.ticker}</p>}
                    </td>
                    <td className="px-3 py-3">
                      <ClassPill k={h.assetClass} />
                    </td>
                    <td className="px-3 py-3 text-white/70">{h.account}</td>
                    <td className="px-3 py-3 text-white/70">{h.tag ?? "—"}</td>
                    <td className="px-3 py-3 text-right text-white/80">{h.investedValue}</td>
                    <td className="px-3 py-3 text-right text-white">{h.currentValue}</td>
                    <td
                      className={`px-3 py-3 text-right font-medium ${h.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
                    >
                      {h.isPositive ? "▲" : "▼"} {h.pnl}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-medium ${h.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}`}
                    >
                      {h.pnlPercent}
                    </td>
                    <td className="px-3 py-3 text-right text-white/70">{h.xirr ?? "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-xs text-white/60">
                          {h.weightPct.toFixed(1)}%
                        </span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full bg-[#6366F1]"
                            style={{ width: `${Math.min(h.weightPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingHolding(h.id)}
                          className="rounded-md p-1.5 text-white/60 hover:bg-white/[0.05] hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => console.log("delete", h.id)}
                          className="rounded-md p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#1F1F23] text-xs font-semibold text-white">
                <tr>
                  <td colSpan={5} className="px-3 py-3 text-right text-white/60">
                    Totals
                  </td>
                  <td className="px-3 py-3 text-right">{fmt(totals.inv)}</td>
                  <td className="px-3 py-3 text-right">{fmt(totals.cur)}</td>
                  <td
                    className={`px-3 py-3 text-right ${totals.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}
                  >
                    {fmt(totals.pnl)}
                  </td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <button onClick={() => openAddModal()} className="hidden" aria-hidden />
      <BulkActionBar />
    </motion.div>
  );
}
