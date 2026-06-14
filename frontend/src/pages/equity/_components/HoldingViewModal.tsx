import React from 'react';
import { ReturnHolding } from './ReturnsAnalysisTable';
import { formatINR } from '../../../utils/formatters';

interface DetailItemProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, valueClassName }) => (
  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
    <div className={`text-base font-bold text-slate-800 ${valueClassName}`}>{value}</div>
  </div>
);

interface Props {
  holding: ReturnHolding;
  onClose: () => void;
}

const HoldingViewModal: React.FC<Props> = ({ holding, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Holding Details</h2>
            <p className="text-sm text-slate-400">{holding.company_name} ({holding.symbol})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 5L5 15M5 5l10 10" /></svg>
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-4">
          <DetailItem label="Company Name" value={holding.company_name} />
          <DetailItem label="Symbol" value={holding.symbol} />
          <DetailItem label="Quantity" value={holding.quantity} />
          <DetailItem label="Avg Buy Price" value={formatINR(holding.avg_buy_price)} />
          <DetailItem label="Current Price" value={formatINR(holding.current_price)} />
          <DetailItem label="Invested Amount" value={formatINR(holding.invested_amount)} />
          <DetailItem label="Current Value" value={formatINR(holding.current_value)} />
          <DetailItem
            label="Unrealised P&L"
            value={`${holding.unrealised_pnl >= 0 ? '+' : ''}${formatINR(holding.unrealised_pnl)}`}
            valueClassName={holding.unrealised_pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}
          />
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldingViewModal;
