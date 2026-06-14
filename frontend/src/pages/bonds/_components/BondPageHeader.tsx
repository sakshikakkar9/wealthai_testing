import React, { useRef } from "react";
import { useBondStore } from "../../../store/bond.store";
import { Download, Plus, Loader2, AlertCircle, X, FileUp } from "lucide-react";
import { parseCSV, parseXLSX, parsePDF } from "../../../utils/importBondParser";
import { hydrateBonds } from "../_data/bonds.data";
import { formatINR } from "../../../utils/formatters";
import { exportBondsToCSV } from "../../../utils/exportUtils";

const BondPageHeader: React.FC = () => {
  const {
    openAddModal,
    addBonds,
    importLoading,
    setImportLoading,
    importError,
    setImportError,
    bonds,
  } = useBondStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalValue = bonds.reduce((sum, b) => sum + Number(b.current_value ?? 0), 0);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    exportBondsToCSV(bonds, "all_bonds.csv");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportError(null);

    try {
      let parsedRawBonds = [];
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension === "csv") {
        parsedRawBonds = await parseCSV(file);
      } else if (extension === "xlsx" || extension === "xls") {
        parsedRawBonds = await parseXLSX(file);
      } else if (extension === "pdf") {
        parsedRawBonds = await parsePDF(file);
      } else {
        throw new Error("Unsupported file format. Please upload PDF, CSV, or XLSX.");
      }

      const newBonds = hydrateBonds(parsedRawBonds);
      addBonds(newBonds);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Import error:", error);
      setImportError(error instanceof Error ? error.message : "Failed to import bonds.");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="px-6 py-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="mr-4">
            <h1 className="text-2xl font-semibold text-slate-800">Bond Portfolio</h1>
            <p className="text-sm text-slate-500 mt-1">
              Fixed income holdings · {bonds.length} bonds · {formatINR(totalValue)} current value
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.csv,.xlsx,.xls"
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleImportClick}
            disabled={importLoading}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 rounded-xl px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importLoading ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
            <span>{importLoading ? "Importing..." : "Import"}</span>
          </button>

          <button
            onClick={handleExportClick}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-600 rounded-xl px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors ml-2"
          >
            <Plus size={16} />
            <span>Add Bond</span>
          </button>
        </div>
      </div>

      {importError && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-sm text-red-700 font-medium">{importError}</p>
          <button
            onClick={() => setImportError(null)}
            className="ml-auto text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BondPageHeader;
