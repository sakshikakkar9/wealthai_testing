import React from "react";
import Badge from "../../../components/common/Badge";
import { formatINR } from "../../../utils/formatters";

interface Maturity {
  name: string;
  type: string;
  date: string;
  amount: number;
  days: number;
}

interface Props {
  data: Maturity[];
}

const MaturitiesTable: React.FC<Props> = ({ data }) => {
  const getRowClass = (days: number) => {
    if (days < 30) return "bg-red-50/50";
    if (days <= 90) return "bg-amber-50/50";
    return "hover:bg-slate-50 transition-colors";
  };

  const getBadgeVariant = (days: number) => {
    if (days < 30) return "danger";
    if (days <= 90) return "warning";
    return "success";
  };

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Instrument
            </th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
              Amount
            </th>
            <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, index) => (
            <tr key={index} className={getRowClass(item.days)}>
              <td className="px-5 py-4">
                <div className="text-sm font-bold text-slate-900">{item.name}</div>
                <div className="text-[10px] text-slate-400 font-medium">{item.date}</div>
              </td>
              <td className="px-5 py-4">
                <Badge
                  variant="neutral"
                  className="bg-slate-100 text-slate-600 border-none px-2 py-0"
                >
                  {item.type}
                </Badge>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="text-sm font-bold text-slate-800 tabular-nums">
                  {formatINR(item.amount)}
                </div>
              </td>
              <td className="px-5 py-4 text-right">
                <Badge variant={getBadgeVariant(item.days)} className="tabular-nums">
                  {item.days} days
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaturitiesTable;
