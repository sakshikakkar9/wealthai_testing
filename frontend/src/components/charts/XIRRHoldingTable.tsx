import React, { useMemo } from "react";
import xirr from "xirr";
import { formatINR, formatPercent } from "../../utils/formatters";
import HoldingSparkline from "./HoldingSparkline";

interface HoldingData {
  symbol: string;
  buyDate: string;
  buyPrice: number;
  currentPrice: number;
  quantity: number;
  sparkline: number[];
}

interface Props {
  holdings: HoldingData[];
}

/**
 * Calculates XIRR for a single holding.
 * Assumes a single buy transaction and the current valuation as the sell transaction.
 */
function calculateHoldingXIRR(
  buyDate: string,
  buyPrice: number,
  currentPrice: number,
  quantity: number,
): number {
  try {
    const transactions = [
      { amount: -(buyPrice * quantity), when: new Date(buyDate) },
      { amount: currentPrice * quantity, when: new Date() },
    ];
    // xirr returns a decimal (e.g., 0.15 for 15%), we convert to percentage
    return xirr(transactions) * 100;
  } catch (e) {
    console.error("XIRR calculation failed", e);
    return 0;
  }
}

/**
 * Calculates CAGR for a single holding.
 * Formula: ((Current Value / Invested Value) ^ (1 / years)) - 1
 */
function calculateHoldingCAGR(buyDate: string, buyPrice: number, currentPrice: number): number {
  const start = new Date(buyDate);
  const end = new Date();
  const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (years <= 0) return 0;

  const totalReturn = currentPrice / buyPrice;
  return (Math.pow(totalReturn, 1 / years) - 1) * 100;
}

const XIRRHoldingTable: React.FC<Props> = ({ holdings }) => {
  const getReturnColor = (val: number) => {
    if (val >= 12) return "text-emerald-600";
    if (val >= 0) return "text-amber-600";
    return "text-red-600";
  };

  const analyzedHoldings = useMemo(() => {
    return holdings.map((h) => {
      const xirrVal = calculateHoldingXIRR(h.buyDate, h.buyPrice, h.currentPrice, h.quantity);
      const cagrVal = calculateHoldingCAGR(h.buyDate, h.buyPrice, h.currentPrice);
      const absReturn = ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100;

      return {
        ...h,
        xirr: xirrVal,
        cagr: cagrVal,
        absReturn,
      };
    });
  }, [holdings]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Returns Analysis</h3>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Dynamic XIRR & CAGR per Holding
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Holding
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                XIRR
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                CAGR
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Abs. Return
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {analyzedHoldings.map((h) => (
              <tr
                key={h.symbol}
                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{h.symbol}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Bought {h.buyDate}</div>
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold tabular-nums ${getReturnColor(h.xirr)}`}
                >
                  {h.xirr.toFixed(2)}%
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold tabular-nums ${getReturnColor(h.cagr)}`}
                >
                  {h.cagr.toFixed(2)}%
                </td>
                <td
                  className={`px-6 py-4 text-right tabular-nums font-semibold ${h.absReturn >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {h.absReturn >= 0 ? "+" : ""}
                  {h.absReturn.toFixed(2)}%
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <HoldingSparkline data={h.sparkline} positive={h.absReturn >= 0} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default XIRRHoldingTable;
