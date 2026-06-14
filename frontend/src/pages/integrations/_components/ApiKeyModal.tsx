import React, { useState } from "react";
import { X, Copy, ShieldCheck } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useIntegrationStore();
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!name.trim()) return;
    const key = `sk-live-${Math.random().toString(36).substring(2, 15)}${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    setGeneratedKey(key);
    setStep("success");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    addToast({ message: "API key copied to clipboard", type: "success" });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {step === "form" ? "Generate API key" : "API key generated"}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {step === "form" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Key Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Production app, My script"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Read portfolio",
                    "Read transactions",
                    "Write transactions",
                    "Read integrations",
                  ].map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        defaultChecked={perm.startsWith("Read")}
                      />
                      <span className="text-xs font-medium text-slate-700">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Expiry
                </label>
                <div className="flex flex-wrap gap-2">
                  {["30 days", "90 days", "1 year", "No expiry"].map((exp) => (
                    <button
                      key={exp}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        exp === "1 year"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!name.trim()}
                  className="flex-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                >
                  Generate key →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-sm font-bold text-emerald-800">Your API key is ready</h3>
                <p className="text-xs text-emerald-600 mt-1">
                  Copy this key now. You won't be able to see it again.
                </p>

                <div className="mt-6 flex items-center gap-2 bg-white border border-emerald-200 rounded-xl p-4 font-mono text-xs text-slate-800 break-all text-left">
                  <span className="flex-1">{generatedKey}</span>
                  <button
                    onClick={copyToClipboard}
                    className="shrink-0 p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start text-amber-800">
                <div className="shrink-0 mt-0.5 font-bold text-lg">⚠</div>
                <div className="text-[10px] leading-relaxed">
                  For security, we only show this key once. If you lose it, you'll need to revoke it
                  and generate a new one. Never share your API key or commit it to version control.
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                I've copied it, close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
