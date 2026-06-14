import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useIntegrationStore } from "../../store/integration.store";

const Toast: React.FC = () => {
  const { toasts, removeToast } = useIntegrationStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full sm:w-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3
            animate-in fade-in slide-in-from-right-5 duration-300
            ${toast.type === "success" ? "border-l-4 border-l-emerald-500" : ""}
            ${toast.type === "error" ? "border-l-4 border-l-red-500" : ""}
            ${toast.type === "info" ? "border-l-4 border-l-indigo-500" : ""}
          `}
        >
          <div className="shrink-0">
            {toast.type === "success" && <CheckCircle2 className="text-emerald-500" size={20} />}
            {toast.type === "error" && <AlertCircle className="text-red-500" size={20} />}
            {toast.type === "info" && <Info className="text-indigo-500" size={20} />}
          </div>
          <div className="flex-1 text-sm font-medium text-slate-800">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
