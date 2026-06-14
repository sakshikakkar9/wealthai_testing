import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Card } from "../ui/card";

interface Props {
  metrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    sortinoRatio: number;
  };
}

const RiskMetricsPanel: React.FC<Props> = ({ metrics }) => {
  const getSharpeColor = (val: number) => {
    if (val >= 1.5) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (val >= 0.5) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  const getDrawdownColor = (val: number) => {
    if (val < 10) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (val <= 25) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  const metricItems = [
    {
      name: "Sharpe Ratio",
      value: metrics.sharpeRatio.toFixed(2),
      color: getSharpeColor(metrics.sharpeRatio),
      tooltip: "Measures risk-adjusted return. Higher is better. > 1.5 is excellent.",
    },
    {
      name: "Max Drawdown",
      value: `${metrics.maxDrawdown.toFixed(1)}%`,
      color: getDrawdownColor(metrics.maxDrawdown),
      tooltip: "The maximum observed loss from a peak to a trough of a portfolio.",
    },
    {
      name: "Annualised Volatility",
      value: `${metrics.volatility.toFixed(1)}%`,
      color: "text-slate-700 bg-slate-50 border-slate-100",
      tooltip: "Measures the standard deviation of returns. Lower indicates more stability.",
    },
    {
      name: "Sortino Ratio",
      value: metrics.sortinoRatio.toFixed(2),
      color: getSharpeColor(metrics.sortinoRatio),
      tooltip: "Similar to Sharpe, but only penalizes downside volatility.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Risk Metrics</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Last 12 Months
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metricItems.map((item) => (
          <div key={item.name} className={`p-4 rounded-xl border ${item.color} transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                {item.name}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle size={12} className="opacity-40" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs w-48">{item.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMetricsPanel;
