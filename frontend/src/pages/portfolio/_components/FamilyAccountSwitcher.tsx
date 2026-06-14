import React, { useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { usePortfolioStore } from "../../../store/portfolio.store";
import { formatShortINR } from "../../../utils/formatters";

interface Account {
  id: string;
  label: string;
  type: string;
  xirr?: number;
  value?: number;
}

interface Props {
  accounts: Account[];
}

const FamilyAccountSwitcher: React.FC<Props> = ({ accounts }) => {
  const { activeAccount, setActiveAccount } = usePortfolioStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedAccount = accounts.find((a) => a.id === activeAccount) || accounts[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium hover:border-indigo-300 transition-all focus:outline-none min-w-[180px]"
      >
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold uppercase">
          {selectedAccount.id === "all" ? <Users size={12} /> : selectedAccount.label.slice(0, 2)}
        </div>
        <span className="flex-1 text-left">{selectedAccount.label}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 w-[280px] bg-white rounded-2xl border border-slate-100 shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 space-y-1">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setActiveAccount(account.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    activeAccount === account.id
                      ? "bg-indigo-50 border border-indigo-100"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${
                        activeAccount === account.id
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {account.id === "all" ? <Users size={14} /> : account.label.slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <div
                        className={`text-xs font-bold ${activeAccount === account.id ? "text-indigo-900" : "text-slate-700"}`}
                      >
                        {account.label}
                      </div>
                      {account.xirr && (
                        <div className="text-[10px] font-medium text-slate-400">
                          XIRR {account.xirr}%
                        </div>
                      )}
                    </div>
                  </div>
                  {account.value && (
                    <div
                      className={`text-xs font-bold ${activeAccount === account.id ? "text-indigo-600" : "text-slate-900"}`}
                    >
                      {formatShortINR(account.value)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FamilyAccountSwitcher;
