import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBondStore, BondSortField } from "../../../store/bond.store";
import { Bond } from "../_data/bonds.data";
import { formatINR, formatPercent } from "../../../utils/formatters";
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  ExternalLink,
  Search,
  FileDown,
  X,
  Check,
  Edit3,
  Trash2,
} from "lucide-react";
import Badge from "../../../components/common/Badge";
import ActionMenu from "../../../components/common/ActionMenu";
import { toast } from "sonner";
import { exportBondsToCSV } from "../../../utils/exportUtils";
import BondEditModal from "./BondEditModal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";

export type BondColumnId =
  | "bond_name"
  | "bond_type"
  | "rating"
  | "invested_amount"
  | "current_value"
  | "gain_loss_pct"
  | "coupon_rate"
  | "ytm"
  | "maturity_date"
  | "status"
  | "actions";

export const DEFAULT_VISIBLE_COLUMNS: BondColumnId[] = [
  "bond_name",
  "bond_type",
  "rating",
  "invested_amount",
  "current_value",
  "gain_loss_pct",
  "coupon_rate",
  "ytm",
  "maturity_date",
  "status",
  "actions",
];

interface BondTableProps {
  bonds: Bond[];
}

const BondTable: React.FC<BondTableProps> = ({ bonds: incomingBonds }) => {
  const {
    sortField,
    sortDirection,
    setSort,
    activeView,
    visibleColumns,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    deleteBond,
  } = useBondStore();

  const navigate = useNavigate();
  const [editBond, setEditBond] = useState<Bond | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteBondTarget, setDeleteBondTarget] = useState<Bond | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Directly sorts the incoming pre-filtered list
  const filteredAndSortedBonds = useMemo(() => {
    let result = [...incomingBonds];

    result.sort((a, b) => {
      const aVal = a[sortField as keyof Bond];
      const bVal = b[sortField as keyof Bond];

      if (typeof aVal === "string" && typeof bVal === "string") {
        const comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  }, [incomingBonds, sortField, sortDirection]);

  const totals = useMemo(() => {
    return {
      invested: filteredAndSortedBonds.reduce((s, b) => s + Number(b.invested_amount ?? 0), 0),
      current: filteredAndSortedBonds.reduce((s, b) => s + Number(b.current_value ?? 0), 0),
      gain: filteredAndSortedBonds.reduce((s, b) => s + Number(b.gain_loss ?? 0), 0),
    };
  }, [filteredAndSortedBonds]);

  const SortIcon = ({ field }: { field: BondSortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const HeaderCell = ({
    label,
    field,
    sortable = true,
    colId,
  }: {
    label: string;
    field?: BondSortField;
    sortable?: boolean;
    colId: BondColumnId;
  }) => {
    if (colId !== "actions" && !visibleColumns.has(colId)) return null;

    return (
      <th
        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${sortable ? "cursor-pointer hover:text-indigo-600 transition-colors" : ""}`}
        onClick={() => sortable && field && setSort(field)}
      >
        <div className="flex items-center gap-1">
          {label}
          {sortable && field && <SortIcon field={field} />}
        </div>
      </th>
    );
  };

  const getStatusVariant = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case "active":
        return "success";
      case "matured":
        return "neutral";
      case "called":
        return "info";
      case "sold":
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

  const handleExportCSV = () => {
    const selectedBonds = filteredAndSortedBonds.filter((b) => selectedIds.has(b.bond_id));
    exportBondsToCSV(selectedBonds, "wealthos_bonds_export.csv");
  };

  if (activeView === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedBonds.map((bond) => (
          <div
            key={bond.bond_id}
            onClick={() => navigate(`/bonds/${bond.bond_id}`)}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <Badge className={getTypeClasses(bond.bond_type)}>{bond.bond_type}</Badge>
              <Badge variant={getStatusVariant(bond.status)}>{bond.status}</Badge>
            </div>
            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{bond.bond_name}</h4>
            <p className="text-xs text-slate-400 mb-4">{bond.isin}</p>

            <div className="grid grid-cols-2 gap-y-3 mb-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Current Value</p>
                <p className="text-sm font-bold text-slate-800">
                  {formatINR(bond.current_value ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Gain</p>
                <p className={`text-sm font-bold ${(bond.gain_loss ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {(bond.gain_loss ?? 0) >= 0 ? "▲" : "▼"}{" "}
                  {formatPercent(bond.gain_loss_pct ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Coupon / YTM</p>
                <p className="text-sm font-medium text-slate-700">
                  {bond.coupon_rate ?? "0"}% / {bond.ytm ?? "0"}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Maturity</p>
                <p className="text-sm font-medium text-slate-700">{bond.maturity_date}</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors">
              Details <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>
    );
  }

  const allSelected = filteredAndSortedBonds.length > 0 && filteredAndSortedBonds.every((b) => selectedIds.has(b.bond_id));

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-indigo-600" />
            <span className="text-indigo-700 text-sm font-medium">
              {selectedIds.size} bond{selectedIds.size > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
              <FileDown size={14} /> Export CSV
            </button>
            <button onClick={clearSelection} className="flex items-center gap-1.5 px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors">
              <X size={14} /> Clear selection
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left w-10">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          selectAll(filteredAndSortedBonds.map((b) => b.bond_id));
                        } else {
                          clearSelection();
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </th>
                <HeaderCell label="Bond Name" field="bond_name" colId="bond_name" />
                <HeaderCell label="Type" field="bond_type" colId="bond_type" />
                <HeaderCell label="Rating" field="rating" colId="rating" />
                <HeaderCell label="Invested" field="invested_amount" colId="invested_amount" />
                <HeaderCell label="Current Value" field="current_value" colId="current_value" />
                <HeaderCell label="Gain / Loss" field="gain_loss_pct" colId="gain_loss_pct" />
                <HeaderCell label="Coupon Rate" field="coupon_rate" colId="coupon_rate" />
                <HeaderCell label="YTM" field="ytm" colId="ytm" />
                <HeaderCell label="Maturity Date" field="maturity_date" colId="maturity_date" />
                <HeaderCell label="Status" field="status" colId="status" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedBonds.map((bond) => (
                <tr
                  key={bond.holding_id}
                  onClick={() => navigate(`/bonds/${bond.bond_id}`)}
                  className={`hover:bg-slate-50/70 transition-colors duration-150 border-b border-slate-100 cursor-pointer group ${selectedIds.has(bond.bond_id) ? "bg-indigo-50/30" : ""}`}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(bond.holding_id)}
                        onChange={() => toggleSelect(bond.holding_id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </td>
                  {visibleColumns.has("bond_name") && (
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">{bond.bond_name}</span>
                        <span className="text-xs text-slate-400">{bond.isin} · {bond.issuer}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.has("bond_type") && (
                    <td className="px-4 py-4">
                      <Badge className={getTypeClasses(bond.bond_type)}>{bond.bond_type}</Badge>
                    </td>
                  )}
                  {visibleColumns.has("rating") && (
                    <td className="px-4 py-4">
                      <Badge variant={getRatingVariant(bond.rating)}>{bond.rating}</Badge>
                    </td>
                  )}
                  {visibleColumns.has("invested_amount") && (
                    <td className="px-4 py-4 text-sm text-slate-600 font-medium">{formatINR(bond.invested_amount ?? 0)}</td>
                  )}
                  {visibleColumns.has("current_value") && (
                    <td className="px-4 py-4 text-sm text-slate-800 font-bold">{formatINR(bond.current_value ?? 0)}</td>
                  )}
                  {visibleColumns.has("gain_loss_pct") && (
                    <td className="px-4 py-4">
                      <div className={`flex flex-col ${(bond.gain_loss ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        <span className="text-sm font-bold">
                          {(bond.gain_loss ?? 0) >= 0 ? "▲" : "▼"} {formatINR(Math.abs(bond.gain_loss ?? 0))}
                        </span>
                        <span className="text-xs">({formatPercent(bond.gain_loss_pct ?? 0)})</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.has("coupon_rate") && (
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                          {bond.coupon_rate !== null ? `${bond.coupon_rate}%` : "—"}
                        </span>
                        <span className="text-[10px] text-slate-400">{bond.coupon_frequency || "Annual"}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.has("ytm") && (
                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      {bond.ytm !== null ? `${bond.ytm}%` : "—"}
                    </td>
                  )}
                  {visibleColumns.has("maturity_date") && (
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{bond.maturity_date}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${bond.days_to_maturity < 180 ? "bg-red-50 text-red-600" : bond.days_to_maturity < 365 ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"}`}>
                            {(bond.days_to_maturity || 0).toLocaleString()} days
                          </span>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.has("status") && (
                    <td className="px-4 py-4">
                      <Badge variant={getStatusVariant(bond.status)}>{bond.status}</Badge>
                    </td>
                  )}
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                      <ActionMenu
                        trigger={
                          <button className="ActionMenuTrigger p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        }
                        items={[
                          { label: "View", onClick: () => navigate(`/bonds/${bond.bond_id}`), icon: ExternalLink },
                          { label: "Edit", onClick: () => { setEditBond(bond); setShowEditModal(true); }, icon: Edit3 },
                          { label: "Delete", onClick: () => { setDeleteBondTarget(bond); setShowDeleteDialog(true); }, icon: Trash2, variant: "danger" }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div>Showing {filteredAndSortedBonds.length} of {incomingBonds.length} bonds</div>
          <div className="flex items-center gap-6">
            <span>Total Invested: <span className="text-slate-800 font-bold">{formatINR(totals.invested)}</span></span>
            <span>Current Value: <span className="text-slate-800 font-bold">{formatINR(totals.current)}</span></span>
            <span>Net Gain: <span className={`font-bold ${totals.gain >= 0 ? "text-emerald-600" : "text-red-500"}`}>{totals.gain >= 0 ? "▲" : "▼"} {formatINR(Math.abs(totals.gain))}</span></span>
          </div>
        </div>

        {filteredAndSortedBonds.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No bonds match your filters</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <button onClick={useBondStore.getState().resetFilters} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">Clear all filters</button>
          </div>
        )}
      </div>

      {showEditModal && editBond && (
        <BondEditModal bond={editBond} onClose={() => { setShowEditModal(false); setEditBond(null); }} onSuccess={() => { setShowEditModal(false); setEditBond(null); }} />
      )}

      {showDeleteDialog && deleteBondTarget && (
        <ConfirmDialog
          title="Delete Bond?"
          description={`Are you sure you want to delete "${deleteBondTarget.bond_name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onCancel={() => { setShowDeleteDialog(false); setDeleteBondTarget(null); }}
          onConfirm={async () => {
            try {
              await deleteBond(deleteBondTarget.holding_id);
              toast.success("Bond deleted successfully");
            } catch (error: any) {
              toast.error(error.message || "Failed to delete bond");
            }
            setShowDeleteDialog(false);
            setDeleteBondTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default BondTable;