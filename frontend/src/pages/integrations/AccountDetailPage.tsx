import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  History,
  Scale,
  Plus,
  ArrowRight,
  ShieldCheck,
  Pause,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore } from "../../store/integration.store";
import WidgetCard from "../../components/common/WidgetCard";
import ContextualNav from "./_components/ContextualNav";

const AccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { integrations, startSyncProgress, openDisconnectModal, openReAuthModal, addToast } =
    useIntegrationStore();

  const integration = integrations.find((i) => i.id === id);

  if (
    !integration ||
    integration.status === "disconnected" ||
    integration.status === "coming_soon"
  ) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F2F0EF]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Account not found or not connected</h2>
          <button
            onClick={() => navigate("/integrations")}
            className="mt-4 text-indigo-600 font-bold"
          >
            Back to Integrations
          </button>
        </div>
      </div>
    );
  }

  const isHealthy = integration.status === "connected" || integration.status === "syncing";

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <ContextualNav
              crumbs={[
                { label: "Integrations", href: "/integrations" },
                { label: "Account Details" },
                { label: integration.name },
              ]}
            />

            <div className="space-y-6">
              {/* Header Card */}
              <WidgetCard className="p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 text-center sm:text-left">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg ${integration.logoColor}`}
                    >
                      {integration.logoInitials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                        <h1 className="text-2xl font-black text-slate-900">{integration.name}</h1>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            isHealthy
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${isHealthy ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                          />
                          {integration.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        {integration.category.replace("_", " ")} · Connected since 10 Jan 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startSyncProgress(integration.id, integration.name)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      <RefreshCw size={16} />
                      Sync now
                    </button>
                    <button
                      onClick={() => navigate(`/integrations/${id}/reconcile`)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      <Scale size={16} />
                      Reconcile
                    </button>
                    <button
                      onClick={() => navigate(`/integrations/${id}/logs`)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                    >
                      <History size={16} />
                      Logs
                    </button>
                  </div>
                </div>
              </WidgetCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Card */}
                <WidgetCard title="Integration Health">
                  <div className="space-y-6 mt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-3xl font-black text-slate-900">
                          {integration.healthScore}%
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Overall Health Score
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-600">99.8%</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Sync Success Rate
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          integration.healthScore > 80
                            ? "bg-emerald-500"
                            : integration.healthScore > 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${integration.healthScore}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 mb-1">Last Sync</div>
                        <div className="text-sm font-bold text-slate-800">
                          {integration.lastSync}
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 mb-1">Next Sync</div>
                        <div className="text-sm font-bold text-slate-800">
                          {integration.nextSync}
                        </div>
                      </div>
                    </div>
                  </div>
                </WidgetCard>

                {/* Linked Accounts Card */}
                <WidgetCard title="Linked Accounts">
                  <div className="space-y-4 mt-4">
                    {integration.accounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-bold text-slate-900">{acc.label}</div>
                          <div className="text-[10px] font-black text-slate-400 tracking-wider">
                            {acc.maskedId}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{acc.recordCount.toLocaleString()} records synced</span>
                          <button
                            onClick={() => openDisconnectModal(integration.id)}
                            className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Unlink
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => navigate(`/integrations/${id}/connect`)}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Link another account under this broker
                    </button>
                  </div>
                </WidgetCard>

                {/* Sync Schedule Card */}
                <WidgetCard title="Sync Schedule">
                  <div className="mt-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-700">Auto-sync</div>
                      <div className="relative w-12 h-6 cursor-pointer rounded-full bg-indigo-600">
                        <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all transform translate-x-0" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Change Frequency
                      </div>
                      <div className="flex gap-2">
                        {["Hourly", "Every 4 hrs", "Every 12 hrs", "Daily"].map((freq) => (
                          <button
                            key={freq}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                              freq === "Every 4 hrs"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                      <ShieldCheck className="text-indigo-600" size={20} />
                      <p className="text-xs text-indigo-700 font-medium">
                        Smart sync is active. Updates are prioritized during market hours.
                      </p>
                    </div>
                  </div>
                </WidgetCard>

                {/* Reconciliation Summary */}
                <WidgetCard title="Reconciliation Status">
                  <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="text-xl font-black text-emerald-700">7</div>
                        <div className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mt-1">
                          Matched Assets
                        </div>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div className="text-xl font-black text-amber-700">1</div>
                        <div className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest mt-1">
                          Discrepancies
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      One discrepancy found in HDFC Bank holdings. Run reconciliation to resolve
                      differences between WealthOS and broker values.
                    </p>

                    <button
                      onClick={() => navigate(`/integrations/${id}/reconcile`)}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      Resolve discrepancies
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </WidgetCard>
              </div>

              {/* Settings / Danger Zone */}
              <WidgetCard title="Settings">
                <div className="mt-4 divide-y divide-slate-50">
                  <button
                    onClick={() => openReAuthModal(integration.id)}
                    className="w-full py-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                        <RefreshCw size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-900">Update credentials</div>
                        <div className="text-xs text-slate-500">
                          Update your API key or re-authorize OAuth
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>

                  <button className="w-full py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all">
                        <Pause size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-900">Pause auto-sync</div>
                        <div className="text-xs text-slate-500">
                          Temporarily stop automatic background updates
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>

                  <button
                    onClick={() => openDisconnectModal(integration.id)}
                    className="w-full py-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-all">
                        <Trash2 size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-red-600">
                          Disconnect {integration.name}
                        </div>
                        <div className="text-xs text-red-400">
                          Remove this integration and all synced data
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-red-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                </div>
              </WidgetCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDetailPage;
