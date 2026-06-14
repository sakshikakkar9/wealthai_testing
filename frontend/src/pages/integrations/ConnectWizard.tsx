import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  Upload,
  ChevronRight,
  X,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore, AuthFlow, Integration } from "../../store/integration.store";
import ContextualNav from "./_components/ContextualNav";

type WizardStep = {
  id: string;
  label: string;
  component: string;
};

const WIZARD_FLOWS: Record<AuthFlow, WizardStep[]> = {
  oauth: [
    { id: "authorise", label: "Authorise", component: "OAuthStep" },
    { id: "verify", label: "Verify", component: "VerifyStep" },
    { id: "done", label: "Done", component: "DoneStep" },
  ],
  api_key: [
    { id: "keys", label: "API Key", component: "ApiKeyStep" },
    { id: "test", label: "Test", component: "TestConnectionStep" },
    { id: "sync", label: "Sync", component: "InitialSyncStep" },
    { id: "done", label: "Done", component: "DoneStep" },
  ],
  account_aggregator: [
    { id: "consent", label: "Consent", component: "AAConsentStep" },
    { id: "verify", label: "Verify", component: "VerifyStep" },
    { id: "done", label: "Done", component: "DoneStep" },
  ],
  credentials: [
    { id: "login", label: "Login", component: "CredentialsStep" },
    { id: "verify", label: "Verify", component: "VerifyStep" },
    { id: "sync", label: "Sync", component: "InitialSyncStep" },
    { id: "done", label: "Done", component: "DoneStep" },
  ],
  file_import: [
    { id: "upload", label: "Upload", component: "FileUploadStep" },
    { id: "map", label: "Map columns", component: "ColumnMapStep" },
    { id: "done", label: "Done", component: "DoneStep" },
  ],
};

const ConnectWizard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isReauth = searchParams.get("reauth") === "true";
  const { integrations, startSyncProgress } = useIntegrationStore();

  const integration = integrations.find((i) => i.id === id);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const steps = integration ? WIZARD_FLOWS[integration.authFlow] : [];
  const currentStep = steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStepIdx(currentStepIdx + 1);
        if (steps[currentStepIdx + 1].id === "done" && integration) {
          // Final navigation to success page
          navigate(`/integrations/${integration.id}/connected`, { replace: true });
        }
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    } else {
      navigate(-1);
    }
  };

  if (!integration) return null;

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <ContextualNav
              crumbs={[
                { label: "Integrations", href: "/integrations" },
                { label: integration.name, href: `/integrations/${integration.id}` },
                { label: isReauth ? "Update Connection" : "Connect account" },
              ]}
            />

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 transition-all duration-500 -z-10"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                        idx < currentStepIdx
                          ? "bg-emerald-500 text-white"
                          : idx === currentStepIdx
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                            : "bg-white border-2 border-slate-200 text-slate-400"
                      }`}
                    >
                      {idx < currentStepIdx ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        idx <= currentStepIdx ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-10 border border-slate-100 min-h-[400px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-indigo-50 p-6 rounded-full">
                      <RefreshCw className="text-indigo-600 animate-spin" size={40} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900">
                      {currentStep.id === "verify"
                        ? "Verifying account..."
                        : currentStep.id === "sync"
                          ? "Starting initial sync..."
                          : "Processing..."}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">This usually takes a few seconds.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  {currentStep.component === "OAuthStep" && <OAuthStep integration={integration} />}
                  {currentStep.component === "ApiKeyStep" && (
                    <ApiKeyStep integration={integration} />
                  )}
                  {currentStep.component === "CredentialsStep" && (
                    <CredentialsStep integration={integration} />
                  )}
                  {currentStep.component === "AAConsentStep" && (
                    <AAConsentStep integration={integration} />
                  )}
                  {currentStep.component === "FileUploadStep" && (
                    <FileUploadStep integration={integration} file={file} setFile={setFile} />
                  )}
                  {currentStep.component === "VerifyStep" && (
                    <VerifyStep integration={integration} />
                  )}
                  {currentStep.component === "TestConnectionStep" && (
                    <TestConnectionStep integration={integration} />
                  )}
                  {currentStep.component === "InitialSyncStep" && (
                    <InitialSyncStep integration={integration} />
                  )}
                  {currentStep.component === "ColumnMapStep" && (
                    <ColumnMapStep integration={integration} />
                  )}
                </div>
              )}

              {/* Nav Buttons */}
              {!isLoading && currentStep.id !== "done" && (
                <div className="mt-12 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStep.id === "upload" && !file}
                    className={`px-10 py-4 rounded-2xl font-black text-base transition-all shadow-lg flex items-center gap-2 ${
                      currentStep.id === "upload" && !file
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                    }`}
                  >
                    {currentStep.id === "upload"
                      ? "Next"
                      : currentStep.id === "map"
                        ? `Import 240 rows`
                        : currentStepIdx === steps.length - 2
                          ? "Connect & start sync"
                          : "Continue"}
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Step Components ---

const OAuthStep = ({ integration }: { integration: Integration }) => (
  <div className="text-center">
    <div className="flex justify-center mb-8">
      <div
        className={`w-20 h-20 rounded-3xl ${integration.logoColor} flex items-center justify-center text-white text-2xl font-black shadow-lg`}
      >
        {integration.logoInitials}
      </div>
    </div>
    <h2 className="text-2xl font-black text-slate-900 mb-2">Connecting to {integration.name}</h2>
    <p className="text-slate-500 mb-10">
      You'll be redirected to {integration.name} to grant secure access.
    </p>

    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left space-y-4 mb-8">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
        WealthOS will be able to:
      </h4>
      <ul className="space-y-3">
        {[
          { label: "View your holdings and positions", access: "Read-only", ok: true },
          { label: "Read your trade history and P&L", access: "Read-only", ok: true },
          { label: "Access your GTT orders", access: "Read-only", ok: true },
          { label: "Place orders on your behalf", access: "Never", ok: false },
          { label: "Withdraw funds", access: "Never", ok: false },
        ].map((item, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.ok ? (
                <CheckCircle2 className="text-emerald-500" size={18} />
              ) : (
                <X className="text-red-500" size={18} />
              )}
              <span
                className={`text-sm font-bold ${item.ok ? "text-slate-700" : "text-slate-400"}`}
              >
                {item.label}
              </span>
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider ${item.ok ? "text-emerald-600" : "text-red-500"}`}
            >
              {item.access}
            </span>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
      <Lock size={14} />
      Secure OAuth 2.0 redirect · No credentials stored
    </div>
  </div>
);

const ApiKeyStep = ({ integration }: { integration: Integration }) => {
  const [showSecret, setShowSecret] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`w-12 h-12 rounded-2xl ${integration.logoColor} flex items-center justify-center text-white text-sm font-black`}
        >
          {integration.logoInitials}
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Enter your {integration.name} API credentials
          </h2>
          <p className="text-xs text-slate-500">
            WealthOS requires read-only API access to sync your portfolio.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8 space-y-3">
        <h4 className="text-xs font-black text-slate-900">Where to get your API key:</h4>
        <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside pl-1">
          <li>Log in to your {integration.name} developer portal</li>
          <li>Go to Dashboard → My Apps</li>
          <li>Create a new app or use an existing one</li>
          <li>Copy the App ID and Secret Key below</li>
        </ol>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            App ID (API Key)
          </label>
          <input
            type="text"
            placeholder="e.g. FY4921-100"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            Secret Key
          </label>
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              placeholder="••••••••••••••••••••••••"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-14"
            />
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <AlertCircle className="text-amber-600 shrink-0" size={18} />
        <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
          <strong>Important:</strong> Use a read-only key. Do not grant "Order Placement" or
          "Withdrawal" permissions to this API key.
        </p>
      </div>
    </div>
  );
};

const CredentialsStep = ({ integration }: { integration: Integration }) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div>
      <div className="flex flex-col items-center text-center mb-10">
        <div
          className={`w-16 h-16 rounded-3xl ${integration.logoColor} flex items-center justify-center text-white text-xl font-black mb-6 shadow-lg`}
        >
          {integration.logoInitials}
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Sign in to {integration.name}</h2>
        <p className="text-slate-500 text-sm">
          Your credentials are encrypted and stored securely.
        </p>
      </div>

      <div className="space-y-6 max-w-sm mx-auto">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            PAN / User ID
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Password
            </label>
            <button className="text-[10px] font-black text-indigo-600 hover:underline">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-14"
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck size={16} className="text-emerald-500" />
        Bank-grade AES-256 encryption · PCI-DSS compliant
      </div>
    </div>
  );
};

const AAConsentStep = ({ integration }: { integration: Integration }) => (
  <div className="text-center">
    <div className="flex justify-center mb-8">
      <div
        className={`w-20 h-20 rounded-3xl ${integration.logoColor} flex items-center justify-center text-white text-2xl font-black shadow-lg`}
      >
        {integration.logoInitials}
      </div>
    </div>
    <h2 className="text-2xl font-black text-slate-900 mb-2">Connecting via Account Aggregator</h2>
    <p className="text-slate-500 mb-10 max-w-sm mx-auto">
      WealthOS uses the RBI-regulated Account Aggregator framework to sync your bank data securely.
    </p>

    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-left mb-8">
      <h4 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
        CONSENT REQUEST DETAILS
      </h4>
      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Duration
          </p>
          <p className="text-sm font-bold text-slate-800">1 Year (Renewable)</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Frequency
          </p>
          <p className="text-sm font-bold text-slate-800">Daily Sync</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Data Shared
          </p>
          <p className="text-sm font-bold text-slate-800">
            Account balance, Transactions, FD details
          </p>
        </div>
      </div>
    </div>

    <p className="text-xs text-slate-500 italic">
      "Your net banking password is never shared with WealthOS or the AA."
    </p>
  </div>
);

const FileUploadStep = ({
  integration,
  file,
  setFile,
}: {
  integration: Integration;
  file: File | null;
  setFile: (f: File | null) => void;
}) => (
  <div>
    <h2 className="text-2xl font-black text-slate-900 mb-2">
      Upload your {integration.name} history
    </h2>
    <p className="text-slate-500 mb-8">
      WealthOS will parse your file and import transactions automatically.
    </p>

    <div className="space-y-8">
      {/* Drop zone */}
      {!file ? (
        <div
          className="border-2 border-dashed border-slate-200 rounded-[32px] p-16 text-center hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer group"
          onClick={() => {
            // Simulate file selection
            setFile(new File([""], "tradebook_2026.csv", { type: "text/csv" }));
          }}
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mx-auto mb-4">
            <Upload size={32} />
          </div>
          <p className="text-sm font-bold text-slate-900">Drag your CSV file here</p>
          <p className="text-xs text-slate-500 mt-1">or click to browse from your computer</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">
              .CSV
            </span>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">
              .XLSX
            </span>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">
              .PDF
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{file.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">2.4 MB · 240 rows detected</div>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="w-10 h-10 rounded-xl hover:bg-emerald-100 text-emerald-600 transition-colors flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h4 className="text-xs font-black text-slate-900 mb-4">
          How to export from {integration.name}:
        </h4>
        <ul className="text-xs text-slate-600 space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold">
              1
            </div>
            Log in to your {integration.name} portal
          </li>
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold">
              2
            </div>
            Navigate to Reports → Tradebook / Statement
          </li>
          <li className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold">
              3
            </div>
            Select date range and export as CSV
          </li>
        </ul>
        <button className="mt-6 text-[11px] font-black text-indigo-600 hover:underline">
          View step-by-step guide →
        </button>
      </div>
    </div>
  </div>
);

const VerifyStep = ({ integration }: { integration: Integration }) => {
  const [steps, setSteps] = useState([
    { id: 1, label: `Connected to ${integration.name} API`, status: "done" },
    { id: 2, label: "Fetching account details...", status: "loading" },
    { id: 3, label: "Fetching holdings...", status: "pending" },
    { id: 4, label: "Fetching trade history...", status: "pending" },
  ]);

  useEffect(() => {
    const timers = [
      setTimeout(
        () =>
          setSteps((s) =>
            s.map((it) =>
              it.id === 2
                ? { ...it, status: "done", label: "Account XX1234 verified" }
                : it.id === 3
                  ? { ...it, status: "loading" }
                  : it,
            ),
          ),
        600,
      ),
      setTimeout(
        () =>
          setSteps((s) =>
            s.map((it) =>
              it.id === 3
                ? { ...it, status: "done", label: "Found 8 equity holdings" }
                : it.id === 4
                  ? { ...it, status: "loading" }
                  : it,
            ),
          ),
        1200,
      ),
      setTimeout(
        () =>
          setSteps((s) =>
            s.map((it) =>
              it.id === 4 ? { ...it, status: "done", label: "Found 4,536 trade records" } : it,
            ),
          ),
        1800,
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Verifying your account</h2>
        <p className="text-slate-500">Checking credentials and discovering assets.</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              step.status === "done"
                ? "bg-emerald-50 border-emerald-100"
                : step.status === "loading"
                  ? "bg-indigo-50 border-indigo-100"
                  : "bg-slate-50 border-transparent opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {step.status === "done" ? (
                <CheckCircle2 className="text-emerald-500" size={18} />
              ) : step.status === "loading" ? (
                <RefreshCw className="text-indigo-600 animate-spin" size={18} />
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200" />
              )}
              <span
                className={`text-sm font-bold ${
                  step.status === "done"
                    ? "text-emerald-800"
                    : step.status === "loading"
                      ? "text-indigo-800"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {step.status === "done" && (
              <div className="text-[10px] font-black text-emerald-500 uppercase">OK</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TestConnectionStep = ({ integration }: { integration: Integration }) => (
  <div className="text-center flex flex-col items-center justify-center py-10">
    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 animate-in zoom-in-50 duration-500">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 mb-2">Connection successful</h2>
    <p className="text-slate-500 mb-10 max-w-xs">
      We've successfully tested your API keys. Ready to start the initial data sync.
    </p>

    <div className="w-full space-y-3 text-left max-w-sm">
      {["API credentials valid", "Read-only scope confirmed", "Account XX3341 accessible"].map(
        (check, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <CheckCircle2 size={16} className="text-emerald-500" />
            {check}
          </div>
        ),
      )}
    </div>
  </div>
);

const InitialSyncStep = ({ integration }: { integration: Integration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Importing your data</h2>
      <p className="text-slate-500 mb-12">
        Initial sync typically takes a minute. You can close this window and we'll notify you.
      </p>

      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-black text-slate-900 uppercase tracking-widest">
            <span>Syncing trades...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-100">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="text-xs font-bold text-slate-400 mb-1">Trades found</div>
            <div className="text-lg font-black text-slate-900">4,536</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="text-xs font-bold text-slate-400 mb-1">Time remaining</div>
            <div className="text-lg font-black text-slate-900">~12s</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColumnMapStep = ({ integration }: { integration: Integration }) => (
  <div>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Map your columns</h2>
        <p className="text-slate-500 text-sm">We found 8 columns. Match them to WealthOS fields.</p>
      </div>
      <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500">
        240 ROWS
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className="flex-1">Your file column</div>
        <div className="w-8 shrink-0" />
        <div className="flex-1">WealthOS field</div>
        <div className="w-32 shrink-0">Status</div>
      </div>

      {[
        { file: "Trade Date", field: "Date", status: "auto" },
        { file: "Instrument", field: "Holding name", status: "auto" },
        { file: "Trade Type", field: "Type (buy/sell)", status: "auto" },
        { file: "Qty", field: "Quantity", status: "auto" },
        { file: "Price", field: "Price per unit", status: "auto" },
        { file: "Trade Value", field: null, status: "manual" },
        { file: "Brokerage", field: "Charges", status: "auto" },
        { file: "Remarks", field: null, status: "manual" },
      ].map((row, i) => (
        <div
          key={i}
          className={`flex items-center p-4 rounded-2xl border transition-all ${
            row.status === "auto"
              ? "bg-emerald-50/50 border-emerald-100"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex-1 text-sm font-bold text-slate-700 font-mono">{row.file}</div>
          <div className="w-8 shrink-0 flex justify-center text-slate-300">
            <ArrowRight size={14} />
          </div>
          <div className="flex-1">
            {row.field ? (
              <span className="text-sm font-bold text-slate-900">{row.field}</span>
            ) : (
              <div className="flex items-center justify-between px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 cursor-pointer hover:border-indigo-300 transition-colors">
                Select field
                <ChevronRight size={12} />
              </div>
            )}
          </div>
          <div className="w-32 shrink-0">
            {row.status === "auto" ? (
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 w-fit">
                <CheckCircle2 size={10} /> Auto-matched
              </span>
            ) : (
              <span className="text-[9px] font-black text-amber-600 bg-amber-100/50 px-2 py-1 rounded uppercase tracking-wider w-fit">
                Needs mapping
              </span>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
        Preview (First 3 rows):
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono text-slate-600">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left pb-2 font-black">Date</th>
              <th className="text-left pb-2 font-black">Instrument</th>
              <th className="text-left pb-2 font-black">Type</th>
              <th className="text-left pb-2 font-black">Qty</th>
              <th className="text-left pb-2 font-black">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100/50">
              <td className="py-2">15 May 26</td>
              <td className="py-2">INFY</td>
              <td className="py-2 text-emerald-600">BUY</td>
              <td className="py-2 font-black">50</td>
              <td className="py-2 font-black">1,840</td>
            </tr>
            <tr>
              <td className="py-2">12 May 26</td>
              <td className="py-2">TCS</td>
              <td className="py-2 text-red-500">SELL</td>
              <td className="py-2 font-black">10</td>
              <td className="py-2 font-black">3,920</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ConnectWizard;
