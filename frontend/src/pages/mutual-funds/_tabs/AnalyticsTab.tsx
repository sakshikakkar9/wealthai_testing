import { Holding } from "../../../api/mf.api";
import React from "react";
import OverlapHeatmapCard from "../_components/OverlapHeatmap";
import UnderlyingStocksPanel from "../_components/UnderlyingStocksPanel";
import ExpenseRatioPanel from "../_components/ExpenseRatioPanel";
import RollingReturnsChart from "../../../components/charts/RollingReturnsChart";
import RadarRiskChart from "../../../components/charts/RadarRiskChart";
import WidgetCard from "../../../components/common/WidgetCard";
import Badge from "../../../components/common/Badge";

const AnalyticsTab = ({ funds }: { funds: Holding[] }) => {
  const categoryRadarData = [
    { subject: "Large Cap", value: 37, fullMark: 100 },
    { subject: "Flexi/Multi", value: 24, fullMark: 100 },
    { subject: "Index", value: 19, fullMark: 100 },
    { subject: "Debt", value: 20, fullMark: 100 },
    { subject: "Small/Mid", value: 0, fullMark: 100 },
    { subject: "ELSS", value: 0, fullMark: 100 },
  ];

  const rollingData = [
    { period: "1Y", mf1: 18.4, mf2: 22.4, mf3: 7.4, mf4: 8.7, mf5: 14.8, benchmark: 8.7 },
    { period: "3Y", mf1: 22.1, mf2: 26.8, mf3: 6.8, mf4: 14.2, mf5: 18.2, benchmark: 14.2 },
    { period: "5Y", mf1: 19.8, mf2: 24.2, mf3: 7.1, mf4: 16.1, mf5: 17.4, benchmark: 16.1 },
  ];

  const chartFunds = (funds || []).map((f) => ({
    id: f.id,
    shortName: f.scheme_name,
    color: "#10B981",
  }));

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Row 1: Overlap & Underlying Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OverlapHeatmapCard funds={funds} />
        </div>
        <div className="lg:col-span-1">
          <UnderlyingStocksPanel />
        </div>
      </div>

      {/* Row 2: Expense Ratio & Category Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpenseRatioPanel funds={funds} />
        <WidgetCard title="Category Exposure" subtitle="Diversification across MF types">
          <div className="h-72 flex items-center justify-center">
            <RadarRiskChart currentData={categoryRadarData} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Risk Score
              </span>
              <Badge variant="warning" className="w-fit mt-1">
                Moderate-High · 68/100
              </Badge>
            </div>
            <p className="text-[10px] text-amber-600 font-medium text-right max-w-[200px]">
              Missing: Small/Mid cap exposure. Consider adding 10% allocation for growth.
            </p>
          </div>
        </WidgetCard>
      </div>

      {/* Row 3: Rolling Returns & AMC Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-6">
        <div className="lg:col-span-2">
          <WidgetCard
            title="Rolling Returns vs Benchmark"
            subtitle="Consistent performance analysis"
          >
            <div className="h-72 mt-4">
              <RollingReturnsChart funds={chartFunds} data={rollingData} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-1 border-t-2 border-dashed border-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Benchmark</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">1Y, 3Y, 5Y Annualized Returns</p>
            </div>
          </WidgetCard>
        </div>
        <div className="lg:col-span-1">
          <WidgetCard title="AMC Concentration" subtitle="Risk spread across providers">
            <div className="space-y-4 pt-2">
              {[
                { name: "Mirae Asset", value: 20, pct: 20, color: "bg-indigo-600" },
                { name: "PPFAS", value: 24, pct: 24, color: "bg-emerald-700" },
                { name: "HDFC", value: 20, pct: 20, color: "bg-blue-800" },
                { name: "SBI", value: 19, pct: 19, color: "bg-blue-900" },
                { name: "Axis", value: 17, pct: 17, color: "bg-red-700" },
              ].map((amc) => (
                <div key={amc.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{amc.name}</span>
                    <span className="text-slate-900">{amc.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${amc.color} rounded-full`}
                      style={{ width: `${amc.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span className="text-[10px] text-emerald-800 font-bold">
                Excellent spread across 5 AMCs
              </span>
            </div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default React.memo(AnalyticsTab);
