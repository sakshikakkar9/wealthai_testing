import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, X, TrendingUp, Building2, Landmark, BarChart3, FileText } from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore, IntegrationCategory } from "../../store/integration.store";
import PlatformCard from "./_components/PlatformCard";
import ContextualNav from "./_components/ContextualNav";

const CATEGORY_TABS: {
  id: IntegrationCategory | "all";
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "all", label: "All", icon: BarChart3 },
  { id: "broker", label: "Brokers", icon: TrendingUp },
  { id: "mutual_fund", label: "Mutual Funds", icon: Building2 },
  { id: "bank", label: "Banks", icon: Landmark },
  { id: "market_data", label: "Market Data", icon: BarChart3 },
  { id: "file_import", label: "File Import", icon: FileText },
];

const POPULAR_CHIPS = ["Zerodha", "CAMS", "HDFC Bank", "AMFI", "Groww"];

const AddAccountGallery: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const {
    integrations,
    gallerySearch,
    setGallerySearch,
    galleryCategory,
    setGalleryCategory,
    galleryStatusFilter,
    setGalleryStatusFilter,
  } = useIntegrationStore();

  // Sync route param with store
  React.useEffect(() => {
    if (category) {
      setGalleryCategory(category as IntegrationCategory);
    }
  }, [category, setGalleryCategory]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleLearnMore = (integration: (typeof integrations)[0]) => {
    const isConnected =
      integration.status !== "disconnected" && integration.status !== "coming_soon";

    if (isConnected) {
      navigate(`/integrations/${integration.id}/detail`);
    } else {
      navigate(`/integrations/${integration.id}`);
    }
  };

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((i) => {
      const matchesCategory = galleryCategory === "all" || i.category === galleryCategory;
      const matchesSearch =
        !gallerySearch ||
        i.name.toLowerCase().includes(gallerySearch.toLowerCase()) ||
        i.tagline.toLowerCase().includes(gallerySearch.toLowerCase());

      const isConnected = i.status !== "disconnected" && i.status !== "coming_soon";
      const matchesStatus =
        galleryStatusFilter === "all" ||
        (galleryStatusFilter === "connected" && isConnected) ||
        (galleryStatusFilter === "available" && i.status === "disconnected") ||
        (galleryStatusFilter === "coming_soon" && i.status === "coming_soon");

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [integrations, galleryCategory, gallerySearch, galleryStatusFilter]);

  const groupedIntegrations = useMemo(() => {
    const groups: Record<string, typeof integrations> = {};
    filteredIntegrations.forEach((i) => {
      if (!groups[i.category]) groups[i.category] = [];
      groups[i.category].push(i);
    });
    return groups;
  }, [filteredIntegrations]);

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="bg-white border-b border-slate-100 px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <ContextualNav
                crumbs={[
                  { label: "Integrations", href: "/integrations" },
                  { label: "Connect an account" },
                ]}
              />

              <div className="mt-4">
                <h1 className="text-2xl font-black text-slate-900 mb-2">Connect an account</h1>
                <p className="text-slate-500 max-w-2xl">
                  Link your brokers, mutual fund registrars, banks, and market data providers to see
                  your complete financial picture.
                </p>
              </div>

              <div className="mt-8 relative max-w-2xl">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  placeholder="Search platforms — Zerodha, HDFC, AMFI..."
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
                {gallerySearch && (
                  <button
                    onClick={() => setGallerySearch("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Popular:
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setGallerySearch(chip)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="sticky top-0 z-10 bg-[#F2F0EF]/80 backdrop-blur-md px-8 py-4 border-b border-slate-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setGalleryCategory(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      galleryCategory === tab.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                {category && (
                  <button
                    onClick={() => navigate("/integrations/add")}
                    className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Clear category filter"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white/50 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
                {(
                  ["all", "connected", "available", "coming_soon"] as Array<
                    "all" | "connected" | "available" | "coming_soon"
                  >
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setGalleryStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      galleryStatusFilter === f
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {f.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 pb-24 max-w-6xl mx-auto">
            {Object.keys(groupedIntegrations).length > 0 ? (
              <div className="space-y-12">
                {CATEGORY_TABS.filter((t) => groupedIntegrations[t.id]).map((cat) => (
                  <div key={cat.id} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                          <cat.icon size={18} />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-slate-900">{cat.label}</h2>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        {groupedIntegrations[cat.id].length} platforms
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {groupedIntegrations[cat.id].map((integration) => (
                        <PlatformCard
                          key={integration.id}
                          integration={integration}
                          onConnect={() => navigate(`/integrations/${integration.id}`)}
                          onLearnMore={() => handleLearnMore(integration)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  No platforms match your search
                </h3>
                <p className="text-slate-500 mt-2 max-w-md">
                  We couldn't find any integrations matching "{gallerySearch}". Try different
                  keywords or browse by category.
                </p>
                <button
                  onClick={() => {
                    setGallerySearch("");
                    setGalleryCategory("all");
                    setGalleryStatusFilter("all");
                  }}
                  className="mt-8 bg-indigo-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddAccountGallery;
