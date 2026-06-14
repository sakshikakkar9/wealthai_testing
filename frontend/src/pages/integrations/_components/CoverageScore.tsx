import React, { useMemo } from "react";
import { Integration } from "../../../store/integration.store";

interface CoverageScoreProps {
  integrations: Integration[];
  variant?: "indigo" | "white";
}

const CoverageScore: React.FC<CoverageScoreProps> = ({ integrations, variant = "white" }) => {
  const stats = useMemo(() => {
    const connected = integrations.filter(
      (i) => i.status === "connected" || i.status === "syncing" || i.status === "warning",
    );
    const totalList = integrations.filter((i) => i.status !== "coming_soon");

    const connectedWeight = connected.reduce((sum, i) => sum + i.coverageWeight, 0);
    const totalWeight = totalList.reduce((sum, i) => sum + i.coverageWeight, 0);

    const coverage = totalWeight > 0 ? Math.round((connectedWeight / totalWeight) * 100) : 0;
    const remaining = totalList.length - connected.length;

    return { coverage, remaining };
  }, [integrations]);

  const isWhite = variant === "white";

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${isWhite ? "text-white" : "text-indigo-600"}`}>
            {stats.coverage}%
          </span>
          <span className={`text-xs font-medium ${isWhite ? "text-white/70" : "text-slate-500"}`}>
            Financial coverage
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`w-full h-2 rounded-full overflow-hidden ${isWhite ? "bg-white/20" : "bg-slate-100"}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isWhite ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" : "bg-indigo-600"
          }`}
          style={{ width: `${stats.coverage}%` }}
        />
      </div>

      <p className={`text-xs mt-2 ${isWhite ? "text-white/70" : "text-slate-500"}`}>
        {stats.coverage === 100
          ? "Your financial picture is complete!"
          : `${stats.coverage}% of your financial accounts are linked — add ${stats.remaining} more to complete your picture`}
      </p>
    </div>
  );
};

export default CoverageScore;
