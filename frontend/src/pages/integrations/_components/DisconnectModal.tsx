import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useIntegrationStore } from "../../../store/integration.store";

const DisconnectModal: React.FC = () => {
  const { disconnectId, closeDisconnectModal, integrations, addToast } = useIntegrationStore();
  const [confirmText, setConfirmText] = useState("");

  const integration = integrations.find((i) => i.id === disconnectId);

  if (!integration) return null;

  const handleDisconnect = () => {
    if (confirmText.toLowerCase() === "disconnect") {
      // In a real app, this would be a store action
      addToast({
        type: "success",
        message: `${integration.name} disconnected successfully.`,
      });
      closeDisconnectModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Disconnect {integration.name}?</h2>
            <button
              onClick={closeDisconnectModal}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="text-red-600 shrink-0" size={20} />
              <div className="text-sm font-medium text-red-800">
                <p className="font-bold mb-1 text-red-900">Warning: This action is destructive</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li>Stop automatic syncing</li>
                  <li>Remove all imported trade history</li>
                  <li>Remove all holdings synced from {integration.name}</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Your manually added transactions will not be affected. To confirm, type{" "}
            <span className="font-bold text-slate-900">disconnect</span> below:
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'disconnect' to confirm"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all mb-6"
          />

          <div className="flex gap-3">
            <button
              onClick={closeDisconnectModal}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDisconnect}
              disabled={confirmText.toLowerCase() !== "disconnect"}
              className={`flex-1 font-bold py-3 rounded-2xl transition-all text-sm ${
                confirmText.toLowerCase() === "disconnect"
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisconnectModal;
