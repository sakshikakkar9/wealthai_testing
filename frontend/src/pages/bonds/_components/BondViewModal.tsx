import React from "react";
import { useBondStore } from "../../../store/bond.store";
import {
  X,
  Calendar,
  Shield,
  Info,
  Hash,
  Building2,
  Percent,
  IndianRupee,
  LucideIcon,
} from "lucide-react";
import { formatINR, formatPercent } from "../../../utils/formatters";

const BondViewModal: React.FC = () => {
  const { showViewModal, closeViewModal, selectedBondId, bonds } = useBondStore();

  const bond = bonds.find((b) => b.bond_id === selectedBondId);

  if (!showViewModal || !bond) return null;

  const DetailItem = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string | number;
    icon: LucideIcon;
  }) => (
    <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Bond Details</h2>
            <p className="text-sm text-slate-500 mt-0.5">{bond.bond_name}</p>
          </div>
          <button
            onClick={closeViewModal}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Bond Name" value={bond.bond_name} icon={Info} />
            <DetailItem label="ISIN" value={bond.isin} icon={Hash} />
            <DetailItem label="Issuer" value={bond.issuer} icon={Building2} />
            <DetailItem label="Bond Type" value={bond.bond_type} icon={Shield} />
            <DetailItem label="Rating" value={bond.rating} icon={Shield} />
            <DetailItem label="Status" value={bond.status} icon={Info} />
            <DetailItem label="Maturity Date" value={bond.maturity_date} icon={Calendar} />
            <DetailItem
              label="Coupon Rate"
              value={formatPercent(bond.coupon_rate)}
              icon={Percent}
            />
            <DetailItem label="YTM" value={formatPercent(bond.ytm)} icon={Percent} />
            <DetailItem
              label="Invested Amount"
              value={formatINR(bond.invested_amount)}
              icon={IndianRupee}
            />
            <DetailItem
              label="Current Value"
              value={formatINR(bond.current_value)}
              icon={IndianRupee}
            />
            <DetailItem
              label="Gain/Loss"
              value={`${formatINR(bond.gain_loss)} (${formatPercent(bond.gain_loss_pct)})`}
              icon={IndianRupee}
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={closeViewModal}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BondViewModal;
