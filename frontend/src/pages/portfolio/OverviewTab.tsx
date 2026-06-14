import { TrendingUp, ArrowUpRight, Activity, Coins } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import WidgetCard from "../../components/common/WidgetCard";
import DonutAllocationChart from "../../components/charts/DonutAllocationChart";
import AccountGroupCard from "../../components/common/AccountGroupCard";
import PnLSparkline from "../../components/charts/PnLSparkline";

const ALLOCATION = [
  { name: "Equity", value: 32, color: "#6366F1" },
  { name: "Mutual Funds", value: 24, color: "#10B981" },
  { name: "FD / Deposits", value: 15, color: "#F59E0B" },
  { name: "Bonds", value: 8, color: "#3B82F6" },
  { name: "Gold", value: 6, color: "#EAB308" },
  { name: "Real Estate", value: 10, color: "#8B5CF6" },
  { name: "Cash", value: 5, color: "#6B7280" },
];

const CLASS_ROWS = [
  { name: "Equity", color: "#6366F1", value: "₹39,94,000", pct: "32%", pnl: "+₹8,40,000" },
  { name: "Mutual Funds", color: "#10B981", value: "₹29,95,800", pct: "24%", pnl: "+₹6,12,400" },
  { name: "FD / Deposits", color: "#F59E0B", value: "₹18,72,000", pct: "15%", pnl: "+₹1,18,200" },
  { name: "Bonds", color: "#3B82F6", value: "₹9,98,580", pct: "8%", pnl: "+₹52,300" },
  { name: "Gold", color: "#EAB308", value: "₹7,48,940", pct: "6%", pnl: "+₹1,06,200" },
  { name: "Real Estate", color: "#8B5CF6", value: "₹12,48,240", pct: "10%", pnl: "+₹4,10,000" },
  { name: "Cash", color: "#6B7280", value: "₹6,24,890", pct: "5%", pnl: "—" },
];

const ACCOUNT_ALLOCATION_PRIMARY = [
  { name: "Equity", value: 36, color: "#6366F1" },
  { name: "MF", value: 24, color: "#10B981" },
  { name: "FD", value: 14, color: "#F59E0B" },
  { name: "Bonds", value: 8, color: "#3B82F6" },
  { name: "Gold", value: 6, color: "#EAB308" },
  { name: "RE", value: 8, color: "#8B5CF6" },
  { name: "Cash", value: 4, color: "#6B7280" },
];
const ACCOUNT_ALLOCATION_JOINT = [
  { name: "Equity", value: 28, color: "#6366F1" },
  { name: "MF", value: 22, color: "#10B981" },
  { name: "FD", value: 18, color: "#F59E0B" },
  { name: "Bonds", value: 10, color: "#3B82F6" },
  { name: "RE", value: 18, color: "#8B5CF6" },
  { name: "Cash", value: 4, color: "#6B7280" },
];
const ACCOUNT_ALLOCATION_FAMILY = [
  { name: "Equity", value: 40, color: "#6366F1" },
  { name: "MF", value: 30, color: "#10B981" },
  { name: "FD", value: 20, color: "#F59E0B" },
  { name: "Cash", value: 10, color: "#6B7280" },
];

const TOP = [
  {
    rank: 1,
    name: "INFY",
    type: "Equity",
    pnl: "+₹2,02,400",
    pct: "+84.2%",
    spark: [100, 110, 120, 124, 130, 138, 145],
  },
  {
    rank: 2,
    name: "Parag Parikh Flexi Cap",
    type: "MF",
    pnl: "+₹18,280",
    pct: "+42.1%",
    spark: [100, 105, 112, 118, 125, 132, 140],
  },
  {
    rank: 3,
    name: "SGB 2021-22 IV",
    type: "Gold",
    pnl: "+₹13,920",
    pct: "+28.7%",
    spark: [100, 103, 110, 115, 120, 124, 128],
  },
];
const LAG = [
  {
    rank: 1,
    name: "ZOMATO",
    type: "Equity",
    pnl: "-₹9,000",
    pct: "-12.4%",
    spark: [100, 96, 92, 90, 88, 87, 85],
  },
  {
    rank: 2,
    name: "IDFC Sterling",
    type: "MF",
    pnl: "-₹1,712",
    pct: "-3.2%",
    spark: [100, 99, 98, 97, 96, 95, 95],
  },
  {
    rank: 3,
    name: "Coal India",
    type: "Equity",
    pnl: "-₹4,800",
    pct: "-8.1%",
    spark: [100, 98, 96, 95, 93, 92, 91],
  },
];

function MiniRank({ items, positive }: { items: typeof TOP; positive: boolean }) {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div
          key={it.rank}
          className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#0F0F11] p-3"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-xs font-bold text-white/70">
            #{it.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{it.name}</p>
            <p className="text-[11px] text-white/40">{it.type}</p>
          </div>
          <div className="h-8 w-20">
            <PnLSparkline data={it.spark} isPositive={positive} height={32} />
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-semibold ${positive ? "text-[#10B981]" : "text-[#EF4444]"}`}
            >
              {it.pnl}
            </p>
            <p className={`text-[11px] ${positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
              {it.pct}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-6"
    >
      {/* A — Summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Value"
          value="₹1,24,82,450"
          change="Invested ₹98,40,000"
          changeLabel="Across all accounts"
          icon={TrendingUp}
          accentColor="indigo"
          sparkline={[100, 104, 108, 112, 116, 120, 124]}
        />
        <StatCard
          title="Overall P&L"
          value="+₹26,42,450"
          change="+26.8%"
          changeLabel="Since Jan 2021"
          icon={ArrowUpRight}
          accentColor="green"
          sparkline={[10, 14, 18, 22, 24, 25, 26]}
        />
        <StatCard
          title="Today's Change"
          value="+₹18,240"
          change="+0.46%"
          changeLabel="Since market open"
          icon={Activity}
          accentColor="green"
          sparkline={[0, 4000, 8000, 6000, 12000, 16000, 18240]}
        />
        <StatCard
          title="XIRR"
          value="18.4% p.a."
          change="+1.2%"
          changeLabel="vs last year"
          icon={Coins}
          accentColor="amber"
          sparkline={[14, 15, 15.5, 16, 17, 17.8, 18.4]}
        />
      </section>

      {/* B — Allocation + breakdown */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WidgetCard title="Asset Allocation" subtitle="Across all accounts">
          <DonutAllocationChart data={ALLOCATION} height={260} />
        </WidgetCard>
        <WidgetCard title="By Asset Class" subtitle="Click any row to filter holdings">
          <div className="space-y-1.5">
            {CLASS_ROWS.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[0.04]"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="flex-1 text-sm text-white">{r.name}</span>
                <span className="text-sm text-white/80">{r.value}</span>
                <span className="w-12 text-right text-xs text-white/50">{r.pct}</span>
                <span className="w-24 text-right text-xs font-medium text-[#10B981]">{r.pnl}</span>
              </div>
            ))}
          </div>
        </WidgetCard>
      </section>

      {/* C — Account group cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AccountGroupCard
          accountName="Primary Account"
          totalValue="₹95,40,000"
          holdingsCount={14}
          pnl="+₹24.2L"
          pnlPercent="+34%"
          isPositive
          allocationData={ACCOUNT_ALLOCATION_PRIMARY}
        />
        <AccountGroupCard
          accountName="Joint Account"
          totalValue="₹22,80,000"
          holdingsCount={4}
          pnl="+₹1.8L"
          pnlPercent="+8.6%"
          isPositive
          allocationData={ACCOUNT_ALLOCATION_JOINT}
        />
        <AccountGroupCard
          accountName="Family Account"
          totalValue="₹6,62,450"
          holdingsCount={2}
          pnl="+₹0.4L"
          pnlPercent="+6.4%"
          isPositive
          allocationData={ACCOUNT_ALLOCATION_FAMILY}
        />
      </section>

      {/* D — Top vs laggards */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WidgetCard title="Top Performers" subtitle="Highest gainers this period">
          <MiniRank items={TOP} positive />
        </WidgetCard>
        <WidgetCard title="Needs Attention" subtitle="Underperformers to review">
          <MiniRank items={LAG} positive={false} />
        </WidgetCard>
      </section>
    </motion.div>
  );
}
