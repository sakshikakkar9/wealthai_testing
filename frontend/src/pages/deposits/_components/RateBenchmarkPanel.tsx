import React from "react";
import { FixedDeposit } from "../../store/deposit.store";
import { formatShortINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";
import { TrendingUp, ExternalLink, ShieldCheck } from "lucide-react";

interface RateBenchmarkPanelProps {
  fds: FixedDeposit[];
  marketRates: { bank: string; rate: number; tenure: string; category: string; isBest: boolean }[];
}

const RateBenchmarkPanel: React.FC<RateBenchmarkPanelProps> = ({ fds, marketRates }) => {
  const bestRate = marketRates.find((r) => r.isBest) || marketRates[0];

  return (
    <WidgetCard title="Rate Benchmarking" subtitle="Your rates vs current market">
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Your Rates Comparison
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {fds.slice(0, 3).map((fd) => {
              const diff = (bestRate.rate - fd.interestRate).toFixed(2);
              const missedPerYear = (fd.principal * (bestRate.rate - fd.interestRate)) / 100;
              return (
                <div key={fd.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      {fd.bankShortName} FD @ {fd.interestRate}%
                    </span>
                    <span className="text-[10px] font-bold text-red-600">-{diff}% diff</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${(fd.interestRate / bestRate.rate) * 100}%` }}
                      />
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${100 - (fd.interestRate / bestRate.rate) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-700 font-medium">
                    Missed ₹{formatShortINR(missedPerYear)}/yr compared to {bestRate.bank}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Top Market Rates
          </h4>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2 px-3">Bank</th>
                  <th className="py-2 px-3 text-right">Rate</th>
                  <th className="py-2 px-3">Tenure</th>
                  <th className="py-2 px-3 text-center">Safety</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {marketRates.slice(0, 5).map((rate, i) => (
                  <tr
                    key={i}
                    className={`text-xs group hover:bg-slate-50/50 transition-colors ${
                      rate.isBest ? "bg-amber-50/50" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{rate.bank}</span>
                        <span className="text-[9px] text-slate-400">{rate.category}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`font-bold ${rate.isBest ? "text-amber-700" : "text-slate-700"}`}
                      >
                        {rate.rate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-medium">{rate.tenure}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex justify-center">
                        <ShieldCheck size={14} className="text-emerald-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-2">
          <TrendingUp size={16} className="text-indigo-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            Switching HDFC FD to {bestRate.bank} on renewal at {bestRate.rate}% would earn ₹1,550
            extra/year on the same ₹2L corpus.
          </p>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(RateBenchmarkPanel);
