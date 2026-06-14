import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Plus } from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useIntegrationStore } from "../../store/integration.store";
import { formatShortINR } from "../../utils/formatters";

const ConnectSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { integrations } = useIntegrationStore();

  const integration = integrations.find((i) => i.id === id);

  if (!integration) return null;

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 p-12 text-center animate-in zoom-in-95 duration-500">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-in zoom-in-50 duration-700 delay-300">
                <CheckCircle2 size={48} />
              </div>
            </div>

            <h1 className="text-4xl font-black text-slate-900 mb-4">
              {integration.name} connected!
            </h1>
            <p className="text-lg text-slate-500 mb-12">
              Your holdings are now syncing automatically. It may take a few minutes for all data to
              reflect in your dashboard.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="text-2xl font-black text-slate-900 mb-1">8</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Holdings
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="text-2xl font-black text-slate-900 mb-1">4,536</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Trades
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="text-2xl font-black text-slate-900 mb-1">
                  {formatShortINR(6840000)}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Portfolio
                </div>
              </div>
            </div>

            <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 mb-12 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <p className="text-sm font-bold text-indigo-700">
                Next sync in 4 hours during market hours
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate("/portfolio")}
                className="w-full sm:flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                View my portfolio
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/integrations/add")}
                className="w-full sm:flex-1 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add another account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConnectSuccessPage;
