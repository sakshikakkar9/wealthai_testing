import React, { useState } from "react";
import { Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react";
import Badge from "./Badge";

export type CorporateAction = {
  symbol: string;
  action: "Dividend" | "Bonus" | "Split" | "Rights" | "Buyback";
  date: string;
  detail: string;
  exDate: string;
};

interface Props {
  actions: CorporateAction[];
}

const CorporateActionsFeed: React.FC<Props> = ({ actions }) => {
  const [filter, setFilter] = useState<"All" | "Dividend" | "Bonus" | "Split">("All");
  const [expanded, setExpanded] = useState(false);

  const filteredActions = actions
    .filter((a) => filter === "All" || a.action === filter)
    .sort((a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime());

  const visibleActions = expanded ? filteredActions : filteredActions.slice(0, 5);

  const getActionColor = (action: string) => {
    switch (action) {
      case "Dividend":
        return "emerald";
      case "Bonus":
        return "indigo";
      case "Split":
        return "amber";
      case "Rights":
        return "red";
      case "Buyback":
        return "blue";
      default:
        return "slate";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Corporate Actions</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Upcoming ex-dates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Dividend", "Bonus", "Split"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {visibleActions.map((action, idx) => (
          <div
            key={`${action.symbol}-${idx}`}
            className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                {action.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{action.symbol}</span>
                  <Badge
                    variant={getActionColor(action.action) as any}
                    className="text-[9px] uppercase"
                  >
                    {action.action}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">{action.detail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Ex-Date: {action.exDate}</p>
              <p className="text-[10px] text-slate-400 font-medium italic">
                Payment: {action.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredActions.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 bg-slate-50 text-indigo-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show All {filteredActions.length} Actions <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CorporateActionsFeed;
