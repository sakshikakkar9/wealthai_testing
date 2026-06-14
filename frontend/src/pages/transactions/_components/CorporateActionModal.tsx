import React, { useState } from "react";
import { X, Calculator, Info } from "lucide-react";
import { useTransactionStore } from "../../../store/transaction.store";
import { formatNumber } from "../../../utils/formatters";

type CorporateActionType = "bonus" | "split" | "rights" | "merger";

const CorporateActionModal: React.FC = () => {
  const { toggleCorporateAction } = useTransactionStore();
  const [actionType, setActionType] = useState<CorporateActionType>("bonus");

  const types: { id: CorporateActionType; label: string }[] = [
    { id: "bonus", label: "Bonus Issue" },
    { id: "split", label: "Stock Split" },
    { id: "rights", label: "Rights Issue" },
    { id: "merger", label: "Merger" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Record Corporate Action</h2>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
              Update holdings for corporate events
            </p>
          </div>
          <button
            onClick={toggleCorporateAction}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Action Type Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              Action Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActionType(t.id)}
                  className={`
                    px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
                    ${
                      actionType === t.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                    }
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Holding
              </label>
              <input
                type="text"
                placeholder="Search holding..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Ratio / Details
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="1"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  />
                  <span className="text-slate-400 font-bold">:</span>
                  <input
                    type="text"
                    placeholder="5"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Ex-Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Record Date
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50">
            <div className="flex items-center gap-2 mb-3">
              <Calculator size={14} className="text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Preview Impact
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Current Holding</span>
                <span className="text-sm font-bold text-slate-700">120 shares</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">After {actionType}</span>
                <span className="text-sm font-bold text-emerald-600">144 shares (+24 bonus)</span>
              </div>
              <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
                <span className="text-xs text-slate-500">Avg Cost Adjustment</span>
                <span className="text-sm font-bold text-indigo-600">₹980 → ₹816/share</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={toggleCorporateAction}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              window.alert("Corporate action recorded!");
              toggleCorporateAction();
            }}
            className="bg-indigo-600 text-white rounded-xl px-8 py-2.5 text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Record Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorporateActionModal;
