import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import { formatINR } from "../../../utils/formatters";

interface DepositTypeBreakdownProps {
  data: {
    byType: { label: string; value: number; color: string }[];
    byCategory: { label: string; value: number; color: string }[];
    byTenure: { label: string; value: number; color: string }[];
  };
}

const BreakdownItem = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="text-slate-500">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-700 font-bold">{formatINR(value)}</span>
          <span className="text-slate-400 text-[10px]">({percent.toFixed(1)}%)</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const DepositTypeBreakdown: React.FC<DepositTypeBreakdownProps> = ({ data }) => {
  const totalPrincipal = data.byType.reduce((s, i) => s + i.value, 0);

  return (
    <WidgetCard title="Deposit Mix" subtitle="Portfolio diversification">
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            By Payout Type
          </h4>
          <div className="space-y-3">
            {data.byType.map((item, i) => (
              <BreakdownItem key={i} {...item} total={totalPrincipal} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            By Asset Category
          </h4>
          <div className="space-y-3">
            {data.byCategory.map((item, i) => (
              <BreakdownItem key={i} {...item} total={totalPrincipal} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            By Tenure
          </h4>
          <div className="space-y-3">
            {data.byTenure.map((item, i) => (
              <BreakdownItem key={i} {...item} total={totalPrincipal} />
            ))}
          </div>
        </div>

        <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-[10px] text-indigo-700 leading-relaxed italic">
            "₹1,50,000 in tax-saver FD eligible for Section 80C deduction (₹1.5L annual limit)."
          </p>
        </div>
      </div>
    </WidgetCard>
  );
};

export default React.memo(DepositTypeBreakdown);
