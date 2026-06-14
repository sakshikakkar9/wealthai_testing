import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Layers,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore, Integration, AuthFlow } from "../../store/integration.store";
import WidgetCard from "../../components/common/WidgetCard";
import ContextualNav from "./_components/ContextualNav";

const HOW_IT_WORKS: Record<AuthFlow, { step1: { title: string; desc: string } }> = {
  oauth: {
    step1: {
      title: "Authorise with {name}",
      desc: "Redirected to {name} login. Grant read-only access.",
    },
  },
  api_key: {
    step1: {
      title: "Generate your API key",
      desc: "Create a read-only API key from your {name} dashboard.",
    },
  },
  account_aggregator: {
    step1: {
      title: "Give AA consent",
      desc: "Approve in your bank's Account Aggregator section.",
    },
  },
  credentials: {
    step1: {
      title: "Enter your credentials",
      desc: "Your login is encrypted and never shared.",
    },
  },
  file_import: {
    step1: {
      title: "Export from {name}",
      desc: "Download your trade history CSV from {name}.",
    },
  },
};

const PlatformDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { integrations, startSyncProgress } = useIntegrationStore();

  const integration = integrations.find((i) => i.id === id);

  if (!integration) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F2F0EF]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Platform not found</h2>
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

  const isConnected = integration.status !== "disconnected" && integration.status !== "coming_soon";
  const step1 = HOW_IT_WORKS[integration.authFlow].step1;

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
                { label: "Brokers", href: "/integrations/add/broker" },
                { label: integration.name },
              ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Hero Card */}
                <WidgetCard className="p-8">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg ${integration.logoColor}`}
                    >
                      {integration.logoInitials}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                        <h1 className="text-3xl font-black text-slate-900">{integration.name}</h1>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                          {integration.category.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-lg text-slate-500 mb-4">{integration.tagline}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          Real-time data
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
                          <Lock size={16} />
                          Secure OAuth 2.0
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      {integration.dataTypes.map((type) => (
                        <span
                          key={type}
                          className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </WidgetCard>

                {/* What you get */}
                <WidgetCard title="What you get by connecting">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {integration.unlocks.map((unlock, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-snug">
                              {unlock}
                            </p>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                              WealthOS monitors this data point and updates your global dashboard
                              automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </WidgetCard>

                {/* How it works */}
                <WidgetCard title="How it works">
                  <div className="mt-8 relative ml-4 pl-10 border-l-2 border-dashed border-slate-100 space-y-12">
                    {/* Step 1 */}
                    <div className="relative">
                      <div className="absolute -left-[53px] top-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-100">
                        1
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {step1.title.replace("{name}", integration.name)}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                        {step1.desc.replace("{name}", integration.name)}
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <div className="absolute -left-[53px] top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black">
                        2
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Initial import</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                        We fetch your complete holdings and trade history. First sync typically
                        takes 30–60 seconds.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <div className="absolute -left-[53px] top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black">
                        3
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">Stay in sync</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                        Your portfolio updates automatically every 4 hours during market hours — no
                        action needed.
                      </p>
                    </div>
                  </div>
                </WidgetCard>

                {/* Requirements */}
                <WidgetCard title="What you need">
                  <div className="mt-6 space-y-3">
                    {integration.requirements?.map((req, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {req}
                      </div>
                    ))}
                  </div>
                </WidgetCard>

                {/* Privacy & Security */}
                <WidgetCard title="Privacy and security">
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {[
                      "Read-only access — WealthOS can never place trades",
                      "Your credentials are encrypted with AES-256",
                      "OAuth tokens are stored server-side, never in browser",
                      "Disconnect anytime and all data is deleted",
                      "SEBI-compliant and SOC 2 Type II certified",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <ShieldCheck className="text-indigo-600 shrink-0" size={18} />
                        <span className="text-xs font-medium text-slate-600 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <Link
                      to="/privacy"
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      Read our full privacy policy →
                    </Link>
                  </div>
                </WidgetCard>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Connect Side Card */}
                <div className="sticky top-6 space-y-6">
                  <WidgetCard className="p-6 border-indigo-100 shadow-xl shadow-indigo-100/50">
                    <h3 className="text-lg font-black text-slate-900 mb-2">Ready to connect?</h3>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                      Connecting {integration.name} takes about 1 minute and unlocks full portfolio
                      automation.
                    </p>

                    <button
                      onClick={() => navigate(`/integrations/${integration.id}/connect`)}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3"
                    >
                      Connect {integration.name}
                      <ArrowRight size={20} />
                    </button>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-center gap-4 py-4 border-y border-slate-50">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Auth
                          </p>
                          <p className="text-xs font-bold text-slate-700 uppercase">
                            {integration.authFlow}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Time
                          </p>
                          <p className="text-xs font-bold text-slate-700">~60 Sec</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Auto-sync frequency:
                        </p>
                        <div className="flex gap-1.5">
                          {["4h", "12h", "Daily"].map((freq) => (
                            <button
                              key={freq}
                              className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                                freq === "4h"
                                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                  : "bg-slate-50 text-slate-400 border border-transparent hover:bg-slate-100"
                              }`}
                            >
                              {freq}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-3">
                      <a
                        href={integration.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                      >
                        <span className="text-xs font-bold text-slate-700">
                          View {integration.name} API docs
                        </span>
                        <ExternalLink
                          size={14}
                          className="text-slate-400 group-hover:text-indigo-600 transition-colors"
                        />
                      </a>
                      <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                        <span className="text-xs font-bold text-slate-700">Contact support</span>
                        <ArrowRight
                          size={14}
                          className="text-slate-400 group-hover:text-indigo-600 transition-colors"
                        />
                      </button>
                    </div>
                  </WidgetCard>

                  {isConnected && (
                    <WidgetCard className="p-6 border-emerald-100">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                            Connected
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          Since 10 Jan 2026
                        </span>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-baseline">
                          <span className="text-lg font-black text-slate-900">
                            {integration.accounts[0]?.maskedId || "—"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {integration.totalRecords.toLocaleString()} records
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Last sync: {integration.lastSync}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => navigate(`/integrations/${integration.id}/detail`)}
                          className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                          View account details
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => startSyncProgress(integration.id, integration.name)}
                            className="py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw size={14} />
                            Sync now
                          </button>
                          <button className="py-2.5 bg-slate-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition-all">
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </WidgetCard>
                  )}

                  <WidgetCard title="Similar platforms">
                    <div className="mt-4 space-y-4">
                      {integrations
                        .filter(
                          (i) => i.category === integration.category && i.id !== integration.id,
                        )
                        .slice(0, 3)
                        .map((sim) => (
                          <div key={sim.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg ${sim.logoColor} flex items-center justify-center text-[10px] font-black text-white`}
                              >
                                {sim.logoInitials}
                              </div>
                              <span className="text-xs font-bold text-slate-700">{sim.name}</span>
                            </div>
                            <Link
                              to={`/integrations/${sim.id}`}
                              className="text-[10px] font-black text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              Connect →
                            </Link>
                          </div>
                        ))}
                    </div>
                  </WidgetCard>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlatformDetailPage;
