import React from "react";
import { X, Download, Filter, ChevronRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

const SyncLogDrawer: React.FC = () => {
  const { showSyncLog, closeSyncLog, syncLogId, integrations } = useIntegrationStore();

  const selectedIntegration = integrations.find((i) => i.id === syncLogId);

  if (!showSyncLog) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30" onClick={closeSyncLog} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white border-l border-slate-100 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sync Activity</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {selectedIntegration ? selectedIntegration.name : "All integrations"}
              </span>
              <ChevronRight size={12} className="text-slate-300" />
              <button className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1">
                <Filter size={10} />
                Filter
              </button>
            </div>
          </div>
          <button
            onClick={closeSyncLog}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          <DateGroup label="Today" />
          <LogItem
            time="09:17"
            name="Zerodha"
            status="success"
            records={284}
            duration="1.2s"
            trigger="Scheduled"
          />
          <LogItem
            time="09:15"
            name="NSE Feed"
            status="success"
            records={1842}
            duration="0.5s"
            trigger="Scheduled"
          />
          <LogItem
            time="08:45"
            name="HDFC Bank"
            status="success"
            records={47}
            duration="0.9s"
            trigger="Scheduled"
          />
          <LogItem
            time="04:32"
            name="Upstox"
            status="failed"
            records={0}
            duration="0.3s"
            trigger="Scheduled"
            error="OAuth expired"
          />

          <DateGroup label="Yesterday" />
          <LogItem
            time="23:30"
            name="AMFI"
            status="success"
            records={18420}
            duration="8.4s"
            trigger="Scheduled"
          />
          <LogItem
            time="22:15"
            name="CAMS"
            status="success"
            records={842}
            duration="3.2s"
            trigger="Scheduled"
          />
          <LogItem
            time="18:00"
            name="KFintech"
            status="partial"
            records={198}
            duration="4.2s"
            trigger="Scheduled"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => window.alert("Export coming soon")}
            className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export Activity Log (CSV)
          </button>
        </div>
      </div>
    </>
  );
};

const DateGroup = ({ label }: { label: string }) => (
  <div className="px-6 py-4 bg-slate-50/50 border-y border-slate-50">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const LogItem = ({
  time,
  name,
  status,
  records,
  duration,
  trigger,
  error,
}: {
  time: string;
  name: string;
  status: "success" | "partial" | "failed";
  records: number;
  duration: string;
  trigger: string;
  error?: string;
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "partial":
        return <AlertCircle size={16} className="text-amber-500" />;
      case "failed":
        return <X size={16} className="text-red-500" />;
    }
  };

  const getTriggerColor = () => {
    switch (trigger) {
      case "Scheduled":
        return "bg-slate-100 text-slate-500";
      case "Manual":
        return "bg-indigo-50 text-indigo-600";
      case "Webhook":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div
      className={`px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 ${
        status === "failed" ? "bg-red-50/20" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-1 shrink-0 w-10">
        <span className="text-[10px] font-bold text-slate-400">{time}</span>
        {getStatusIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-slate-900">{name}</span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${getTriggerColor()}`}
          >
            {trigger}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {duration}
          </span>
          {status !== "failed" && (
            <span className="flex items-center gap-1 font-medium">
              {records.toLocaleString()} records
            </span>
          )}
          {error && (
            <span className="text-red-600 font-bold flex items-center gap-1">
              {error}
              <button className="underline ml-1">Fix →</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncLogDrawer;
