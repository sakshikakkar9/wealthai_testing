import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import MaturityGanttChart from "../../../components/charts/MaturityGanttChart";
import { FixedDeposit } from "../../store/deposit.store";
import { useDepositStore } from "../../../store/deposit.store";

interface MaturityTimelineChartProps {
  fds: FixedDeposit[];
}

const MaturityTimelineChart: React.FC<MaturityTimelineChartProps> = ({ fds }) => {
  const { setShowNewFDModal } = useDepositStore();

  const maturingSoonCount = fds.filter((f) => f.daysRemaining < 30).length;
  const activeCount = fds.filter((f) => f.daysRemaining >= 30).length;

  return (
    <WidgetCard
      title="Maturity Timeline"
      subtitle="Your FDs across time"
      action={
        <button
          onClick={() => setShowNewFDModal(true)}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          Add FD →
        </button>
      }
    >
      <div className="flex gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {maturingSoonCount} Maturing Soon
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {activeCount} Active
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            0 Matured
          </span>
        </div>
      </div>
      <MaturityGanttChart fds={fds} height={260} />
    </WidgetCard>
  );
};

export default React.memo(MaturityTimelineChart);
