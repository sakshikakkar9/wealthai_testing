import React from "react";
import { Zap } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";

const CapitalGainsPanel = () => {
  return (
    <WidgetCard title="Capital Gains Summary" subtitle="FY 2025-26">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
            Equity Mutual Funds
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Long-term gains (&gt;1 year)</span>
              <span className="font-bold text-slate-900">₹18,420</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Exempt (₹1.25L limit)</span>
              <span className="font-bold text-emerald-600">₹18,420 (within limit)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tax payable</span>
              <span className="font-bold text-emerald-600">₹0</span>
            </div>
            <div className="flex justify-between text-[10px] bg-indigo-50 px-2 py-1.5 rounded mt-2">
              <span className="text-indigo-700 font-bold uppercase tracking-wider">
                Remaining Exemption
              </span>
              <span className="font-bold text-indigo-900">₹1,06,580</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Short-term gains (&lt;1 year)</span>
              <span className="font-bold text-slate-900">₹8,240</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tax @ 20%</span>
              <span className="font-bold text-red-600">₹1,648</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
            Debt Mutual Funds
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Realised gains (Slab rate)</span>
              <span className="font-bold text-slate-900">₹4,200</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tax (30% assumed)</span>
              <span className="font-bold text-red-600">₹1,260</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Zap size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
            <span className="font-bold uppercase">Tax Tip:</span> PPFAS Flexi Cap has LTCG of ₹52,610.
            If redeemed, ₹40,030 is within remaining exemption. Tax only on ₹12,580 = ₹1,572. Timing
            matters.
          </p>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(CapitalGainsPanel);
