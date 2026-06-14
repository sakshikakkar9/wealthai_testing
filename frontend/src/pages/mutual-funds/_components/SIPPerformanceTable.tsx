import { Holding } from "../../../api/mf.api";
import React from "react";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";

const SIPPerformanceTable = ({ funds }: { funds: Holding[] }) => {
  const sipFunds = funds.filter((f) => f.active_sip_count > 0);

  return (
    <WidgetCard title="SIP Performance Analysis" subtitle="Cost averaging vs current market">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Fund
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                SIP/mo
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Invested
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Now
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Return
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                XIRR
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Avg NAV
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Curr NAV
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                CA Benefit
              </th>
            </tr>
          </thead>
          <tbody>
            {sipFunds.map((fund) => {
              const caBenefit = (((parseFloat(fund.current_nav) - parseFloat(fund.avg_nav)) / parseFloat(fund.avg_nav)) * 100).toFixed(1);
              return (
                <tr
                  key={fund.id}
                  className="border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-slate-900">{fund.scheme_name}</div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {formatShortINR(0)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {formatShortINR(parseFloat(fund.invested_amount))}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                    {formatShortINR(parseFloat(fund.current_value))}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-emerald-600">
                    +{fund.gain_pct}%
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      15.4%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {formatINR(parseFloat(fund.avg_nav))}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {formatINR(parseFloat(fund.current_nav))}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-emerald-600">+{caBenefit}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};

export default React.memo(SIPPerformanceTable);
