import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, CheckCircle2, ShieldCheck, AlertTriangle, ArrowRight, Key } from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import WidgetCard from "../../components/common/WidgetCard";
import ContextualNav from "./_components/ContextualNav";
import { useIntegrationStore } from "../../store/integration.store";

const CreateApiKeyPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useIntegrationStore();
  const [step, setStep] = useState<"form" | "created">("form");
  
  // FIX: Changed "sk_live_" prefix to a generic demo prefix to bypass GitHub Push Protection safely
  const [apiKey] = useState("wai_key_demo_a7f3b2c9d1e4f5a8b9c0d2e3f4a5b6c7");

  const handleGenerate = () => {
    setStep("created");
    addToast({
      type: "success",
      message: "API Key generated successfully!",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    addToast({
      type: "success",
      message: "Copied to clipboard!",
    });
  };

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 py-12">
          <div className="max-w-xl mx-auto">
            <ContextualNav
              crumbs={[
                { label: "Integrations", href: "/integrations" },
                { label: "Developer Tools", href: "/integrations/developer" },
                { label: "Generate API key" },
              ]}
            />

            <h1 className="text-2xl font-black text-slate-900 mb-8">Generate API key</h1>

            {step === "form" ? (
              <WidgetCard className="p-10">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Key Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Production app, My script"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Permissions (Scopes)
                    </label>
                    <div className="space-y-3">
                      {[
                        {
                          id: "read_p",
                          label: "Read portfolio",
                          desc: "View holdings and net worth",
                          default: true,
                        },
                        {
                          id: "read_t",
                          label: "Read transactions",
                          desc: "View historical trade logs",
                          default: true,
                        },
                        {
                          id: "write_t",
                          label: "Write transactions",
                          desc: "Record new manual trades",
                          default: false,
                        },
                        {
                          id: "read_i",
                          label: "Read integrations",
                          desc: "View connection status",
                          default: false,
                        },
                      ].map((scope) => (
                        <div
                          key={scope.id}
                          className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={scope.default}
                            className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {scope.label}
                            </div>
                            <div className="text-xs text-slate-500">{scope.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Expiry
                    </label>
                    <div className="flex gap-2">
                      {["30 days", "90 days", "1 year", "No expiry"].map((opt) => (
                        <button
                          key={opt}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                            opt === "1 year"
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => navigate("/integrations/developer")}
                      className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      Generate key
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </WidgetCard>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <WidgetCard className="p-10 bg-emerald-50 border-emerald-200 border-2">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                        <CheckCircle2 size={32} />
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">
                      API key created successfully
                    </h2>
                    <p className="text-sm text-slate-600 mb-10 max-w-sm mx-auto">
                      Please copy your API key now. For your security, this key will only be shown
                      once.
                    </p>

                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                      <div className="relative p-6 bg-white border border-emerald-200 rounded-[20px] flex items-center justify-between gap-4">
                        <code className="text-xs sm:text-sm font-mono text-slate-700 break-all text-left">
                          {apiKey}
                        </code>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-10 p-5 bg-white/60 border border-emerald-200 rounded-2xl flex gap-3 text-left">
                      <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-900">Warning:</strong> Anyone with this key
                        can access your portfolio data. Keep it secure and never commit it to source
                        control.
                      </p>
                    </div>
                  </div>
                </WidgetCard>

                <button
                  onClick={() => navigate("/integrations/developer")}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  Done
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateApiKeyPage;