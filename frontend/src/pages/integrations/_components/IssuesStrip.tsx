import React from "react";
import { AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { Integration } from "../../../store/integration.store";

interface IssuesStripProps {
  integrations: Integration[];
}

const IssuesStrip: React.FC<IssuesStripProps> = ({ integrations }) => {
  const issues = integrations.filter((i) => i.status === "error" || i.status === "warning");

  if (issues.length === 0) return null;

  return (
    <div className="mx-6 my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
      <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
        <AlertTriangle size={16} />
        Issues need attention
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {issues.map((i) => {
          const isError = i.status === "error";
          return (
            <div
              key={i.id}
              className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border ${
                isError ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {isError ? (
                  <XCircle size={16} className="text-red-500 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{i.name}</p>
                  <p
                    className={`text-[10px] truncate ${isError ? "text-red-600" : "text-amber-700"}`}
                  >
                    {i.errorMessage || i.warningMessage || "Action required"}
                  </p>
                </div>
              </div>
              <button
                className={`flex items-center gap-1 text-[10px] font-bold shrink-0 whitespace-nowrap px-2 py-1 rounded-lg border transition-colors ${
                  isError
                    ? "text-red-700 border-red-200 hover:bg-red-100"
                    : "text-amber-700 border-amber-200 hover:bg-amber-100"
                }`}
              >
                {isError ? "Re-authenticate" : "Fix"}
                <ArrowRight size={10} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssuesStrip;
