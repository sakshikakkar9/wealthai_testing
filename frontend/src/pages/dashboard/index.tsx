import React, { useEffect, useState } from "react";
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
import * as portfolioApi from "../../api/portfolio.api";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [allocation, setAllocation] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [summary, alloc] = await Promise.all([
          portfolioApi.getPortfolioSummary(),
          portfolioApi.getAllocation()
        ]);
        setData(summary);
        setAllocation(alloc || []);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your wealth dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load data</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Fallback defaults for safety
  const summary = data || {
    grand_total_current_value: 0,
    grand_gain_pct: "0.00",
    grand_total_gain: 0,
    grand_total_invested: 0,
    equity: { total_unrealised_pnl: 0, total_current_value: 0 },
    mutual_funds: { total_current_value: 0 },
    deposits: { total_current_value: 0 },
    bonds: { total_maturity_value: 0 }
  };

  const chartAllocation = allocation.map((a: any) => ({
    name: a.asset_class,
    value: parseFloat(a.allocation_pct),
    color: a.asset_class === 'Equity' ? '#6366F1' :
           a.asset_class === 'Mutual Funds' ? '#10B981' :
           a.asset_class === 'Deposits' ? '#F59E0B' : '#3B82F6'
  }));

  // Sparkline fallbacks
  const SPARKLINES = {
    netWorth: [100, 104, 102, 108, 112, 110, 118],
    xirr: [14, 15, 15.5, 16, 17, 17.8, 18.4],
    pnl: [0, 5000, 3000, 12000, 10000, 16000, 18240],
    income: [18000, 22000, 24000, 28000, 25000, 30000, 32000],
  };

  const PORTFOLIO_GROWTH = [
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
    { date: "May 26", value: summary.grand_total_current_value },
  ];

  const SECTORS = [
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
  ];

  const GOALS = [
    { name: "Retirement Fund", percent: 34, saved: 17000000, target: 50000000, color: "indigo", targetYear: 2045 },
    { name: "Dream Home", percent: 67, saved: 5360000, target: 8000000, color: "emerald", targetYear: 2027 },
    { name: "Education Fund", percent: 21, saved: 630000, target: 3000000, color: "amber", targetYear: 2032 },
  ];

  const MATURITIES = [
    { name: "HDFC FD 3yr", type: "Fixed Deposit", date: "15 Jun 2026", amount: 200000, days: 17 },
    { name: "SGB Tranche IV", type: "Gold Bond", date: "12 Aug 2026", amount: 95000, days: 75 },
  ];

  const INCOME_ITEMS = [
    { initials: "INFY", name: "Infosys Ltd", date: "28 May", rate: "₹21/share", est: 4200, color: "indigo" },
    { initials: "TCS", name: "TCS Ltd", date: "10 Jun", rate: "₹28/share", est: 5600, color: "blue" },
  ];

  const RISK_DATA = [
    { subject: "Market Risk", value: 72, fullMark: 100 },
    { subject: "Liquidity", value: 45, fullMark: 100 },
    { subject: "Concentration", value: 60, fullMark: 100 },
    { subject: "Duration", value: 38, fullMark: 100 },
    { subject: "Currency", value: 25, fullMark: 100 },
    { subject: "Credit", value: 50, fullMark: 100 },
  ];

  const CASHFLOW = [
    { month: "Dec", income: 175000, expense: 82000 },
    { month: "Jan", income: 148000, expense: 76000 },
    { month: "Feb", income: 162000, expense: 88000 },
    { month: "Mar", income: 180000, expense: 79000 },
    { month: "Apr", income: 155000, expense: 91000 },
    { month: "May", income: 168000, expense: 85000 },
  ];

  const INCOME_BREAKDOWN = [
    { month: "Dec", dividends: 8000, interest: 12000, other: 1875 },
    { month: "Jan", dividends: 11200, interest: 9800, other: 0 },
    { month: "Feb", dividends: 6500, interest: 14200, other: 1875 },
    { month: "Mar", dividends: 15400, interest: 11000, other: 0 },
    { month: "Apr", dividends: 9800, interest: 13500, other: 1875 },
    { month: "May", dividends: 13200, interest: 10400, other: 1875 },
  ];

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
                  <h2 className="text-3xl md:text-4xl font-bold tabular-nums">
                    {formatINR(summary.grand_total_current_value)}
                  </h2>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-300" />
                    <span className="text-sm font-bold text-emerald-300">+{summary.grand_gain_pct}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-indigo-100/80 text-xs font-medium">As of Today</p>
                  <p className="text-indigo-50 text-xs font-bold">+{formatShortINR(summary.grand_total_gain)} total gain</p>
                </div>
              </div>
              <div className="w-full md:w-64 h-20 bg-white/5 rounded-xl p-2 backdrop-blur-sm border border-white/10">
                <SparklineChart data={SPARKLINES.netWorth} color="#ffffff" />
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute right-20 -bottom-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
          </section>

          {/* ROW 1: 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Net Worth"
              value={formatINR(summary.grand_total_current_value)}
              change={`${formatShortINR(summary.grand_total_gain)} (+${summary.grand_gain_pct}%)`}
              changeType="positive"
              changeLabel="all time"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <WidgetCard
                title="Portfolio Growth"
                subtitle="12-month performance"
                action={
                  <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                    <option>By Value</option>
                  </select>
                }
              >
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Invested</p>
                    <p className="text-base md:text-lg font-bold text-slate-900 tabular-nums">
                      {formatShortINR(summary.grand_total_invested)}
                    </p>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-slate-100" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Gain</p>
                    <div className="flex items-center gap-1">
                      <p className="text-base md:text-lg font-bold text-emerald-600 tabular-nums">
                        {formatShortINR(summary.grand_total_gain)}
                      </p>
                      <span className="text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-1 rounded">
                        (+{summary.grand_gain_pct}%)
                      </span>
                    </div>
                  </div>
                </div>
                <AreaPortfolioChart data={PORTFOLIO_GROWTH} height={280} />
              </WidgetCard>
            </div>
            <WidgetCard title="Asset Allocation">
              <DonutAllocationChart data={chartAllocation} />
              <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[11px] text-indigo-700 font-medium">
                  💡 <span className="font-bold">Portfolio rebalancing</span>: Maintain your target allocation for optimal risk-adjusted returns.
                </p>
              </div>
            </WidgetCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <WidgetCard title="Cash Flow" subtitle="Income vs Expenses">
              <BarCashFlowChart data={CASHFLOW} height={220} />
            </WidgetCard>
            <WidgetCard title="Sector Exposure" subtitle="Equity allocation breakdown">
              <SectorHeatmap data={SECTORS} />
            </WidgetCard>
            <WidgetCard title="Financial Goals">
              <GoalRings goals={GOALS} />
            </WidgetCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WidgetCard title="Upcoming Maturities">
              <MaturitiesTable data={MATURITIES} />
            </WidgetCard>
            <WidgetCard title="Upcoming Income">
              <IncomeList items={INCOME_ITEMS} />
            </WidgetCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            <WidgetCard title="Risk Profile">
              <RadarRiskChart currentData={RISK_DATA} />
            </WidgetCard>
            <WidgetCard title="Daily Returns">
              <ReturnsCalendar />
            </WidgetCard>
            <WidgetCard title="Income Breakdown">
              <StackedIncomeChart data={INCOME_BREAKDOWN} height={220} />
            </WidgetCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
