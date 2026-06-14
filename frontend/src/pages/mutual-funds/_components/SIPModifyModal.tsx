import React from "react";
import { X, TrendingUp } from "lucide-react";
import { useMFStore } from "../../../store/mutualfund.store";

const SIPModifyModal = () => {
  const { closeSIPModify, modifyingSIPId } = useMFStore();

  if (!modifyingSIPId) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeSIPModify}
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Modify SIP</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              SIP ID: {modifyingSIPId}
            </p>
          </div>
          <button
            onClick={closeSIPModify}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Monthly Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                defaultValue="10000"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              SIP Date
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 5, 10, 15, 20, 25].map((d) => (
                <button
                  key={d}
                  className={`
                    py-3 rounded-xl text-sm font-bold border transition-all
                    ${d === 1 ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <TrendingUp size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-indigo-800 font-medium leading-relaxed">
              Increasing your SIP by <span className="font-bold">₹2,000</span> could add{" "}
              <span className="font-bold">₹4.2L</span> to your 10-year projected portfolio (at 15%
              CAGR).
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          <button className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Update SIP Mandate
          </button>
          <button
            onClick={closeSIPModify}
            className="w-full py-3.5 text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SIPModifyModal);
