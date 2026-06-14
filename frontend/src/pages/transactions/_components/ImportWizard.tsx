import React, { useEffect } from "react";
import { X, FileText, Upload, Link2, Check, ChevronRight, AlertCircle } from "lucide-react";
import { useTransactionStore, ImportSource } from "../../../store/transaction.store";

const ImportWizard: React.FC = () => {
  const { toggleImportWizard, importStep, setImportStep, importSource, setImportSource } =
    useTransactionStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleImportWizard();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [toggleImportWizard]);

  const steps = ["Source", "Upload", "Map", "Confirm"];

  const sources: {
    id: ImportSource;
    label: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    { id: "csv", label: "CSV/Excel", description: "Upload standard files", icon: FileText },
    { id: "pdf", label: "PDF Statement", description: "Auto-parse broker PDFs", icon: FileText },
    { id: "zerodha", label: "Zerodha Kite", description: "Connect via API", icon: Link2 },
    { id: "groww", label: "Groww", description: "Import Groww history", icon: Link2 },
  ];

  const renderStep = () => {
    switch (importStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg font-bold text-slate-800">
              How would you like to import?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {sources.map((src) => (
                <button
                  key={src.id}
                  onClick={() => {
                    setImportSource(src.id);
                    setImportStep(1);
                  }}
                  className="flex flex-col items-center p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 mb-3 transition-colors">
                    <src.icon size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{src.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">
                    {src.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg font-bold text-slate-800">
              Upload {importSource?.toUpperCase()} File
            </h3>
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-300 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-indigo-500 mb-4 transition-colors">
                <Upload size={32} />
              </div>
              <p className="text-sm font-bold text-slate-700">Click to browse or drag & drop</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Supports .csv, .xlsx, .xls up to 10MB
              </p>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setImportStep(0)}
                className="px-6 py-2 text-sm font-bold text-slate-500"
              >
                Back
              </button>
              <button
                onClick={() => setImportStep(2)}
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-center text-lg font-bold text-slate-800">Map Columns</h3>
            <p className="text-center text-xs text-slate-500">
              Match your file columns to WealthOS fields
            </p>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { file: "Trade Date", field: "Date" },
                { file: "Instrument", field: "Holding Name" },
                { file: "Buy/Sell", field: "Type" },
                { file: "Quantity", field: "Qty" },
                { file: "Price", field: "Price" },
              ].map((map, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100"
                >
                  <span className="flex-1 text-xs font-bold text-slate-500 italic">
                    "{map.file}"
                  </span>
                  <ChevronRight size={14} className="text-slate-300" />
                  <select className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-indigo-300 outline-none">
                    <option>{map.field}</option>
                  </select>
                  <Check size={16} className="text-emerald-500" />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setImportStep(1)}
                className="px-6 py-2 text-sm font-bold text-slate-500"
              >
                Back
              </button>
              <button
                onClick={() => setImportStep(3)}
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"
              >
                Review
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Review Import</h3>
              <p className="text-sm text-slate-500 mt-1">38 transactions ready to be added</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <AlertCircle size={20} className="text-amber-500" />
                <p className="text-xs font-medium text-amber-700">
                  2 duplicates detected — they will be automatically skipped to prevent data
                  doubling.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Preview (first 3 rows)
                </p>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] font-bold"
                    >
                      <span className="text-slate-700">15 May 2026 • Buy • INFY</span>
                      <span className="text-slate-900">₹92,184</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setImportStep(2)}
                className="px-6 py-2 text-sm font-bold text-slate-500"
              >
                Back
              </button>
              <button
                onClick={() => {
                  window.alert("Import successful! 38 transactions added.");
                  toggleImportWizard();
                }}
                className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100"
              >
                Import 38 Transactions
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      onClick={toggleImportWizard}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Import Transactions</h2>
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-2 h-2 rounded-full ${i <= importStep ? "bg-indigo-600" : "bg-slate-200"}`}
                  />
                  {i < steps.length - 1 && (
                    <div
                      className={`w-4 h-0.5 ${i < importStep ? "bg-indigo-600" : "bg-slate-100"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button
            onClick={toggleImportWizard}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10">{renderStep()}</div>
      </div>
    </div>
  );
};

export default ImportWizard;
