import React, { useState } from "react";
import { AlertCircle, AlertTriangle, RefreshCw, X, Eye, EyeOff } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

const ReAuthModal: React.FC = () => {
  const { reAuthId, closeReAuthModal, integrations, startSyncProgress, addToast } =
    useIntegrationStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const integration = integrations.find((i) => i.id === reAuthId);

  if (!integration) return null;

  const handleReconnect = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      closeReAuthModal();
      startSyncProgress(integration.id, integration.name);
      addToast({
        type: "info",
        message: `Refreshing connection with ${integration.name}...`,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm ${integration.logoColor}`}
              >
                {integration.logoInitials}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Re-authenticate {integration.name}
              </h2>
            </div>
            <button
              onClick={closeReAuthModal}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {integration.status === "error" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex gap-3">
              <AlertCircle className="text-red-600 shrink-0" size={20} />
              <div className="text-sm font-medium text-red-800">
                <p className="font-bold mb-0.5">Session expired</p>
                <p className="opacity-90">{integration.errorMessage}</p>
              </div>
            </div>
          )}

          {integration.status === "warning" && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-3">
              <AlertTriangle className="text-amber-600 shrink-0" size={20} />
              <div className="text-sm font-medium text-amber-800">
                <p className="font-bold mb-0.5">Attention needed</p>
                <p className="opacity-90">{integration.warningMessage}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {integration.authFlow === "oauth" && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-600 mb-6">
                  You will be redirected to {integration.name} to securely re-authorize WealthOS.
                </p>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-indigo-50 p-4 rounded-full">
                      <RefreshCw className="text-indigo-600" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(integration.authFlow === "credentials" || integration.authFlow === "api_key") && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    {integration.authFlow === "api_key" ? "API Key" : "User ID / PAN"}
                  </label>
                  <input
                    type="text"
                    defaultValue={integration.accounts[0]?.maskedId || ""}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    {integration.authFlow === "api_key" ? "Secret Key" : "Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {integration.authFlow === "account_aggregator" && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-600 mb-6">
                  You need to renew your Account Aggregator consent to continue syncing.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Consent details:</h4>
                  <ul className="text-[11px] text-slate-500 space-y-1.5">
                    <li className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-bold text-slate-700">1 Year</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Data shared:</span>
                      <span className="font-bold text-slate-700">Balance, Transactions</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeReAuthModal}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReconnect}
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-2xl hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : integration.authFlow === "oauth" ? (
                "Reconnect via OAuth"
              ) : (
                "Update & Sync"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReAuthModal;
