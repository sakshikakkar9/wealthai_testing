import React from "react";
import { X, Plus } from "lucide-react";
import { usePortfolioStore } from "../../../store/portfolio.store";
import { formatINR, formatNumber } from "../../../utils/formatters";

interface Transaction {
  id: string;
  holdingId: string;
  holdingName: string;
  type: "buy" | "sell" | "dividend" | "interest" | "sip";
  date: string;
  quantity?: number;
  price?: number;
  amount: number;
  account: string;
}

interface Props {
  transactions: Transaction[];
}

const TYPE_CONFIG = {
  buy: { label: "BUY", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  sell: { label: "SELL", color: "bg-red-50 text-red-700 border-red-100" },
  dividend: { label: "DIV", color: "bg-amber-50 text-amber-700 border-amber-100" },
  interest: { label: "INT", color: "bg-blue-50 text-blue-700 border-blue-100" },
  sip: { label: "SIP", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
};

const TransactionDrawer: React.FC<Props> = ({ transactions }) => {
  const { showTransactions, setShowTransactions } = usePortfolioStore();

  if (!showTransactions) return null;

  // Group by month
  const grouped = transactions.reduce(
    (acc, t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "long", year: "numeric" });
      if (!acc[month]) acc[month] = [];
      acc[month].push(t);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowTransactions(false)} />
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl z-50 flex flex-col transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
          <button
            onClick={() => setShowTransactions(false)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex gap-2 p-4 bg-slate-50 border-b border-slate-100">
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option>All Types</option>
            <option>Buy</option>
            <option>Sell</option>
            <option>Dividend</option>
          </select>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option>All Holdings</option>
          </select>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option>Recent First</option>
            <option>Oldest First</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{month}</h3>
              <div className="space-y-3">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className={`bg-white border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition-shadow ${TYPE_CONFIG[t.type].color.split(" ")[2]}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border ${TYPE_CONFIG[t.type].color}`}
                      >
                        {TYPE_CONFIG[t.type].label}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{t.holdingName}</div>
                        <div className="text-xs text-slate-400">
                          {t.quantity && `${formatNumber(t.quantity)} units @ `}
                          {t.price && formatINR(t.price)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {t.type === "sell" || t.type === "dividend" || t.type === "interest"
                          ? "+"
                          : ""}
                        {formatINR(t.amount)}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {new Date(t.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        · <span className="uppercase">{t.account}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>
    </>
  );
};

export default TransactionDrawer;
