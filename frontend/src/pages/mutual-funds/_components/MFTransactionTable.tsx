import React from "react";
import { MoreVertical } from "lucide-react";
import { formatINR, formatNumber } from "../../../utils/formatters";

const MF_TRANSACTIONS = [
  { id:'mt1', date:'01 May 2026', type:'sip', fund:'mf1', fundName:'Mirae Large Cap', nav:61.12, units:163.6, amount:10000, folio:'91234567/01' },
  { id:'mt2', date:'05 May 2026', type:'sip', fund:'mf2', fundName:'PPFAS Flexi Cap', nav:62.40, units:240.4, amount:15000, folio:'83421190/01' },
  { id:'mt3', date:'15 May 2026', type:'sip', fund:'mf4', fundName:'SBI Nifty Index', nav:34.20, units:146.2, amount:5000, folio:'62441100/01' },
  { id:'mt4', date:'01 Apr 2026', type:'sip', fund:'mf1', fundName:'Mirae Large Cap', nav:60.90, units:164.2, amount:10000, folio:'91234567/01' },
  { id:'mt5', date:'05 Apr 2026', type:'sip', fund:'mf2', fundName:'PPFAS Flexi Cap', nav:61.50, units:243.9, amount:15000, folio:'83421190/01' },
  { id:'mt6', date:'20 Mar 2026', type:'purchase', fund:'mf3', fundName:'HDFC Short Debt', nav:23.10, units:432.9, amount:10000, folio:'71883400/01' },
  { id:'mt7', date:'01 Mar 2026', type:'sip', fund:'mf1', fundName:'Mirae Large Cap', nav:58.80, units:170.1, amount:10000, folio:'91234567/01' },
  { id:'mt8', date:'15 Feb 2026', type:'sip', fund:'mf4', fundName:'SBI Nifty Index', nav:33.40, units:149.7, amount:5000, folio:'62441100/01' },
  { id:'mt9', date:'10 Jan 2026', type:'stp', fund:'mf3', fundName:'HDFC Short Debt', nav:22.90, units:436.7, amount:10000, folio:'71883400/01', note:'STP from HDFC Debt to HDFC Equity' },
  { id:'mt10',date:'01 Dec 2025', type:'purchase', fund:'mf5', fundName:'Axis Bluechip', nav:36.20, units:276.2, amount:10000, folio:'55218800/01' },
];

const MFTransactionTable = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fund</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">NAV</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Units</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Folio</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {MF_TRANSACTIONS.map((tx) => {
              const isOutflow = ['purchase', 'sip', 'stp', 'switch_in'].includes(tx.type);

              return (
                <tr key={tx.id} className="border-b border-slate-100/60 hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-slate-900">{tx.date}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      tx.type === 'sip' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      tx.type === 'purchase' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-slate-900">{tx.fundName}</div>
                    {(tx as any).note && <div className="text-[10px] text-slate-400 font-medium italic mt-0.5">{(tx as any).note}</div>}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-slate-600">{formatINR(tx.nav)}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="text-sm font-medium text-slate-600">{tx.units.toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-bold ${isOutflow ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isOutflow ? '−' : '+'}{formatINR(tx.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[10px] font-mono text-slate-500">{tx.folio}</div>
                  </td>
                  <td className="px-5 py-4 text-right">
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
      <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">1–10</span> of <span className="font-bold text-slate-900">10</span> transactions
        </div>
      </div>
    </div>
  );
};

export default React.memo(MFTransactionTable);
