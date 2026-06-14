import { Holding } from "../../../api/mf.api";
import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useMFStore } from "../../../store/mutualfund.store";

const DirectRegularAlert = ({ funds = [] }: { funds: Holding[] }) => {
  const { setActiveTab } = useMFStore();
  const regularFund = (funds || []).find((f) => (f.plan_type || "").toLowerCase() === 'regular');

  if (!regularFund) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="text-sm font-bold text-amber-900">
            {regularFund.scheme_name} is in Regular plan
          </div>
          <p className="text-xs text-amber-700 font-medium">
            You're paying extra vs Direct plan ({regularFund.expense_ratio}% vs 0.5% TER).
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            window.alert(
              "Switching requires redemption. This triggers capital gains tax. Consult your CA.",
            )
          }
          className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-all shadow-sm"
        >
          Switch to Direct
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
        >
          See switching guide <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(DirectRegularAlert);
