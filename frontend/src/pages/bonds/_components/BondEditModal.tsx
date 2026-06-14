// src/components/modals/BondEditModal.tsx
import React, { useState, useEffect } from "react";
import { useBondStore } from "../../../store/bond.store";
import { type Bond } from "../_data/bonds.data";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

interface BondEditModalProps {
  bond: Bond;
  onClose: () => void;
  onSuccess: () => void;
}

type BondEditFormData = Partial<Bond> & {
  issuer_name?: string;
};

const BondEditModal: React.FC<BondEditModalProps> = ({ bond, onClose, onSuccess }) => {
  const { updateBond } = useBondStore();
  const [formData, setFormData] = useState<BondEditFormData>({});
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Helper utility transforming arbitrary date string layouts (e.g., "14 Aug 2033")
   * directly into valid HTML5 input value variants ("yyyy-MM-dd") safely.
   */
  const formatDateToInput = (dateString: any): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    // Fallback block if parsing fails due to invalid parameters
    if (isNaN(date.getTime())) return ""; 
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (bond) {
      // Safely transform dates into standardized inputs during form initialization
      setFormData({
        ...bond,
        maturity_date: formatDateToInput(bond.maturity_date),
      });
    }
  }, [bond]);

  const handleSave = async () => {
    // Resolve the bond_id from your data object structure
    const bondId = (bond as any).bond_id || bond.id || (bond as any).holding_id || (bond as any)._id;

    if (!bondId) {
      console.error("❌ Trace Error: Could not resolve a valid primary identifier on object:", bond);
      toast.error("Unable to update: Bond holding ID could not be identified.");
      return;
    }

    setIsSaving(true);
    try {
      // Synchronize local store runtime context state matching database fields
      await updateBond(bondId, formData);
      
      toast.success("Bond metrics synced and updated successfully in DB!");
      onSuccess();
    } catch (error: any) {
      console.error("Failed to commit updates:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update bond record.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["coupon_rate", "ytm", "invested_amount", "current_value", "quantity", "avg_purchase_price"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Bond</h2>
            <p className="text-sm text-slate-500 mt-0.5">Update bond information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bond Name
              </label>
              <input
                type="text"
                name="bond_name"
                value={formData.bond_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ISIN
              </label>
              <input
                type="text"
                name="isin"
                value={formData.isin || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Issuer
              </label>
              <input
                type="text"
                name="issuer_name"
                value={formData.issuer_name || formData.issuer || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Maturity Date
              </label>
              <input
                type="date"
                name="maturity_date"
                value={formData.maturity_date || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Coupon Rate (%)
              </label>
              <input
                type="number"
                name="coupon_rate"
                step="0.01"
                value={formData.coupon_rate || 0}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                YTM (%)
              </label>
              <input
                type="number"
                name="ytm"
                step="0.01"
                value={formData.ytm || 0}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BondEditModal;