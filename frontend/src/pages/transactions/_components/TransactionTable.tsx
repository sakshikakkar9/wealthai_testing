import React, { useMemo, useCallback } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useTransactionStore, TxType, TxStatus } from "../../../store/transaction.store";
import { formatINR, formatNumber } from "../../../utils/formatters";
import Badge from "../../../components/common/Badge";

interface Transaction {
  id: string;
  date: string;
  type: TxType;
  status: TxStatus;
  holdingId: string;
  holdingName: string;
  ticker?: string;
  assetClass: string;
  account: string;
  quantity?: number;
  price?: number;
  amount: number;
  charges?: number;
  netAmount: number;
  notes?: string;
  broker?: string;
  referenceNo?: string;
  sipId?: string;
  sipInstalment?: number;
  ratePerUnit?: number;
  taxDeducted?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TypeBadge = ({ type }: { type: TxType }) => {
  const styles: Record<TxType, string> = {
    buy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    sell: "bg-red-50 text-red-700 border border-red-200",
    sip: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    stp: "bg-blue-50 text-blue-700 border border-blue-200",
    swp: "bg-violet-50 text-violet-700 border border-violet-200",
    dividend: "bg-amber-50 text-amber-700 border border-amber-200",
    interest: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    bonus: "bg-purple-50 text-purple-700 border border-purple-200",
    split: "bg-purple-50 text-purple-700 border border-purple-200",
    rights: "bg-purple-50 text-purple-700 border border-purple-200",
    merger: "bg-purple-50 text-purple-700 border border-purple-200",
    expense: "bg-slate-100 text-slate-600 border border-slate-200",
    fee: "bg-slate-100 text-slate-600 border border-slate-200",
    tax: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[type]}`}
    >
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: TxStatus }) => {
  const variants: Record<TxStatus, "success" | "warning" | "danger" | "neutral"> = {
    confirmed: "success",
    pending: "warning",
    failed: "danger",
    cancelled: "neutral",
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
};

const AccountPill = ({ account }: { account: string }) => {
  const initials = account.slice(0, 2).toUpperCase();
  return (
    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
      {initials}
    </div>
  );
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const {
    sortField,
    sortDir,
    setSort,
    selectedRows,
    toggleRow,
    selectAll,
    clearSelection,
    currentPage,
    setPage,
    pageSize,
    openAuditLog,
  } = useTransactionStore();

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      const valA = a[sortField as keyof Transaction] ?? 0;
      const valB = b[sortField as keyof Transaction] ?? 0;
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [transactions, sortField, sortDir]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedTransactions.length) {
      clearSelection();
    } else {
      selectAll(paginatedTransactions.map((t) => t.id));
    }
  }, [selectedRows.size, paginatedTransactions, selectAll, clearSelection]);

  const totalPages = Math.ceil(transactions.length / pageSize);

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No transactions found</h3>
        <p className="text-slate-500 mb-6">Try adjusting your filters to see more results.</p>
        <button
          onClick={clearSelection}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
            <tr>
              <th className="px-5 py-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={
                    selectedRows.size > 0 && selectedRows.size === paginatedTransactions.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                onClick={() => setSort("date")}
              >
                Date {sortField === "date" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Holding / Ticker
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Account
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Qty
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Price
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right cursor-pointer hover:text-slate-600"
                onClick={() => setSort("amount")}
              >
                Amount {sortField === "amount" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Charges
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right cursor-pointer hover:text-slate-600"
                onClick={() => setSort("netAmount")}
              >
                Net Amount {sortField === "netAmount" && (sortDir === "asc" ? "▲" : "▼")}
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedTransactions.map((tx) => {
              const isSelected = selectedRows.has(tx.id);
              const isOutflow = ["buy", "expense", "fee", "tax"].includes(tx.type);
              const isInflow = ["sell", "dividend", "interest"].includes(tx.type);

              return (
                <tr
                  key={tx.id}
                  className={`
                    hover:bg-slate-50 cursor-pointer transition-colors
                    ${isSelected ? "bg-indigo-50/50" : ""}
                    ${tx.status === "failed" ? "bg-red-50/30" : ""}
                    ${tx.status === "cancelled" ? "opacity-60" : ""}
                    ${tx.status === "pending" ? "bg-amber-50/20" : ""}
                  `}
                  onClick={() => openAuditLog(tx.id)}
                >
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isSelected}
                      onChange={() => toggleRow(tx.id)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">{tx.date}</div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {tx.createdAt.split(" ")[3]}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <TypeBadge type={tx.type} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-slate-900 truncate max-w-[180px]">
                      {tx.holdingName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {tx.ticker && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {tx.ticker}
                        </span>
                      )}
                      {tx.sipInstalment && (
                        <span className="text-[10px] text-indigo-500 font-medium italic">
                          • SIP #{tx.sipInstalment}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="neutral" className="text-[10px] py-0">
                      {tx.assetClass.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <AccountPill account={tx.account} />
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {tx.quantity ? formatNumber(tx.quantity) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-600">
                    {tx.price ? formatINR(tx.price) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={`text-sm font-bold ${isOutflow ? "text-red-600" : isInflow ? "text-emerald-600" : "text-slate-900"}`}
                    >
                      {isOutflow ? "−" : isInflow ? "+" : ""}
                      {formatINR(tx.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-slate-400">
                    {tx.charges ? formatINR(tx.charges) : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span
                      className={`text-sm font-bold ${isOutflow ? "text-red-600" : isInflow ? "text-emerald-600" : "text-slate-900"}`}
                    >
                      {isOutflow ? "−" : isInflow ? "+" : ""}
                      {formatINR(tx.netAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-white">
        <div className="text-xs text-slate-500 font-medium">
          Showing{" "}
          <span className="font-bold text-slate-900">{(currentPage - 1) * pageSize + 1}</span>–
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * pageSize, transactions.length)}
          </span>{" "}
          of <span className="font-bold text-slate-900">{transactions.length}</span> transactions
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`
                min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
                ${currentPage === p ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200" : "text-slate-500 hover:bg-slate-100"}
              `}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TransactionTable);
