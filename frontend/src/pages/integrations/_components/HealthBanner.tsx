import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Integration } from "../../../store/integration.store";
import CoverageScore from "./CoverageScore";

interface HealthBannerProps {
  integrations: Integration[];
}

const HealthBanner: React.FC<HealthBannerProps> = ({ integrations }) => {
  const hasError = integrations.some((i) => i.status === "error");
  const hasWarning = integrations.some((i) => i.status === "warning");

  const connectedCount = integrations.filter(
    (i) => i.status === "connected" || i.status === "syncing" || i.status === "warning",
  ).length;
  const errorCount = integrations.filter((i) => i.status === "error").length;
  const warningCount = integrations.filter((i) => i.status === "warning").length;
  const disconnectedCount = integrations.filter((i) => i.status === "disconnected").length;
  const comingSoonCount = integrations.filter((i) => i.status === "coming_soon").length;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${
        hasError || !hasWarning ? "from-indigo-600 to-indigo-500" : "from-amber-500 to-amber-400"
      } p-8 text-white`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Connected Accounts</h1>
          <p className="text-white/80 mt-1">
            Link your financial accounts for a complete and auto-updating portfolio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
            <RefreshCw size={16} />
            Sync All
          </button>
          <button className="bg-white text-indigo-600 hover:bg-indigo-50 transition-colors px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20">
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>

      <div className="mt-8 max-w-3xl">
        <CoverageScore integrations={integrations} variant="white" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <StatusChip label={`${connectedCount} Connected`} variant="connected" />
        {warningCount > 0 && <StatusChip label={`${warningCount} Warnings`} variant="warning" />}
        {errorCount > 0 && (
          <StatusChip label={`${errorCount} Error${errorCount > 1 ? "s" : ""}`} variant="error" />
        )}
        <StatusChip label={`${disconnectedCount} Not linked`} variant="disconnected" />
        <StatusChip label={`${comingSoonCount} Coming soon`} variant="soon" />
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

interface StatusChipProps {
  label: string;
  variant: "connected" | "warning" | "error" | "disconnected" | "soon";
}

const StatusChip: React.FC<StatusChipProps> = ({ label, variant }) => {
  const styles = {
    connected: "bg-white/15 border-white/25",
    warning: "bg-amber-500/30 border-amber-300/40",
    error: "bg-red-500/30 border-red-300/40",
    disconnected: "bg-white/10 border-white/20",
    soon: "bg-white/5 border-white/10 text-white/60",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full border text-xs font-medium backdrop-blur-md ${styles[variant]}`}
    >
      {label}
    </div>
  );
};

export default HealthBanner;
