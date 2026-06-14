import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  BarChart3,
  Landmark,
  FileText,
  Zap,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp as TrendUpIcon,
  X,
  ArrowLeftRight,
  Plug,
} from "lucide-react";
import { useDashboardStore } from "../../../store/dashboard.store";
import { useIntegrationStore, Integration } from "../../../store/integration.store";
import Badge from "../../../components/common/Badge";

// Dummy Data to calculate issues count for sidebar badge
const INTEGRATIONS: Integration[] = [
  { id: "amfi", status: "connected" },
  { id: "cams", status: "connected" },
  { id: "kfintech", status: "warning" },
  { id: "zerodha", status: "connected" },
  { id: "groww", status: "connected" },
  { id: "upstox", status: "error" },
  { id: "fyers", status: "disconnected" },
  { id: "angel_one", status: "coming_soon" },
  { id: "hdfc_sec", status: "coming_soon" },
  { id: "hdfc_bank", status: "connected" },
  { id: "icici_bank", status: "connected" },
  { id: "axis_bank", status: "warning" },
  { id: "kotak_bank", status: "disconnected" },
  { id: "nse", status: "connected" },
  { id: "bse", status: "connected" },
  { id: "alpha_vantage", status: "connected" },
  { id: "refinitiv", status: "coming_soon" },
] as Integration[];

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, setActiveNav, isMobileMenuOpen, setMobileMenuOpen } =
    useDashboardStore();
  const location = useLocation();

  // Badge logic for integrations
  const integrationErrors = INTEGRATIONS.filter((i) => i.status === "error").length;
  const integrationWarnings = INTEGRATIONS.filter((i) => i.status === "warning").length;

  const getIntegrationBadge = () => {
    if (integrationErrors > 0) {
      return {
        text: `${integrationErrors} ${integrationErrors === 1 ? "Error" : "Errors"}`,
        variant: "danger" as const,
      };
    }
    if (integrationWarnings > 0) {
      return {
        text: `${integrationWarnings} ${integrationWarnings === 1 ? "Warn" : "Warns"}`,
        variant: "warning" as const,
      };
    }
    return null;
  };

  const integrationBadge = getIntegrationBadge();

  const navItems = [
    { label: "Dashboard", id: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Portfolio", id: "portfolio", icon: PieChart, href: "/portfolio" },
    { label: "Transactions", id: "transactions", icon: ArrowLeftRight, href: "/transactions" },
    { label: "Bonds", id: "bonds", icon: Landmark, href: "/bonds" },
    { label: "Equity", id: "equity", icon: TrendingUp, href: "/equity", badge: "42 stocks" },
    {
      label: "Mutual Funds",
      id: "mutual-funds",
      icon: BarChart3,
      href: "/mutual-funds",
      badge: "18 funds",
    },
    { label: "Deposits", id: "deposits", icon: Landmark, href: "/deposits", badge: "5 FDs" },
    {
      label: "F&O",
      id: "fno",
      icon: Zap,
      href: "/fno",
      badge: "Beta",
      badgeVariant: "warning" as const,
    },
    {
      label: "Algo Trading",
      id: "algo",
      icon: Bot,
      href: "/algo",
      badge: "New",
      badgeVariant: "info" as const,
    },
    {
      label: "Integrations",
      id: "integrations",
      href: "/integrations",
      icon: Plug,
      badge: integrationBadge?.text,
      badgeVariant: integrationBadge?.variant,
    },
    // { label: "Bonds", id: "bonds", icon: Landmark, href: "/bonds" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:flex lg:flex-col
        ${sidebarCollapsed ? "lg:w-16" : "lg:w-60"}
        ${isMobileMenuOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        bg-white border-r border-slate-100 h-screen lg:sticky lg:top-0 transition-all duration-300 ease-in-out flex flex-col
      `}
      >
        {/* Logo Area */}
        <div className="p-4 flex items-center justify-between h-16 border-b border-slate-50">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 leading-tight">WealthOS</span>
                <span className="text-[10px] text-indigo-600 font-semibold tracking-wider uppercase">
                  Premium
                </span>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold lg:mx-auto">
              W
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }
              `}
              >
                <item.icon
                  size={20}
                  className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
                />

                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant || "neutral"}
                        className="px-1.5 py-0 scale-90"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}

                {sidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile */}
        <div className="p-3 border-t border-slate-100">
          <div className={`flex flex-col gap-1 ${sidebarCollapsed ? "items-center" : ""}`}>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-all group relative`}
            >
              <Settings size={20} className="text-slate-400 group-hover:text-slate-600" />
              {!sidebarCollapsed && <span className="text-sm">Settings</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  Settings
                </div>
              )}
            </Link>

            <div
              className={`mt-2 p-2 rounded-2xl ${sidebarCollapsed ? "" : "bg-slate-50 border border-slate-100"}`}
            >
              <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                  RK
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">Rahul Kumar</p>
                    <p className="text-[10px] text-slate-500 font-medium">Premium Plan</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-600">XIRR: 18.4%</span>
                      <TrendUpIcon size={8} className="text-emerald-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
