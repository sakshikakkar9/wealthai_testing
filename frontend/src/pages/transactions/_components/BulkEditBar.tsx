import React from "react";
import { X, Trash2, Download, Tag, ArrowRightLeft } from "lucide-react";
import { useTransactionStore } from "../../../store/transaction.store";

const BulkEditBar: React.FC = () => {
  const { selectedRows, clearSelection } = useTransactionStore();
  const count = selectedRows.size;
  const isVisible = count > 0;

  const handleBulkAction = (action: string) => {
    window.alert(`Bulk action: ${action} for ${count} transactions.`);
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 lg:left-[240px] right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-4
        transition-all duration-300 transform
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-sm shadow-indigo-100">
            {count} selected
          </div>
          <button
            onClick={clearSelection}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            title="Deselect all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBulkAction("Change Account")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <ArrowRightLeft size={16} className="text-slate-400" />
            Change Account
          </button>

          <button
            onClick={() => handleBulkAction("Re-categorise")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <Tag size={16} className="text-slate-400" />
            Re-categorise
          </button>

          <button
            onClick={() => handleBulkAction("Export")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <Download size={16} className="text-slate-400" />
            Export CSV
          </button>

          <div className="w-px h-6 bg-slate-100 mx-2" />

          <button
            onClick={() => handleBulkAction("Delete")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditBar;
