import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { formatINR, formatPercent } from "../../utils/formatters";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface TradeSuggestion {
  action: "BUY" | "SELL";
  symbol: string;
  amount: number;
  reason: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suggestions: TradeSuggestion[];
}

const RebalancingDrawer: React.FC<Props> = ({ isOpen, onClose, suggestions }) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-2xl mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold text-slate-900">
            Rebalancing Suggestions
          </DrawerTitle>
          <DrawerDescription>
            Recommended trades to bring your portfolio back to its target sector allocation.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-medium">No rebalancing needed at this time.</p>
            </div>
          ) : (
            suggestions.map((trade, idx) => (
              <div
                key={`${trade.symbol}-${idx}`}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      trade.action === "BUY"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {trade.action}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{trade.symbol}</div>
                    <div className="text-xs text-slate-500">{trade.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatINR(trade.amount)}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Approx. Value
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DrawerFooter className="border-t border-slate-100 mt-4">
          <div className="flex gap-3">
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl">
              Execute All Trades
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 font-bold h-12 rounded-xl">
                Close
              </Button>
            </DrawerClose>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            *Execution of trades depends on market liquidity and current price.
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RebalancingDrawer;
