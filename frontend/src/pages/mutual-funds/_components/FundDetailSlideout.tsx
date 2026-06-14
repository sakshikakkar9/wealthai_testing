import { Holding } from "../../../api/mf.api";
import React, { useEffect, useState } from "react";
import { X, Shield, ArrowUpRight } from "lucide-react";
import { formatINR, formatDate } from "./mfUtils";
import { formatShortINR } from "../../../utils/formatters";
import { useMFStore } from "../../../store/mutualfund.store";
import Badge from "../../../components/common/Badge";
import HoldingSparkline from "../../../components/charts/HoldingSparkline";

const FundDetailSlideout = ({ fund }: { fund: Holding | null }) => {
  const { setActiveFund, openSIPModify } = useMFStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (fund) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [fund]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActiveFund(null), 300);
  };

  if (!fund) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm`}
            >
              {(fund.fund_house || "MF").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{fund.scheme_name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {fund.plan_type} Growth
                </span>
                <Badge variant="success" className="h-4">
                  {fund.display_category}
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Units
              </span>
              <span className="text-sm font-bold text-slate-900">
                {parseFloat(fund.units).toFixed(4)}
              </span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                NAV
              </span>
              <span className="text-sm font-bold text-slate-900">{formatINR(fund.current_nav)}</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Invested
              </span>
              <span className="text-sm font-bold text-slate-900">
                {formatShortINR(parseFloat(fund.invested_amount))}
              </span>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Value
              </span>
              <span className="text-sm font-bold text-emerald-700">
                {formatShortINR(parseFloat(fund.current_value))}
              </span>
            </div>
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Gain
              </span>
              <span className="text-sm font-bold text-emerald-600">+{parseFloat(fund.gain_pct).toFixed(2)}%</span>
            </div>
            <div className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                XIRR
              </span>
              <span className="text-sm font-bold text-indigo-600">15.4%</span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="h-20 bg-slate-50 rounded-2xl p-2 flex items-center justify-center">
            <HoldingSparkline data={[85, 92, 90, 105, 110, 112, 114]} positive={parseFloat(fund.gain_loss) >= 0} />
          </div>

          {/* Details Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Fund Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "AMC", value: fund.fund_house },
                { label: "Category", value: fund.display_category },
                { label: "Benchmark", value: "N/A" },
                { label: "Manager", value: fund.fund_manager_name || "—" },
                { label: "AUM", value: `N/A` },
                { label: "Expense Ratio", value: `${fund.expense_ratio}%` },
                { label: "Exit Load", value: "N/A" },
                { label: "Risk", value: "High" },
              ].map((chip) => (
                <div key={chip.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tighter">
                    {chip.label}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">{chip.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Returns vs Benchmark */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Performance Analysis
            </h3>
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">
                      Period
                    </th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">
                      Fund
                    </th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">
                      Benchmark
                    </th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">
                      Alpha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { p: "1Y", f: 0, b: 0, a: 0 },
                    {
                      p: "3Y",
                      f: 0,
                      b: 0,
                      a: 0,
                    },
                    {
                      p: "5Y",
                      f: 0,
                      b: 0,
                      a: 0,
                    },
                  ].map((r) => (
                    <tr key={r.p}>
                      <td className="px-4 py-3 text-xs font-bold text-slate-900">{r.p}</td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-900 text-right">
                        {r.f}%
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-500 text-right">
                        {r.b}%
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-emerald-600 text-right">
                        +{r.a}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Holdings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Top Holdings in Fund
            </h3>
            <div className="space-y-3">
              {[].map((h: any) => (
                <div key={h.stock} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{h.stock}</span>
                    <span className="font-bold text-slate-900">{h.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${h.pct * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIP Info */}
          {fund.active_sip_count > 0 && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">
                    SIP Active
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-700">
                  {formatShortINR(0)}/mo
                </span>
              </div>
              <p className="text-[10px] text-indigo-600 font-medium">
                Next deduction on 01 Jun 2026.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openSIPModify(fund.id)}
                  className="flex-1 py-2 bg-white text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all"
                >
                  Modify SIP
                </button>
                <button className="flex-1 py-2 bg-white text-amber-600 text-[10px] font-bold rounded-lg border border-amber-200 hover:bg-amber-50 transition-all">
                  Pause SIP
                </button>
              </div>
            </div>
          )}

          {/* Tax Position */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-amber-600" />
              <h4 className="text-sm font-bold text-amber-900">Tax Position</h4>
            </div>
            <div className="flex justify-between text-xs text-amber-800">
              <span>
                Holding: <span className="font-bold">365 days</span>
              </span>
              <span className="font-bold uppercase">
                LTCG Eligible
              </span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-amber-900 border-t border-amber-200 pt-2">
              <span>Estimated Tax if redeemed today:</span>
              <span>{formatINR(0)}</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4 pb-12">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
              + Lump sum
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              ↓ Redeem
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
              View All Transactions <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FundDetailSlideout);
