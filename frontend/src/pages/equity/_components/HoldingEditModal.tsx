import React, { useState, useEffect } from 'react';
import { ReturnHolding } from './ReturnsAnalysisTable';
import { formatINR } from '../../../utils/formatters';

interface Props {
  holding: ReturnHolding;
  onSave: (id: string, data: { quantity: number; avg_buy_price: number; current_price: number }) => void;
  onClose: () => void;
}

const HoldingEditModal: React.FC<Props> = ({ holding, onSave, onClose }) => {
  const [quantity, setQuantity] = useState(holding.quantity);
  const [avgBuy, setAvgBuy] = useState(holding.avg_buy_price);
  const [currPrice, setCurrPrice] = useState(holding.current_price);

  const invested = quantity * avgBuy;
  const currentVal = quantity * currPrice;
  const pnl = currentVal - invested;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Holding</h2>
            <p className="text-sm text-slate-400">{holding.company_name} ({holding.symbol})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 5L5 15M5 5l10 10" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-medium">{holding.company_name}</div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Symbol</label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 font-medium">{holding.symbol}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Buy Price</label>
              <input
                type="number"
                value={avgBuy}
                onChange={(e) => setAvgBuy(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Price</label>
              <input
                type="number"
                value={currPrice}
                onChange={(e) => setCurrPrice(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 grid grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Invested</div>
              <div className="text-sm font-bold text-indigo-900">{formatINR(invested)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Value</div>
              <div className="text-sm font-bold text-indigo-900">{formatINR(currentVal)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Unreal. P&L</div>
              <div className={`text-sm font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {pnl >= 0 ? '+' : ''}{formatINR(pnl)}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
            Cancel
          </button>
          <button
            onClick={() => onSave(holding.id, { quantity, avg_buy_price: avgBuy, current_price: currPrice })}
            className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldingEditModal;
