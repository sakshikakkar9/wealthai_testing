import React, { useEffect, useMemo } from "react";
import { useBondStore } from "../../../store/bond.store";
import { BONDS } from "../_data/bonds.data";
import {
  X,
  RefreshCw,
  Edit2,
  CheckCircle,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { formatINR, formatPercent } from "../../../utils/formatters";
import Badge from "../../../components/common/Badge";
import { daysBetween, generateCouponDates } from "../../../utils/bondUtils";

interface Props {
  bonds?: typeof BONDS;
}

const BondDetailDrawer: React.FC<Props> = ({ bonds = BONDS }) => {
  const { selectedBondId, closeDetail, openDetail } = useBondStore();

  const bondIndex = useMemo(
    () => bonds.findIndex((b) => b.id === selectedBondId),
    [selectedBondId, bonds],
  );

  const bond = bondIndex !== -1 ? bonds[bondIndex] : null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeDetail]);

  if (!bond) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Matured":
        return "neutral";
      case "Called":
        return "info";
      case "Sold":
        return "danger";
      default:
        return "neutral";
    }
  };

  const getTypeClasses = (type: string) => {
    switch (type) {
      case "Govt":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Corporate":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "SDL":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SGB":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "T-Bill":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getRatingVariant = (rating: string) => {
    if (["AAA", "AA+"].includes(rating)) return "success";
    if (["AA", "AA-"].includes(rating)) return "info";
    if (["A+", "A", "A-"].includes(rating)) return "warning";
    if (rating === "BBB+") return "danger";
    return "neutral";
  };

  // Maturity progress calculation
  const start = bond.issue_date ?? bond.purchase_date;
  const today = "2026-05-15";
  const totalDays = daysBetween(start, bond.maturity_date);
  const elapsedDays = daysBetween(start, today);
  const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

  // Upcoming coupons
  const upcomingCouponDates = generateCouponDates(bond.next_coupon_date, bond.coupon_frequency, 4);
  const paymentsPerYear =
    bond.coupon_frequency === "Semi-Annual"
      ? 2
      : bond.coupon_frequency === "Annual"
        ? 1
        : bond.coupon_frequency === "Quarterly"
          ? 4
          : 1;
  const couponAmount =
    ((Number(bond.quantity ?? 0) * Number(bond.face_value ?? 0) * Number(bond.coupon_rate ?? 0)) /
      100) /
    paymentsPerYear;

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2 border-b border-slate-50 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );

  const navigateBond = (direction: "prev" | "next") => {
    const nextIndex = direction === "next" ? bondIndex + 1 : bondIndex - 1;
    if (nextIndex >= 0 && nextIndex < bonds.length) {
      openDetail(bonds[nextIndex].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] pointer-events-auto"
        onClick={closeDetail}
      />

      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-100 flex flex-col pointer-events-auto transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Badge className={getTypeClasses(bond.bond_type)}>{bond.bond_type}</Badge>
              <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => navigateBond("prev")}
                  disabled={bondIndex === 0}
                  className={`p-1 rounded-md transition-colors ${bondIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white hover:text-indigo-600 text-slate-400"}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => navigateBond("next")}
                  disabled={bondIndex === bonds.length - 1}
                  className={`p-1 rounded-md transition-colors ${bondIndex === bonds.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-white hover:text-indigo-600 text-slate-400"}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={closeDetail}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{bond.bond_name}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {bond.isin} · {bond.issuer}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${bond.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}
              />
              <span className="text-xs font-semibold text-slate-700">{bond.status}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">
              Purchased{" "}
              {new Date(bond.purchase_date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Value Summary Card */}
          <div className="p-6">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                    Current Value
                  </p>
                  <div className="text-3xl font-bold text-emerald-900">
                    {formatINR(bond.current_value ?? 0)}
                  </div>
                </div>
                <div className="bg-white/50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="text-sm font-bold text-emerald-700">
                    {(bond.gain_loss ?? 0) >= 0 ? "▲" : "▼"} {bond.gain_loss_pct ?? 0}%
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-emerald-200 pt-4">
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase">Invested</p>
                  <p className="text-sm font-bold text-emerald-800">
                    {formatINR(bond.invested_amount ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase">Total Gain</p>
                  <p className="text-sm font-bold text-emerald-800">
                    {formatINR(bond.gain_loss ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase">YTM</p>
                  <p className="text-sm font-bold text-emerald-800">{bond.ytm ?? 0}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase">
                      Accrued Interest
                    </p>
                    <button
                      title="Interest earned but not yet paid out"
                      className="text-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      <Info size={10} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-emerald-800">
                    {formatINR(bond.accrued_interest ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bond Details */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Bond Details
            </h3>
            <div className="space-y-1">
              <DetailRow label="Bond Name" value={bond.bond_name} />
              <DetailRow label="ISIN" value={bond.isin} />
              <DetailRow label="Issuer" value={bond.issuer} />
              <DetailRow label="Type" value={bond.bond_type} />
              <DetailRow
                label="Rating"
                value={<Badge variant={getRatingVariant(bond.rating)}>{bond.rating}</Badge>}
              />
              <DetailRow label="Coupon Rate" value={`${bond.coupon_rate ?? 0}% per annum`} />
              <DetailRow label="Frequency" value={bond.coupon_frequency} />
              <DetailRow label="Face Value" value={formatINR(bond.face_value ?? 0)} />
              <DetailRow label="Taxable" value={bond.is_taxable ? "Yes" : "No"} />
              {bond.sector && <DetailRow label="Sector" value={bond.sector} />}
            </div>
          </div>

          {/* Holding Details */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Holding Details
            </h3>
            <div className="space-y-1">
              <DetailRow label="Quantity" value={`${bond.quantity ?? 0} bonds`} />
              <DetailRow
                label="Purchase Price"
                value={`${formatINR(bond.purchase_price ?? 0)} per bond`}
              />
              <DetailRow
                label="Current Price"
                value={`${formatINR(bond.current_price ?? 0)} per bond`}
              />
              <DetailRow
                label="Purchase Date"
                value={
                  bond.purchase_date
                    ? new Date(bond.purchase_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"
                }
              />
              <DetailRow label="Annual Income" value={formatINR(bond.annual_income ?? 0)} />
            </div>
          </div>

          {/* Maturity & Schedule */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Maturity & Schedule
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Maturity Date</span>
                  <span className="text-slate-800 font-semibold">
                    {new Date(bond.maturity_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full w-[var(--progress)]"
                    style={{ "--progress": `${progress}%` } as React.CSSProperties}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">
                  {bond.days_to_maturity.toLocaleString()} days remaining (
                  {bond.years_to_maturity.toFixed(1)} years)
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-500">Next Coupon</span>
                  <span className="text-xs font-bold text-indigo-600">
                    {new Date(bond.next_coupon_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 italic">
                    In {daysBetween(today, bond.next_coupon_date)} days
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatINR(couponAmount)} payout
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Coupons using generated dates */}
          <div className="px-6 py-4 pb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Upcoming Coupons
            </h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2">Month</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2 text-right">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {upcomingCouponDates.map((dateStr, i) => {
                    const date = new Date(dateStr);
                    return (
                      <tr key={i} className="text-slate-700">
                        <td className="px-4 py-3 font-medium">
                          {date.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          {formatINR(couponAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          {bond.coupon_frequency}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => window.alert("Action: Update Price")}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all group"
            >
              <RefreshCw size={18} className="text-slate-400 group-hover:text-indigo-500" />
              <span className="text-[10px] font-bold uppercase">Update</span>
            </button>
            <button
              onClick={() => window.alert("Action: Edit Holding")}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all group"
            >
              <Edit2 size={18} className="text-slate-400 group-hover:text-indigo-500" />
              <span className="text-[10px] font-bold uppercase">Edit</span>
            </button>
            <button
              onClick={() => window.alert("Action: Record Coupon")}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all group"
            >
              <CheckCircle size={18} className="text-slate-400 group-hover:text-indigo-500" />
              <span className="text-[10px] font-bold uppercase">Coupon</span>
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.alert("Action: Export")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download size={14} /> Export Data
            </button>
            <button
              onClick={() => window.alert("Action: Delete")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-100 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondDetailDrawer;
