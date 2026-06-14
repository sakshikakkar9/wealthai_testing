import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore } from "../../store/integration.store";
import ContextualNav from "./_components/ContextualNav";

const SyncLogsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { integrations } = useIntegrationStore();

  const integrationFilter = id ? integrations.find((i) => i.id === id) : null;

  const logs = useMemo(
    () => [
      {
        id: "l1",
        time: "30 May 2026, 09:17 AM",
        integration: "Zerodha",
        trigger: "Scheduled",
        status: "success",
        records: 284,
        duration: "1.24s",
      },
      {
        id: "l2",
        time: "30 May 2026, 09:15 AM",
        integration: "NSE Feed",
        trigger: "Scheduled",
        status: "success",
        records: 1842,
        duration: "0.48s",
      },
      {
        id: "l3",
        time: "30 May 2026, 08:45 AM",
        integration: "HDFC Bank",
        trigger: "Scheduled",
        status: "success",
        records: 12,
        duration: "0.92s",
      },
      {
        id: "l4",
        time: "29 May 2026, 11:30 PM",
        integration: "AMFI",
        trigger: "Scheduled",
        status: "success",
        records: 0,
        duration: "1.15s",
      },
      {
        id: "l5",
        time: "29 May 2026, 11:00 PM",
        integration: "Axis Bank",
        trigger: "Scheduled",
        status: "success",
        records: 3,
        duration: "0.85s",
      },
      {
        id: "l6",
        time: "28 May 2026, 09:17 AM",
        integration: "Upstox",
        trigger: "Scheduled",
        status: "error",
        records: 0,
        duration: "0.34s",
        error: "OAuth session expired",
      },
    ],
    [],
  );

  const filteredLogs = id
    ? logs.filter((l) => l.integration.toLowerCase() === integrationFilter?.name.toLowerCase())
    : logs;

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <ContextualNav
              crumbs={
                [
                  { label: "Integrations", href: "/integrations" },
                  integrationFilter
                    ? { label: integrationFilter.name, href: `/integrations/${id}/detail` }
                    : { label: "Sync Logs" },
                  integrationFilter ? { label: "Sync Logs" } : null,
                ].filter(Boolean) as Array<{ label: string; href?: string }>
              }
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1">
                  {integrationFilter
                    ? `Sync Logs — ${integrationFilter.name}`
                    : "Sync Logs — All Integrations"}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Monitor synchronization history and data freshness across your accounts.
                </p>
              </div>
              <button
                onClick={() => window.alert("Exporting logs...")}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Syncs", value: "542", color: "text-slate-900" },
                { label: "Success Rate", value: "96.3%", color: "text-emerald-600" },
                { label: "Failed Syncs", value: "24", color: "text-red-500" },
                { label: "Avg Duration", value: "1.8s", color: "text-indigo-600" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col"
                >
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[24px] p-2 border border-slate-100 shadow-sm mb-6 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                <Filter size={16} />
                All integrations
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                Last 7 days
              </button>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Integration</th>
                      <th className="px-6 py-4">Trigger</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Records</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-slate-700">{log.time.split(",")[1]}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {log.time.split(",")[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                              {log.integration.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-700">{log.integration}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {log.trigger}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {log.status === "success" ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                              <CheckCircle2 size={14} />
                              OK
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                              <XCircle size={14} />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {log.records.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                          {log.duration}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {log.status === "error" && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/integrations/${log.integration.toLowerCase()}/connect?reauth=true`,
                                  )
                                }
                                className="text-red-500 text-xs font-bold hover:underline"
                              >
                                Fix
                              </button>
                            )}
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                <div className="text-xs font-medium text-slate-400">Showing 6 of 542 logs</div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SyncLogsPage;
