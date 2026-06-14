import { Holding } from "../../../api/mf.api";
import React, { useState } from "react";
import { MoreVertical, Eye, Edit2, Trash2, TrendingUp } from "lucide-react";
import { useMFStore } from "../../../store/mutualfund.store";
import Badge from "../../../components/common/Badge";
import ActionMenu from "../../../components/common/ActionMenu";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import EditFundModal from "./EditFundModal";
import HoldingDetailView from "./HoldingDetailView";
import { formatINR, gainDisplay, formatDate } from "./mfUtils";

const MFHoldingsTable = ({ funds }: { funds: any[] }) => {
  const {
    setActiveFund,
    deleteHolding,
    totalItems,
    currentPage,
    pageSize,
    setPage,
    holdings,
    isLoading,
    error
  } = useMFStore();

  const [viewFund, setViewFund] = useState<Holding | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editFund, setEditFund] = useState<Holding | null>(null);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && !holdings.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!holdings.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="max-w-xs mx-auto">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No mutual fund holdings found</h3>
          <p className="text-slate-500 text-sm mb-6">Click 'Add Fund' to record your first holding.</p>
          <button
            onClick={() => useMFStore.getState().setShowAddFundModal(true)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            Add Fund
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Scheme
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Folio
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Current NAV
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Units
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Invested
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Current Value
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Gain / Loss
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                1D Change
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                SIPs
              </th>
              <th className="px-5 py-4 w-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((fund) => {
              const gain = gainDisplay(fund.gain_loss, fund.gain_pct);
              const dayChange = parseFloat(fund.day_change_percent);

              return (
                <tr
                  key={fund.id}
                  onClick={() => setActiveFund(fund.id)}
                  className="border-b border-slate-100/60 hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{fund.scheme_name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{fund.fund_house}</span>
                      <div className="mt-1">
                        <Badge variant="success" className="text-[8px] py-0 h-3.5">
                          {fund.display_category}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={fund.plan_type.toLowerCase() === 'direct' ? 'success' : 'warning'} className="text-[10px]">
                      {fund.plan_type}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {fund.folio_number}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-slate-900">{formatINR(fund.current_nav)}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{formatDate(fund.nav_date)}</div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-slate-600 font-medium">
                    {parseFloat(fund.units).toFixed(4)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-slate-900 font-medium">
                    {formatINR(fund.invested_amount)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-slate-900 font-bold">
                    {formatINR(fund.current_value)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-bold ${gain.cls}`}>
                      {gain.text}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-bold ${dayChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {dayChange >= 0 ? "+" : ""}{dayChange}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {fund.active_sip_count > 0 ? (
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      trigger={
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors ActionMenuTrigger">
                          <MoreVertical size={16} />
                        </button>
                      }
                      items={[
                        {
                          label: "View Details",
                          icon: Eye,
                          onClick: () => setViewFund(fund),
                        },
                        {
                          label: "Edit Holding",
                          icon: Edit2,
                          onClick: () => setEditFund(fund),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          variant: "danger",
                          onClick: () => setDeleteId(fund.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">
            {Math.min(totalItems, (currentPage - 1) * pageSize + 1)}–{Math.min(totalItems, currentPage * pageSize)}
          </span> of{" "}
          <span className="font-bold text-slate-900">{totalItems}</span> funds
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage * pageSize >= totalItems}
            className="px-3 py-1 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {viewFund && (
        <HoldingDetailView
          fund={viewFund}
          onClose={() => setViewFund(null)}
        />
      )}

      {editFund && (
        <EditFundModal
          fund={editFund}
          onClose={() => setEditFund(null)}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Mutual Fund?"
          description="Are you sure you want to remove this fund from your portfolio? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={async () => {
            if (deleteId) {
              await deleteHolding(deleteId);
              setDeleteId(null);
            }
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default React.memo(MFHoldingsTable);
