import { Holding } from "../../../api/mf.api";
import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatINR } from "../../../utils/formatters";

const ExpenseRatioPanel = ({ funds }: { funds: Holding[] }) => {
  return (
    <WidgetCard title="Expense Ratio Analysis" subtitle="What your funds cost annually">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Fund
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                TER
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Annual ₹ Cost
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                vs Direct
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Extra
              </th>
            </tr>
          </thead>
          <tbody>
            {funds.map((f) => {
              const annualCost = Math.round((parseFloat(f.current_value) * parseFloat(f.expense_ratio)) / 100);
              const isRegular = f.plan_type.toLowerCase() === 'regular';
              const extra = isRegular ? Math.round(parseFloat(f.current_value) * 0.005) : 0;

              return (
                <tr
                  key={f.id}
                  className={`border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors ${isRegular ? "bg-amber-50/20" : ""}`}
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-slate-900">{f.scheme_name}</div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {f.expense_ratio}%
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {formatINR(annualCost)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-400">
                    {isRegular ? `0.5% Dir` : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={`text-sm font-bold ${extra && extra > 0 ? "text-red-600" : "text-slate-400"}`}
                    >
                      {extra && extra > 0 ? `₹${extra}` : "₹0"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50/30">
              <td className="px-4 py-4 text-sm font-bold text-slate-900">Weighted Avg</td>
              <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">0.52%</td>
              <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                {formatINR(3046)}
              </td>
              <td className="px-4 py-4"></td>
              <td className="px-4 py-4 text-right text-sm font-bold text-red-600">₹680</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
        <p className="text-sm text-indigo-900 leading-relaxed">
          Your weighted average TER is <span className="font-bold">0.52%</span>. On your ₹5.70L
          corpus, this costs <span className="font-bold">₹2,964/year</span>. Switching HDFC Debt to
          Direct plan saves <span className="font-bold text-emerald-600">₹680/year</span>. Over 10
          years, that's <span className="font-bold">₹9,400</span> extra in your pocket.
        </p>
      </div>
    </WidgetCard>
  );
};

export default React.memo(ExpenseRatioPanel);
