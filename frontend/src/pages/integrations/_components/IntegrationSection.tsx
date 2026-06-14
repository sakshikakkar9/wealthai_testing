import React from "react";
import { useNavigate } from "react-router-dom";
import { LucideIcon, Plus } from "lucide-react";
import {
  Integration,
  IntegrationCategory,
  useIntegrationStore,
} from "../../../store/integration.store";
import ConnectCard from "./ConnectCard";

interface CategoryMeta {
  id: IntegrationCategory;
  label: string;
  icon: LucideIcon;
  addLabel: string;
}

interface IntegrationSectionProps {
  category: CategoryMeta;
  integrations: Integration[];
}

const IntegrationSection: React.FC<IntegrationSectionProps> = ({ category, integrations }) => {
  const navigate = useNavigate();
  const { openConnect, openDetail, triggerSync, syncingIds } = useIntegrationStore();

  if (integrations.length === 0) return null;

  const connectedCount = integrations.filter(
    (i) => i.status === "connected" || i.status === "syncing" || i.status === "warning",
  ).length;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const handleOpenDetail = (id: string) => {
    if (isMobile) navigate(`/integrations/${id}/detail`);
    else openDetail(id);
  };

  const handleOpenConnect = (id: string) => {
    if (isMobile) navigate(`/integrations/${id}/connect`);
    else openConnect(id);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
            <category.icon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{category.label}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {integrations.length} available · {connectedCount} connected
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/integrations/add/${category.id}`)}
          className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          {category.addLabel}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map((i) => (
          <ConnectCard
            key={i.id}
            integration={i}
            isSyncing={syncingIds.has(i.id)}
            onConnect={() => handleOpenConnect(i.id)}
            onOpenDetail={() => handleOpenDetail(i.id)}
            onSync={() => triggerSync(i.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default IntegrationSection;
