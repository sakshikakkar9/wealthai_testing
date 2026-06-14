import React from "react";
import { Trash2, Download, Tag, ArrowRightLeft, X } from "lucide-react";
import { usePortfolioStore } from "../../../store/portfolio.store";

const BulkActionBar: React.FC = () => {
  const { selectedRows, clearSelection } = usePortfolioStore();
  const count = selectedRows.size;

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-[240px] right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-4 animate-in slide-in-from-bottom-full duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 text-xs font-bold">
              {count}
            </span>
            <span className="text-sm font-bold text-slate-700">holdings selected</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <ArrowRightLeft size={14} />
              Move Account
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Tag size={14} />
              Tag
            </button>
            <button
              onClick={() => alert("Export coming soon")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download size={14} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        <button
          onClick={clearSelection}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} />
          Deselect All
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;
