import React, { useState, useEffect } from "react";
import { X, Search, Calculator } from "lucide-react";
import { useTransactionStore, TxType } from "../../../store/transaction.store";
import { formatINR } from "../../../utils/formatters";

const TransactionFormModal: React.FC = () => {
  const { closeFormModal, editingTxId } = useTransactionStore();
  const [type, setType] = useState<TxType>("buy");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFormModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeFormModal]);

  const txTypes: { label: string; value: TxType }[] = [
    { label: "Buy", value: "buy" },
    { label: "Sell", value: "sell" },
    { label: "SIP", value: "sip" },
    { label: "STP", value: "stp" },
    { label: "SWP", value: "swp" },
    { label: "Dividend", value: "dividend" },
    { label: "Interest", value: "interest" },
    { label: "Bonus", value: "bonus" },
    { label: "Split", value: "split" },
    { label: "Rights", value: "rights" },
    { label: "Expense", value: "expense" },
    { label: "Fee", value: "fee" },
    { label: "Tax", value: "tax" },
  ];

  const expenseCategories = [
    "Brokerage",
    "Demat Charges",
    "AMC Charges",
    "STT",
    "GST",
    "Stamp Duty",
    "Advisory Fee",
    "Other",
  ];

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={closeFormModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingTxId ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
              {editingTxId ? `TX ID: ${editingTxId}` : "Record a new money movement"}
            </p>
          </div>
          <button
            onClick={closeFormModal}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Type Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              Transaction Type
            </label>
            <div className="flex flex-wrap gap-2">
              {txTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold transition-all
                    ${
                      type === t.value
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-105"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Core Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Date
                </label>
                <input
                  type="date"
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
              </div>
              <div className="relative">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Holding
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search holding..."
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Account
                </label>
                <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                  <option value="rahul">Rahul Kumar</option>
                  <option value="priya">Priya Kumar</option>
                  <option value="joint">Joint Account</option>
                  <option value="huf">HUF Account</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Asset Class
                </label>
                <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                  <option value="equity">Equity</option>
                  <option value="mutual_fund">Mutual Fund</option>
                  <option value="fd">Fixed Deposit</option>
                  <option value="bond">Bond</option>
                  <option value="gold">Gold</option>
                  <option value="real_estate">Real Estate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditional Sections */}
          <div className="pt-4 border-t border-slate-50 space-y-4">
            {(type === "buy" || type === "sell") && (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Price
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Broker
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Ref No
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            )}

            {type === "sip" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Instalment #
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    SIP ID
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            )}

            {type === "dividend" && (
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Rate/Unit
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Ex-Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Record Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    TDS
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            )}

            {(type === "expense" || type === "fee" || type === "tax") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Category
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {expenseCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            )}

            {(type === "bonus" || type === "split" || type === "rights") && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Ratio
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1:5"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Ex-Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Record Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Computation Section */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Calculator size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Net Transaction Value
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">{formatINR(92184)}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Gross
                </p>
                <p className="text-sm font-bold text-slate-700">{formatINR(92000)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Charges
                </p>
                <p className="text-sm font-bold text-red-600">{formatINR(184)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              placeholder="Add any internal remarks..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={closeFormModal}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              window.alert("Transaction saved!");
              closeFormModal();
            }}
            className="bg-indigo-600 text-white rounded-xl px-8 py-2.5 text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            {editingTxId ? "Save Changes" : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFormModal;
