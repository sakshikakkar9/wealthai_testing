import React, { useMemo, useEffect, useState } from "react";
import {
  TrendingUp,
  Building2,
  Landmark,
  BarChart3,
  LucideIcon,
  Plus,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useDashboardStore } from "../../store/dashboard.store";
import { useIntegrationStore, IntegrationCategory } from "../../store/integration.store";

// Components
import HealthBanner from "./_components/HealthBanner";
import IntegrationFilterBar from "./_components/IntegrationFilterBar";
import IntegrationSection from "./_components/IntegrationSection";
import OnboardingChecklist from "./_components/OnboardingChecklist";
import IssuesStrip from "./_components/IssuesStrip";
import DeveloperPanel from "./_components/DeveloperPanel";
import ConnectModal from "./_components/ConnectModal";
import AccountDetailDrawer from "./_components/AccountDetailDrawer";
import SyncLogDrawer from "./_components/SyncLogDrawer";
import ReconcileDrawer from "./_components/ReconcileDrawer";
import SyncProgressOverlay from "./_components/SyncProgressOverlay";
import DisconnectModal from "./_components/DisconnectModal";
import ReAuthModal from "./_components/ReAuthModal";

const CATEGORIES: { id: IntegrationCategory; label: string; icon: LucideIcon; addLabel: string }[] =
  [
    { id: "broker", label: "Brokers", icon: TrendingUp, addLabel: "Add Broker" },
    {
      id: "mutual_fund",
      label: "Mutual Fund Registrars",
      icon: Building2,
      addLabel: "Add Registrar",
    },
    { id: "bank", label: "Banks", icon: Landmark, addLabel: "Add Bank" },
    { id: "market_data", label: "Market Data", icon: BarChart3, addLabel: "Add Data Source" },
  ];

const IntegrationsHub: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveNav } = useDashboardStore();
  const {
    activeTab,
    activeCategory,
    searchQuery,
    connectingId,
    detailId,
    showSyncLog,
    showReconcile,
    integrations,
    syncProgress,
    startSyncProgress,
    showDisconnectModal,
    showReAuthModal,
    addToast,
  } = useIntegrationStore();

  const [showOnboarding, setShowOnboarding] = useState(true);

  // Set active nav on mount
  useEffect(() => {
    setActiveNav("integrations");
  }, [setActiveNav]);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((i) => {
      const matchesCategory = activeCategory === "all" || i.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return (matchesCategory && matchesSearch) || i.status !== "disconnected";
    });
  }, [integrations, activeCategory, searchQuery]);

  const connectedCount = useMemo(
    () =>
      integrations.filter(
        (i) => i.status === "connected" || i.status === "syncing" || i.status === "warning",
      ).length,
    [integrations],
  );

  const issueCount = useMemo(
    () => integrations.filter((i) => i.status === "error" || i.status === "warning").length,
    [integrations],
  );

  const handleSyncAll = () => {
    startSyncProgress("all", "All Integrations");
    addToast({
      type: "info",
      message: "Starting global sync for all connected accounts...",
    });
  };

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {/* A — Hero Banner */}
          <div className="bg-white border-b border-slate-100 px-8 py-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Integrations</h1>
                <p className="text-slate-500 max-w-md">
                  Connect your financial life. Sync your brokers, banks, and funds to see your
                  complete net worth in real-time.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <button
                    onClick={() => navigate("/integrations/logs")}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <FileText size={18} />
                    View Logs
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSyncAll}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                >
                  <RefreshCw size={18} />
                  Sync All
                </button>
                <button
                  onClick={() => navigate("/integrations/add")}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Plus size={20} />
                  Add account
                </button>
              </div>
            </div>
          </div>

          {/* B — Coverage Banner */}
          <HealthBanner integrations={integrations} />

          {/* C — View Tabs + Filter Bar */}
          <IntegrationFilterBar integrations={integrations} />

          {/* D — Accounts view (default tab) */}
          {activeTab === "accounts" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Onboarding checklist if < 4 integrations connected */}
              {connectedCount < 4 && showOnboarding && (
                <OnboardingChecklist
                  integrations={integrations}
                  onDismiss={() => setShowOnboarding(false)}
                  onConnect={(id) => navigate(`/integrations/${id}`)}
                />
              )}

              {/* Issues strip — only if errors or warnings */}
              {issueCount > 0 && <IssuesStrip integrations={integrations} />}

              {/* Sections per category */}
              <div className="px-6 pb-24 mt-6 space-y-12">
                {CATEGORIES.map((cat) => (
                  <IntegrationSection
                    key={cat.id}
                    category={cat}
                    integrations={filteredIntegrations.filter((i) => i.category === cat.id)}
                  />
                ))}

                {filteredIntegrations.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                      <BarChart3 size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No integrations match</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Try adjusting your search or filters.
                    </p>
                    <button
                      onClick={() => useIntegrationStore.getState().setSearchQuery("")}
                      className="mt-4 text-sm font-bold text-indigo-600 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* E — Developer view (second tab) */}
          {activeTab === "developer" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <DeveloperPanel integrations={integrations} />
            </div>
          )}
        </main>
      </div>

      {/* Overlays */}
      {connectingId && <ConnectModal />}
      {detailId && <AccountDetailDrawer />}
      {showSyncLog && <SyncLogDrawer />}
      {showReconcile && <ReconcileDrawer />}
      {syncProgress && <SyncProgressOverlay />}
      {showDisconnectModal && <DisconnectModal />}
      {showReAuthModal && <ReAuthModal />}
    </div>
  );
};

export default IntegrationsHub;
