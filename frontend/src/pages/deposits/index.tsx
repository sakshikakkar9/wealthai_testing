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
import { useDepositStore, FixedDeposit } from "../../store/deposit.store";
import { useDashboardStore } from "../../store/dashboard.store";

const MARKET_RATES = [
  {
    bank: "Unity Small Finance Bank",
    rate: 9.0,
    tenure: "1001 days",
    category: "Small Finance Bank",
    isBest: true,
  },
  {
    bank: "Utkarsh Small Finance Bank",
    rate: 8.5,
    tenure: "2 years",
    category: "Small Finance Bank",
    isBest: false,
  },
  {
    bank: "Suryoday Small Finance Bank",
    rate: 8.25,
    tenure: "5 years",
    category: "Small Finance Bank",
    isBest: false,
  },
  {
    bank: "AU Small Finance Bank",
    rate: 8.0,
    tenure: "18 months",
    category: "Small Finance Bank",
    isBest: false,
  },
  {
    bank: "IDFC First Bank",
    rate: 7.75,
    tenure: "400 days",
    category: "Private Bank",
    isBest: false,
  },
  { bank: "YES Bank", rate: 7.75, tenure: "1 year", category: "Private Bank", isBest: false },
  {
    bank: "Kotak Mahindra Bank",
    rate: 7.4,
    tenure: "390 days",
    category: "Private Bank",
    isBest: false,
  },
  { bank: "HDFC Bank", rate: 7.25, tenure: "2–3 years", category: "Private Bank", isBest: false },
  {
    bank: "ICICI Bank",
    rate: 7.25,
    tenure: "15–18 months",
    category: "Private Bank",
    isBest: false,
  },
  { bank: "SBI", rate: 6.8, tenure: "1–2 years", category: "PSU Bank", isBest: false },
];

const INCOME_PROJECTION = [
  {
    month: "Jun 26",
    principal_maturity: 246842,
    interest_payout: 0,
    fd_ids: ["fd1"],
    event: "maturity" as const,
  },
  {
    month: "Jul 26",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
  },
  {
    month: "Aug 26",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
  },
  {
    month: "Sep 26",
    principal_maturity: 0,
    interest_payout: 3112,
    fd_ids: ["fd2", "fd5"],
    event: "payout" as const,
  },
  {
    month: "Oct 26",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
  },
  {
    month: "Nov 26",
    principal_maturity: 80325,
    interest_payout: 1786,
    fd_ids: ["fd2", "fd5"],
    event: "maturity" as const,
  },
  {
    month: "Dec 26",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
  },
  {
    month: "Jan 27",
    principal_maturity: 143469,
    interest_payout: 1786,
    fd_ids: ["fd3", "fd5"],
    event: "maturity" as const,
  },
  {
    month: "Feb 27",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
  },
  {
    month: "Mar 27",
    principal_maturity: 0,
    interest_payout: 3112,
    fd_ids: ["fd2_renewed", "fd5"],
    event: "payout" as const,
  },
  {
    month: "Apr 27",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
  },
  {
    month: "May 27",
    principal_maturity: 0,
    interest_payout: 1786,
    fd_ids: ["fd5"],
    event: "payout" as const,
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
    isLoading
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
      tdsThresholdStatus: {
        HDFC: { interest: 14520, threshold: 40000, tdsApplicable: false },
        PNB: { interest: 2318, threshold: 40000, tdsApplicable: false },
        Axis: { interest: 3000, threshold: 40000, tdsApplicable: false },
        SBI: { interest: 5000, threshold: 40000, tdsApplicable: false },
        ICICI: { interest: 11431, threshold: 40000, tdsApplicable: false },
      },
      mixData: {
        byType: [
          { label: "Cumulative", value: 475000, color: "bg-indigo-500" },
          { label: "Non-cumulative", value: 375000, color: "bg-emerald-500" },
        ],
        byCategory: [
          { label: "Bank FD", value: 850000, color: "bg-amber-500" },
          { label: "Corporate FD", value: 0, color: "bg-slate-300" },
          { label: "Tax-saver", value: 150000, color: "bg-indigo-400" },
        ],
        byTenure: [
          { label: "Short (<1yr)", value: 0, color: "bg-emerald-400" },
          { label: "Medium (1-3yr)", value: 475000, color: "bg-amber-400" },
          { label: "Long (>3yr)", value: 375000, color: "bg-indigo-400" },
        ],
      },
    };
  }, [FIXED_DEPOSITS]);

  const activeFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === activeFDId), [activeFDId, FIXED_DEPOSITS]);
  const renewalFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === renewalFDId), [renewalFDId, FIXED_DEPOSITS]);
  const breakFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === breakFDId), [breakFDId, FIXED_DEPOSITS]);

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {/* SECTION 1 — Command banner */}
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

          {/* SECTION 2 — Stat cards */}
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

          {/* MOVED: SECTION 5 — Holdings table (Now Section 3) */}
          <div className="px-6 py-4">
            <FDFilterBar />
            <FDHoldingsTable fds={FIXED_DEPOSITS} />
          </div>

          {/* SECTION 3 — Maturity timeline + accrual (Now Section 4) */}
          <div className="px-6 py-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <MaturityTimelineChart fds={FIXED_DEPOSITS} />
            </div>
            <InterestAccrualChart
              totalAccrued={summary.totalAccruedInterest}
              totalTDS={summary.tdsDeducted}
            />
          </div>

          {/* SECTION 4 — Ladder + DICGC (Now Section 5) */}
          <div className="px-6 pb-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <FDLadderAnalyser fds={FIXED_DEPOSITS} />
            </div>
            <DICGCInsuranceTracker fds={FIXED_DEPOSITS} />
          </div>

          {/* SECTION 6 — Renewal planner + TDS tracker */}
          <div className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RenewalPlanner fds={FIXED_DEPOSITS} />
            <TDSTracker
              totalInterestFY={summary.interestYTD}
              tdsDeducted={summary.tdsDeducted}
              tdsThresholdStatus={summary.tdsThresholdStatus}
            />
          </div>

          {/* SECTION 7 — Rate benchmark + calculator */}
          <div className="px-6 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
             {/* BUG-009 FIX: Hide the market rates section as per instructions */}
             {/* <RateBenchmarkPanel fds={FIXED_DEPOSITS} marketRates={MARKET_RATES} /> */}
             <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center justify-center text-center opacity-50">
               <h3 className="text-lg font-bold text-slate-800">Market FD Rates</h3>
               <p className="text-sm text-slate-400">TODO: Replace hardcoded rates with backend API</p>
             </div>
            <FDCalculatorPanel />
          </div>

          {/* SECTION 8 — Income projection + deposit type breakdown */}
          <div className="px-6 pb-8 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <IncomeProjectionChart data={INCOME_PROJECTION} />
            </div>
            <DepositTypeBreakdown data={summary.mixData} />
          </div>
        </main>
      </div>

      {/* Slideout + Modals */}
      {activeFD && <FDDetailSlideout fd={activeFD} />}
      {showNewFDModal && <NewFDModal />}
      {showRenewalModal && renewalFD && <RenewalModal fd={renewalFD} />}
      {showBreakFDModal && breakFD && <BreakFDModal fd={breakFD} />}
    </div>
  );
};

export default DepositsPage;
