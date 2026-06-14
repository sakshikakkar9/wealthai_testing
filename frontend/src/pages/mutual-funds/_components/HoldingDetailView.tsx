import React from "react";
import { ArrowLeft, Star, Briefcase } from "lucide-react";
import { Holding } from "../../../api/mf.api";
import { formatINR, formatDate, gainDisplay, managerName, starDisplay } from "./mfUtils";
import Badge from "../../../components/common/Badge";

interface HoldingDetailViewProps {
  fund: Holding;
  onClose: () => void;
}

const HoldingDetailView: React.FC<HoldingDetailViewProps> = ({ fund, onClose }) => {
  const gain = gainDisplay(fund.gain_loss, fund.gain_pct);
  const dayChange = parseFloat(fund.day_change_percent);
  const isTodayPositive = dayChange >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F0EF] overflow-y-auto">

      {/* ── Top Bar with Back Link ─────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Holdings
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-sm text-slate-400 font-medium">{fund.scheme_name}</span>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  {(fund.fund_house || "MF").split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{fund.scheme_name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 font-semibold">{fund.fund_house}</span>
                    <Badge variant="success" className="text-[9px]">{fund.display_category}</Badge>
                    <Badge variant={fund.plan_type?.toLowerCase() === 'direct' ? 'success' : 'warning'} className="text-[9px]">
                      {fund.plan_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{formatINR(fund.current_value)}</div>
              <div className={`text-sm font-bold mt-1 ${gain.cls}`}>{gain.text}</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Invested Amount",  value: formatINR(fund.invested_amount), sub: null },
            { label: "Current Value",    value: formatINR(fund.current_value),   sub: null },
            { label: "Units Held",       value: parseFloat(fund.units).toFixed(4), sub: null },
            { label: "Avg Buy NAV",      value: formatINR(fund.avg_nav),         sub: null },
            { label: "Current NAV",      value: formatINR(fund.current_nav),     sub: formatDate(fund.nav_date) },
            { label: "1D Change",
              value: `${isTodayPositive ? '+' : ''}${dayChange}%`,
              sub: null,
              cls: isTodayPositive ? 'text-green-600' : 'text-red-500' },
            { label: "Gain / Loss",      value: gain.text, sub: null, cls: gain.cls },
            { label: "Folio Number",     value: fund.folio_number, sub: null },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
              <div className={`text-base font-bold ${(m as any).cls || 'text-slate-900'}`}>{m.value}</div>
              {m.sub && <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>}
            </div>
          ))}
        </div>

        {/* Fund Info Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Fund Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Briefcase size={10} /> Fund Manager
              </div>
              <div className="text-sm font-semibold text-slate-800">{managerName(fund.fund_manager_name)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expense Ratio</div>
              <div className="text-sm font-semibold text-slate-800">{parseFloat(fund.expense_ratio).toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Star size={10} /> Star Rating
              </div>
              <div className="text-sm font-semibold text-amber-500">{starDisplay(fund.star_rating)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</div>
              <div className="text-sm font-semibold text-slate-800">{fund.display_category}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Plan Type</div>
              <div className="text-sm font-semibold text-slate-800">{fund.plan_type}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active SIPs</div>
              <div className="text-sm font-semibold text-slate-800">
                {fund.active_sip_count > 0
                  ? <Badge variant="success">{fund.active_sip_count} Active</Badge>
                  : <span className="text-slate-400">None</span>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(HoldingDetailView);
