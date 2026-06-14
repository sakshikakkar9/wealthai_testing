import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Webhook, Copy, RotateCw, Trash2, Terminal, ArrowRight, Code } from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore } from "../../store/integration.store";
import WidgetCard from "../../components/common/WidgetCard";
import ContextualNav from "./_components/ContextualNav";
import ApiKeyModal from "./_components/ApiKeyModal";
import WebhookModal from "./_components/WebhookModal";

const DeveloperPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useIntegrationStore();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleAddKey = () => {
    if (isMobile) navigate("/integrations/developer/keys/new");
    else setIsApiKeyModalOpen(true);
  };

  const handleAddWebhook = () => {
    if (isMobile) navigate("/integrations/developer/webhooks/new");
    else setIsWebhookModalOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <ContextualNav
              crumbs={[
                { label: "Integrations", href: "/integrations" },
                { label: "Developer Tools" },
              ]}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1">Developer Tools</h1>
                <p className="text-sm text-slate-500 font-medium">
                  API keys, webhooks, and sync monitoring for advanced use cases.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddWebhook}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  <Webhook size={18} />
                  Add webhook
                </button>
                <button
                  onClick={handleAddKey}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Plus size={20} />
                  Generate API key
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* WealthOS API Keys */}
              <WidgetCard
                title="WealthOS API Keys"
                action={
                  <button
                    onClick={handleAddKey}
                    className="text-xs font-black text-indigo-600 hover:underline"
                  >
                    + Generate key
                  </button>
                }
              >
                <div className="mt-4 space-y-4">
                  {[
                    {
                      name: "Production key",
                      key: "sk-live-••••4f2a",
                      scope: "read:all",
                      date: "10 Jan",
                    },
                    {
                      name: "Development key",
                      key: "sk-dev-••••2b1c",
                      scope: "read:portfolio",
                      date: "15 Mar",
                    },
                  ].map((key, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">{key.name}</span>
                        <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md uppercase">
                          {key.scope}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs font-mono text-slate-500">{key.key}</code>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            // FIX: Swapped out "sk_live_" prefix for custom mockup prefix to unblock Git Push
                            onClick={() => handleCopy("wai_key_demo_a7f3b2c9d1e4f5a8b9c0d2e3f4a5b6c7")}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                            <RotateCw size={14} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </WidgetCard>

              {/* 3rd Party Keys */}
              <WidgetCard title="Third-Party Keys">
                <div className="mt-4 space-y-4">
                  {[
                    { provider: "Fyers", status: "Active", type: "OAuth 2.0" },
                    { provider: "Alpha Vantage", status: "Active", type: "API Key" },
                    { provider: "NSE Feed", status: "Active", type: "Internal" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                          <Terminal size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{item.provider}</div>
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                            {item.type}
                          </div>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>

            {/* Webhooks Section */}
            <WidgetCard
              title="Webhooks"
              action={
                <button
                  onClick={handleAddWebhook}
                  className="text-xs font-black text-indigo-600 hover:underline"
                >
                  + Add webhook
                </button>
              }
            >
              <div className="mt-6 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Outgoing Webhooks
                  </h4>
                  {[
                    {
                      method: "POST",
                      url: "https://api.myapp.com/wh/portfolio",
                      event: "portfolio.updated",
                      last: "Today 09:17",
                    },
                    {
                      method: "POST",
                      url: "https://webhooks.site/7f3a2c9d",
                      event: "sync.completed",
                      last: "2 days ago",
                    },
                  ].map((wh, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                          {wh.method}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-slate-700 truncate max-w-xs">
                            {wh.url}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-500">
                              {wh.event}
                            </span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] font-medium text-slate-400">
                              Last: {wh.last}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 text-[10px] font-black text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          Test
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Code size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </WidgetCard>

            {/* Logs Summary */}
            <div className="mt-8">
              <WidgetCard
                title="Recent API Activity"
                action={
                  <button
                    onClick={() => navigate("/integrations/logs")}
                    className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    View all logs
                    <ArrowRight size={14} />
                  </button>
                }
              >
                <div className="mt-6 space-y-2">
                  {[
                    { method: "GET", path: "/v1/portfolio", status: 200, time: "2 min ago" },
                    { method: "GET", path: "/v1/holdings/zerodha", status: 200, time: "4 min ago" },
                    { method: "POST", path: "/v1/webhooks/test", status: 201, time: "15 min ago" },
                    { method: "GET", path: "/v1/transactions", status: 401, time: "1 hr ago" },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            log.method === "GET"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {log.method}
                        </span>
                        <code className="text-[11px] font-mono text-slate-600">{log.path}</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold ${
                            log.status >= 400 ? "text-red-500" : "text-emerald-500"
                          }`}
                        >
                          {log.status}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>
          </div>
        </main>
      </div>

      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
      <WebhookModal isOpen={isWebhookModalOpen} onClose={() => setIsWebhookModalOpen(false)} />
    </div>
  );
};

export default DeveloperPage;