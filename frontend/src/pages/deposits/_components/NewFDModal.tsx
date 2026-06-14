import React, { useState } from "react";
import { X, Search, Landmark, ShieldCheck, Calculator, Loader2 } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { formatINR } from "../../../utils/formatters";

const NewFDModal: React.FC = () => {
  const { setShowNewFDModal, addDeposit, isLoading } = useDepositStore();
  const [formData, setFormData] = useState({
    institution_name: "",
    account_number: "",
    account_name: "",
    account_type: "FD",
    interest_type: "cumulative",
    principal_amount: "",
    interest_rate: "",
    start_date: new Date().toISOString().split("T")[0],
    tenure_months: "",
    compounding_freq: "at_maturity",
    maturity_action: "credit_to_account",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addDeposit(formData);
    if (success) {
      setShowNewFDModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => !isLoading && setShowNewFDModal(false)}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Landmark size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Add Fixed Deposit</h2>
                <p className="text-xs text-slate-500 font-medium italic">
                  Record existing FD or book a new one
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNewFDModal(false)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-amber-700 shadow-sm transition-all"
              >
                Record existing FD
              </button>
              <button
                type="button"
                className="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all"
              >
                Book new FD at bank
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                Core Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">Bank Name</label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={14}
                    />
                    <input
                      name="institution_name"
                      value={formData.institution_name}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g. HDFC Bank"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">FD Number</label>
                  <input
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    type="text"
                    placeholder="HDFC-3421-FD"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">Account Name</label>
                  <input
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. My Primary FD"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">FD Type</label>
                  <select
                    name="interest_type"
                    value={formData.interest_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="cumulative">Cumulative</option>
                    <option value="non_cumulative">Non-Cumulative (Payout)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">
                    Principal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      ₹
                    </span>
                    <input
                      name="principal_amount"
                      value={formData.principal_amount}
                      onChange={handleChange}
                      type="number"
                      placeholder="2,00,000"
                      required
                      className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    name="interest_rate"
                    value={formData.interest_rate}
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    placeholder="7.25"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">Start Date</label>
                  <input
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    type="date"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">Tenure (Months)</label>
                  <input
                    name="tenure_months"
                    value={formData.tenure_months}
                    onChange={handleChange}
                    type="number"
                    placeholder="36"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                Payout Settings
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">Interest Compounding</label>
                  <select
                    name="compounding_freq"
                    value={formData.compounding_freq}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="at_maturity">At Maturity</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half_yearly">Half-yearly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 px-1">Auto-renewal</label>
                  <div className="flex gap-4 py-2.5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="maturity_action"
                        value="auto_renew"
                        checked={formData.maturity_action === "auto_renew"}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        Yes
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="maturity_action"
                        value="credit_to_account"
                        checked={formData.maturity_action === "credit_to_account"}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        No
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowNewFDModal(false)}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Fixed Deposit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFDModal;
