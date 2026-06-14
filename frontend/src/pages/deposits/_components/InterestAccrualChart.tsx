import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import InterestAccrualAreaChart from "../../../components/charts/InterestAccrualAreaChart";
import { formatINR } from "../../../utils/formatters";

interface InterestAccrualChartProps {
  totalAccrued: number;
  totalTDS: number;
}

const InterestAccrualChart: React.FC<InterestAccrualChartProps> = ({ totalAccrued, totalTDS }) => {
  const accrualData = [
    { month: "Jan 26", accrued: 3800, tds: 0 },
    { month: "Feb 26", accrued: 3800, tds: 0 },
    { month: "Mar 26", accrued: 5600, tds: 560 },
    { month: "Apr 26", accrued: 4200, tds: 0 },
    { month: "May 26", accrued: 5020, tds: 583 },
  ];

  return (
    <WidgetCard title="Interest Accrual" subtitle="Monthly · FY 2025-26">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
            Total
          </span>
          <span className="text-xs font-bold text-slate-700">{formatINR(totalAccrued)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
            TDS
          </span>
          <span className="text-xs font-bold text-red-500">{formatINR(totalTDS)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
            Net
          </span>
          <span className="text-xs font-bold text-emerald-600">
            {formatINR(totalAccrued - totalTDS)}
          </span>
        </div>
      </div>
      <InterestAccrualAreaChart data={accrualData} height={200} />
    </WidgetCard>
  );
};

export default React.memo(InterestAccrualChart);
