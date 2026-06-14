import React, { useMemo } from "react";
import { Bond, COUPON_SCHEDULE } from "../_data/bonds.data";
import { formatINR, formatShortINR } from "../../../utils/formatters";
import { computeWeightedAvgYTM, daysBetween } from "../../../utils/bondUtils";

interface Props {
  bonds: Bond[];
}

const SummaryCards: React.FC<Props> = ({ bonds }) => {
  const stats = useMemo(() => {
    const totalInvested = bonds.reduce((sum, b) => sum + Number(b.invested_amount ?? 0), 0);
    const totalCurrentValue = bonds.reduce((sum, b) => sum + Number(b.current_value ?? 0), 0);
    const totalGain = totalCurrentValue - totalInvested;
    const totalAnnualIncome = bonds.reduce((sum, b) => sum + Number(b.annual_income ?? 0), 0);

    const taxableIncome = bonds
      .filter((b) => b.is_taxable)
      .reduce((sum, b) => sum + Number(b.annual_income ?? 0), 0);
    const taxFreeIncome = bonds
      .filter((b) => !b.is_taxable)
      .reduce((sum, b) => sum + Number(b.annual_income ?? 0), 0);

    const weightedAvgCoupon =
      totalInvested > 0
        ? bonds.reduce(
            (sum, b) => sum + Number(b.coupon_rate ?? 0) * Number(b.invested_amount ?? 0),
            0,
          ) / totalInvested
        : 0;

    const weightedAvgYTM = computeWeightedAvgYTM(bonds);

    const totalAccruedInterest = bonds.reduce((sum, b) => sum + Number(b.accrued_interest ?? 0), 0);

    // Compute days to next coupon from COUPON_SCHEDULE
    const today = "2026-05-15";
    const futureCoupons = [...COUPON_SCHEDULE]
      .filter((c) => c.coupon_date > today)
      .sort((a, b) => a.coupon_date.localeCompare(b.coupon_date));

    const daysToNextCoupon =
      futureCoupons.length > 0 ? daysBetween(today, futureCoupons[0].coupon_date) : 0;

    const typesCount = new Set(bonds.map((b) => b.bond_type)).size;

    return {
      totalInvested,
      totalCurrentValue,
      totalGain,
      totalAnnualIncome,
      taxableIncome,
      taxFreeIncome,
      weightedAvgCoupon,
      weightedAvgYTM,
      totalAccruedInterest,
      daysToNextCoupon,
      typesCount,
      bondsCount: bonds.length,
    };
  }, [bonds]);

  return (
    <>
      {/* Card 1 — Total Invested */}
      <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-indigo-500 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Total Invested
        </p>
        <div className="text-2xl font-semibold text-slate-800">
          {formatINR(stats.totalInvested)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {stats.bondsCount} bonds · {stats.typesCount} types
        </p>
      </div>

      {/* Card 2 — Current Value */}
      <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Current Value
        </p>
        <div className="text-2xl font-semibold text-slate-800">
          {formatINR(stats.totalCurrentValue)}
        </div>
        <p className={`text-xs mt-1 ${stats.totalGain >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {stats.totalGain >= 0 ? "▲" : "▼"} {formatINR(Math.abs(stats.totalGain))} gain
        </p>
      </div>

      {/* Card 3 — Annual Coupon Income */}
      <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-amber-500 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Annual Income
        </p>
        <div className="text-2xl font-semibold text-slate-800">
          {formatINR(stats.totalAnnualIncome)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          ₹{formatShortINR(stats.taxableIncome)} taxable · ₹{formatShortINR(stats.taxFreeIncome)}{" "}
          tax-free
        </p>
      </div>

      {/* Card 4 — Avg YTM */}
      <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-purple-500 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Avg Yield (YTM)
        </p>
        <div className="text-2xl font-semibold text-slate-800">
          {stats.weightedAvgYTM.toFixed(2)}%
        </div>
        <p className="text-xs text-slate-400 mt-1">Next coupon in {stats.daysToNextCoupon} days</p>
      </div>

      {/* Card 5 — Accrued Interest */}
      <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-rose-400 shadow-sm p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Accrued Interest
        </p>
        <div className="text-2xl font-semibold text-slate-800">
          {formatINR(stats.totalAccruedInterest)}
        </div>
        <p className="text-xs text-slate-400 mt-1">Interest in-flight, not yet received</p>
      </div>
    </>
  );
};

export default React.memo(SummaryCards);
