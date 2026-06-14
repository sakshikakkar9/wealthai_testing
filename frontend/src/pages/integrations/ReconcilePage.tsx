import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore } from "../../store/integration.store";
import WidgetCard from "../../components/common/WidgetCard";
import ContextualNav from "./_components/ContextualNav";

const ReconcilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { integrations, startSyncProgress } = useIntegrationStore();

  const integration = integrations.find((i) => i.id === id);

  if (!integration) return null;

  const handleRunReconciliation = () => {
    startSyncProgress(integration.id, integration.name);
  };

  const discrepancies = [
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd.",
      wealthosQty: 150,
      brokerQty: 125,
      delta: -25,
      cause: "Likely cause: A sell transaction may not have been recorded in WealthOS.",
    },
  ];

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
                { label: integration.name, href: `/integrations/${integration.id}/detail` },
                { label: "Portfolio Reconciliation" },
              ]}
            />

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 mb-1">
                    Portfolio Reconciliation — {integration.name}
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    Last checked: 30 May 2026, 09:17 AM
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.alert("Exporting report...")}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    <Download size={18} />
                    Export report
                  </button>
                  <button
                    onClick={handleRunReconciliation}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    <RefreshCw size={18} />
                    Run reconciliation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                {[
                  {
                    label: "Total Holdings",
                    value: "8",
                    color: "text-slate-900",
                    bg: "bg-slate-50",
                  },
                  {
                    label: "Matched",
                    value: "7",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50/50",
                  },
                  {
                    label: "Mismatched",
                    value: "1",
                    color: "text-amber-600",
                    bg: "bg-amber-50/50",
                  },
                  { label: "Missing", value: "0", color: "text-red-600", bg: "bg-red-50/50" },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-slate-100/50`}>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {stat.label}
                    </div>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm mb-8">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Holdings Comparison
                </h3>
                <div className="text-[10px] font-black text-slate-400">8 HOLDINGS</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      <th className="px-6 py-4">Holding</th>
                      <th className="px-6 py-4">WealthOS Qty</th>
                      <th className="px-6 py-4">Broker Qty</th>
                      <th className="px-6 py-4">Delta</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: "INFY", wos: 200, broker: 200, status: "match" },
                      { name: "TCS", wos: 60, broker: 60, status: "match" },
                      { name: "HDFC Bank", wos: 150, broker: 125, status: "mismatch" },
                      { name: "RELIANCE", wos: 80, broker: 80, status: "match" },
                      { name: "ITC", wos: 500, broker: 500, status: "match" },
                      { name: "WIPRO", wos: 300, broker: 300, status: "match" },
                      { name: "COFORGE", wos: 25, broker: 25, status: "match" },
                      { name: "ZOMATO", wos: 1000, broker: 1000, status: "match" },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className={`transition-colors ${
                          row.status === "mismatch" ? "bg-amber-50/30" : "hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 font-bold text-slate-700">{row.name}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{row.wos}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{row.broker}</td>
                        <td className="px-6 py-4">
                          {row.status === "mismatch" ? (
                            <span className="font-mono font-bold text-amber-600">
                              {row.broker - row.wos}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {row.status === "match" ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                              <CheckCircle2 size={14} />
                              Match
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
                              <AlertTriangle size={14} />
                              Mismatch
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discrepancies Detail */}
            {discrepancies.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 ml-2">Resolve Discrepancies</h3>
                {discrepancies.map((disc, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[32px] border border-amber-100 overflow-hidden shadow-sm shadow-amber-100/20"
                  >
                    <div className="p-6 bg-amber-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center text-amber-600 font-black">
                          {disc.symbol.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{disc.name}</h4>
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                            Quantity Mismatch
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-slate-400" />
                    </div>

                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            WealthOS shows
                          </p>
                          <p className="text-xl font-black text-slate-700">
                            {disc.wealthosQty} shares
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            {integration.name} shows
                          </p>
                          <p className="text-xl font-black text-slate-900">
                            {disc.brokerQty} shares
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Difference
                          </p>
                          <p className="text-xl font-black text-amber-600">{disc.delta} shares</p>
                        </div>
                      </div>

                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                        <div className="flex gap-3">
                          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {disc.cause}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                          What would you like to do?
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex flex-col items-center justify-center">
                            <span>Use broker value</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                              Set to {disc.brokerQty} shares
                            </span>
                          </button>
                          <button className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex flex-col items-center justify-center">
                            <span>Keep WealthOS value</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                              Stay at {disc.wealthosQty} shares
                            </span>
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/transactions?prefill=${disc.symbol.toLowerCase()}_sell`)
                          }
                          className="w-full py-4 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                          Record a missing transaction
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReconcilePage;
