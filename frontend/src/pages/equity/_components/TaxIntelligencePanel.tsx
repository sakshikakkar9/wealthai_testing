import React from "react";
import { Shield, Zap, TrendingDown, Clock, Info } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatINR, formatShortINR } from "../../../utils/formatters";

interface SummaryProps {
  summary: {
    ltcgRealized: number;
    stcgRealized: number;
    ltcgTax: number;
    stcgTax: number;
    totalUnrealizedGain: number;
    totalUnrealizedTax: number;
  };
}

export const TaxSummaryCard: React.FC<SummaryProps> = ({ summary }) => (
  <WidgetCard title="Tax P&L Summary" subtitle="FY 2025-26">
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
          Realised gains this FY
        </span>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">Long-term (&gt;1 year)</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                Exemption used
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Gain: {formatShortINR(summary.ltcgRealized)}</span>
              <span className="text-slate-900 font-bold">
                Tax @ 10%: {formatShortINR(summary.ltcgTax)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              (₹1L exempt — taxable: ₹nil above exemption)
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-700">Short-term (&lt;1 year)</span>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Gain: {formatShortINR(summary.stcgRealized)}</span>
              <span className="text-slate-900 font-bold">
                Tax @ 15%: {formatShortINR(summary.stcgTax)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-900">Total tax booked this FY:</span>
          <span className="text-sm font-bold text-indigo-600">
            {formatINR(summary.ltcgTax + summary.stcgTax)}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
          Unrealised gains (if booked today)
        </span>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-600 font-medium">
            LTCG: {formatShortINR(summary.totalUnrealizedGain)}
          </span>
          <span className="text-slate-900 font-bold">
            Tax liability: {formatShortINR(summary.totalUnrealizedTax)}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mb-4">
          (Note: ₹1L annual LTCG exemption already used)
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 items-start">
          <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[10px] text-amber-800 leading-normal">
            <span className="font-bold">HDFC Bank</span> crosses 1Y on 14 Jun 2026 —{" "}
            <span className="font-bold">15 days</span>
            <br />
            STCG rate 15% → LTCG 10% · Potential saving: <span className="font-bold">₹1,080</span>
          </div>
        </div>
      </div>
    </div>
  </WidgetCard>
);

export const TaxHarvestPanel: React.FC<{ harvestable: number; saving: number }> = ({
  harvestable,
  saving,
}) => (
  <WidgetCard title="Tax Harvesting Opportunities">
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Book these losses to offset gains and reduce your tax bill
      </p>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <TrendingDown size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Asian Paints (ASIANPAINT)</div>
            <div className="text-[10px] font-bold text-red-600 uppercase">
              Current loss: −{formatINR(26800)} (−10.0%)
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-2 rounded-lg text-xs font-bold">
            <Zap size={14} />
            Booked loss offsets STCG → Tax saving: {formatINR(saving)}
          </div>

          <div className="flex gap-2 items-start text-[10px] text-slate-500 leading-relaxed">
            <Info size={12} className="shrink-0 mt-0.5" />
            <span>
              How: Sell 100 shares → re-buy after 30 days to maintain position while realizing the
              tax-loss benefit.
            </span>
          </div>
        </div>

        <button
          onClick={() => window.alert("Navigating to transactions with pre-fill...")}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
        >
          Harvest this loss →
        </button>
      </div>

      <p className="text-[10px] text-slate-400 italic text-center">
        Tax calculations are indicative. Consult your CA before acting.
      </p>
    </div>
  </WidgetCard>
);

const TaxIntelligencePanel: React.FC<SummaryProps & { harvestable: number; saving: number }> = (
  props,
) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TaxSummaryCard summary={props.summary} />
      <TaxHarvestPanel harvestable={props.harvestable} saving={props.saving} />
    </div>
  );
};

export default TaxIntelligencePanel;
