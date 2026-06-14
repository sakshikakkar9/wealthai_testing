import { Holding } from "../../../api/mf.api";
import React from "react";
import SIPCalendar from "../_components/SIPCalendar";
import SIPCard from "../_components/SIPCard";
import SIPPerformanceTable from "../_components/SIPPerformanceTable";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatShortINR } from "../../../utils/formatters";
import { RefreshCw } from "lucide-react";

const SIPManagerTab = ({ funds }: { funds: Holding[] }) => {
  const sipFunds = funds.filter((f) => f.active_sip_count > 0);

  return (
    <div className="px-6 py-5 space-y-5">
      {/* Row 1: Calendar + Cashflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SIPCalendar />
        </div>
        <div className="lg:col-span-1">
          <WidgetCard title="SIP Cashflow" subtitle="Next 30 days">
            <div className="space-y-6">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                  Total Monthly Outflow
                </div>
                <div className="text-3xl font-bold text-slate-900">{formatShortINR(33000)}</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  ✓ All mandates active
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Upcoming Deductions
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold">
                        01
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                        Mirae Large Cap
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹10,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold">
                        05
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                        PPFAS Flexi Cap
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹15,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-600 text-white text-[8px] flex items-center justify-center font-bold">
                        15
                      </div>
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                        SBI Nifty Index
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹5,000</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="text-[10px] text-indigo-700 font-bold uppercase mb-1">
                  SIP Portfolio Value
                </div>
                <div className="text-lg font-bold text-indigo-900">₹3,56,642</div>
                <div className="text-[10px] text-indigo-600 font-medium">+₹73,642 gain (+26%)</div>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* Row 2: Active SIP cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-1">
          Active & Paused SIPs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sipFunds.map((fund) => (
            <SIPCard key={fund.id} fund={fund} />
          ))}
        </div>
      </div>

      {/* Row 3: STP / SWP tracker placeholder */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-1">
          STP & SWP Tracker
        </h3>
        <WidgetCard title="">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
              <RefreshCw size={24} />
            </div>
            <div className="text-sm font-bold text-slate-900 mb-1">
              No active STP or SWP mandates
            </div>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Automate your transfers and withdrawals between funds to manage risk and cash flow.
            </p>
            <button className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
              + Setup STP/SWP
            </button>
          </div>
        </WidgetCard>
      </div>

      {/* Row 4: SIP performance analysis table */}
      <SIPPerformanceTable funds={funds} />
    </div>
  );
};

export default React.memo(SIPManagerTab);
