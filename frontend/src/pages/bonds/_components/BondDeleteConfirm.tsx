import React from "react";
import { type Bond } from "../_data/bonds.data";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface BondDeleteConfirmProps {
  bond: Bond;
  onCancel: () => void;
  onConfirm: () => void;
}

const BondDeleteConfirm: React.FC<BondDeleteConfirmProps> = ({ bond, onCancel, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    toast.success("Bond deleted. Backend integration pending.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 py-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Delete Bond?</h2>
          <p className="text-sm text-slate-500 mt-2">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-slate-700">{bond.bond_name}</span> from your
            portfolio? This action cannot be undone.
          </p>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BondDeleteConfirm;
