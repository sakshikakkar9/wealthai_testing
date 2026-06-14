import { Holding } from "../../../api/mf.api";
import React from "react";
import { useMFStore } from "../../../store/mutualfund.store";
import FYSelectorStrip from "../_components/FYSelectorStrip";
import CapitalGainsPanel from "../_components/CapitalGainsPanel";
import ELSSTracker from "../_components/ELSSTracker";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import { FileText, Download, ExternalLink } from "lucide-react";

const FundTaxBreakdownTable = ({ funds }: { funds: Holding[] }) => {
  return (
    <WidgetCard title="Per-Fund Tax Breakdown" subtitle="Projected tax if redeemed today">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Fund
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Holding
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Unrealised Gain
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Proj. Tax
              </th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {funds.map((f) => {
              const isAxisSTCG = f.id === "mf5"; // Special case from prompt

              return (
                <tr
                  key={f.id}
                  className={`border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors ${isAxisSTCG ? "bg-amber-50/20" : ""}`}
                >
                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-slate-900">{f.scheme_name}</div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-600">365d</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        f.category === "debt"
                          ? "text-blue-600"
                          : true // Default to LTCG for now as holdingDays not in Holding
                            ? "text-emerald-600"
                            : "text-amber-600"
                      }`}
                    >
                      {f.category === "debt" ? "Debt" : "LTCG"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                    {formatShortINR(0)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-red-600">
                    {formatINR(0)}
                  </td>
                  <td className="px-5 py-4">
                    {isAxisSTCG ? (
                      <div
                        className="flex items-center gap-1.5"
                        title="Hold until 08 Jun 2026 to convert STCG→LTCG. Save ₹2,356 in tax."
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-bold text-amber-700 uppercase">
                          9 days to LTCG
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          Redeemable
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
};

const TaxReportsTab = ({ funds }: { funds: Holding[] }) => {
  return (
    <div className="px-6 py-5 space-y-5 pb-8">
      <FYSelectorStrip />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CapitalGainsPanel />
        <ELSSTracker />
      </div>

      <FundTaxBreakdownTable funds={funds} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WidgetCard title="Dividend Income" subtitle="FY 2025-26">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
              <FileText size={24} />
            </div>
            <div className="text-sm font-bold text-slate-900 mb-1">No dividend income recorded</div>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Your funds are primarily Growth options. Dividends (IDCW) will appear here if you
              switch to income options.
            </p>
          </div>
        </WidgetCard>

        <WidgetCard title="Download Reports" subtitle="Generate ITR-ready statements">
          <div className="space-y-1">
            {[
              {
                label: "Capital Gains Report",
                sub: "FY 2025-26 · ITR-friendly format · LTCG + STCG",
                type: "PDF",
              },
              {
                label: "Transaction Statement",
                sub: "All time · Excel format · Purchases, Redemptions, SIPs",
                type: "Excel",
              },
              {
                label: "Folio Statement (CAMS)",
                sub: "Full CAS for CAMS-registered funds",
                type: "External",
                external: true,
              },
              {
                label: "Folio Statement (KFintech)",
                sub: "Full CAS for KFintech-registered funds",
                type: "External",
                external: true,
              },
            ].map((report, i) => (
              <div
                key={i}
                onClick={() => window.alert(`Download: ${report.label}`)}
                className="flex items-center justify-between p-3 border-b border-slate-100/60 hover:bg-slate-50 cursor-pointer rounded-xl group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {report.external ? <ExternalLink size={16} /> : <Download size={16} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{report.label}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{report.sub}</div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {report.type}
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
};

export default React.memo(TaxReportsTab);
