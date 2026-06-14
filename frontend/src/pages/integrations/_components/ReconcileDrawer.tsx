import React from "react";
import { X, RefreshCw, CheckCircle2, AlertTriangle, Scale, Download } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

const ReconcileDrawer: React.FC = () => {
  const { showReconcile, closeReconcile, reconcileId, integrations } = useIntegrationStore();

  const integration = integrations.find((i) => i.id === reconcileId);

  if (!showReconcile || !integration) return null;

  const handleResolve = (action: string) => {
    window.alert(`Applying change: ${action}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeReconcile}
      />

      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <Scale size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reconcile Holdings</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {integration.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500">Last checked: {integration.lastSync}</span>
              </div>
            </div>
          </div>
          <button
            onClick={closeReconcile}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="px-6 py-4 bg-slate-50/50 flex items-center gap-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">7 Matched</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-sm font-bold text-slate-700">1 Mismatch</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
            <span className="text-sm font-bold text-slate-700">0 Missing</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Mismatch Alert */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">HDFC Bank (HDFCBANK)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Discrepancy found in quantity</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-amber-100">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  WealthOS says
                </p>
                <p className="text-lg font-bold text-slate-900 mt-1">150 shares</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Zerodha shows
                </p>
                <p className="text-lg font-bold text-slate-900 mt-1">125 shares</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  Difference
                </p>
                <p className="text-lg font-bold text-red-600 mt-1">−25 shares</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-amber-700 italic">
                Possible reason: partial sell not yet recorded in WealthOS
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => handleResolve("Use Zerodha value")}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Use Zerodha value
                </button>
                <button
                  onClick={() => handleResolve("Keep WealthOS")}
                  className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Keep WealthOS
                </button>
              </div>
              <button
                onClick={() => handleResolve("Add transaction")}
                className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Record missing transaction →
              </button>
            </div>
          </div>

          {/* Matched Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <CheckCircle2 size={16} />7 holdings match exactly
              </div>
            </div>
            <div className="space-y-2">
              {["INFY", "TCS", "RELIANCE", "BAJFINANCE", "SUNPHARMA", "MARUTI", "Embassy"].map(
                (h) => (
                  <div
                    key={h}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                  >
                    <span className="text-xs font-bold text-slate-700">{h}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-400">Match</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white sticky bottom-0">
          <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {}} // Run again logic
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Run Again
            </button>
            <button
              onClick={closeReconcile}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconcileDrawer;
