import React from "react";
import {
  MoreVertical,
  Lock,
  AlertCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";
import { useDepositStore } from "../../../store/deposit.store";
import { FixedDeposit } from "../../../store/deposit.store";
import { formatINR } from "../../../utils/formatters";
import Badge from "../../../components/common/Badge";
import ActionMenu from "../../../components/common/ActionMenu";

interface FDHoldingsTableProps {
  fds: FixedDeposit[];
}

const FDHoldingsTable: React.FC<FDHoldingsTableProps> = ({ fds }) => {
  const {
    selectedRows,
    toggleRow,
    selectAll,
    setActiveFD,
    openRenewalModal,
    openBreakFDModal,
    sortField,
    setSort,
  } = useDepositStore();

  const handleSelectAll = () => {
    if (selectedRows.size === fds.length) {
      selectAll([]);
    } else {
      selectAll(fds.map((f) => f.id));
    }
  };

  if (fds.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Clock size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No fixed deposits yet</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-xs">
          Add your first FD to track maturity, interest, and DICGC coverage.
        </p>
        <button className="bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2">
          <Plus size={18} /> Add FD
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-4 px-6 w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === fds.length && fds.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
              </th>
              <th
                className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                onClick={() => setSort("bank")}
              >
                Bank
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                A/C
              </th>
              <th
                className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right cursor-pointer hover:text-slate-600"
                onClick={() => setSort("principal")}
              >
                Principal
              </th>
              <th
                className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right cursor-pointer hover:text-slate-600"
                onClick={() => setSort("rate")}
              >
                Rate
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Maturity
              </th>
              <th
                className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                onClick={() => setSort("days_left")}
              >
                Days Left
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Accrued Int.
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Maturity Value
              </th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                TDS
              </th>
              <th className="py-4 px-6 w-12 text-center">
                <MoreVertical size={14} className="mx-auto text-slate-300" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {fds.map((fd) => (
              <tr
                key={fd.id}
                className={`group hover:bg-slate-50/50 transition-colors cursor-pointer ${
                  fd.daysRemaining < 30 ? "bg-red-50/20" : ""
                } ${fd.daysRemaining >= 30 && fd.daysRemaining <= 90 ? "bg-amber-50/10" : ""} ${
                  fd.isTaxSaver ? "bg-indigo-50/10" : ""
                }`}
                onClick={() => setActiveFD(fd.id)}
              >
                <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(fd.id)}
                    onChange={() => toggleRow(fd.id)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${fd.bankLogoColor} flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-sm`}
                    >
                      {fd.bankLogoInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{fd.bankName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{fd.fdNumber}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <Badge variant={fd.type === "cumulative" ? "info" : "success"}>
                      {fd.type === "cumulative" ? "Cumulative" : "Payout"}
                    </Badge>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                      {fd.interestFrequency}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 border border-slate-200 uppercase">
                      {fd.account.substring(0, 2)}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-bold text-slate-700">
                    {formatINR(fd.principal)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-bold text-amber-700">{fd.interestRate}%</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold ${
                        fd.daysRemaining < 30 ? "text-red-600" : "text-slate-700"
                      }`}
                    >
                      {fd.maturityDate ? new Date(fd.maturityDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Started {fd.startDate ? new Date(fd.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge
                    variant={
                      fd.daysRemaining < 30 ? "danger" : fd.daysRemaining <= 90 ? "warning" : "info"
                    }
                  >
                    {fd.daysRemaining} days {fd.daysRemaining < 30 && "⚠"}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm font-medium text-emerald-600">
                    +{formatINR(fd.accruedInterest)}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-700">
                      {formatINR(fd.maturityValue)}
                    </span>
                    {fd.isTaxSaver && (
                      <span className="text-[9px] text-indigo-500 font-bold flex items-center gap-0.5">
                        <Lock size={8} /> TAX SAVER
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className={`text-sm font-medium ${
                      fd.tdsDeducted > 0 ? "text-red-600" : "text-slate-400"
                    }`}
                  >
                    {fd.tdsDeducted > 0 ? `-${formatINR(fd.tdsDeducted)}` : "₹0"}
                  </span>
                </td>
                <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    items={[
                      {
                        label: "Renew FD",
                        icon: RefreshCw,
                        onClick: () => openRenewalModal(fd.id),
                      },
                      {
                        label: "Break FD",
                        icon: AlertCircle,
                        onClick: () => openBreakFDModal(fd.id),
                        variant: "danger",
                      },
                      {
                        label: "View Transactions",
                        icon: ExternalLink,
                        onClick: () => {},
                      },
                      {
                        label: "Edit Details",
                        icon: Edit2,
                        onClick: () => {},
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        onClick: () => {},
                        variant: "danger",
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50/50 font-bold text-slate-700">
              <td className="py-4 px-6" colSpan={4}>
                TOTAL · {fds.length} FDs
              </td>
              <td className="py-4 px-4 text-right">
                {formatINR(fds.reduce((sum, fd) => sum + fd.principal, 0))}
              </td>
              <td className="py-4 px-4 text-right">
                {(
                  fds.reduce((sum, fd) => sum + fd.interestRate * fd.principal, 0) /
                  fds.reduce((sum, fd) => sum + fd.principal, 0)
                ).toFixed(2)}
                % avg
              </td>
              <td colSpan={2} />
              <td className="py-4 px-4 text-right text-emerald-600">
                +{formatINR(fds.reduce((sum, fd) => sum + fd.accruedInterest, 0))}
              </td>
              <td className="py-4 px-4 text-right">
                {formatINR(fds.reduce((sum, fd) => sum + fd.maturityValue, 0))}
              </td>
              <td className="py-4 px-4 text-right text-red-600">
                -{formatINR(fds.reduce((sum, fd) => sum + fd.tdsDeducted, 0))}
              </td>
              <td className="py-4 px-6" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default React.memo(FDHoldingsTable);
