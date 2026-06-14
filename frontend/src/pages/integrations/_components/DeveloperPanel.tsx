import React from "react";
import {
  Key,
  Globe,
  Database,
  Eye,
  Copy,
  RefreshCw,
  Trash2,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import WidgetCard from "../../../components/common/WidgetCard";
import { Integration } from "../../../store/integration.store";

interface DeveloperPanelProps {
  integrations: Integration[];
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ integrations }) => {
  const handleAction = (action: string) => {
    window.alert(`Action: ${action}`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 3-Column Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-5">
        {/* Col 1 — WealthOS API Keys */}
        <div className="space-y-4">
          <WidgetCard
            title="WealthOS API Keys"
            icon={<Key size={16} className="text-indigo-600" />}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Production Key</span>
                  <div className="flex gap-1">
                    <IconButton icon={<Eye size={12} />} onClick={() => {}} />
                    <IconButton icon={<Copy size={12} />} onClick={() => {}} />
                    <IconButton icon={<RefreshCw size={12} />} onClick={() => {}} />
                    <IconButton
                      icon={<Trash2 size={12} />}
                      onClick={() => {}}
                      className="text-red-400"
                    />
                  </div>
                </div>
                <div className="font-mono text-[11px] bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-slate-600">
                  sk-••••••••••••4f2a
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Created 10 Jan 2026</span>
                  <span>Used today</span>
                </div>
                <p className="text-[10px] font-medium text-slate-500">
                  Scopes: <code className="bg-slate-100 px-1 rounded">read:portfolio</code>{" "}
                  <code className="bg-slate-100 px-1 rounded">read:transactions</code>
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Development Key</span>
                  <div className="flex gap-1">
                    <IconButton icon={<Eye size={12} />} onClick={() => {}} />
                    <IconButton icon={<Copy size={12} />} onClick={() => {}} />
                    <IconButton icon={<RefreshCw size={12} />} onClick={() => {}} />
                    <IconButton
                      icon={<Trash2 size={12} />}
                      onClick={() => {}}
                      className="text-red-400"
                    />
                  </div>
                </div>
                <div className="font-mono text-[11px] bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-slate-600">
                  sk-dev-••••••••2b1c
                </div>
              </div>

              <button
                onClick={() => handleAction("Generate New Key")}
                className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all mt-2"
              >
                <Plus size={14} />
                Generate New Key
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Col 2 — Third-party Keys */}
        <div className="space-y-4">
          <WidgetCard
            title="Connected Service Keys"
            icon={<Database size={16} className="text-emerald-600" />}
          >
            <div className="space-y-4">
              <KeyRow name="AMFI" value="amfi-••••••••9f3c" />
              <KeyRow name="NSE" value="nse-•••••••••2d8f" />
              <KeyRow name="BSE" value="bse-•••••••••7a1e" />
              <KeyRow name="Alpha V" value="av-••••••••••5c2b" />

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 mt-4">
                <p className="text-[10px] text-emerald-800 leading-relaxed font-medium">
                  These keys are encrypted at rest with AES-256 and are used only for automated sync
                  jobs.
                </p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Col 3 — Webhooks */}
        <div className="space-y-4">
          <WidgetCard title="Webhooks" icon={<Globe size={16} className="text-purple-600" />}>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Incoming
                  </h4>
                </div>
                <WebhookRow
                  name="Zerodha trades"
                  url="https://api.wealthos.in/wh/zerodha"
                  status="Active"
                  last="today 05:17 AM"
                />
                <WebhookRow
                  name="NSE Corporate Actions"
                  url="https://api.wealthos.in/wh/nse-ca"
                  status="Active"
                />
                <button
                  onClick={() => handleAction("Add incoming webhook")}
                  className="w-full py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition-colors"
                >
                  + Add incoming webhook
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Outgoing
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Portfolio changes</span>
                    <div className="flex gap-2">
                      <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">
                        Edit
                      </button>
                      <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600">
                        Test
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 break-all">
                    POST https://your-server.com/webhooks/wealthos
                  </div>
                </div>
                <button
                  onClick={() => handleAction("Add outgoing webhook")}
                  className="w-full py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition-colors"
                >
                  + Add outgoing webhook
                </button>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* Full-width Sync History */}
      <div className="px-6">
        <WidgetCard
          title="Full Sync History"
          action={
            <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
              <Copy size={14} />
              Export CSV
            </button>
          }
        >
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Time
                  </th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Integration
                  </th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Records
                  </th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Duration
                  </th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Trigger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <SyncLogRow
                  time="30 May 09:17"
                  name="Zerodha"
                  status="success"
                  records={284}
                  duration="1.24s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="30 May 09:15"
                  name="NSE Feed"
                  status="success"
                  records={1842}
                  duration="0.48s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="30 May 08:45"
                  name="HDFC Bank"
                  status="success"
                  records={47}
                  duration="0.92s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="30 May 07:30"
                  name="ICICI Bank"
                  status="success"
                  records={18}
                  duration="0.88s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="29 May 23:30"
                  name="AMFI"
                  status="success"
                  records={18420}
                  duration="8.42s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="29 May 22:15"
                  name="CAMS"
                  status="success"
                  records={842}
                  duration="3.18s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="29 May 21:00"
                  name="Axis Bank"
                  status="success"
                  records={22}
                  duration="0.74s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="28 May 06:00"
                  name="KFintech"
                  status="partial"
                  records={198}
                  duration="4.20s"
                  trigger="Scheduled"
                />
                <SyncLogRow
                  time="27 May 16:32"
                  name="Upstox"
                  status="failed"
                  records={0}
                  duration="0.34s"
                  trigger="Scheduled"
                />
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
            <span className="text-xs text-slate-400">Showing last 15 sync events</span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-400 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
};

const IconButton = ({
  icon,
  onClick,
  className = "",
}: {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors ${className}`}
  >
    {icon}
  </button>
);

const KeyRow = ({ name, value }: { name: string; value: string }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-xs font-bold text-slate-700 w-16">{name}</span>
    <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded flex-1 truncate">
      {value}
    </span>
    <div className="flex gap-1 shrink-0">
      <IconButton icon={<RefreshCw size={12} />} onClick={() => {}} />
      <IconButton icon={<Trash2 size={12} />} onClick={() => {}} className="text-red-400" />
    </div>
  </div>
);

const WebhookRow = ({
  name,
  url,
  status,
  last,
}: {
  name: string;
  url: string;
  status: string;
  last?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold text-slate-900">{name}</span>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-emerald-600 uppercase">{status}</span>
      </div>
    </div>
    <div className="font-mono text-[10px] text-slate-500 break-all bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 flex items-center justify-between group">
      <span className="truncate">{url}</span>
      <button className="text-indigo-600 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        Copy
      </button>
    </div>
    {last && <p className="text-[9px] text-slate-400">Last event: {last}</p>}
  </div>
);

const SyncLogRow = ({
  time,
  name,
  status,
  records,
  duration,
  trigger,
}: {
  time: string;
  name: string;
  status: "success" | "partial" | "failed";
  records: number;
  duration: string;
  trigger: string;
}) => (
  <tr className="group hover:bg-slate-50/50 transition-colors">
    <td className="py-4 px-4 text-xs font-medium text-slate-500">{time}</td>
    <td className="py-4 px-4 text-xs font-bold text-slate-900">{name}</td>
    <td className="py-4 px-4">
      {status === "success" && (
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase">
          <CheckCircle2 size={12} /> OK
        </div>
      )}
      {status === "partial" && (
        <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] uppercase">
          <AlertTriangle size={12} /> Partial
        </div>
      )}
      {status === "failed" && (
        <div className="flex items-center gap-1.5 text-red-600 font-bold text-[10px] uppercase">
          <XCircle size={12} /> Failed
        </div>
      )}
    </td>
    <td className="py-4 px-4 text-xs font-bold text-slate-700">{records.toLocaleString()}</td>
    <td className="py-4 px-4 text-xs font-medium text-slate-500">{duration}</td>
    <td className="py-4 px-4">
      <span
        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
          trigger === "Scheduled"
            ? "bg-slate-100 text-slate-500"
            : trigger === "Manual"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-purple-50 text-purple-600"
        }`}
      >
        {trigger}
      </span>
    </td>
  </tr>
);

export default DeveloperPanel;
