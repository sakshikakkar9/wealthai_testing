import { Holding } from "../../../api/mf.api";
import { MutualFundSummary } from "../../../store/mutualfund.store";
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Plus,
  Download,
  RefreshCw,
  BarChart2,
  Briefcase,
  Zap,
  Scale,
} from "lucide-react";
import StatCard from "../../../components/common/StatCard";
import WidgetCard from "../../../components/common/WidgetCard";
import AreaPortfolioChart from "../../../components/charts/AreaPortfolioChart";
import BenchmarkAreaChart from "../../../components/charts/BenchmarkAreaChart";
import DonutAllocationChart from "../../../components/charts/DonutAllocationChart";
import { formatINR, formatShortINR, formatPercent } from "../../../utils/formatters";
import { useMFStore } from "../../../store/mutualfund.store";

const OverviewTab = ({ funds, summary }: { funds: Holding[]; summary: MutualFundSummary }) => {
  const { setActiveTab, setActiveFund } = useMFStore();

  const MF_ALLOCATION = [
    { name: "Equity (Large)", value: 37, color: "#6366F1" },
    { name: "Equity (Flexi)", value: 24, color: "#10B981" },
    { name: "Equity (Index)", value: 19, color: "#3B82F6" },
    { name: "Debt", value: 20, color: "#F59E0B" },
  ];

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Stat Cards
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Value"
          value={formatShortINR(summary.totalCurrentValue)}
          subValue={`+${formatShortINR(summary.totalGainLoss)} gain (+${summary.totalGainPct}%)`}
          accentColor="emerald"
        />
        <StatCard
          title="Portfolio XIRR"
          value={`${summary.xirr}% p.a.`}
          subValue="Beat NIFTY by 13.4%"
          accentColor="emerald"
        />
        <StatCard
          title="Monthly SIP"
          value={formatShortINR(summary.monthlySIPAmount)}
          subValue={`${summary.activeSIPs} active · ${summary.pausedSIPs} paused`}
          accentColor="indigo"
        />
        <StatCard
          title="Today's Change"
          value={`+${formatINR(summary.todayChange)}`}
          subValue={`+${summary.todayChangePct}% · Nav updated`}
          accentColor="emerald"
        />
      </div> */}
{/* Stat Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard
    title="Total Value"
    value={formatShortINR(summary.totalCurrentValue)}
    change={`+${formatShortINR(summary.totalGainLoss)}`} 
    changeType="positive"
    changeLabel={`(+${summary.totalGainPct}%)`}
    icon={Briefcase} // Passed Icon
    accentColor="emerald"
    sparklineData={[10, 15, 13, 17, 22, 25, 30]} // Passed dummy data array
  />
  <StatCard
    title="Portfolio XIRR"
    value={`${summary.xirr > 0 ? summary.xirr : "15.4"}% p.a.`}
    change="Beat NIFTY"
    changeType="positive"
    changeLabel="by 13.4%"
    icon={BarChart2} // Passed Icon
    accentColor="emerald"
    sparklineData={[12, 14, 16, 15, 18, 20, 24]} // Passed dummy data array
  />
  <StatCard
    title="Monthly SIP"
    value={formatShortINR(summary.monthlySIPAmount)}
    change={`${summary.activeSIPs} active`}
    changeType="neutral"
    changeLabel={`· ${summary.pausedSIPs} paused`}
    icon={Calendar} // Passed Icon
    accentColor="indigo"
    sparklineData={[5, 5, 5, 5, 5, 5, 5]} // Passed dummy data array
  />
  <StatCard
    title="Today's Change"
    value={`+${formatINR(summary.todayChange)}`}
    change={`+${summary.todayChangePct}%`}
    changeType="positive"
    changeLabel="· Nav updated"
    icon={Zap} // Passed Icon
    accentColor="emerald"
    sparklineData={[20, 18, 25, 22, 24, 28, 31]} // Passed dummy data array
  />
</div>
      {/* Performance and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WidgetCard title="Portfolio Performance" subtitle="vs NIFTY 50 Benchmark">
            <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
              <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col min-w-[100px]">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  XIRR
                </span>
                <span className="text-sm font-bold text-emerald-700">{summary.xirr > 0 ? summary.xirr : "15.4"}%</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col min-w-[100px]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  NIFTY 50
                </span>
                <span className="text-sm font-bold text-slate-700">8.7%</span>
              </div>
              <div className="px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100 flex flex-col min-w-[100px]">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  Alpha
                </span>
                <span className="text-sm font-bold text-indigo-700">+13.4%</span>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col min-w-[100px]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Peak Value
                </span>
                <span className="text-sm font-bold text-slate-700">₹5.92L</span>
              </div>
            </div>
            <div className="h-64">
              {/* Using BenchmarkAreaChart as specified */}
              <BenchmarkAreaChart
                portfolioData={[]} // Real data would go here
                benchmark="NIFTY 50"
                height={256}
              />
            </div>
          </WidgetCard>
        </div>
        <div className="lg:col-span-1">
          <WidgetCard title="Asset Allocation" subtitle="By Category">
            <div className="h-64 flex items-center justify-center">
              <DonutAllocationChart data={MF_ALLOCATION} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Equity 80% · Debt 20%</span>
                <span className="text-emerald-600 font-bold">Healthy Mix</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                  <span className="font-bold">Rebalance suggestion:</span> Consider adding ₹30,000
                  to debt to reach your target 70/30 allocation.
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Performers */}
        <WidgetCard
          title="Top Performers"
          action={
            <button
              onClick={() => setActiveTab("holdings")}
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase hover:text-emerald-700"
            >
              View all <ArrowRight size={12} />
            </button>
          }
        >
          <div className="space-y-4">
            {funds
              .slice(0, 3)
              .map((fund: Holding) => (
                <div
                  key={fund.id}
                  onClick={() => setActiveFund(fund.id)}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-[10px]`}
                    >
                      {(fund.fund_house || "MF")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {fund.scheme_name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {fund.display_category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600">XIRR 15.4%</div>
                    <div className="text-[10px] text-slate-400 font-medium">+{fund.gain_pct}%</div>
                  </div>
                </div>
              ))}
          </div>
        </WidgetCard>

        {/* SIP Summary */}
        <WidgetCard
          title="SIP Summary"
          action={
            <button
              onClick={() => setActiveTab("sip")}
              className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase hover:text-indigo-700"
            >
              Manage <ArrowRight size={12} />
            </button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-wider">
                  Outflow
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {formatShortINR(summary.monthlySIPAmount)}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-wider">
                  Active SIPs
                </div>
                <div className="text-sm font-bold text-slate-900">{summary.activeSIPs}</div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                  Next SIP
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{funds.length > 0 ? "In 2 days" : "N/A"}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900">{funds.length > 0 ? funds[0].scheme_name : "No active SIP"}</div>
                <div className="text-xs font-bold text-indigo-600">{funds.length > 0 ? formatShortINR(10000) : "₹0"}</div>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{funds.length > 0 ? "Due on 01 Jun 2026" : ""}</div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <span className="text-[10px] font-bold">⏸</span>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-amber-800">1 Paused SIP</div>
                <div className="text-[10px] text-amber-600">Axis Bluechip Fund</div>
              </div>
              <button className="text-[10px] font-bold text-amber-700 hover:underline">
                Resume →
              </button>
            </div>
          </div>
        </WidgetCard>

        {/* Quick Actions */}
        <WidgetCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.alert("Feature: Lump sum investment")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-200">
                <Plus size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Lump sum</span>
            </button>
            <button
              onClick={() => window.alert("Feature: Start new SIP")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-200">
                <TrendingUp size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">New SIP</span>
            </button>
            <button
              onClick={() => window.alert("Feature: Redeem fund")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-200">
                <Download size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Redeem</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:border-emerald-200">
                <Scale size={20} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Compare</span>
            </button>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
};

export default React.memo(OverviewTab);
