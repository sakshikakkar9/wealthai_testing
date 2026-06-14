import React from "react";
import { X, ShieldCheck, Info, CheckCircle2 } from "lucide-react";
import { useIntegrationStore, Integration, AuthFlow } from "../../../store/integration.store";

const AUTH_FLOW_META: Record<
  AuthFlow,
  {
    label: string;
    securityNote: string;
    fields: { key: string; label: string; inputType: "text" | "password" }[];
    ctaLabel: string;
    description: string;
  }
> = {
  oauth: {
    label: "OAuth 2.0",
    securityNote: "Secure redirect — no password stored",
    fields: [],
    ctaLabel: "Continue with {name} →",
    description: "You will be redirected to the provider's secure login page.",
  },
  api_key: {
    label: "API Key",
    securityNote: "Encrypted at rest — never shared",
    fields: [
      { key: "key", label: "API Key", inputType: "text" },
      { key: "secret", label: "API Secret", inputType: "password" },
    ],
    ctaLabel: "Connect →",
    description: "Generate a read-only API key from your provider dashboard.",
  },
  credentials: {
    label: "Username / Password",
    securityNote: "AES-256 encrypted — read-only access",
    fields: [
      { key: "username", label: "PAN / Username", inputType: "text" },
      { key: "password", label: "Password", inputType: "password" },
    ],
    ctaLabel: "Connect →",
    description: "Your credentials are encrypted and used only for data retrieval.",
  },
  account_aggregator: {
    label: "Account Aggregator",
    securityNote: "RBI AA framework — consent revocable anytime",
    fields: [],
    ctaLabel: "Authorise via Account Aggregator →",
    description: "Uses RBI's Account Aggregator framework for secure data sharing.",
  },
  file_import: {
    label: "File Import",
    securityNote: "No live connection — manual import only",
    fields: [],
    ctaLabel: "Upload File →",
    description: "Upload your transaction statements manually.",
  },
};

const ConnectModal: React.FC = () => {
  const { connectingId, closeConnect, integrations } = useIntegrationStore();

  const integration = integrations.find((i) => i.id === connectingId);

  if (!integration) return null;

  const meta = AUTH_FLOW_META[integration.authFlow];

  const handleConnect = () => {
    window.alert("Connecting... Initial sync starting.");
    closeConnect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeConnect} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg ${integration.logoColor}`}
            >
              {integration.logoInitials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Connect {integration.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{integration.dataTypes.join(" · ")}</p>
            </div>
          </div>
          <button
            onClick={closeConnect}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Benefits */}
        <div className="p-6 bg-slate-50/50">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            What you'll get
          </h3>
          <ul className="space-y-2.5">
            {integration.unlocks.map((u, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                {u}
              </li>
            ))}
          </ul>
        </div>

        {/* Auth Body */}
        <div className="p-6 space-y-6">
          {meta.fields.length > 0 && (
            <div className="space-y-4">
              {meta.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">{field.label}</label>
                  <input
                    type={field.inputType}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-3">
            <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-indigo-900">{meta.label} Auth</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed">{meta.description}</p>
            </div>
          </div>

          <button
            onClick={handleConnect}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {meta.ctaLabel.replace("{name}", integration.name)}
          </button>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-medium">{meta.securityNote}</span>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Auto-sync</span>
            <span className="text-xs font-bold text-emerald-600">ENABLED</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Frequency</span>
            <span className="text-xs font-bold text-slate-700">{integration.syncFrequency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
