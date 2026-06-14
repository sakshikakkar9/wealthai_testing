import React from "react";
import { X, Search, Plus } from "lucide-react";
import { usePortfolioStore } from "../../../store/portfolio.store";

const AddHoldingModal: React.FC = () => {
  const { showAddModal, setShowAddModal } = usePortfolioStore();

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={() => setShowAddModal(false)} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Add Holding</h2>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Asset Class
            </label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow appearance-none bg-white">
              <option>Equity</option>
              <option>Mutual Fund</option>
              <option>Fixed Deposit</option>
              <option>Bond</option>
              <option>Gold / SGB</option>
              <option>Real Estate</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Name / Ticker
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search INFY, HDFCBANK..."
                className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Account
            </label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow appearance-none bg-white">
              <option>Rahul Kumar</option>
              <option>Priya Kumar</option>
              <option>Joint Account</option>
              <option>HUF Account</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Quantity
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Average Cost
              </label>
              <input
                type="text"
                placeholder="₹ 0"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Purchase Date
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Tags
              </label>
              <button className="w-full h-[41px] flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm hover:bg-slate-50 transition-colors">
                <Plus size={14} />
                Add tags
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={() => setShowAddModal(false)}
            className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all">
            Add Holding
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHoldingModal;
