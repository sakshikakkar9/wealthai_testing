import React from "react";
import { Calendar, Gift, Layers, Users } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import Badge from "../../../components/common/Badge";

interface Action {
  ticker: string;
  name: string;
  type: string;
  date: string;
  detail: string;
  impact: string;
}

interface Props {
  actions: Action[];
}

const CorporateActionsPanel: React.FC<Props> = ({ actions }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dividend":
        return (
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Gift size={18} />
          </div>
        );
      case "bonus":
        return (
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Layers size={18} />
          </div>
        );
      case "split":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Layers size={18} />
          </div>
        );
      case "agm":
        return (
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
            <Users size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
            <Calendar size={18} />
          </div>
        );
    }
  };

  return (
    <WidgetCard title="Corporate Events" badge={actions.length.toString()}>
      <div className="space-y-4">
        {actions.map((action, idx) => {
          const isUpcoming = action.date.includes("2026"); // Simplification for demo
          return (
            <div
              key={idx}
              className={`flex gap-4 p-4 rounded-2xl transition-all ${isUpcoming ? "bg-white border border-slate-100 hover:shadow-md" : "opacity-50"}`}
            >
              {getTypeIcon(action.type)}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-xs font-bold text-slate-900 mr-2">{action.ticker}</span>
                    <span className="text-xs font-medium text-slate-500">{action.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {action.date}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600 mb-2">{action.detail}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                    Impact: {action.impact}
                  </span>
                  {isUpcoming && (
                    <Badge variant="amber" className="text-[8px] py-0 px-1.5 h-4">
                      Upcoming
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
};

export default React.memo(CorporateActionsPanel);
