import React, { useMemo } from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import Badge from "../../../components/common/Badge";

interface Props {
  summary: {
    wtdAvgPE: number;
    wtdAvgDivYield: number;
    wtdAvgBeta: number;
  };
}

const FundamentalsSnapshot: React.FC<Props> = ({ summary }) => {
  const FUNDAMENTAL_SIGNALS: Record<
    string,
    (portfolio: number, benchmark: number) => "good" | "warn" | "neutral"
  > = {
    pe: (p, b) => (p < b * 0.9 ? "good" : p > b * 1.15 ? "warn" : "neutral"),
    divYield: (p, b) => (p > b * 1.1 ? "good" : p < b * 0.8 ? "warn" : "neutral"),
    beta: (p) => (p < 0.9 ? "good" : p > 1.2 ? "warn" : "neutral"),
    roe: (p, b) => (p > b * 1.2 ? "good" : p < b * 0.8 ? "warn" : "neutral"),
  };

  const rows = [
    { label: "P/E Ratio", portfolio: summary.wtdAvgPE, benchmark: 22.1, suffix: "x", type: "pe" },
    { label: "P/Book Value", portfolio: 6.2, benchmark: 3.8, suffix: "x", type: "neutral" },
    {
      label: "Dividend Yield",
      portfolio: summary.wtdAvgDivYield,
      benchmark: 1.2,
      suffix: "%",
      type: "divYield",
    },
    { label: "Beta", portfolio: summary.wtdAvgBeta, benchmark: 1.0, suffix: "", type: "beta" },
    { label: "Avg ROE", portfolio: 25.8, benchmark: 16.2, suffix: "%", type: "roe" },
  ];

  return (
    <WidgetCard title="Portfolio Fundamentals" subtitle="Weighted averages vs NIFTY 50">
      <div className="space-y-0.5">
        <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 mb-1">
          <span className="col-span-1">Metric</span>
          <span className="text-right">Portfolio</span>
          <span className="text-right">NIFTY 50</span>
          <span className="text-right">Signal</span>
        </div>

        {rows.map((row, idx) => {
          const signal =
            row.type !== "neutral"
              ? FUNDAMENTAL_SIGNALS[row.type]?.(row.portfolio, row.benchmark)
              : "warn";

          return (
            <div
              key={idx}
              className="grid grid-cols-4 gap-2 text-sm py-3 border-b border-slate-50 items-center last:border-0"
            >
              <span className="text-slate-600 font-medium">{row.label}</span>
              <span className="text-right font-bold text-slate-900 tabular-nums">
                {row.portfolio}
                {row.suffix}
              </span>
              <span className="text-right text-slate-400 tabular-nums">
                {row.benchmark}
                {row.suffix}
              </span>
              <div className="flex justify-end">
                {signal === "good" ? (
                  <Badge
                    variant="emerald"
                    className="text-[10px] py-0 px-1.5 h-5 flex items-center"
                  >
                    ✓ Positive
                  </Badge>
                ) : signal === "warn" ? (
                  <Badge variant="amber" className="text-[10px] py-0 px-1.5 h-5 flex items-center">
                    ⚠ Premium
                  </Badge>
                ) : (
                  <Badge variant="indigo" className="text-[10px] py-0 px-1.5 h-5 flex items-center">
                    Neutral
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
};

export default React.memo(FundamentalsSnapshot);
