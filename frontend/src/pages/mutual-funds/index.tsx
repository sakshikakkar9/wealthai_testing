import React, { useMemo, useEffect } from "react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import MFCommandBanner from "./_components/MFCommandBanner";
import {
  useMFStore,
  MFTab,
  MFCategory,
  MFPlanType,
  MFOption,
  SIPStatus,
} from "../../store/mutualfund.store";
import { useDashboardStore } from "../../store/dashboard.store";

// Lazy load tabs
import OverviewTab from "./_tabs/OverviewTab";
import HoldingsTab from "./_tabs/HoldingsTab";
import SIPManagerTab from "./_tabs/SIPManagerTab";
import AnalyticsTab from "./_tabs/AnalyticsTab";
import TransactionsTab from "./_tabs/TransactionsTab";
import TaxReportsTab from "./_tabs/TaxReportsTab";

// Modals & Slideouts
import FundDetailSlideout from "./_components/FundDetailSlideout";
import AddFundModal from "./_components/AddFundModal";
import SIPModifyModal from "./_components/SIPModifyModal";


const MFTabBar = () => {
  const { activeTab, setActiveTab, totalItems, holdings } = useMFStore();
  const sipCount = holdings.filter((h) => (h.active_sip_count ?? 0) > 0).length;

  const tabs: { id: MFTab; label: string; badge?: string; badgeColor?: string }[] = [
    { id: "overview", label: "Overview" },
    {
      id: "holdings",
      label: "Holdings",
      badge: totalItems > 0 ? totalItems.toString() : undefined,
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "sip",
      label: "SIP Manager",
      badge: sipCount > 0 ? sipCount.toString() : undefined,
      badgeColor: "bg-indigo-100 text-indigo-700",
    },
    { id: "analytics", label: "Analytics" },
    { id: "transactions", label: "Transactions" },
    { id: "tax", label: "Tax & Reports" },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-6 sticky top-0 z-20">
      <div className="flex items-end gap-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-1.5 text-sm px-4 py-4 cursor-pointer transition-colors duration-150 relative
              ${activeTab === tab.id ? "text-emerald-700 font-bold" : "text-slate-500 hover:text-slate-700"}
            `}
          >
            {tab.label}
            {tab.badge && (
              <span
                className={`rounded-full text-[10px] px-1.5 py-0.5 font-bold ${tab.badgeColor}`}
              >
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MutualFundsPage = () => {
  const {
    activeTab,
    activeFundId,
    showAddFundModal,
    showSIPModifyModal,
    holdings,
    summary,
    loadData,
    isLoading,
  } = useMFStore();
  const { setActiveNav } = useDashboardStore();

  const loadDataRef = React.useRef(loadData);
  loadDataRef.current = loadData;

  useEffect(() => {
    setActiveNav("mutual-funds");
    loadDataRef.current();
  }, [setActiveNav]);


  const fallbackSummary = useMemo(
    () => ({
      totalFunds: 0,
      activeSIPs: 0,
      pausedSIPs: 0,
      totalInvested: 0,
      totalCurrentValue: 0,
      totalGainLoss: 0,
      totalGainPct: 0,
      xirr: 0,
      monthlySIPAmount: 0,
      nextSIPDate: "N/A",
      nextSIPAmount: 0,
      dividendYTD: 0,
      regularPlanFunds: 0,
      regularPlanAnnualCommission: 0,
      weightedAvgExpenseRatio: 0,
      annualExpenseCostINR: 0,
      hasELSS: false,
      todayChange: 0,
      todayChangePct: 0,
    }),
    [],
  );

  const displaySummary = summary || fallbackSummary;

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          {/* Shell Components */}
          <MFCommandBanner summary={displaySummary} />
          <MFTabBar />

          {/* Tab Content */}
          <div className="p-0">
            {isLoading && !holdings.length ? (
              <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <OverviewTab funds={holdings} summary={displaySummary} />
                )}
                {activeTab === "holdings" && <HoldingsTab funds={holdings} />}
                {activeTab === "sip" && <SIPManagerTab funds={holdings} />}
                {activeTab === "analytics" && <AnalyticsTab funds={holdings} />}
                {activeTab === "transactions" && <TransactionsTab />}
                {activeTab === "tax" && <TaxReportsTab funds={holdings} />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals & Detail Panels */}
      {activeFundId && (
        <FundDetailSlideout fund={holdings.find((f) => f.id === activeFundId) || null} />
      )}
      {showAddFundModal && <AddFundModal />}
      {showSIPModifyModal && <SIPModifyModal />}
    </div>
  );
};

export default MutualFundsPage;
