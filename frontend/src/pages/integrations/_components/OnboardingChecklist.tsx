import React from "react";
import { X, CheckCircle2, Circle, Rocket } from "lucide-react";
import { Integration, IntegrationCategory } from "../../../store/integration.store";

interface OnboardingChecklistProps {
  integrations: Integration[];
  onDismiss: () => void;
  onConnect: (id: string) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  integrations,
  onDismiss,
  onConnect,
}) => {
  const steps = [
    {
      label: "Connect a broker",
      category: "broker" as IntegrationCategory,
      doneLabel: (name: string) => `${name} connected`,
    },
    {
      label: "Link your mutual funds",
      category: "mutual_fund" as IntegrationCategory,
      doneLabel: (name: string) => `${name} connected`,
    },
    {
      label: "Add a bank account",
      category: "bank" as IntegrationCategory,
      doneLabel: (name: string) => `Bank connected`,
    },
    {
      label: "Connect market data",
      category: "market_data" as IntegrationCategory,
      doneLabel: (name: string) => `Market data active`,
    },
  ];

  const processedSteps = steps.map((step) => {
    const connected = integrations.find(
      (i) => i.category === step.category && (i.status === "connected" || i.status === "syncing"),
    );
    return {
      ...step,
      isDone: !!connected,
      displayText: connected ? step.doneLabel(connected.shortName) : step.label,
      targetId: integrations.find((i) => i.category === step.category)?.id,
    };
  });

  const doneCount = processedSteps.filter((s) => s.isDone).length;
  const progress = (doneCount / steps.length) * 100;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl mx-6 my-4 p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-indigo-900 font-bold">
          <Rocket size={18} className="text-indigo-600" />
          Complete your financial picture
        </div>
        <button
          onClick={onDismiss}
          className="text-indigo-400 hover:text-indigo-600 p-1 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-6 relative z-10">
        {processedSteps.map((step, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 text-sm cursor-pointer transition-colors ${
              step.isDone ? "text-indigo-900 font-medium" : "text-slate-500 hover:text-indigo-600"
            }`}
            onClick={() => !step.isDone && step.targetId && onConnect(step.targetId)}
          >
            {step.isDone ? (
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            ) : (
              <Circle size={18} className="text-slate-300 shrink-0" />
            )}
            {step.displayText}
          </div>
        ))}
      </div>

      <div className="space-y-2 relative z-10">
        <div className="w-full h-1.5 bg-indigo-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
          {doneCount} of {steps.length} steps complete
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-indigo-200/30 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-200/50 transition-colors" />
    </div>
  );
};

export default OnboardingChecklist;
