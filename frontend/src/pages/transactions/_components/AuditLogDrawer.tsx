import React from "react";
import {
  X,
  Clock,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTransactionStore } from "../../../store/transaction.store";
import { formatINR } from "../../../utils/formatters";

const AuditLogDrawer: React.FC = () => {
  const { showAuditLog, auditTxId, closeAuditLog } = useTransactionStore();

  const AUDIT_ENTRIES = [
    {
      txId: "t001",
      timestamp: "15 May 09:20",
      action: "EDITED",
      user: "Rahul Kumar",
      detail: "Notes updated: added broker reference",
    },
    {
      txId: "t001",
      timestamp: "15 May 09:18",
      action: "VERIFIED",
      user: "System",
      detail: "Holdings balance updated · Avg cost recalculated",
    },
    {
      txId: "t001",
      timestamp: "15 May 09:18",
      action: "CREATED",
      user: "Rahul Kumar",
      detail: "Transaction created via Zerodha import",
    },
    {
      txId: "t009",
      timestamp: "20 May 11:32",
      action: "CREATED",
      user: "Priya Kumar",
      detail: "Sell order placed via Groww",
    },
    {
      txId: "t009",
      timestamp: "20 May 11:32",
      action: "VERIFIED",
      user: "System",
      detail: "P&L calculated: loss ₹-5,600 (-10.3%) · STCG triggered",
    },
  ];

  const filteredEntries = AUDIT_ENTRIES.filter((e) => !auditTxId || e.txId === auditTxId);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATED":
        return (
          <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
            <CheckCircle2 size={14} />
          </div>
        );
      case "VERIFIED":
        return (
          <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle2 size={14} />
          </div>
        );
      case "EDITED":
        return (
          <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
            <Edit2 size={14} />
          </div>
        );
      case "DELETED":
        return (
          <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
            <Trash2 size={14} />
          </div>
        );
      default:
        return (
          <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
            <Clock size={14} />
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      {showAuditLog && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[80]"
          onClick={closeAuditLog}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-[90]
          transition-transform duration-300 ease-out transform flex flex-col
          ${showAuditLog ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Audit Log</h2>
              <p className="text-xs text-slate-500 font-medium">
                Activity history for {auditTxId || "all transactions"}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuditLog}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {auditTxId && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Transaction Summary
                </span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                  Confirmed
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">Infosys Ltd · Buy</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{formatINR(92184)}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-xs font-bold text-slate-700 mt-1">Rahul Kumar</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Reference
                  </p>
                  <p className="text-xs font-bold text-slate-700 mt-1 italic">ZD20260515001</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-0 relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100" />

            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="text-slate-200 mx-auto mb-3" size={48} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  No history found
                </p>
              </div>
            ) : (
              filteredEntries.map((entry, idx) => (
                <div key={idx} className="relative pl-12 pb-8 last:pb-0 group">
                  {/* Action Marker */}
                  <div className="absolute left-0 top-0 z-10 transition-transform group-hover:scale-110">
                    {getActionIcon(entry.action)}
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {entry.timestamp}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <User size={10} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600">{entry.user}</span>
                    </div>
                  </div>
                  <div className="bg-white group-hover:bg-slate-50 transition-colors p-3 rounded-xl border border-slate-100 group-hover:border-slate-200 shadow-sm shadow-slate-50">
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                      {entry.action}
                    </p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {entry.detail}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {auditTxId && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-indigo-600">
              <Edit2 size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-indigo-600">
              <Copy size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Duplicate</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-red-50 transition-all text-slate-500 hover:text-red-600">
              <Trash2 size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Delete</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AuditLogDrawer;
