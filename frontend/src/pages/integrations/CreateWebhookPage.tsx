import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Webhook, ArrowRight, ShieldCheck, Code, Play, Eye, EyeOff, Save, X } from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import WidgetCard from "../../components/common/WidgetCard";
import ContextualNav from "./_components/ContextualNav";
import { useIntegrationStore } from "../../store/integration.store";

const CreateWebhookPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useIntegrationStore();
  const [type, setType] = useState<"incoming" | "outgoing">("outgoing");
  const [showSecret, setShowSecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = () => {
    addToast({
      type: "success",
      message: "Webhook endpoint saved successfully!",
    });
    navigate("/integrations/developer");
  };

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      addToast({
        type: "success",
        message: "Test event sent! Response: 200 OK",
      });
    }, 1500);
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
                { label: "Add webhook" },
              ]}
            />

            <h1 className="text-2xl font-black text-slate-900 mb-8">Add webhook endpoint</h1>

            <WidgetCard className="p-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Webhook Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setType("incoming")}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-2 border-2 ${
                        type === "incoming"
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <Webhook size={20} />
                      Incoming
                      <span className="text-[9px] opacity-70 font-bold">From brokers</span>
                    </button>
                    <button
                      onClick={() => setType("outgoing")}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-2 border-2 ${
                        type === "outgoing"
                          ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <Webhook size={20} className="rotate-180" />
                      Outgoing
                      <span className="text-[9px] opacity-70 font-bold">To your server</span>
                    </button>
                  </div>
                </div>

                {type === "outgoing" && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Endpoint URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-server.com/wealthos-wh"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="My production portfolio tracker"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Events to send
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: "p_u", label: "portfolio.updated" },
                          { id: "s_c", label: "sync.completed" },
                          { id: "s_f", label: "sync.failed" },
                          { id: "m_u", label: "maturity.upcoming" },
                        ].map((ev) => (
                          <div
                            key={ev.id}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[11px] font-mono font-bold text-slate-700">
                              {ev.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Signing Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecret ? "text" : "password"}
                          value="whs_7f3a2c9d1e4f5a8b9c0d2e3f4a5b6c7"
                          readOnly
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none pr-14"
                        />
                        <button
                          onClick={() => setShowSecret(!showSecret)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 italic ml-1">
                        Use this secret to verify signatures from WealthOS.
                      </p>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleTest}
                        disabled={isTesting}
                        className="w-full py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        {isTesting ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Play size={18} fill="currentColor" />
                        )}
                        Send test event
                      </button>
                    </div>
                  </div>
                )}

                {type === "incoming" && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-indigo-600" size={24} />
                        <h4 className="text-sm font-black text-indigo-900">Incoming webhooks</h4>
                      </div>
                      <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                        Incoming webhooks are configured per integration. For example, Zerodha uses
                        webhooks to notify WealthOS about trade execution in real-time.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Supported providers
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {["Zerodha", "Upstox", "Fyers", "Groww"].map((p) => (
                          <div
                            key={p}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                          >
                            <span className="text-xs font-bold text-slate-700">{p}</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/integrations")}
                      className="w-full py-4 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-2xl transition-all"
                    >
                      Browse integrations to configure incoming webhooks
                    </button>
                  </div>
                )}

                <div className="pt-4 flex gap-3 border-t border-slate-50">
                  <button
                    onClick={() => navigate("/integrations/developer")}
                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save webhook
                  </button>
                </div>
              </div>
            </WidgetCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateWebhookPage;
