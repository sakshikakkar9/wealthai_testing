import React, { useEffect, useState } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Shield,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { formatINR, formatShortINR, formatPercent } from "../../../utils/formatters";
import { useEquityStore } from "../../../store/equity.store";
import Badge from "../../../components/common/Badge";
import HoldingSparkline from "../../../components/charts/HoldingSparkline";
import { EquityHolding } from "../index";

interface Props {
  holding: EquityHolding | null;
}

const StockDetailSlideout: React.FC<Props> = ({ holding }) => {
  const { setActiveStock } = useEquityStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (holding) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [holding]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setActiveStock(null), 300);
  };

  if (!holding) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />

      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl transition-transform duration-300 transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-base">
              {holding.ticker?.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{holding.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {holding.ticker}
                </span>
                <Badge variant="indigo" className="h-4">
                  {holding.sector}
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Price & Change Section */}
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Current Price
              </div>
              <div className="text-3xl font-bold text-slate-900 tabular-nums">
                {formatINR(holding.currentPrice)}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center justify-end gap-1 text-lg font-bold ${holding.dayChangePct >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {holding.dayChangePct >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {formatPercent(holding.dayChangePct)}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Today: {holding.dayChange >= 0 ? "+" : ""}
                {formatINR(holding.dayChange)}
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase">Price History (7D)</span>
              <span className="text-xs font-bold text-emerald-600">Bullish Momentum</span>
            </div>
            <div className="h-24">
              <HoldingSparkline data={holding.sparkline} positive={holding.gainPct >= 0} />
            </div>
          </div>

          {/* KPI Chips Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Total Value
              </span>
              <span className="text-xl font-bold text-slate-900">
                {formatShortINR(holding.currentValue)}
              </span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Gain / Loss
              </span>
              <span
                className={`text-xl font-bold ${holding.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {holding.gainLoss >= 0 ? "+" : ""}
                {formatShortINR(holding.gainLoss)}
              </span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Average Cost
              </span>
              <span className="text-xl font-bold text-slate-900">{formatINR(holding.avgCost)}</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                XIRR
              </span>
              <span className="text-xl font-bold text-indigo-600">{holding.xirr.toFixed(1)}%</span>
            </div>
          </div>

          {/* Fundamentals Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Fundamentals
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "PE Ratio", value: `${holding.pe}x` },
                { label: "P/BV", value: `${holding.pbv}x` },
                { label: "EPS", value: `₹${holding.eps}` },
                { label: "ROE", value: `${holding.roe}%` },
                { label: "Beta", value: holding.beta.toFixed(2) },
                { label: "Dividend", value: `${holding.dividendYield}%` },
              ].map((chip) => (
                <div key={chip.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">{chip.label}</div>
                  <div className="text-sm font-semibold text-slate-800">{chip.value}</div>
                </div>
              ))}
              <div className="bg-slate-50 rounded-xl p-3 text-center col-span-3 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold">Market Cap</span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{(holding.marketCap / 100000).toFixed(1)}L Cr (
                  {holding.marketCapCategory.toUpperCase()})
                </span>
              </div>
            </div>
          </div>

          {/* Technical Signals */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Technical Indicators
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${holding.aboveMA200 ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <span className="text-sm font-medium text-slate-700">
                  {holding.aboveMA200 ? "Bullish" : "Bearish"} · Above 200-day Moving Average
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${holding.aboveMA50 ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <span className="text-sm font-medium text-slate-700">
                  {holding.aboveMA50 ? "Strong" : "Weak"} · Above 50-day Moving Average
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={holding.rsi14 > 70 ? "amber" : holding.rsi14 < 30 ? "emerald" : "indigo"}
                  className="text-[10px]"
                >
                  RSI {holding.rsi14}
                </Badge>
                <span className="text-sm font-medium text-slate-700">
                  {holding.rsi14 > 70 ? "Overbought" : holding.rsi14 < 30 ? "Oversold" : "Neutral"}{" "}
                  momentum
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    holding.week52Position > 80
                      ? "emerald"
                      : holding.week52Position < 20
                        ? "red"
                        : "indigo"
                  }
                  className="text-[10px]"
                >
                  52W Pos: {holding.week52Position}%
                </Badge>
                <span className="text-sm font-medium text-slate-700">
                  Sitting at {holding.week52Position}% of its annual range
                </span>
              </div>
            </div>
          </div>

          {/* Tax Position */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 space-y-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-amber-600" />
              <h4 className="text-sm font-bold text-amber-900">Tax Position</h4>
            </div>
            <div className="flex justify-between text-xs text-amber-800">
              <span>
                Holding Period: <span className="font-bold">{holding.holdingDays} days</span>
              </span>
              <span className="font-bold uppercase">
                {holding.isLTCG ? "LTCG Eligible" : "STCG (Short Term)"}
              </span>
            </div>
            <div className="flex justify-between text-xs text-amber-800">
              <span>Unrealised Gain:</span>
              <span className="font-bold">{formatINR(holding.unrealizedGain)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-amber-900 border-t border-amber-200 pt-2">
              <span>Estimated Tax Liability:</span>
              <span>{formatINR(holding.unrealizedTax)}</span>
            </div>
            {holding.taxHarvestOpportunity && (
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 p-2 rounded-lg text-[10px] font-bold">
                <Zap size={12} />
                TAX HARVESTING OPPORTUNITY: Book loss to save {formatINR(holding.taxSaving)}
              </div>
            )}
          </div>

          {/* Corporate Events */}
          {holding.upcomingActions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {holding.upcomingActions.map((action, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 capitalize">
                        {action.type}
                      </div>
                      <div className="text-xs text-slate-500 mb-1">{action.date}</div>
                      <div className="text-[10px] font-medium text-indigo-600">{action.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 pt-4 pb-10">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Buy More
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              Sell Position
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
              View All Transactions <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StockDetailSlideout);
