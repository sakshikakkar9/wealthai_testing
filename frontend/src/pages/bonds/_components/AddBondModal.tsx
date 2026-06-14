import React, { useState, useMemo } from "react";
import { useBondStore } from "../../../store/bond.store";
import { X, FileText, Download, AlertCircle } from "lucide-react";
import { formatINR } from "../../../utils/formatters";
import { validateBondForm, FormFields } from "../../../utils/bondUtils";

// --- Sub-components outside to prevent re-creation on render ---

interface InputProps {
  label: string;
  name: keyof FormFields | "account_id"; 
  value: string | number | boolean;
  error?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  error,
  type = "text",
  required = false,
  placeholder = "",
  onChange,
}) => {
  const hasError = !!error;

  let inputValue: string | number = "";
  if (type === "date") {
    inputValue = value as string;
  } else if (typeof value === "boolean") {
    inputValue = value ? "Yes" : "No";
  } else {
    inputValue = (value as string | number) ?? "";
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={inputValue}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`bg-white border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 w-full transition-all ${
          hasError
            ? "border-red-400 focus:border-red-400 focus:ring-red-500/20"
            : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400"
        }`}
      />
      {hasError && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectProps {
  label: string;
  name: keyof FormFields;
  value: string | number;
  error?: string;
  options: string[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  error,
  options,
  required = false,
  onChange,
}) => {
  const hasError = !!error;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label} {required && "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`bg-white border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 w-full transition-all ${
          hasError
            ? "border-red-400 focus:border-red-400 focus:ring-red-500/20"
            : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400"
        }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

// --- Main Component ---

const AddBondModal: React.FC = () => {
  const { closeAddModal } = useBondStore();

  const [formData, setFormData] = useState<FormFields>({
    bond_name: "",
    isin: "",
    bond_type: "Corporate", 
    issuer: "",
    coupon_rate: 0,
    maturity_date: "",
    face_value: 1000,
    coupon_frequency: "Semi-Annual",
    rating: "AAA",
    is_taxable: true,
    quantity: 0,
    purchase_price: 1000,
    purchase_date: "",
  });

  const [accountId, setAccountId] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(() => {
    const qty = formData.quantity || 0;
    const price = formData.purchase_price || 0;
    const rate = formData.coupon_rate || 0;
    const fv = formData.face_value || 1000;

    return {
      invested: qty > 0 && price > 0 ? qty * price : 0,
      annualIncome: qty > 0 && fv > 0 && rate > 0 ? qty * fv * (rate / 100) : 0,
    };
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      let finalValue: string | number | boolean = value;
      if (type === "number") finalValue = parseFloat(value) || 0;
      if (name === "is_taxable") finalValue = value === "Yes";

      return { ...prev, [name]: finalValue };
    });

    if (errors[name as keyof FormFields]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormFields];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateBondForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) element.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const targetIsin = formData.isin && formData.isin.trim() !== "" 
        ? formData.isin.trim() 
        : `CUSTOM-${Date.now()}`;

      const typeMapping: Record<string, string> = {
        "Govt": "government",
        "Corporate": "corporate",
        "SDL": "sdl",
        "SGB": "government", 
        "T-Bill": "t_bill",
        "Tax Free": "tax_free"
      };

      const frequencyMapping: Record<string, string> = {
        "Annual": "annual",
        "Semi-Annual": "semi_annual",
        "Quarterly": "quarterly",
        "Monthly": "monthly",
        "Zero Coupon": "cumulative"
      };

      const dbCompliantBondType = typeMapping[formData.bond_type] || "corporate";
      const dbCompliantFrequency = frequencyMapping[formData.coupon_frequency] || "semi_annual";

      const executionPayload = {
        formData: {
          bond_name: formData.bond_name.trim(),
          isin: targetIsin,
          bond_type: dbCompliantBondType, 
          issuer_name: formData.issuer.trim(), 
          coupon_rate: Number(formData.coupon_rate) || 0,
          maturity_date: formData.maturity_date || null,
          face_value: Number(formData.face_value) || 1000,
          interest_frequency: dbCompliantFrequency, 
          credit_rating: formData.rating || "AAA", 
          is_listed: true,
          quantity: Number(formData.quantity) || 0,
          avg_purchase_price: Number(formData.purchase_price) || 0, 
          invested_amount: (Number(formData.quantity) || 0) * (Number(formData.purchase_price) || 0),
          purchase_date: formData.purchase_date || new Date().toISOString().split('T')[0],
          demat_account: accountId.trim() || null
        }
      };

      const response = await fetch("http://localhost:3000/api/v1/bond/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(executionPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "The database layer rejected this specific entity configuration validation rules.");
      }

      /* ⚡️ SNAZZY PERFORMANCE BOOSTS HERE:
        1. Close the modal instantly so the UI responds immediately.
        2. Wipe local state right away.
        3. Trigger store re-fetch without using 'await' so it loads in the background silently.
        4. Removed the thread-blocking native window alert().
      */
      closeAddModal();

      setFormData({
        bond_name: "",
        isin: "",
        bond_type: "Corporate", 
        issuer: "",
        coupon_rate: 0,
        maturity_date: "",
        face_value: 1000,
        coupon_frequency: "Semi-Annual",
        rating: "AAA",
        is_taxable: true,
        quantity: 0,
        purchase_price: 1000,
        purchase_date: "",
      });
      setAccountId("");
      setErrors({});

      // Fire and forget the sync query to update dashboard cache lists in background
      const currentStoreState = useBondStore.getState() as any;
      if (currentStoreState && typeof currentStoreState.fetchHoldings === "function") {
        currentStoreState.fetchHoldings();
      } else if (currentStoreState && typeof currentStoreState.fetchBonds === "function") {
        currentStoreState.fetchBonds();
      }

    } catch (err: any) {
      console.error("❌ Form Modal Submission Error Interceptor:", err);
      alert(`Persistence failure error: ${err.message || "Could not save entry row to database."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeAddModal} />

      <div className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Add New Bond</h2>
              <p className="text-xs text-slate-500">Record a new fixed income holding</p>
            </div>
          </div>
          <button
            onClick={closeAddModal}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Import Banner */}
          <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400">
                <Download size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Import from PDF/Excel</p>
                <p className="text-[10px] text-slate-500">Auto-fill details from your statement</p>
              </div>
            </div>
            <div className="relative">
              <button
                disabled
                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-bold opacity-50 cursor-not-allowed peer"
              >
                Upload
              </button>
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 invisible peer-hover:opacity-100 peer-hover:visible transition-all">
                Backend required — coming in next release
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} id="add-bond-form" className="space-y-8">
            {/* Bond Details Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                Bond Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Bond Name"
                    name="bond_name"
                    value={formData.bond_name}
                    error={errors.bond_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 7.26% GOI 2032"
                  />
                </div>
                <Input
                  label="ISIN"
                  name="isin"
                  value={formData.isin}
                  error={errors.isin}
                  onChange={handleChange}
                  placeholder="IN0020180066"
                />
                <Select
                  label="Bond Type"
                  name="bond_type"
                  value={formData.bond_type}
                  error={errors.bond_type}
                  onChange={handleChange}
                  required
                  options={["Govt", "Corporate", "SDL", "SGB", "T-Bill", "Tax Free"]}
                />
                <div className="col-span-2">
                  <Input
                    label="Issuer"
                    name="issuer"
                    value={formData.issuer}
                    error={errors.issuer}
                    onChange={handleChange}
                    required
                    placeholder="Government of India"
                  />
                </div>
                <Input
                  label="Coupon Rate (%)"
                  name="coupon_rate"
                  value={formData.coupon_rate}
                  error={errors.coupon_rate}
                  onChange={handleChange}
                  type="number"
                  required
                  placeholder="7.26"
                />
                <Input
                  label="Maturity Date"
                  name="maturity_date"
                  value={formData.maturity_date}
                  error={errors.maturity_date}
                  onChange={handleChange}
                  type="date"
                  required
                />
                <Input
                  label="Face Value"
                  name="face_value"
                  value={formData.face_value}
                  error={errors.face_value}
                  onChange={handleChange}
                  type="number"
                  required
                />
                <Select
                  label="Coupon Frequency"
                  name="coupon_frequency"
                  value={formData.coupon_frequency}
                  error={errors.coupon_frequency}
                  onChange={handleChange}
                  required
                  options={["Annual", "Semi-Annual", "Quarterly", "Zero Coupon"]}
                />
                <Select
                  label="Rating"
                  name="rating"
                  value={formData.rating}
                  error={errors.rating}
                  options={["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "Unrated"]}
                  onChange={handleChange}
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Taxable
                  </label>
                  <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="is_taxable"
                          value={v}
                          checked={
                            (v === "Yes" && formData.is_taxable) ||
                            (v === "No" && !formData.is_taxable)
                          }
                          onChange={handleChange}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Holding Details Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-slate-100 pb-2">
                Holding Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  error={errors.quantity}
                  onChange={handleChange}
                  type="number"
                  required
                  placeholder="100"
                />
                <Input
                  label="Purchase Price"
                  name="purchase_price"
                  value={formData.purchase_price}
                  error={errors.purchase_price}
                  onChange={handleChange}
                  type="number"
                  required
                  placeholder="1000"
                />
                <Input
                  label="Purchase Date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  error={errors.purchase_date}
                  onChange={handleChange}
                  type="date"
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Demat Account
                  </label>
                  <input
                    type="text"
                    name="account_id"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Optional"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Computed Preview */}
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Invested Amount</p>
                <p className="text-lg font-bold text-indigo-900">
                  {preview.invested > 0 ? formatINR(preview.invested) : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Annual Income</p>
                <p className="text-lg font-bold text-indigo-900">
                  {preview.annualIncome > 0 ? formatINR(preview.annualIncome) : "—"}
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeAddModal}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            form="add-bond-form"
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Bond"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBondModal;