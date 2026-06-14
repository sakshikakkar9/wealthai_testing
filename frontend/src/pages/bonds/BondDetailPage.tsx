import React, { useEffect, useState } from "react"; // 👈 Added useState
import { useParams, useNavigate } from "react-router-dom";
import { useBondStore } from "../../store/bond.store";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import {
  ArrowLeft,
  Calendar,
  Shield,
  Info,
  Percent,
  Clock,
  Activity,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { formatINR, formatPercent } from "../../utils/formatters";
import Badge from "../../components/common/Badge";

const BondDetailPage: React.FC = () => {
  const { bondId } = useParams<{ bondId: string }>();
  const navigate = useNavigate();
  
  // 1. Removed 'error' and 'setError' since they aren't provided by useBondStore
  const { bonds, isLoading, setLoading } = useBondStore();

  // 2. Local state to manage simulated error UI state if needed
  const [localError, setLocalError] = useState<string | null>(null);

  // 3. 🖥️ FIX: Changed 'b.id' to 'b.bond_id' to match your data schema
  const bond = bonds.find((b) => b.bond_id === bondId);

  useEffect(() => {
    // Simulate loading if data isn't immediately available or for consistent UX
    if (!bond && !isLoading) {
      setLoading(true);
      setLocalError(null); 
      
      const t = setTimeout(() => {
        setLoading(false);
        // If still not found after "fetching", handle fallback gracefully
        const found = bonds.find((b) => b.bond_id === bondId);
        if (!found) {
          // Optional: Set an error message if you want the Error UI to display
          // setLocalError("The bond data could not be verified on the server.");
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [bond, bondId, bonds, isLoading, setLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </main>
        </div>
      </div>
    );
  }

  if (localError) {
    return (
      <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl border border-red-100 shadow-xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Bond</h2>
              <p className="text-slate-500 mb-8">{localError}</p>
              <button
                onClick={() => navigate("/bonds")}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Back to Portfolio
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!bond) {
    return (
      <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Bond not found</h2>
              <p className="text-slate-500 mb-6">The bond you are looking for does not exist.</p>
              <button
                onClick={() => navigate("/bonds")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Back to Bonds
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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

  const getRatingVariant = (rating: string) => {
    if (["AAA", "AA+"].includes(rating)) return "success";
    if (["AA", "AA-"].includes(rating)) return "info";
    if (["A+", "A", "A-"].includes(rating)) return "warning";
    if (rating === "BBB+") return "danger";
    return "neutral";
  };

  const InfoCard = ({
    label,
    value,
    icon: Icon,
    subValue,
  }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    subValue?: string;
  }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          <Icon size={18} />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-bold text-slate-800">{value}</div>
      {subValue && <div className="text-xs text-slate-500 mt-1">{subValue}</div>}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/bonds")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors mb-6 group"
          >
            <div className="p-1.5 bg-white rounded-lg border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Bonds</span>
          </button>

          {/* Header */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={getStatusVariant(bond.status)}>{bond.status}</Badge>
                  <Badge variant={getRatingVariant(bond.rating)}>{bond.rating} Rating</Badge>
                </div>
                <h1 className="text-3xl font-bold text-slate-800">{bond.bond_name}</h1>
                <p className="text-slate-500 mt-1">
                  {bond.isin} · {bond.issuer}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Current Value
                </p>
                <div className="text-3xl font-black text-slate-900">
                  {formatINR(bond.current_value ?? 0)}
                </div>
                <div
                  className={`flex items-center gap-1.5 mt-1 font-bold ${(bond.gain_loss ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  <span>{(bond.gain_loss ?? 0) >= 0 ? "▲" : "▼"}</span>
                  <span>
                    {formatINR(Math.abs(bond.gain_loss ?? 0))} ({formatPercent(bond.gain_loss_pct ?? 0)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoCard
              label="Coupon Rate"
              value={`${bond.coupon_rate ?? 0}%`}
              icon={Percent}
              subValue={bond.coupon_frequency}
            />
            <InfoCard label="YTM" value={`${bond.ytm ?? 0}%`} icon={TrendingUp} />
            <InfoCard
              label="Maturity Date"
              value={
                bond.maturity_date
                  ? new Date(bond.maturity_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"
              }
              icon={Calendar}
              subValue={`${(bond.days_to_maturity ?? 0).toLocaleString()} days remaining`}
            />
            <InfoCard
              label="Accrued Interest"
              value={formatINR(bond.accrued_interest ?? 0)}
              icon={Clock}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Info size={20} className="text-indigo-600" />
                  Security Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <DetailItem label="Full Name" value={bond.bond_name} />
                  <DetailItem label="ISIN" value={bond.isin} />
                  <DetailItem label="Issuer" value={bond.issuer} />
                  <DetailItem label="Bond Type" value={bond.bond_type} />
                  <DetailItem label="Face Value" value={formatINR(bond.face_value ?? 0)} />
                  <DetailItem label="Rating" value={bond.rating} />
                  <DetailItem label="Tax Status" value={bond.is_taxable ? "Taxable" : "Tax Free"} />
                  {bond.sector && <DetailItem label="Sector" value={bond.sector} />}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-indigo-600" />
                  Holding Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <DetailItem label="Quantity" value={(bond.quantity ?? 0).toString()} />
                  <DetailItem label="Invested Amount" value={formatINR(bond.invested_amount ?? 0)} />
                  <DetailItem label="Avg. Purchase Price" value={formatINR(bond.purchase_price ?? 0)} />
                  <DetailItem
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
                  <DetailItem label="Current Price" value={formatINR(bond.current_price ?? 0)} />
                  <DetailItem label="Annual Income" value={formatINR(bond.annual_income ?? 0)} />
                </div>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity size={20} />
                  Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                      Unrealized Gain/Loss
                    </p>
                    <p className="text-2xl font-bold">{formatINR(bond.gain_loss ?? 0)}</p>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                      Total Returns (%)
                    </p>
                    <p className="text-2xl font-bold">{bond.gain_loss_pct ?? 0}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-lg shadow-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Upcoming Event
                </h3>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Next Coupon Payout
                  </p>
                  <p className="text-xl font-bold">
                    {bond.next_coupon_date
                      ? new Date(bond.next_coupon_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                  <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                      Estimated Amount
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      {formatINR(
                        (bond.annual_income ?? 0) / (bond.coupon_frequency === "Annual" ? 1 : 2),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Resilient value fallback type handling
const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-700">{value?.toString() ?? "—"}</p>
  </div>
);

export default BondDetailPage;