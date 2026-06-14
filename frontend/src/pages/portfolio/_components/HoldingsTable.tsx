import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { formatINR, formatShortINR, formatNumber } from "../../../utils/formatters";
import { AssetClass, usePortfolioStore } from "../../../store/portfolio.store";
import Badge from "../../../components/common/Badge";
import HoldingSparkline from "../../../components/charts/HoldingSparkline";

interface Holding {
  id: string;
  name: string;
  ticker?: string;
  assetClass: AssetClass;
  account: string;
  tags: string[];
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  invested: number;
  gainLoss: number;
  gainPct: number;
  xirr: number;
  dayChange: number;
  dayChangePct: number;
  weight: number;
  sparkline: number[];
  sector?: string;
  maturityDate?: string;
  couponRate?: number;
}

interface Props {
  holdings: Holding[];
}

const ASSET_CONFIG = {
  equity: { iconColor: "bg-indigo-500", label: "Equity" },
  mutual_fund: { iconColor: "bg-emerald-500", label: "MF" },
  fd: { iconColor: "bg-amber-500", label: "FD" },
  bond: { iconColor: "bg-blue-500", label: "Bond" },
  gold: { iconColor: "bg-yellow-500", label: "Gold" },
  real_estate: { iconColor: "bg-purple-500", label: "RE" },
  cash: { iconColor: "bg-slate-500", label: "Cash" },
  all: { iconColor: "bg-slate-500", label: "All" },
};

const HoldingsTable: React.FC<Props> = ({ holdings }) => {
  const { sortField, sortDir, setSort, selectedRows, toggleRow, selectAll, setActiveHolding } =
    usePortfolioStore();

  const isAllSelected = holdings.length > 0 && selectedRows.size === holdings.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      usePortfolioStore.getState().clearSelection();
    } else {
      selectAll(holdings.map((h) => h.id));
    }
  };

  const getXIRRColor = (xirr: number) => {
    if (xirr > 15) return "text-emerald-600";
    if (xirr > 8) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-4 w-10 sticky top-0 bg-slate-50/50 z-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name / Ticker{" "}
                  {sortField === "name" &&
                    (sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Account
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Qty
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Avg Cost
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                CMP
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("current_value")}
              >
                <div className="flex items-center justify-end gap-1">
                  Value{" "}
                  {sortField === "current_value" &&
                    (sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                P&L
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("gain_pct")}
              >
                <div className="flex items-center justify-end gap-1">
                  P&L%{" "}
                  {sortField === "gain_pct" &&
                    (sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("xirr")}
              >
                <div className="flex items-center justify-end gap-1">
                  XIRR{" "}
                  {sortField === "xirr" &&
                    (sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Day
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("weight")}
              >
                <div className="flex items-center justify-end gap-1">
                  Wt%{" "}
                  {sortField === "weight" &&
                    (sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Spark
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={16} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <TrendingUp size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No holdings match your filters</p>
                    <button
                      onClick={() => usePortfolioStore.getState().setActiveAssetClass("all")}
                      className="text-sm text-indigo-600 font-semibold hover:underline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              holdings.map((h) => (
                <tr
                  key={h.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedRows.has(h.id) ? "bg-indigo-50/50" : ""}`}
                  onClick={() => setActiveHolding(h.id)}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      checked={selectedRows.has(h.id)}
                      onChange={() => toggleRow(h.id)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${ASSET_CONFIG[h.assetClass].iconColor}`}
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{h.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase">
                          {h.ticker}
                        </div>
                        {(h.assetClass === "fd" || h.assetClass === "bond") && h.maturityDate && (
                          <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                            Mat: {h.maturityDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        h.assetClass === "equity"
                          ? "indigo"
                          : h.assetClass === "mutual_fund"
                            ? "emerald"
                            : "amber"
                      }
                    >
                      {ASSET_CONFIG[h.assetClass].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                      {h.account.slice(0, 2)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {h.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-medium uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                      {h.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[9px] font-medium">
                          +{h.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-slate-700 tabular-nums text-sm">
                    {formatNumber(h.quantity)}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-500 tabular-nums text-sm">
                    {formatINR(h.avgCost)}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-500 tabular-nums text-sm">
                    {formatINR(h.currentPrice)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-900 tabular-nums text-sm">
                    {formatShortINR(h.currentValue)}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    <div
                      className={`flex items-center justify-end gap-1 text-sm font-semibold ${h.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {h.gainLoss >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {formatShortINR(Math.abs(h.gainLoss))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Badge variant={h.gainPct >= 0 ? "emerald" : "red"} className="tabular-nums">
                      {h.gainPct >= 0 ? "+" : ""}
                      {h.gainPct.toFixed(1)}%
                    </Badge>
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-bold tabular-nums text-sm ${getXIRRColor(h.xirr)}`}
                  >
                    {h.xirr.toFixed(1)}%
                  </td>
                  <td
                    className={`px-4 py-4 text-right tabular-nums text-xs font-medium ${h.dayChangePct >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {h.dayChangePct >= 0 ? "+" : ""}
                    {h.dayChangePct.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="relative w-full h-4 bg-indigo-50 rounded overflow-hidden flex items-center justify-end px-1">
                      <div
                        className="absolute left-0 top-0 h-full bg-indigo-100"
                        style={{ width: `${h.weight * 5}%` }}
                      />
                      <span className="relative text-[10px] font-bold text-indigo-700">
                        {h.weight.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <HoldingSparkline data={h.sparkline} positive={h.gainPct >= 0} />
                  </td>
                  <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {holdings.length > 0 && (
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 text-sm text-slate-900" colSpan={7}>
                  TOTAL
                </td>
                <td className="px-4 py-4 text-right text-sm text-slate-900 tabular-nums">
                  {formatShortINR(holdings.reduce((sum, h) => sum + h.currentValue, 0))}
                </td>
                <td className="px-4 py-4 text-right tabular-nums">
                  <div className="flex items-center justify-end gap-1 text-sm text-emerald-600">
                    <TrendingUp size={12} />
                    {formatShortINR(holdings.reduce((sum, h) => sum + h.gainLoss, 0))}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <Badge variant="emerald" className="tabular-nums">
                    +32.5%
                  </Badge>
                </td>
                <td className="px-4 py-4 text-right text-sm text-emerald-600 tabular-nums">
                  18.4%
                </td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 text-right text-sm text-indigo-700 tabular-nums">100%</td>
                <td className="px-4 py-4" colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default React.memo(HoldingsTable);
