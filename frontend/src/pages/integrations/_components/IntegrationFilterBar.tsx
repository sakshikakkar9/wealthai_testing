import React from "react";
import { Search } from "lucide-react";
import {
  useIntegrationStore,
  IntegrationCategory,
  Integration,
} from "../../../store/integration.store";

interface FilterBarProps {
  integrations: Integration[];
}

const IntegrationFilterBar: React.FC<FilterBarProps> = ({ integrations }) => {
  const {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useIntegrationStore();

  const CATEGORIES: { id: IntegrationCategory | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "broker", label: "Brokers" },
    { id: "mutual_fund", label: "Mutual Funds" },
    { id: "bank", label: "Banks" },
    { id: "market_data", label: "Market Data" },
  ];

  const getCount = (catId: IntegrationCategory | "all") => {
    return integrations.filter((i) => {
      if (i.status === "coming_soon") return false;
      if (catId === "all") return true;
      return i.category === catId;
    }).length;
  };

  return (
    <div className="sticky top-[64px] z-20 bg-[#F2F0EF] border-b border-slate-200">
      <div className="px-6 flex items-center justify-between h-12">
        <div className="flex gap-8 h-full">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`text-sm font-bold h-full border-b-2 transition-all ${
              activeTab === "accounts"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Accounts
          </button>
          <button
            onClick={() => setActiveTab("developer")}
            className={`text-sm font-bold h-full border-b-2 transition-all ${
              activeTab === "developer"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Developer
          </button>
        </div>
      </div>

      {activeTab === "accounts" && (
        <div className="px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const count = getCount(cat.id);
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationFilterBar;
