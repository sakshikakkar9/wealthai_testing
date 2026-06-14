import React, { useEffect, useMemo } from "react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useDashboardStore } from "../../store/dashboard.store";
import { useBondStore } from "../../store/bond.store";

// Components
import BondPageHeader from "./_components/BondPageHeader";
import SummaryCards from "./_components/SummaryCards";
import BondFilters from "./_components/BondFilters";
import BondTable from "./_components/BondTable";
import BondDetailDrawer from "./_components/BondDetailDrawer";
import AddBondModal from "./_components/AddBondModal";
import { SummaryCardSkeleton, TableSkeleton } from "./_components/BondSkeletons";
import { Landmark, Plus } from "lucide-react";
import { getMaturityBucket } from "../../utils/bondUtils";

const BondsPage: React.FC = () => {
  const { setActiveNav } = useDashboardStore();
  const {
    bonds,
    loadBonds,
    selectedBondId,
    showAddModal,
    setActiveView,
    isLoading,
    openAddModal,
    searchQuery,
    filters,
  } = useBondStore();

  useEffect(() => {
    setActiveNav("bonds");
    loadBonds();

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActiveView("cards");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setActiveNav, setActiveView, loadBonds]);

  // Combined Filtering Pipeline
  const filteredBonds = useMemo(() => {
    let result = [...bonds];

    // 1. Text Search Filter (Case-Insensitive)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          (b.bond_name || '').toLowerCase().includes(q) ||
          (b.isin || '').toLowerCase().includes(q) ||
          (b.issuer || '').toLowerCase().includes(q)
      );
    }

    // 2. Bond Type Filter (Handles frontend labels vs raw backend keys seamlessly)
    if (filters.bondType && filters.bondType !== "All") {
      const targetType = filters.bondType.toLowerCase();
      result = result.filter((b) => {
        const currentType = (b.bond_type || '').toLowerCase();
        
        if (targetType === 'govt' || targetType === 'government' || targetType === 'gsec') {
          return currentType === 'govt' || currentType === 'government' || currentType === 'gsec';
        }
        if (targetType === 't-bill' || targetType === 't_bill') {
          return currentType === 't-bill' || currentType === 't_bill';
        }
        if (targetType === 'tax free' || targetType === 'tax_free') {
          return currentType === 'tax free' || currentType === 'tax_free';
        }
        return currentType === targetType;
      });
    }
    
    // 3. Status Filter (Case-Insensitive)
    if (filters.status && filters.status !== "All") {
      result = result.filter(
        (b) => (b.status || '').toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // 4. Credit Rating Filter (Case-Insensitive)
    if (filters.rating && filters.rating !== "All") {
      result = result.filter(
        (b) => (b.rating || '').toLowerCase() === filters.rating.toLowerCase()
      );
    }
    
    // 5. Days to Maturity Bucket Filter
    if (filters.maturityBucket && filters.maturityBucket !== "All") {
      result = result.filter(
        (b) => getMaturityBucket(b.days_to_maturity) === filters.maturityBucket
      );
    }

    return result;
  }, [bonds, searchQuery, filters]);

  // Empty Fallback State View
  if (!isLoading && bonds.length === 0) {
    return (
      <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 max-w-lg w-full text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Landmark size={40} className="text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No bonds in your portfolio</h2>
              <p className="text-slate-400 text-sm mb-8">
                Add your first bond to start tracking fixed-income investments.
              </p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Plus size={18} />
                Add Bond
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Active Portfolio Dashboard View
  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto">
          <BondPageHeader />

          {/* Performance Summary Statistics Ribbon */}
          <div className="px-6 pt-2 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {isLoading ? <SummaryCardSkeleton /> : <SummaryCards bonds={filteredBonds} />}
          </div>

          {/* Filtering Controller Layout */}
          <BondFilters />

          {/* Core Structured Asset Display Data Table */}
          <div className="px-6 pb-8" id="bond-table">
            {isLoading ? <TableSkeleton /> : <BondTable bonds={filteredBonds} />}
          </div>
        </main>
      </div>

      {/* Side Context drawers and Modals */}
      {selectedBondId && (
        <BondDetailDrawer bonds={filteredBonds} />
      )}
      {showAddModal && <AddBondModal />}
    </div>
  );
};

export default BondsPage;