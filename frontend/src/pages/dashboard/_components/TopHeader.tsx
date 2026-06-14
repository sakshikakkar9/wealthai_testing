import React from "react";
import { Search, Bell, TrendingUp, Menu } from "lucide-react";
import { useDashboardStore, DateRange } from "../../../store/dashboard.store";

const TopHeader: React.FC = () => {
  const { dateRange, setDateRange, setMobileMenuOpen, activeNav } = useDashboardStore();

  const getPageTitle = () => {
    switch (activeNav) {
      case "dashboard":
        return "Dashboard";
      case "portfolio":
        return "Portfolio";
      case "transactions":
        return "Transactions";
      case "equity":
        return "Equity";
      case "mutual-funds":
        return "Mutual Funds";
      case "deposits":
        return "Deposits";
      case "bonds":
        return "Bonds";
      case "fno":
        return "F&O";
      case "algo":
        return "Algo Trading";
      case "integrations":
        return "Integrations";
      default:
        return "WealthOS";
    }
  };

  const ranges: DateRange[] = ["1M", "3M", "1Y", "All"];

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger (Mobile) + Title & Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-base md:text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium whitespace-nowrap">
              Friday, 29 May 2026
            </p>
          </div>
        </div>

        {/* Center: Live Ticker */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              NIFTY 50
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-700">24,832.45</span>
              <div className="flex items-center text-emerald-500 font-bold text-xs">
                <TrendingUp size={12} />
                <span>+0.42%</span>
              </div>
            </div>
          </div>
          <div className="w-px h-4 bg-slate-100" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              SENSEX
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-700">81,245.12</span>
              <div className="flex items-center text-emerald-500 font-bold text-xs">
                <TrendingUp size={12} />
                <span>+0.38%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors hidden sm:block"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <div className="relative">
            <button
              className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-200">
            RK
          </div>
        </div>
      </div>

      {/* Row 2: Date Range Tabs */}
      <div className="mt-3 md:mt-4 flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto no-scrollbar">
        {ranges.map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`
              px-4 py-1.5 text-xs font-semibold rounded-lg transition-all
              ${
                dateRange === range
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }
            `}
          >
            {range}
          </button>
        ))}
      </div>
    </header>
  );
};

export default TopHeader;
