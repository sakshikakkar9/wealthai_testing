import React, { useState } from "react";
import {
  X,
  RefreshCw,
  Scale,
  List,
  Pause,
  Trash2,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";
import SyncActivitySparkline from "../../../components/charts/SyncActivitySparkline";

const AccountDetailDrawer: React.FC = () => {
  const {
    detailId,
    closeDetail,
    integrations,
    triggerSync,
    openReconcile,
    openSyncLog,
    syncingIds,
  } = useIntegrationStore();
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);

  const integration = integrations.find((i) => i.id === detailId);

  if (!integration) return null;

  const isSyncing = syncingIds.has(integration.id);

  const handleSync = () => {
    triggerSync(integration.id);
    window.alert("Sync started");
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30" onClick={closeDetail} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white border-l border-slate-100 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-sm ${integration.logoColor}`}
              >
                {integration.logoInitials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{integration.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {integration.category.replace("_", " ")} · {integration.authFlow}
                </p>
              </div>
            </div>
            <button
              onClick={closeDetail}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isSyncing ? "bg-indigo-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="text-sm font-bold text-slate-700">
              {isSyncing ? "Syncing in progress..." : "Syncing normally"}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Linked Accounts */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Linked Accounts
            </h3>
            <div className="space-y-3">
              {integration.accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900">{acc.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{acc.maskedId}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>{acc.recordCount.toLocaleString()} records synced</span>
                    <span>Last: {acc.lastSync}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-bold text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                + Link another account
              </button>
            </div>
          </section>

          {/* Data Summary */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Synced Data Summary
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {integration.dataTypes.map((type) => (
                <div
                  key={type}
                  className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-100"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                    {type}
                  </p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">
                    {Math.floor(Math.random() * 500) + 1}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sync Health */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Sync Health
              </h3>
              <span className="text-xs font-bold text-emerald-600">{integration.healthScore}%</span>
            </div>
            <div className="space-y-4">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${integration.healthScore}%` }}
                />
              </div>
              <SyncActivitySparkline data={[2, 5, 3, 8, 12, 10, 15, 14, 18, 20, 16, 22]} />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</p>
                  <p className="text-sm font-bold text-slate-700">99.2%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Duration</p>
                  <p className="text-sm font-bold text-slate-700">1.24s</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Auto-sync</span>
                  <span className="text-[10px] text-slate-500">
                    Every {integration.syncFrequency}
                  </span>
                </div>
                <button
                  onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    isAutoSyncEnabled ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                      isAutoSyncEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-3 gap-2">
            <button
              onClick={handleSync}
              className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
            >
              <RefreshCw
                size={18}
                className={`text-slate-400 group-hover:text-indigo-600 ${
                  isSyncing ? "animate-spin" : ""
                }`}
              />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-700">
                Sync Now
              </span>
            </button>
            <button
              onClick={() => openReconcile(integration.id)}
              className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
            >
              <Scale size={18} className="text-slate-400 group-hover:text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700">
                Reconcile
              </span>
            </button>
            <button
              onClick={() => openSyncLog(integration.id)}
              className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl hover:bg-amber-50 hover:border-amber-100 transition-all group"
            >
              <List size={18} className="text-slate-400 group-hover:text-amber-600" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-amber-700">
                View Logs
              </span>
            </button>
          </section>

          {/* Danger Zone */}
          <section className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between group cursor-pointer">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600">
                Connection Settings
              </h3>
              <ArrowRight
                size={14}
                className="text-slate-300 group-hover:translate-x-1 transition-all"
              />
            </div>
            <div className="mt-4 space-y-2">
              <button className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <Pause size={16} className="text-slate-400" />
                  Pause auto-sync
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-slate-400" />
                  Edit credentials
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <Trash2 size={16} className="text-red-400" />
                  Disconnect integration
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <a
            href={integration.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={12} />
            API Documentation
          </a>
          <span className="text-[10px] font-medium text-slate-400 italic">
            WealthOS v2.4.1 Connected
          </span>
        </div>
      </div>
    </>
  );
};

export default AccountDetailDrawer;
