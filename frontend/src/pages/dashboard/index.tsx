import React, { useMemo } from "react";
import { TrendingUp, Activity, ArrowUpRight, Coins } from "lucide-react";
import Sidebar from "./_components/Sidebar";
import TopHeader from "./_components/TopHeader";
import StatCard from "../../components/common/StatCard";
import WidgetCard from "../../components/common/WidgetCard";
import AreaPortfolioChart from "../../components/charts/AreaPortfolioChart";
import DonutAllocationChart from "../../components/charts/DonutAllocationChart";
import BarCashFlowChart from "../../components/charts/BarCashFlowChart";
import RadarRiskChart from "../../components/charts/RadarRiskChart";
import StackedIncomeChart from "../../components/charts/StackedIncomeChart";
import SectorHeatmap from "./_components/SectorHeatmap";
import GoalRings from "./_components/GoalRings";
import ReturnsCalendar from "./_components/ReturnsCalendar";
import MaturitiesTable from "./_components/MaturitiesTable";
import IncomeList from "./_components/IncomeList";
import SparklineChart from "../../components/charts/SparklineChart";
import { formatINR, formatShortINR } from "../../utils/formatters";

const Dashboard: React.FC = () => {
  const SPARKLINES = useMemo(
    () => ({
      netWorth: [100, 104, 102, 108, 112, 110, 118],
      xirr: [14, 15, 15.5, 16, 17, 17.8, 18.4],
      pnl: [0, 5000, 3000, 12000, 10000, 16000, 18240],
      income: [18000, 22000, 24000, 28000, 25000, 30000, 32000],
    }),
    [],
  );

  const PORTFOLIO_GROWTH = useMemo(
    () => [
      { date: "Jun 25", value: 9500000 },
      { date: "Jul 25", value: 9820000 },
      { date: "Aug 25", value: 9650000 },
      { date: "Sep 25", value: 10200000 },
      { date: "Oct 25", value: 10850000 },
      { date: "Nov 25", value: 10450000 },
      { date: "Dec 25", value: 11200000 },
      { date: "Jan 26", value: 11850000 },
      { date: "Feb 26", value: 11400000 },
      { date: "Mar 26", value: 12150000 },
      { date: "Apr 26", value: 12620000 },
      { date: "May 26", value: 12482450 },
    ],
    [],
  );

  const ALLOCATION = useMemo(
    () => [
      { name: "Equity", value: 32, color: "#6366F1" },
      { name: "Mutual Funds", value: 24, color: "#10B981" },
      { name: "FD/Deposits", value: 15, color: "#F59E0B" },
      { name: "Bonds", value: 8, color: "#3B82F6" },
      { name: "Gold/SGB", value: 6, color: "#EAB308" },
      { name: "Real Estate", value: 10, color: "#8B5CF6" },
      { name: "Cash", value: 5, color: "#94A3B8" },
    ],
    [],
  );

  const CASHFLOW = useMemo(
    () => [
      { month: "Dec", income: 175000, expense: 82000 },
      { month: "Jan", income: 148000, expense: 76000 },
      { month: "Feb", income: 162000, expense: 88000 },
      { month: "Mar", income: 180000, expense: 79000 },
      { month: "Apr", income: 155000, expense: 91000 },
      { month: "May", income: 168000, expense: 85000 },
    ],
    [],
  );

  const SECTORS = useMemo(
    () => [
      { name: "IT", weight: 22 },
      { name: "Banking", weight: 18 },
      { name: "FMCG", weight: 12 },
      { name: "Auto", weight: 10 },
      { name: "Pharma", weight: 9 },
      { name: "Infra", weight: 8 },
      { name: "Energy", weight: 7 },
      { name: "Metals", weight: 5 },
      { name: "Realty", weight: 4 },
      { name: "Telecom", weight: 3 },
      { name: "Chemicals", weight: 2 },
      { name: "Others", weight: 0 },
    ],
    [],
  );

  const GOALS = useMemo(
    () => [
      {
        name: "Retirement Fund",
        percent: 34,
        saved: 17000000,
        target: 50000000,
        color: "indigo",
        targetYear: 2045,
      },
      {
        name: "Dream Home",
        percent: 67,
        saved: 5360000,
        target: 8000000,
        color: "emerald",
        targetYear: 2027,
      },
      {
        name: "Education Fund",
        percent: 21,
        saved: 630000,
        target: 3000000,
        color: "amber",
        targetYear: 2032,
      },
    ],
    [],
  );

  const MATURITIES = useMemo(
    () => [
      { name: "HDFC FD 3yr", type: "Fixed Deposit", date: "15 Jun 2026", amount: 200000, days: 17 },
      { name: "SGB Tranche IV", type: "Gold Bond", date: "12 Aug 2026", amount: 95000, days: 75 },
      { name: "ICICI Corp Bond", type: "Bond", date: "03 Nov 2026", amount: 150000, days: 158 },
      { name: "PNB FD 1yr", type: "Fixed Deposit", date: "22 Nov 2026", amount: 75000, days: 177 },
      {
        name: "Axis FD 2yr",
        type: "Fixed Deposit",
        date: "04 Jan 2027",
        amount: 125000,
        days: 220,
      },
    ],
    [],
  );

  const INCOME_ITEMS = useMemo(
    () => [
      {
        initials: "INFY",
        name: "Infosys Ltd",
        date: "28 May",
        rate: "₹21/share",
        est: 4200,
        color: "indigo",
      },
      {
        initials: "TCS",
        name: "TCS Ltd",
        date: "10 Jun",
        rate: "₹28/share",
        est: 5600,
        color: "blue",
      },
      {
        initials: "FD",
        name: "HDFC FD Interest",
        date: "15 Jun",
        rate: "Fixed",
        est: 3500,
        color: "amber",
      },
      {
        initials: "ICICI",
        name: "ICICI Bank",
        date: "22 Jun",
        rate: "₹10/share",
        est: 2000,
        color: "emerald",
      },
      {
        initials: "SGB",
        name: "SGB Coupon",
        date: "30 Jun",
        rate: "2.5% p.a.",
        est: 1875,
        color: "yellow",
      },
    ],
    [],
  );

  const RISK_DATA = useMemo(
    () => [
      { subject: "Market Risk", value: 72, fullMark: 100 },
      { subject: "Liquidity", value: 45, fullMark: 100 },
      { subject: "Concentration", value: 60, fullMark: 100 },
      { subject: "Duration", value: 38, fullMark: 100 },
      { subject: "Currency", value: 25, fullMark: 100 },
      { subject: "Credit", value: 50, fullMark: 100 },
    ],
    [],
  );

  const INCOME_BREAKDOWN = useMemo(
    () => [
      { month: "Dec", dividends: 8000, interest: 12000, other: 1875 },
      { month: "Jan", dividends: 11200, interest: 9800, other: 0 },
      { month: "Feb", dividends: 6500, interest: 14200, other: 1875 },
      { month: "Mar", dividends: 15400, interest: 11000, other: 0 },
      { month: "Apr", dividends: 9800, interest: 13500, other: 1875 },
      { month: "May", dividends: 13200, interest: 10400, other: 1875 },
    ],
    [],
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
          {/* Net Worth Banner */}
          <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-4 md:p-6 text-white shadow-lg shadow-indigo-200">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
                  Total Net Worth
                </p>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl md:text-4xl font-bold tabular-nums">₹1,24,82,450</h2>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-300" />
                    <span className="text-sm font-bold text-emerald-300">+2.67%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-indigo-100/80 text-xs font-medium">As of 29 May 2026</p>
                  <p className="text-indigo-50 text-xs font-bold">+₹3,24,000 this month</p>
                </div>
              </div>
              <div className="w-full md:w-64 h-20 bg-white/5 rounded-xl p-2 backdrop-blur-sm border border-white/10">
                <SparklineChart data={SPARKLINES.netWorth} color="#ffffff" />
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute right-20 -bottom-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
          </section>

          {/* ROW 1: 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Net Worth"
              value="₹1,24,82,450"
              change="+₹3,24,000 (+2.67%)"
              changeType="positive"
              changeLabel="vs last month"
              icon={TrendingUp}
              accentColor="indigo"
              sparklineData={SPARKLINES.netWorth}
            />
            <StatCard
              title="Portfolio XIRR"
              value="18.4% p.a."
              change="+1.2% vs last year"
              changeType="positive"
              changeLabel="long-term target 15%"
              icon={Activity}
              accentColor="emerald"
              sparklineData={SPARKLINES.xirr}
            />
            <StatCard
              title="Today's P&L"
              value="+₹18,240"
              change="+0.46% since open"
              changeType="positive"
              changeLabel="Nifty +0.42%"
              icon={ArrowUpRight}
              accentColor="emerald"
              sparklineData={SPARKLINES.pnl}
            />
            <StatCard
              title="Income YTD"
              value="₹2,84,000"
              change="Div ₹1.6L + Int ₹1.2L"
              changeType="neutral"
              changeLabel="on track for ₹4.2L"
              icon={Coins}
              accentColor="amber"
              sparklineData={SPARKLINES.income}
            />
          </div>

          {/* ROW 2: Portfolio Growth (2/3) + Asset Allocation (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <WidgetCard
                title="Portfolio Growth"
                subtitle="12-month performance"
                action={
                  <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                    <option>By Value</option>
                    <option>By XIRR</option>
                  </select>
                }
              >
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Peak Value
                    </p>
                    <p className="text-base md:text-lg font-bold text-slate-900 tabular-nums">
                      ₹1.28 Cr
                    </p>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-slate-100" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Invested
                    </p>
                    <p className="text-base md:text-lg font-bold text-slate-900 tabular-nums">
                      ₹94.2 L
                    </p>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-slate-100" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Total Gain
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-base md:text-lg font-bold text-emerald-600 tabular-nums">
                        ₹30.6 L
                      </p>
                      <span className="text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-1 rounded">
                        (+32.5%)
                      </span>
                    </div>
                  </div>
                </div>
                <AreaPortfolioChart data={PORTFOLIO_GROWTH} height={280} />
              </WidgetCard>
            </div>
            <WidgetCard
              title="Asset Allocation"
              action={
                <button className="text-indigo-600 text-xs font-bold hover:underline">
                  Rebalance →
                </button>
              }
            >
              <DonutAllocationChart data={ALLOCATION} />
              <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[11px] text-indigo-700 font-medium">
                  💡 <span className="font-bold">Equity over target by 7%</span>. Consider
                  rebalancing some profits into Bonds.
                </p>
              </div>
            </WidgetCard>
          </div>

          {/* ROW 3: Cash Flow + Sector Heatmap + Goal Rings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WidgetCard title="Cash Flow" subtitle="Income vs Expenses">
              <div className="mb-4">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100">
                  Avg Monthly Surplus: ₹79,833
                </span>
              </div>
              <BarCashFlowChart data={CASHFLOW} height={220} />
            </WidgetCard>
            <WidgetCard title="Sector Exposure" subtitle="Equity allocation breakdown">
              <SectorHeatmap data={SECTORS} />
            </WidgetCard>
            <WidgetCard
              title="Financial Goals"
              action={
                <button className="text-indigo-600 text-xs font-bold hover:underline">
                  + Add Goal
                </button>
              }
            >
              <GoalRings goals={GOALS} />
            </WidgetCard>
          </div>

          {/* ROW 4: Upcoming Maturities + Upcoming Income */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WidgetCard
              title="Upcoming Maturities"
              action={
                <button className="text-indigo-600 text-xs font-bold hover:underline">
                  View All →
                </button>
              }
            >
              <MaturitiesTable data={MATURITIES} />
            </WidgetCard>
            <WidgetCard
              title="Upcoming Income"
              subtitle="Next 30 days · Est. ₹17,175"
              action={
                <button className="text-indigo-600 text-xs font-bold hover:underline">
                  Calendar View →
                </button>
              }
            >
              <IncomeList items={INCOME_ITEMS} />
            </WidgetCard>
          </div>

          {/* ROW 5: Risk Radar + Returns Calendar + Income Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            <WidgetCard title="Risk Profile" subtitle="vs Ideal benchmark">
              <div className="mb-2">
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold border border-amber-100">
                  Moderate-High · 62/100
                </span>
              </div>
              <RadarRiskChart currentData={RISK_DATA} />
            </WidgetCard>
            <WidgetCard title="Daily Returns" subtitle="Mar – May 2026">
              <ReturnsCalendar />
            </WidgetCard>
            <WidgetCard title="Income Breakdown" subtitle="Dividends · Interest · Other">
              <div className="mb-4">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100">
                  ₹2,84,000 received YTD
                </span>
              </div>
              <StackedIncomeChart data={INCOME_BREAKDOWN} height={220} />
            </WidgetCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
