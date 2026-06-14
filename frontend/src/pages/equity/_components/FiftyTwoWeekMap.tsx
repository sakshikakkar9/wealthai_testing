import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import { EquityHolding } from "../index";
import FiftyTwoWeekBar from "../../../components/charts/FiftyTwoWeekBar";

interface Props {
  holdings: EquityHolding[];
}

const FiftyTwoWeekMap: React.FC<Props> = ({ holdings }) => {
  const sortedHoldings = [...holdings].sort((a, b) => b.week52Position - a.week52Position);

  return (
    <WidgetCard title="52-Week Range Map" subtitle="Where each holding sits">
      <div className="space-y-6">
        {sortedHoldings.map((stock) => (
          <div key={stock.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{stock.ticker}</span>
                <span className="text-[10px] font-medium text-slate-400">{stock.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-600">
                  {stock.week52Position}%
                </span>
                {stock.week52Position > 80 ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    Near high ↑
                  </span>
                ) : stock.week52Position < 20 ? (
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5">
                    Near low ↓
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400">Mid range</span>
                )}
              </div>
            </div>
            <FiftyTwoWeekBar
              low={stock.week52Low}
              high={stock.week52High}
              current={stock.currentPrice}
              position52w={stock.week52Position}
            />
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default React.memo(FiftyTwoWeekMap);
