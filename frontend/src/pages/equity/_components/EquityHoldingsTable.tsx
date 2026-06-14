import React from "react";
import { TrendingUp, TrendingDown, MoreHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { formatINR, formatShortINR, formatNumber } from "../../../utils/formatters";
import { useEquityStore, SortField } from "../../../store/equity.store";
import Badge from "../../../components/common/Badge";
import GoalTag from "../../../components/common/GoalTag";
import { useGoals } from "../../../hooks/useGoals";
import HoldingSparkline from "../../../components/charts/HoldingSparkline";
import { EquityHolding } from "../index";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface Props {
  holdings: EquityHolding[];
}

const EquityHoldingsTable: React.FC<Props> = ({ holdings }) => {
  const {
    sortField,
    sortDir,
    setSort,
    selectedRows,
    toggleRow,
    selectAll,
    clearSelection,
    setActiveStock,
    showFundamentals,
    groupBy,
  } = useEquityStore();

  const { getTags } = useGoals();

  const isAllSelected = holdings.length > 0 && selectedRows.size === holdings.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll(holdings.map((h) => h.id));
    }
  };

  const getXIRRColor = (xirr: number) => {
    if (xirr > 15) return "text-emerald-600";
    if (xirr > 8) return "text-amber-600";
    return "text-red-600";
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const groupedHoldings = React.useMemo(() => {
    if (groupBy === "none") return [{ group: null, items: holdings }];

    const groups: Record<string, EquityHolding[]> = {};
    holdings.forEach((h) => {
      let key = "Other";
      if (groupBy === "sector") key = h.sector;
      else if (groupBy === "market_cap")
        key = h.marketCapCategory.charAt(0).toUpperCase() + h.marketCapCategory.slice(1) + " Cap";
      else if (groupBy === "gain_loss") key = h.gainLoss >= 0 ? "Gainers" : "Losers";

      if (!groups[key]) groups[key] = [];
      groups[key].push(h);
    });

    return Object.entries(groups).map(([group, items]) => ({ group, items }));
  }, [holdings, groupBy]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-4 w-10 sticky top-0 bg-slate-50/50 z-10 text-center">
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
                  Name / Ticker {renderSortIcon("name")}
                </div>
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Account
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Period
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

              {showFundamentals && (
                <>
                  <th
                    className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right"
                    onClick={() => setSort("pe")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      PE {renderSortIcon("pe")}
                    </div>
                  </th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Div Yield
                  </th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Beta
                  </th>
                  <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    MA Signal
                  </th>
                  <th
                    className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center"
                    onClick={() => setSort("position_52w")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      52W Position {renderSortIcon("position_52w")}
                    </div>
                  </th>
                </>
              )}

              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("current_value")}
              >
                <div className="flex items-center justify-end gap-1">
                  Value {renderSortIcon("current_value")}
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
                  P&L% {renderSortIcon("gain_pct")}
                </div>
              </th>
              <th
                className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => setSort("xirr")}
              >
                <div className="flex items-center justify-end gap-1">
                  XIRR {renderSortIcon("xirr")}
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
                  Wt% {renderSortIcon("weight")}
                </div>
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Spark
              </th>
              <th className="px-4 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={showFundamentals ? 20 : 16} className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <TrendingUp size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No stocks match your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              groupedHoldings.map(({ group, items }) => (
                <React.Fragment key={group || "all"}>
                  {group && (
                    <tr className="bg-slate-50 border-y border-slate-100 px-4 py-2">
                      <td
                        colSpan={showFundamentals ? 20 : 16}
                        className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                      >
                        {group} · {items.length} stocks ·{" "}
                        {formatShortINR(items.reduce((s, i) => s + i.currentValue, 0))} ·{" "}
                        {(
                          (items.reduce((s, i) => s + i.gainLoss, 0) /
                            items.reduce((s, i) => s + i.invested, 0)) *
                          100
                        ).toFixed(1)}
                        % avg gain
                      </td>
                    </tr>
                  )}
                  {items.map((h) => (
                    <tr
                      key={h.id}
                      className={`border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${selectedRows.has(h.id) ? "bg-indigo-50/50" : ""}`}
                      onClick={() => setActiveStock(h.id)}
                    >
                      <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          checked={selectedRows.has(h.id)}
                          onChange={() => toggleRow(h.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                            {h.ticker?.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{h.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase">
                              {h.ticker}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                          {h.account.slice(0, 2)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {h.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-medium uppercase whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                          {getTags(h.ticker || h.name).map((goal) => (
                            <GoalTag key={goal} goal={goal} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {h.holdingDays >= 365 ? (
                                <Badge variant="emerald" className="text-[9px] whitespace-nowrap">
                                  🟢 LTCG
                                </Badge>
                              ) : h.holdingDays >= 335 ? (
                                <Badge variant="amber" className="text-[9px] whitespace-nowrap">
                                  🟡 LTCG in {365 - h.holdingDays}d
                                </Badge>
                              ) : (
                                <Badge variant="red" className="text-[9px] whitespace-nowrap">
                                  🔴 STCG
                                </Badge>
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {h.holdingDays >= 365
                                  ? "Long-term capital gain (12.5% tax)"
                                  : `Short-term capital gain (20% tax). Becomes LTCG in ${365 - h.holdingDays} days.`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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

                      {showFundamentals && (
                        <>
                          <td
                            className={`px-4 py-4 text-right tabular-nums text-sm font-medium ${h.pe > 35 ? "text-amber-600" : h.pe < 15 ? "text-emerald-600" : "text-slate-700"}`}
                          >
                            {h.pe.toFixed(1)}x
                          </td>
                          <td className="px-4 py-4 text-right tabular-nums text-sm font-medium text-emerald-600">
                            {h.dividendYield}%
                          </td>
                          <td
                            className={`px-4 py-4 text-right tabular-nums text-sm font-medium ${h.beta > 1.2 ? "text-amber-600" : h.beta < 0.8 ? "text-emerald-600" : "text-slate-700"}`}
                          >
                            {h.beta.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {h.aboveMA200 && h.aboveMA50 ? (
                              <Badge variant="emerald" className="text-[9px]">
                                ▲ Bullish
                              </Badge>
                            ) : h.aboveMA200 && !h.aboveMA50 ? (
                              <Badge variant="amber" className="text-[9px]">
                                ▲ Caution
                              </Badge>
                            ) : (
                              <Badge variant="red" className="text-[9px]">
                                ▼ Bearish
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                                <div
                                  className={`absolute left-0 top-0 h-full rounded-full ${h.week52Position > 80 ? "bg-emerald-500" : h.week52Position < 20 ? "bg-red-500" : "bg-indigo-600"}`}
                                  style={{ width: `${h.week52Position}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-bold text-slate-400">
                                {h.week52Position}% of range
                              </span>
                            </div>
                          </td>
                        </>
                      )}

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
                        <Badge
                          variant={h.gainPct >= 0 ? "emerald" : "red"}
                          className="tabular-nums"
                        >
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
                      <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
          {holdings.length > 0 && (
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 text-sm text-slate-900" colSpan={showFundamentals ? 7 : 6}>
                  TOTAL
                </td>
                {showFundamentals && <td className="px-4 py-4" colSpan={4}></td>}
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
                    +37.4%
                  </Badge>
                </td>
                <td className="px-4 py-4 text-right text-sm text-emerald-600 tabular-nums">
                  21.4%
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

export default React.memo(EquityHoldingsTable);
