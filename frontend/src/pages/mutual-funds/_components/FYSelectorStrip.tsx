import React from "react";
import { useMFStore } from "../../../store/mutualfund.store";

const FYSelectorStrip = () => {
  const { taxFY, setTaxFY } = useMFStore();
  const fyears = ["2025-26", "2024-25", "2023-24"];

  return (
    <div className="flex items-center gap-4 bg-white/50 p-1.5 rounded-2xl w-fit border border-slate-100 shadow-sm">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 pr-1">
        Financial Year:
      </span>
      <div className="flex items-center gap-1">
        {fyears.map((fy) => (
          <button
            key={fy}
            onClick={() => setTaxFY(fy)}
            className={`
              px-4 py-1.5 rounded-xl text-xs font-bold transition-all
              ${taxFY === fy ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"}
            `}
          >
            {fy}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(FYSelectorStrip);
