import React, { useEffect, useState, useMemo } from "react";
import { RefreshCw, CheckCircle2, XCircle, X } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

const SyncProgressOverlay: React.FC = () => {
  const { syncProgress, clearSyncProgress, integrations } = useIntegrationStore();
  const [completedIntegrations, setCompletedIntegrations] = useState<
    Array<{ id: string; name: string; status: "done" | "error"; records: number; duration: string }>
  >([]);
  const [currentSyncIdx, setCurrentSyncIdx] = useState(-1);

  const isAll = syncProgress?.integrationId === "all";
  const targetIntegrations = useMemo(
    () =>
      isAll ? integrations.filter((i) => i.status === "connected" || i.status === "warning") : [],
    [isAll, integrations],
  );

  useEffect(() => {
    if (isAll && targetIntegrations.length > 0) {
      setCurrentSyncIdx(0);
    }
  }, [isAll, targetIntegrations.length]);

  useEffect(() => {
    if (currentSyncIdx !== -1 && currentSyncIdx < targetIntegrations.length) {
      const integration = targetIntegrations[currentSyncIdx];
      const timer = setTimeout(() => {
        setCompletedIntegrations((prev) => [
          ...prev,
          {
            id: integration.id,
            name: integration.name,
            status: "done",
            records: Math.floor(Math.random() * 500),
            duration: (1 + Math.random()).toFixed(2) + "s",
          },
        ]);
        setCurrentSyncIdx((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentSyncIdx, targetIntegrations]);

  if (!syncProgress) return null;

  const isFinished = isAll
    ? currentSyncIdx === targetIntegrations.length
    : syncProgress.phase === "done";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {isFinished ? "Sync complete" : "Syncing your accounts..."}
            </h2>
            <button
              onClick={clearSyncProgress}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!isAll ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {syncProgress.integrationName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {syncProgress.integrationName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{syncProgress.message}</div>
                </div>
                <div className="shrink-0">
                  {syncProgress.phase === "done" ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : syncProgress.phase === "error" ? (
                    <XCircle className="text-red-500" size={24} />
                  ) : (
                    <RefreshCw className="text-indigo-600 animate-spin" size={24} />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Progress</span>
                  <span>{syncProgress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${syncProgress.percent}%` }}
                  />
                </div>
              </div>

              {syncProgress.phase === "done" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                  <div className="text-sm font-bold text-emerald-800">
                    {syncProgress.recordsFound.toLocaleString()} records updated
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    Portfolio values refreshed successfully
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
              {targetIntegrations.map((integration, idx) => {
                const completed = completedIntegrations.find((c) => c.id === integration.id);
                const isCurrent = idx === currentSyncIdx;

                return (
                  <div
                    key={integration.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                      isCurrent ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${integration.logoColor}`}
                    >
                      {integration.logoInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900">{integration.name}</div>
                      {completed && (
                        <div className="text-[10px] text-slate-500">
                          {completed.records} records · {completed.duration}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {completed ? (
                        <CheckCircle2 className="text-emerald-500" size={16} />
                      ) : isCurrent ? (
                        <RefreshCw className="text-indigo-600 animate-spin" size={16} />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isFinished && (
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                onClick={clearSyncProgress}
                className="bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm"
              >
                Done
              </button>
              <button
                onClick={() => {
                  clearSyncProgress();
                  // navigate to portfolio
                }}
                className="bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-50 transition-all text-sm"
              >
                View Portfolio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncProgressOverlay;
