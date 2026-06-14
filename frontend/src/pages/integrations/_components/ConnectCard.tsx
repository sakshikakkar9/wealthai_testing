import React from "react";
import {
  RefreshCw,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { Integration, AuthFlow } from "../../../store/integration.store";

interface ConnectCardProps {
  integration: Integration;
  isSyncing: boolean;
  onConnect: () => void;
  onOpenDetail: () => void;
  onSync: () => void;
}

const ConnectCard: React.FC<ConnectCardProps> = ({
  integration,
  isSyncing,
  onConnect,
  onOpenDetail,
  onSync,
}) => {
  const { status, name, tagline, logoInitials, logoColor, dataTypes, healthScore, accounts } =
    integration;

  const isConnected =
    status === "connected" || status === "syncing" || status === "warning" || status === "error";
  const isHealthy = status === "connected" || status === "syncing";
  const isError = status === "error";
  const isWarning = status === "warning";
  const isDisconnected = status === "disconnected";
  const isSoon = status === "coming_soon";

  const getBorderColor = () => {
    if (isHealthy) return "border-l-4 border-l-emerald-400";
    if (isError) return "border-l-4 border-l-red-400";
    if (isWarning) return "border-l-4 border-l-amber-400";
    return "";
  };

  const getBgColor = () => {
    if (isError) return "bg-red-50/30";
    if (isWarning) return "bg-amber-50/20";
    if (isSoon) return "opacity-60";
    return "bg-white";
  };

  const getHealthColor = () => {
    if (healthScore > 80) return "bg-emerald-500";
    if (healthScore >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getAuthHint = (flow: AuthFlow) => {
    switch (flow) {
      case "oauth":
        return "Secure redirect — no password stored";
      case "api_key":
        return "Paste your API key — read-only access";
      case "account_aggregator":
        return "RBI Account Aggregator framework";
      case "credentials":
        return "Encrypted storage — never shared";
      default:
        return "";
    }
  };

  return (
    <div
      className={`relative group flex flex-col h-full rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md ${getBorderColor()} ${getBgColor()}`}
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3 overflow-hidden">
          <div
            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white shadow-sm ${logoColor}`}
          >
            {logoInitials}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 truncate">{name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {dataTypes.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
              {dataTypes.length > 3 && (
                <span className="bg-slate-100 text-slate-400 rounded-full px-2 py-0.5 text-[10px] font-medium">
                  +{dataTypes.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Chip */}
        <div className="shrink-0">
          {isHealthy && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
              {integration.supportsRealtime && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              )}
              {isSyncing ? "Syncing..." : "Live"}
            </div>
          )}
          {isError && (
            <div className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 flex items-center gap-1">
              <AlertCircle size={10} />
              Error
            </div>
          )}
          {isWarning && (
            <div className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 flex items-center gap-1">
              <AlertTriangle size={10} />
              Stale
            </div>
          )}
          {isDisconnected && (
            <div className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100">
              Connect
            </div>
          )}
          {isSoon && (
            <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
              Soon
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col border-t border-slate-50">
        {/* Content Area */}
        <div className="p-4 flex-1">
          {isConnected && (
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">
                  {accounts[0]?.maskedId || "—"} · {integration.totalRecords.toLocaleString()}{" "}
                  records
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {integration.lastSync}
                </span>
              </div>

              {isError && (
                <p className="text-[11px] font-medium text-red-600 bg-red-50/50 p-2 rounded-lg border border-red-100">
                  {integration.errorMessage}
                </p>
              )}

              {isWarning && (
                <p className="text-[11px] font-medium text-amber-700 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                  {integration.warningMessage}
                </p>
              )}

              {!isError && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Sync Health</span>
                    <span className={healthScore < 50 ? "text-red-500" : "text-slate-600"}>
                      {healthScore}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getHealthColor()} ${
                        isSyncing ? "animate-pulse" : ""
                      }`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {isDisconnected && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">{tagline}</p>
              <ul className="space-y-1.5">
                {integration.unlocks.slice(0, 2).map((u, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[10px] font-medium text-slate-700"
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ArrowRight size={8} />
                    </div>
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSoon && (
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Community Interest</span>
                  <span>68 votes</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-300 w-[68%]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50/50 rounded-b-2xl border-t border-slate-50">
          {(isHealthy || isWarning) && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onSync}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors px-2 py-1.5"
              >
                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                Sync
              </button>
              <button
                onClick={onOpenDetail}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm"
              >
                Details
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {isError && (
            <button
              onClick={onConnect}
              className="w-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              {integration.authFlow === "oauth" ? "Re-authenticate" : "Update Credentials"}
            </button>
          )}

          {isDisconnected && (
            <div>
              <button
                onClick={onConnect}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200"
              >
                Connect {integration.shortName}
              </button>
              <p className="text-[9px] text-slate-400 mt-2 text-center">
                {getAuthHint(integration.authFlow)}
              </p>
            </div>
          )}

          {isSoon && (
            <button
              onClick={() => window.alert(`You'll be notified when ${name} launches.`)}
              className="w-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors py-2 rounded-xl text-xs font-bold"
            >
              Notify me
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ConnectCard);
