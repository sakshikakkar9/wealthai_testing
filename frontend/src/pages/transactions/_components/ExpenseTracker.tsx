import React from "react";
import { Receipt, ArrowRight, ExternalLink } from "lucide-react";
import { formatINR, formatPercent } from "../../../utils/formatters";

const ExpenseTracker: React.FC = () => {
  const expenses = [
    { category: "LTCG Tax", amount: 4200, pct: 46.4 },
    { category: "STCG Tax", amount: 2800, pct: 30.9 },
    { category: "Demat Charges", amount: 1200, pct: 13.2 },
    { category: "AMC Charges", amount: 500, pct: 5.5 },
    { category: "Brokerage", amount: 350, pct: 3.9 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
            <Receipt size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Expenses & Tax</h3>
        </div>
        <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
          <ExternalLink size={16} />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total YTD Expenses
          </p>
          <h2 className="text-2xl font-bold text-slate-900">{formatINR(9050)}</h2>
        </div>

        <div className="space-y-6">
          {expenses.map((exp) => (
            <div key={exp.category} className="group cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {exp.category}
                </span>
                <span className="text-xs font-bold text-slate-900">{formatINR(exp.amount)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500 group-hover:bg-indigo-600"
                    style={{ width: `${exp.pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 w-8">{exp.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              % of Portfolio
            </p>
            <p className="text-sm font-bold text-slate-800">0.07%</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              % of Returns
            </p>
            <p className="text-sm font-bold text-slate-800">0.30%</p>
          </div>
        </div>
      </div>

      <button className="px-5 py-3 border-t border-slate-50 text-[11px] font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors">
        VIEW EXPENSE HISTORY <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default ExpenseTracker;
