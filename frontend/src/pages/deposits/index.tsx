import React, { useMemo, useEffect } from "react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import DepositCommandBanner from "./_components/DepositCommandBanner";
import DepositStatCards from "./_components/DepositStatCards";
import MaturityTimelineChart from "./_components/MaturityTimelineChart";
import InterestAccrualChart from "./_components/InterestAccrualChart";
import FDLadderAnalyser from "./_components/FDLadderAnalyser";
import DICGCInsuranceTracker from "./_components/DICGCInsuranceTracker";
import FDFilterBar from "./_components/FDFilterBar";
import FDHoldingsTable from "./_components/FDHoldingsTable";
import RenewalPlanner from "./_components/RenewalPlanner";
import TDSTracker from "./_components/TDSTracker";
import RateBenchmarkPanel from "./_components/RateBenchmarkPanel";
import FDCalculatorPanel from "./_components/FDCalculatorPanel";
import IncomeProjectionChart from "./_components/IncomeProjectionChart";
import DepositTypeBreakdown from "./_components/DepositTypeBreakdown";
import FDDetailSlideout from "./_components/FDDetailSlideout";
import NewFDModal from "./_components/NewFDModal";
import RenewalModal from "./_components/RenewalModal";
import BreakFDModal from "./_components/BreakFDModal";
import { useDepositStore } from "../../store/deposit.store";
import { useDashboardStore } from "../../store/dashboard.store";

const MARKET_RATES: any[] = [];

const INCOME_PROJECTION = [
  {
    month: "Jun 26",
    principal_maturity: 0,
    interest_payout: 0,
    fd_ids: [],
    event: "maturity" as const,
  },
];

const DepositsPage: React.FC = () => {
  const { setActiveNav } = useDashboardStore();
  const {
    activeFDId,
    showNewFDModal,
    showRenewalModal,
    showBreakFDModal,
    renewalFDId,
    breakFDId,
    deposits: FIXED_DEPOSITS,
    fetchDeposits,
  } = useDepositStore();

  useEffect(() => {
    setActiveNav("deposits");
    fetchDeposits();
  }, [setActiveNav, fetchDeposits]);

  const summary = useMemo(() => {
    const fdsToUse = FIXED_DEPOSITS;
    if (fdsToUse.length === 0) {
      return {
        totalFDs: 0,
        totalBanks: 0,
        totalPrincipal: 0,
        totalMaturityValue: 0,
        totalAccruedInterest: 0,
        totalInterest: 0,
        weightedAvgRate: 0,
        minRate: 0,
        maxRate: 0,
        interestYTD: 0,
        tdsDeducted: 0,
        nearestMaturityDays: 0,
        nearestMaturityBank: "N/A",
        nearestMaturityValue: 0,
        tdsThresholdStatus: {},
        mixData: { byType: [], byCategory: [], byTenure: [] }
      };
    }

    const totalPrincipal = fdsToUse.reduce((sum, fd) => sum + fd.principal, 0);
    const totalInterest = fdsToUse.reduce((sum, fd) => sum + fd.totalInterestAtMaturity, 0);
    const weightedAvgRate = Number(
      (
        fdsToUse.reduce((sum, fd) => sum + fd.interestRate * fd.principal, 0) / totalPrincipal
      ).toFixed(2),
    );
    const rates = fdsToUse.map((fd) => fd.interestRate);
    const nearestFD = [...fdsToUse].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];

    return {
      totalFDs: fdsToUse.length,
      totalBanks: new Set(fdsToUse.map((fd) => fd.bankShortName)).size,
      totalPrincipal,
      totalMaturityValue: fdsToUse.reduce((sum, fd) => sum + fd.maturityValue, 0),
      totalAccruedInterest: fdsToUse.reduce((sum, fd) => sum + fd.accruedInterest, 0),
      totalInterest,
      weightedAvgRate,
      minRate: Math.min(...rates),
      maxRate: Math.max(...rates),
      interestYTD: FIXED_DEPOSITS.reduce((sum, fd) => sum + fd.interestEarnedTillDate, 0),
      tdsDeducted: FIXED_DEPOSITS.reduce((sum, fd) => sum + fd.tdsDeducted, 0),
      nearestMaturityDays: nearestFD.daysRemaining,
      nearestMaturityBank: nearestFD.bankShortName,
      nearestMaturityValue: nearestFD.maturityValue,
      tdsThresholdStatus: {},
      mixData: {
        byType: [
          { label: "Cumulative", value: totalPrincipal, color: "bg-indigo-500" },
        ],
        byCategory: [
          { label: "Bank FD", value: totalPrincipal, color: "bg-amber-500" },
        ],
        byTenure: [
          { label: "Medium (1-3yr)", value: totalPrincipal, color: "bg-amber-400" },
        ],
      },
    };
  }, [FIXED_DEPOSITS]);

  const activeFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === activeFDId), [FIXED_DEPOSITS, activeFDId]);
  const renewalFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === renewalFDId), [FIXED_DEPOSITS, renewalFDId]);
  const breakFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === breakFDId), [FIXED_DEPOSITS, breakFDId]);

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <DepositCommandBanner
            totalFDs={summary.totalFDs}
            totalBanks={summary.totalBanks}
            totalPrincipal={summary.totalPrincipal}
            weightedAvgRate={summary.weightedAvgRate}
            totalMaturityValue={summary.totalMaturityValue}
            totalAccruedInterest={summary.totalAccruedInterest}
            nearestMaturityDays={summary.nearestMaturityDays}
            nearestMaturityBank={summary.nearestMaturityBank}
            nearestMaturityValue={summary.nearestMaturityValue}
          />

          <div className="px-6 pt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <DepositStatCards
              totalPrincipal={summary.totalPrincipal}
              totalFDs={summary.totalFDs}
              totalBanks={summary.totalBanks}
              weightedAvgRate={summary.weightedAvgRate}
              minRate={summary.minRate}
              maxRate={summary.maxRate}
              totalMaturityValue={summary.totalMaturityValue}
              totalInterest={summary.totalInterest}
              interestYTD={summary.interestYTD}
              tdsDeducted={summary.tdsDeducted}
            />
          </div>

          <div className="px-6 py-4">
            <FDFilterBar />
            <FDHoldingsTable fds={FIXED_DEPOSITS} />
          </div>

          <div className="px-6 py-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <MaturityTimelineChart fds={FIXED_DEPOSITS} />
            </div>
            <InterestAccrualChart
              totalAccrued={summary.totalAccruedInterest}
              totalTDS={summary.tdsDeducted}
            />
          </div>

          <div className="px-6 pb-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <FDLadderAnalyser fds={FIXED_DEPOSITS} />
            </div>
            <DICGCInsuranceTracker fds={FIXED_DEPOSITS} />
          </div>

          <div className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RenewalPlanner fds={FIXED_DEPOSITS} />
            <TDSTracker
              totalInterestFY={summary.interestYTD}
              tdsDeducted={summary.tdsDeducted}
              tdsThresholdStatus={summary.tdsThresholdStatus}
            />
          </div>

          {/* Market FD Rates Section - Hidden with TODO */}
          {/* TODO: wire to /api/v1/fd/market-rates once endpoint is implemented */}
          {MARKET_RATES.length > 0 && (
            <div className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RateBenchmarkPanel fds={FIXED_DEPOSITS} marketRates={MARKET_RATES} />
              <FDCalculatorPanel />
            </div>
          )}
          {MARKET_RATES.length === 0 && (
            <div className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
               <FDCalculatorPanel />
            </div>
          )}

          <div className="px-6 pb-8 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <IncomeProjectionChart data={INCOME_PROJECTION} />
            </div>
            <DepositTypeBreakdown data={summary.mixData} />
          </div>
        </main>
      </div>

      {activeFD && <FDDetailSlideout fd={activeFD} />}
      {showNewFDModal && <NewFDModal />}
      {showRenewalModal && renewalFD && <RenewalModal fd={renewalFD} />}
      {showBreakFDModal && breakFD && <BreakFDModal fd={breakFD} />}
    </div>
  );
};

export default DepositsPage;
