import React, { useState } from "react";
import { X, Globe, Lock, Send } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebhookModal: React.FC<WebhookModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useIntegrationStore();
  const [type, setType] = useState<"incoming" | "outgoing">("outgoing");
  const [url, setUrl] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!url.trim()) return;
    addToast({ message: "Webhook saved successfully", type: "success" });
    onClose();
  };

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      addToast({ message: "Test event sent: 200 OK", type: "success" });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Add webhook endpoint</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setType("incoming")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  type === "incoming" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Incoming
              </button>
              <button
                onClick={() => setType("outgoing")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  type === "outgoing" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Outgoing
              </button>
            </div>

            {type === "outgoing" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Endpoint URL
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Globe size={16} />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-server.com/wealthos"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Events to send
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "p.u", label: "portfolio.updated", desc: "Holdings or prices changed" },
                      {
                        id: "s.c",
                        label: "sync.completed",
                        desc: "Account synchronization finished",
                      },
                      { id: "s.f", label: "sync.failed", desc: "Critical failure during sync" },
                    ].map((event) => (
                      <label
                        key={event.id}
                        className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          defaultChecked={event.id !== "s.f"}
                        />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-700">{event.label}</div>
                          <div className="text-[10px] text-slate-500">{event.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Signing secret</span>
                    <span className="text-indigo-600 cursor-pointer hover:underline">Custom</span>
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 font-mono text-xs text-slate-500">
                    <Lock size={14} className="shrink-0" />
                    <span className="flex-1">whs_••••••••••••••••••••7f3a</span>
                    <button className="text-indigo-600 font-bold hover:underline">Reveal</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Globe size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Incoming Webhooks</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
                    Receive events from supported third-party providers directly into WealthOS.
                  </p>
                </div>
                <button className="text-indigo-600 text-xs font-bold hover:underline">
                  View documentation ↗
                </button>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              {type === "outgoing" && (
                <button
                  onClick={handleTest}
                  disabled={!url.trim() || isTesting}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isTesting ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Send test
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={type === "outgoing" && !url.trim()}
                className="flex-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none text-sm"
              >
                Save webhook →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookModal;
