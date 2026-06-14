import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Coins,
  FileText,
  Landmark,
  LineChart,
  PieChart,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { usePortfolioStore } from "../../store/portfolio.store";

type AssetType = "equity" | "mf" | "fd" | "bonds" | "gold" | "realestate" | "cash";

const TILES: { key: AssetType; label: string; icon: LucideIcon }[] = [
  { key: "equity", label: "Equity", icon: LineChart },
  { key: "mf", label: "Mutual Fund", icon: PieChart },
  { key: "fd", label: "Fixed Deposit", icon: Landmark },
  { key: "bonds", label: "Bond", icon: FileText },
  { key: "gold", label: "Gold / SGB", icon: Coins },
  { key: "realestate", label: "Real Estate", icon: Building2 },
  { key: "cash", label: "Cash / Bank", icon: Wallet },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/70">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "h-9 w-full rounded-lg border border-white/[0.07] bg-[#0F0F11] px-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#6366F1] focus:outline-none";

function CommonFields() {
  return (
    <>
      <Field label="Account">
        <div className="flex gap-1 rounded-lg border border-white/[0.07] bg-[#0F0F11] p-1">
          {["Primary", "Joint", "Family"].map((a, i) => (
            <button
              type="button"
              key={a}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium ${
                i === 0 ? "bg-indigo-600 text-white" : "text-white/60 hover:bg-white/[0.04]"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Tag">
        <input list="tag-list" className={inputCls} placeholder="Core / Tactical / Long-term..." />
        <datalist id="tag-list">
          <option value="Core" />
          <option value="Tactical" />
          <option value="Long-term" />
          <option value="Dividend" />
          <option value="Speculative" />
        </datalist>
      </Field>
      <Field label="Notes (optional)">
        <textarea rows={2} className={`${inputCls} h-auto py-2`} />
      </Field>
    </>
  );
}

function EquityForm() {
  return (
    <div className="space-y-3">
      <Field label="Stock">
        <input className={inputCls} placeholder="Search NSE/BSE..." />
      </Field>
      <Field label="Exchange">
        <div className="flex gap-1 rounded-lg border border-white/[0.07] bg-[#0F0F11] p-1 w-fit">
          {["NSE", "BSE"].map((x, i) => (
            <button
              type="button"
              key={x}
              className={`rounded-md px-3 py-1 text-xs ${i === 0 ? "bg-indigo-600 text-white" : "text-white/60"}`}
            >
              {x}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Quantity">
          <input type="number" className={inputCls} />
        </Field>
        <Field label="Buy Price">
          <input className={inputCls} placeholder="₹" />
        </Field>
      </div>
      <Field label="Buy Date">
        <input type="date" className={inputCls} />
      </Field>
      <CommonFields />
    </div>
  );
}

function MFForm() {
  return (
    <div className="space-y-3">
      <Field label="Scheme name">
        <input className={inputCls} placeholder="Search scheme..." />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Units">
          <input type="number" className={inputCls} />
        </Field>
        <Field label="NAV at purchase">
          <input className={inputCls} placeholder="₹" />
        </Field>
      </div>
      <Field label="Purchase Date">
        <input type="date" className={inputCls} />
      </Field>
      <Field label="SIP">
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" /> Set as SIP
        </label>
      </Field>
      <CommonFields />
    </div>
  );
}

function FDForm() {
  return (
    <div className="space-y-3">
      <Field label="Bank name">
        <input className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Principal">
          <input className={inputCls} placeholder="₹" />
        </Field>
        <Field label="Interest Rate">
          <input className={inputCls} placeholder="%" />
        </Field>
      </div>
      <Field label="Tenure">
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} type="number" />
          <select className={`${inputCls} w-28`}>
            <option>Days</option>
            <option>Months</option>
            <option>Years</option>
          </select>
        </div>
      </Field>
      <Field label="Start Date">
        <input type="date" className={inputCls} />
      </Field>
      <Field label="Interest payout">
        <select className={inputCls}>
          <option>Simple</option>
          <option>Compound</option>
          <option>Monthly</option>
          <option>Quarterly</option>
        </select>
      </Field>
      <CommonFields />
    </div>
  );
}

function BondForm() {
  return (
    <div className="space-y-3">
      <Field label="Bond / ISIN">
        <input className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Face Value">
          <input className={inputCls} placeholder="₹" />
        </Field>
        <Field label="Purchase Price">
          <input className={inputCls} placeholder="₹" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Coupon Rate">
          <input className={inputCls} placeholder="%" />
        </Field>
        <Field label="Maturity Date">
          <input type="date" className={inputCls} />
        </Field>
      </div>
      <Field label="Frequency">
        <select className={inputCls}>
          <option>Annual</option>
          <option>Semi-annual</option>
          <option>Quarterly</option>
        </select>
      </Field>
      <CommonFields />
    </div>
  );
}

function GoldForm() {
  return (
    <div className="space-y-3">
      <Field label="Sub-type">
        <div className="flex flex-wrap gap-1.5">
          {["Physical Gold", "SGB", "Gold ETF", "Gold MF"].map((s, i) => (
            <button
              type="button"
              key={s}
              className={`rounded-full px-3 py-1 text-xs ${i === 0 ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Quantity (g / units)">
          <input type="number" className={inputCls} />
        </Field>
        <Field label="Purchase Price">
          <input className={inputCls} placeholder="₹" />
        </Field>
      </div>
      <Field label="Purchase Date">
        <input type="date" className={inputCls} />
      </Field>
      <CommonFields />
    </div>
  );
}

function REForm() {
  return (
    <div className="space-y-3">
      <Field label="Property name">
        <input className={inputCls} />
      </Field>
      <Field label="Type">
        <select className={inputCls}>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Land</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Purchase Value">
          <input className={inputCls} placeholder="₹" />
        </Field>
        <Field label="Current Value">
          <input className={inputCls} placeholder="₹" />
        </Field>
      </div>
      <Field label="Purchase Date">
        <input type="date" className={inputCls} />
      </Field>
      <Field label="Rental income">
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" /> Receives rent
        </label>
      </Field>
      <CommonFields />
    </div>
  );
}

function CashForm() {
  return (
    <div className="space-y-3">
      <Field label="Bank name">
        <input className={inputCls} />
      </Field>
      <Field label="Account type">
        <select className={inputCls}>
          <option>Savings</option>
          <option>Current</option>
          <option>Wallet</option>
        </select>
      </Field>
      <Field label="Current balance">
        <input className={inputCls} placeholder="₹" />
      </Field>
      <CommonFields />
    </div>
  );
}

const FORM_MAP: Record<AssetType, () => React.ReactElement> = {
  equity: EquityForm,
  mf: MFForm,
  fd: FDForm,
  bonds: BondForm,
  gold: GoldForm,
  realestate: REForm,
  cash: CashForm,
};

export default function AddHoldingModal() {
  const open = usePortfolioStore((s) => s.isAddModalOpen);
  const close = usePortfolioStore((s) => s.closeAddModal);
  const preselected = usePortfolioStore((s) => s.preselectedAssetClass);
  const editing = usePortfolioStore((s) => s.editingHoldingId);
  const [step, setStep] = useState<"a" | "b">("a");
  const [type, setType] = useState<AssetType | null>(null);

  useEffect(() => {
    if (open && preselected) {
      setType(preselected as AssetType);
      setStep("b");
    } else if (open) {
      setStep("a");
      setType(null);
    }
  }, [open, preselected]);

  const FormCmp = type ? FORM_MAP[type] : null;
  const typeLabel = type ? TILES.find((t) => t.key === type)?.label : "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-2">
                {step === "b" && !preselected && (
                  <button
                    onClick={() => setStep("a")}
                    className="rounded-md p-1 text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <h3 className="text-sm font-semibold text-white">
                  {step === "a"
                    ? "What would you like to add?"
                    : `${editing ? "Edit" : "Add"} ${typeLabel}`}
                </h3>
              </div>
              <button onClick={close} className="rounded-md p-1 text-white/60 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[68vh] overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                {step === "a" ? (
                  <motion.div
                    key="step-a"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    {TILES.map((t) => {
                      const Icon = t.icon;
                      const active = type === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => {
                            setType(t.key);
                            setStep("b");
                          }}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-xs transition ${
                            active
                              ? "border-indigo-600 bg-indigo-600/10"
                              : "border-white/[0.07] bg-[#0F0F11] hover:border-white/20"
                          }`}
                        >
                          <Icon className="h-5 w-5 text-[#6366F1]" />
                          <span className="font-medium text-white">{t.label}</span>
                        </button>
                      );
                    })}
                    <button className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0F0F11] p-4 text-xs text-white/40">
                      <Banknote className="h-5 w-5" />
                      <span>More soon</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-b"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {FormCmp && <FormCmp />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {step === "b" && (
              <div className="flex items-center justify-end gap-2 border-t border-white/[0.07] bg-[#0F0F11]/60 px-5 py-3">
                <button
                  onClick={close}
                  className="rounded-lg px-4 py-2 text-xs text-white/70 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  onClick={close}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  {editing ? "Update Holding" : "Save Holding"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
