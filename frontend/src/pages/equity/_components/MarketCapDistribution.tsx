import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatShortINR } from "../../../utils/formatters";

interface Props {
  data: {
    large: { value: number; weight: number; avgGain: number };
    mid: { value: number; weight: number; avgGain: number };
    small: { value: number; weight: number; avgGain: number };
  };
}

const MarketCapDistribution: React.FC<Props> = ({ data }) => {
  return (
    <WidgetCard title="Market Cap Mix">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-6">
          {/* Large Cap Ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#6366F1 0% ${data.large.weight}%, transparent ${data.large.weight}% 100%)`,
              maskImage: "radial-gradient(transparent 65%, black 66%)",
              WebkitMaskImage: "radial-gradient(transparent 65%, black 66%)",
            }}
          />
          {/* Mid Cap Ring */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: `conic-gradient(transparent 0% ${data.large.weight}%, #8B5CF6 ${data.large.weight}% ${data.large.weight + data.mid.weight}%, transparent ${data.large.weight + data.mid.weight}% 100%)`,
              maskImage: "radial-gradient(transparent 65%, black 66%)",
              WebkitMaskImage: "radial-gradient(transparent 65%, black 66%)",
            }}
          />
          {/* Small Cap Ring */}
          <div
            className="absolute inset-8 rounded-full"
            style={{
              background: `conic-gradient(transparent 0% ${data.large.weight + data.mid.weight}%, #A78BFA ${data.large.weight + data.mid.weight}% 100%)`,
              maskImage: "radial-gradient(transparent 65%, black 66%)",
              WebkitMaskImage: "radial-gradient(transparent 65%, black 66%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900">{data.large.weight}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Large
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-sm font-medium text-slate-700">
                Large Cap ({data.large.weight}%)
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                {formatShortINR(data.large.value)}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                avg gain +{data.large.avgGain}%
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-sm font-medium text-slate-700">
                Mid Cap ({data.mid.weight}%)
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                {formatShortINR(data.mid.value)}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                avg gain +{data.mid.avgGain}%
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <span className="text-sm font-medium text-slate-700">
                Small Cap ({data.small.weight}%)
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                {formatShortINR(data.small.value)}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                avg gain +{data.small.avgGain}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 w-full text-center">
          <span className="text-[10px] text-slate-400 font-medium">
            Market cap categories per SEBI definition
          </span>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(MarketCapDistribution);
