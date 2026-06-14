import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Search, IndianRupee, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useMFStore } from "../../../store/mutualfund.store";
import { fetchMFSchemes, Scheme } from "../../../api/mf.api";
import { toast } from "sonner";

const AddFundModal = () => {
  const { setShowAddFundModal, addHolding } = useMFStore();

  // Scheme search state
  const [schemeQuery, setSchemeQuery] = useState("");
  const [schemeResults, setSchemeResults] = useState<Scheme[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Form fields
  const [folio, setFolio] = useState("");
  const [units, setUnits] = useState("");
  const [avgNav, setAvgNav] = useState("");
  const [investedAmount, setInvestedAmount] = useState("");
  const [manualAmount, setManualAmount] = useState(false);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schemeInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus scheme input on mount
  useEffect(() => {
    setTimeout(() => schemeInputRef.current?.focus(), 50);
  }, []);

  // Scheme search with debounce
  useEffect(() => {
    if (schemeQuery.length < 2) {
      setSchemeResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSchemeLoading(true);
      try {
        const results = await fetchMFSchemes(schemeQuery);
        // Guard: ensure results is an array (defensive against API shape changes)
        setSchemeResults(Array.isArray(results) ? results : []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Scheme search failed:", err);
        setSchemeResults([]);
      } finally {
        setSchemeLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [schemeQuery]);

  // Auto-calculate invested amount
  useEffect(() => {
    if (manualAmount) return;
    const u = parseFloat(units);
    const n = parseFloat(avgNav);
    if (u > 0 && n > 0) {
      setInvestedAmount((u * n).toFixed(2));
    } else {
      setInvestedAmount("");
    }
  }, [units, avgNav, manualAmount]);

  const handleSchemeSelect = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setSchemeQuery(scheme.scheme_name);
    setShowDropdown(false);
    setSchemeResults([]);
    // Clear scheme error if any
    setErrors((prev) => {
      const next = { ...prev };
      delete next.scheme;
      return next;
    });
  };

  const handleClearScheme = () => {
    setSelectedScheme(null);
    setSchemeQuery("");
    setSchemeResults([]);
    setShowDropdown(false);
    setManualAmount(false);
    setInvestedAmount("");
    setTimeout(() => schemeInputRef.current?.focus(), 50);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!selectedScheme)                      e.scheme = "Please select a scheme from the dropdown";
    if (!folio.trim())                        e.folio  = "Folio number is required";
    if (!units || parseFloat(units) <= 0)     e.units  = "Units must be greater than 0";
    if (!avgNav || parseFloat(avgNav) <= 0)   e.avgNav = "Avg NAV must be greater than 0";
    if (!investedAmount || parseFloat(investedAmount) <= 0)
                                              e.amount = "Invested amount must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addHolding({
        scheme_id:        selectedScheme!.scheme_id,
        folio_number:     folio.trim(),
        units:            parseFloat(units),
        avg_nav:          parseFloat(avgNav),
        invested_amount:  parseFloat(investedAmount),
      });
      toast.success("Holding added successfully");
      handleClose();
    } catch (err: any) {
      if (err.message?.includes("duplicate") || err.message?.includes("conflict")) {
        toast.success("Holding updated successfully");
        handleClose();
      } else {
        setErrors({ server: err.message || "Failed to add holding. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    setSelectedScheme(null);
    setSchemeQuery("");
    setSchemeResults([]);
    setShowDropdown(false);
    setFolio("");
    setUnits("");
    setAvgNav("");
    setInvestedAmount("");
    setManualAmount(false);
    setErrors({});
    setIsSubmitting(false);
    setShowAddFundModal(false);
  }, [setShowAddFundModal]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal card — stopPropagation prevents backdrop click from firing */}
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Mutual Fund</h2>
            <p className="text-xs text-slate-400 mt-0.5">Search a scheme and enter your holding details</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* Server error banner */}
          {errors.server && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              {errors.server}
            </div>
          )}

          {/* ── SCHEME SEARCH ─────────────────────────────────── */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
              Scheme Name *
            </label>

            {selectedScheme ? (
              /* Selected scheme pill */
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{selectedScheme.scheme_name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 uppercase font-semibold tracking-wide">
                      {selectedScheme.fund_house}
                      <span className="mx-1 text-slate-300">·</span>
                      {selectedScheme.category} — {selectedScheme.sub_category}
                      {selectedScheme.plan_type && (
                        <span className="ml-2 bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {selectedScheme.plan_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearScheme}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              /* Search input */
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                  size={16}
                />
                <input
                  ref={schemeInputRef}
                  type="text"
                  value={schemeQuery}
                  onChange={(e) => setSchemeQuery(e.target.value)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onFocus={() => schemeResults.length > 0 && setShowDropdown(true)}
                  placeholder="Type fund name (e.g. Mirae, Axis, HDFC)..."
                  className={`w-full pl-11 pr-10 py-3.5 bg-slate-50 border ${
                    errors.scheme ? "border-red-300" : "border-slate-200"
                  } rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
                />
                {schemeLoading && (
                  <Loader2
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin"
                  />
                )}
              </div>
            )}

            {errors.scheme && (
              <p className="mt-1 text-[10px] text-red-500 font-bold ml-1">{errors.scheme}</p>
            )}

            {/* Dropdown results */}
            {showDropdown && schemeResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-52 overflow-y-auto"
              >
                {schemeResults.map((s) => (
                  <div
                    key={s.scheme_id}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur before click registers
                      e.stopPropagation();
                      handleSchemeSelect(s);
                    }}
                    className="flex flex-col px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                  >
                    <span className="text-sm font-semibold text-slate-800">{s.scheme_name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                      {s.fund_house}
                      <span className="mx-1 text-slate-300">·</span>
                      {s.category} — {s.sub_category}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {showDropdown && !schemeLoading && schemeQuery.length >= 2 && schemeResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 px-4 py-6 text-center text-sm text-slate-400">
                No schemes found for "{schemeQuery}"
              </div>
            )}
          </div>

          {/* ── FOLIO NUMBER ──────────────────────────────────── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
              Folio Number *
            </label>
            <input
              type="text"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              placeholder="e.g. MF-12345678"
              className={`w-full px-4 py-3 bg-slate-50 border ${
                errors.folio ? "border-red-300" : "border-slate-200"
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
            />
            {errors.folio && (
              <p className="mt-1 text-[10px] text-red-500 font-bold ml-1">{errors.folio}</p>
            )}
          </div>

          {/* ── UNITS + AVG NAV (side by side) ───────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Units Held *
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                placeholder="0.0000"
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  errors.units ? "border-red-300" : "border-slate-200"
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
              {errors.units && (
                <p className="mt-1 text-[10px] text-red-500 font-bold ml-1">{errors.units}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Avg Buy NAV (₹) *
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={avgNav}
                onChange={(e) => setAvgNav(e.target.value)}
                placeholder="0.0000"
                className={`w-full px-4 py-3 bg-slate-50 border ${
                  errors.avgNav ? "border-red-300" : "border-slate-200"
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
              {errors.avgNav && (
                <p className="mt-1 text-[10px] text-red-500 font-bold ml-1">{errors.avgNav}</p>
              )}
            </div>
          </div>

          {/* ── INVESTED AMOUNT (auto-calculated) ────────────── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
              Invested Amount (₹)
              <span className="ml-2 text-emerald-500 normal-case font-normal text-[9px]">
                {!manualAmount && units && avgNav ? "auto-calculated" : ""}
              </span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee size={15} />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={investedAmount}
                onChange={(e) => {
                  setInvestedAmount(e.target.value);
                  setManualAmount(true);
                }}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                  errors.amount ? "border-red-300" : "border-slate-200"
                } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-[10px] text-red-500 font-bold ml-1">{errors.amount}</p>
            )}
            {/* Live preview */}
            {selectedScheme && units && avgNav && investedAmount && (
              <div className="mt-2 px-3 py-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 font-medium flex gap-4">
                <span>Units: <strong className="text-slate-700">{parseFloat(units).toFixed(4)}</strong></span>
                <span>×</span>
                <span>NAV: <strong className="text-slate-700">₹{parseFloat(avgNav).toFixed(4)}</strong></span>
                <span>=</span>
                <span>Value: <strong className="text-emerald-700">₹{(parseFloat(units) * parseFloat(avgNav)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></span>
              </div>
            )}
          </div>

          {/* ── ACTION BUTTONS ────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {isSubmitting ? "Adding..." : "Add Holding"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFundModal;
