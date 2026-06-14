import React, { useState, useEffect } from "react";
import { AlertCircle, X, ChevronRight, RefreshCw } from "lucide-react";
import { formatPercent } from "../../utils/formatters";
import RebalancingDrawer from "./RebalancingDrawer";

interface Drift {
  sector: string;
  current: number;
  target: number;
  drift: number;
}

interface TradeSuggestion {
  action: "BUY" | "SELL";
  symbol: string;
  amount: number;
  reason: string;
}

interface Props {
  drifts: Drift[];
  suggestions: TradeSuggestion[];
}

const RebalancingAlerts: React.FC<Props> = ({ drifts, suggestions }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const significantDrifts = drifts.filter((d) => Math.abs(d.drift) > 0.05);

  useEffect(() => {
    const dismissedAt = localStorage.getItem("rebalancing_alert_dismissed");
    if (dismissedAt) {
      const lastDismissed = new Date(parseInt(dismissedAt));
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (lastDismissed < sevenDaysAgo) {
        setIsVisible(significantDrifts.length > 0);
      }
    } else {
      setIsVisible(significantDrifts.length > 0);
    }
  }, [significantDrifts.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("rebalancing_alert_dismissed", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="mx-6 mt-4 p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 animate-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <RefreshCw size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold">Portfolio Drift Detected</h4>
            <p className="text-indigo-100 text-xs">
              {significantDrifts.length} sectors have drifted more than 5% from your target
              allocation.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            View Suggestions
            <ChevronRight size={14} />
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 text-indigo-200 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <RebalancingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        suggestions={suggestions}
      />
    </div>
  );
};

export default RebalancingAlerts;
