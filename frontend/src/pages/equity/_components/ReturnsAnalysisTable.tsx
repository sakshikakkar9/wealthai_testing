import React from 'react';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatINR } from '../../../utils/formatters';
import ActionMenu from '../../../components/common/ActionMenu';
import HoldingSparkline from '../../../components/charts/HoldingSparkline';

export interface ReturnHolding {
  id: string;
  company_name: string;
  symbol: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  invested_amount: number;
  current_value: number;
  unrealised_pnl: number;
  sparkline?: number[];
}

interface ReturnsAnalysisTableProps {
  holdings: ReturnHolding[];
  onView:   (h: ReturnHolding) => void;
  onEdit:   (h: ReturnHolding) => void;
  onDelete: (h: ReturnHolding) => void;
}

const ReturnsAnalysisTable: React.FC<ReturnsAnalysisTableProps> = ({ holdings, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Returns Analysis</h3>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Dynamic XIRR & CAGR per Holding
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Holding</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Buy</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Curr Price</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invested</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Curr Value</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unreal. P&L</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Trend</th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{h.company_name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{h.symbol}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{h.quantity}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatINR(h.avg_buy_price)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatINR(h.current_price)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatINR(h.invested_amount)}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatINR(h.current_value)}</td>
                <td className={`px-6 py-4 text-sm font-semibold ${h.unrealised_pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {h.unrealised_pnl >= 0 ? '+' : ''}{formatINR(h.unrealised_pnl)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <HoldingSparkline data={h.sparkline ?? []} positive={h.unrealised_pnl >= 0} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <ActionMenu
                      trigger={<button className="p-1 rounded hover:bg-slate-100 text-slate-400"><MoreHorizontal size={16} /></button>}
                      items={[
                        { label: 'View',   icon: Eye,         onClick: () => onView(h) },
                        { label: 'Edit',   icon: Pencil,      onClick: () => onEdit(h) },
                        { label: 'Delete', icon: Trash2,      onClick: () => onDelete(h), variant: 'danger' },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsAnalysisTable;
