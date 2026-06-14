import React, { useMemo } from "react";
import { FixedDeposit } from "../../store/deposit.store";
import { computeLadderScore } from "../../../utils/fdCalculations";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import WidgetCard from "../../../components/common/WidgetCard";
import { AlertCircle, Plus, CheckCircle2 } from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";

interface FDLadderAnalyserProps {
  fds: FixedDeposit[];
}

const FDLadderAnalyser: React.FC<FDLadderAnalyserProps> = ({ fds }) => {
  const { setShowNewFDModal } = useDepositStore();

  const ladderData = useMemo(() => {
    const score = computeLadderScore(fds);

    // Group by year-quarter
    const grouped: Record<string, { amount: number; fds: string[]; status: string }> = {};

    // Mocking some future years for display
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];
    const quarters = ["Q1", "Q2", "Q3", "Q4"];

    fds.forEach((fd) => {
      const date = new Date(fd.maturityDate);
      const key = `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
      if (!grouped[key]) {
        grouped[key] = { amount: 0, fds: [], status: fd.status };
      }
      grouped[key].amount += fd.principal;
      grouped[key].fds.push(fd.bankShortName);
    });

    const maxAmount = Math.max(...Object.values(grouped).map((g) => g.amount), 1);

    // Generate display rows
    const rows: {
      label: string;
      amount: number;
      fds: string[];
      status: string;
      isGap: boolean;
    }[] = [];
    years.forEach((y) => {
      quarters.forEach((q) => {
        const key = `${y} ${q}`;
        if (grouped[key] || y <= currentYear + 1) {
          // Show current and next year quarters
          rows.push({
            label: key,
            amount: grouped[key]?.amount || 0,
            fds: grouped[key]?.fds || [],
            status: grouped[key]
              ? grouped[key].status === "maturing_soon"
                ? "⚠ Maturing soon"
                : "Active"
              : "⚡ Gap — add FD",
            isGap: !grouped[key],
          });
        }
      });
    });

    return { score, rows, maxAmount };
  }, [fds]);

  return (
    <WidgetCard title="FD Ladder Analyser" subtitle="Your maturity distribution & liquidity health">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ladder Health Score
          </span>
          <span className="text-lg font-bold text-slate-900">{ladderData.score}/100</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000"
            style={{ width: `${ladderData.score}%` }}
          />
        </div>
        <div className="mt-3 flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <AlertCircle size={14} className="text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-indigo-700 leading-relaxed">
            {ladderData.score > 80
              ? "Excellent laddering! Your maturities are well-spread, ensuring consistent liquidity."
              : ladderData.score > 60
                ? "Good health. Consider filling the 2027 gap to ensure annual cashflow."
                : "Concentration risk detected. Most of your FDs mature in a single year."}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-2 px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Year</div>
          <div className="col-span-5">Amount Maturing</div>
          <div className="col-span-3">FDs</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
          {ladderData.rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded-lg border transition-colors ${
                row.isGap
                  ? "bg-slate-50 border-dashed border-slate-200"
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="col-span-2 text-[11px] font-bold text-slate-600">{row.label}</div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      row.isGap
                        ? "bg-slate-200"
                        : row.status.includes("soon")
                          ? "bg-red-500"
                          : "bg-indigo-500"
                    }`}
                    style={{ width: `${(row.amount / ladderData.maxAmount) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold min-w-[60px] ${row.isGap ? "text-slate-300" : "text-slate-700"}`}
                >
                  {row.amount > 0 ? formatShortINR(row.amount) : "₹0"}
                </span>
              </div>
              <div className="col-span-3">
                <div className="flex -space-x-1 overflow-hidden">
                  {row.fds.length > 0 ? (
                    row.fds.map((bank, bi) => (
                      <div
                        key={bi}
                        className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-500"
                      >
                        {bank.substring(0, 2)}
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-300">—</span>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-right">
                {row.isGap ? (
                  <button
                    onClick={() => setShowNewFDModal(true)}
                    className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center justify-end gap-1"
                  >
                    <Plus size={10} /> Fill
                  </button>
                ) : (
                  <span
                    className={`text-[10px] font-bold ${row.status.includes("soon") ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {row.status.includes("soon") ? "Soon" : "Active"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={14} className="text-amber-600" />
          <span className="text-[11px] font-bold text-amber-900">Ladder Suggestion</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          You have no maturities in 2027. Add a ₹1,00,000 FD for 18-24 months to create annual
          cashflow.
        </p>
      </div>
    </WidgetCard>
  );
};

export default React.memo(FDLadderAnalyser);
