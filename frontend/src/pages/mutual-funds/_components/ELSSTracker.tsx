import React from "react";
import { Plus } from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import { useMFStore } from "../../../store/mutualfund.store";

const ELSSTracker = () => {
  const { setShowAddFundModal } = useMFStore();

  return (
    <WidgetCard title="ELSS Tax Saving" subtitle="Section 80C">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Invested this FY
            </span>
            <span className="text-sm font-bold text-slate-900">₹0</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "0%" }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>₹0</span>
            <span>Target: ₹1,50,000</span>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-900 uppercase">Limit Remaining</span>
          </div>
          <p className="text-xs text-amber-800 font-medium leading-relaxed mb-3">
            You have no ELSS investments. Invest <span className="font-bold">₹1,50,000</span> in
            ELSS to save <span className="font-bold">₹46,800</span> in tax (at 30% slab).
          </p>
          <button
            onClick={() => setShowAddFundModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all shadow-sm"
          >
            <Plus size={14} />
            Invest in ELSS
          </button>
        </div>

        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Top ELSS funds to consider
          </div>
          <div className="space-y-2">
            {[
              { name: "Mirae Asset ELSS Direct", xirr: "18.4%", ter: "0.48%" },
              { name: "Parag Parikh ELSS Direct", xirr: "22.1%", ter: "0.62%" },
              { name: "Axis ELSS Direct", xirr: "17.2%", ter: "0.50%" },
            ].map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-700 group-hover:text-emerald-600">
                  {f.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  5Y: {f.xirr} · TER: {f.ter}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

const AlertTriangle = ({ size, className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export default React.memo(ELSSTracker);
