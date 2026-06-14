import React from "react";
import { Check, ArrowRight, TrendingUp, Info, Upload } from "lucide-react";
import { Integration } from "../../../store/integration.store";

interface PlatformCardProps {
  integration: Integration;
  onConnect: () => void;
  onLearnMore: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ integration, onConnect, onLearnMore }) => {
  const {
    id,
    name,
    tagline,
    logoInitials,
    logoColor,
    dataTypes,
    status,
    isPopular,
    supportsRealtime,
    authFlow,
  } = integration;

  const isConnected = status !== "disconnected" && status !== "coming_soon";
  const isComingSoon = status === "coming_soon";
  const isFileImport = authFlow === "file_import";

  if (isConnected) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full border-l-4 border-l-emerald-400 group hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm ${logoColor}`}
          >
            {logoInitials}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
            <Check size={10} />
            Connected
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-1">{name}</h3>
        <p className="text-[11px] text-slate-400 font-medium mb-4">
          {integration.accounts[0]?.maskedId || "Synced"} · Synced{" "}
          {integration.accounts[0]?.lastSync || "recently"}
        </p>

        <div className="mt-auto">
          <button
            onClick={onLearnMore}
            className="w-full text-indigo-600 text-xs font-bold py-2 bg-indigo-50/50 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
          >
            View details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (isComingSoon) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full opacity-70 group">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm grayscale ${logoColor}`}
          >
            {logoInitials}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
            Coming soon
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-1">{name}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{tagline}</p>

        <div className="mt-auto space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>Community Interest</span>
              <span>68%</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-300 w-[68%]" />
            </div>
          </div>
          <button className="w-full text-indigo-600 text-xs font-bold py-2 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors">
            Notify me
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full group hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm ${logoColor}`}
        >
          {isFileImport ? <Upload size={20} /> : logoInitials}
        </div>
        {isPopular && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
            Popular
          </div>
        )}
      </div>

      <h3 className="text-sm font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3 h-8 line-clamp-2">{tagline}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {dataTypes.slice(0, 3).map((t) => (
          <span
            key={t}
            className="bg-slate-50 text-slate-500 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-slate-400 font-medium capitalize">
          {authFlow.replace("_", " ")}
        </span>
        {supportsRealtime && (
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Real-time
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <button
          onClick={onConnect}
          className="col-span-2 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
        >
          {isFileImport ? "Import file" : "Connect"}
          <ArrowRight size={14} />
        </button>
        <button
          onClick={onLearnMore}
          className="col-span-2 text-slate-500 text-xs font-bold py-2 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
        >
          <Info size={14} />
          Learn more
        </button>
      </div>
    </div>
  );
};

export default React.memo(PlatformCard);
