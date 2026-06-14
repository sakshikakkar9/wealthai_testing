import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import IncomeProjectionBarChart, {
  IncomeProjectionData,
} from "../../../components/charts/IncomeProjectionBarChart";

interface IncomeProjectionChartProps {
  data: IncomeProjectionData[];
}

const IncomeProjectionChart: React.FC<IncomeProjectionChartProps> = ({ data }) => {
  return (
    <WidgetCard title="Income Projection" subtitle="Next 12 months · Principal + interest">
      <div className="flex gap-4 mb-4">
        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100">
          ₹5,28,636 total inflows
        </div>
        <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-100">
          3 FD maturities
        </div>
        <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-100">
          ₹20,313 interest payouts
        </div>
      </div>
      <IncomeProjectionBarChart data={data} height={260} />
    </WidgetCard>
  );
};

export default React.memo(IncomeProjectionChart);
