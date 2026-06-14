import React from "react";
import { formatNumber } from "../../../utils/formatters";

const FolioSummaryStrip = () => {
  const folios = [
    {
      amc: "Mirae",
      initials: "MA",
      color: "bg-indigo-600",
      folio: "91234567/01",
      registrar: "KFintech",
      units: 1840.22,
      holder: "Rahul Kumar",
    },
    {
      amc: "PPFAS",
      initials: "PP",
      color: "bg-emerald-700",
      folio: "83421190/01",
      registrar: "CAMS",
      units: 2210.54,
      holder: "Priya Kumar",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 px-5 py-3 flex flex-wrap gap-6 text-sm shadow-sm overflow-x-auto">
      {folios.map((f) => (
        <div key={f.folio} className="flex items-center gap-3 shrink-0">
          <div
            className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center text-white text-[10px] font-bold`}
          >
            {f.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{f.amc}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">· {f.folio}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {f.registrar} · {f.units.toFixed(2)} units · {f.holder}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(FolioSummaryStrip);
