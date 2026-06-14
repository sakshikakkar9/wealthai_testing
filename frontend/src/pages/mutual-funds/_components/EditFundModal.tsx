import React, { useState, useEffect } from "react";
import { X, Loader2, IndianRupee } from "lucide-react";
import { useMFStore } from "../../../store/mutualfund.store";
import { Holding } from "../../../api/mf.api";
import { toast } from "sonner";

interface EditFundModalProps {
  fund: Holding;
  onClose: () => void;
}

const EditFundModal: React.FC<EditFundModalProps> = ({ fund, onClose }) => {
  const { updateHolding } = useMFStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [folio, setFolio]   = useState(fund.folio_number ?? "");
  const [units, setUnits]   = useState(String(parseFloat(fund.units ?? "0")));
  const [avgNav, setAvgNav] = useState(String(parseFloat(fund.avg_nav ?? "0")));
  const [investedAmount, setInvestedAmount] = useState(
    String(parseFloat(fund.invested_amount ?? "0"))
  );
  const [manualAmount, setManualAmount] = useState(false);

  // Auto-recalculate invested amount
  useEffect(() => {
    if (manualAmount) return;
    const u = parseFloat(units);
    const n = parseFloat(avgNav);
    if (u > 0 && n > 0) setInvestedAmount((u * n).toFixed(2));
  }, [units, avgNav, manualAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folio.trim()) { setError("Folio number is required"); return; }
    if (parseFloat(units) <= 0) { setError("Units must be greater than 0"); return; }
    if (parseFloat(avgNav) <= 0) { setError("Avg NAV must be greater than 0"); return; }

    setLoading(true);
    setError("");
    try {
      await updateHolding(fund.id, {
        folio_number:    folio.trim(),
        units:           parseFloat(units),
        avg_nav:         parseFloat(avgNav),
        invested_amount: parseFloat(investedAmount),
      });
      toast.success("Holding updated successfully");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update holding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Holding</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update your investment details</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Scheme info (read-only) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scheme</div>
            <div className="text-sm font-bold text-slate-900">{fund.scheme_name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold tracking-wide">
              {fund.fund_house} · {fund.display_category}
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          {/* Folio */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
              Folio Number *
            </label>
            <input
              type="text"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Units + Avg NAV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Units Held *
              </label>
              <input
                type="number" step="0.0001" min="0"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Avg Buy NAV (₹) *
              </label>
              <input
                type="number" step="0.0001" min="0"
                value={avgNav}
                onChange={(e) => setAvgNav(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Invested Amount */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
              Invested Amount (₹)
              <span className="ml-2 text-emerald-500 normal-case font-normal text-[9px]">
                {!manualAmount ? "auto-calculated" : "manual"}
              </span>
            </label>
            <div className="relative">
              <IndianRupee size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number" step="0.01" min="0"
                value={investedAmount}
                onChange={(e) => { setInvestedAmount(e.target.value); setManualAmount(true); }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-3 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditFundModal);
