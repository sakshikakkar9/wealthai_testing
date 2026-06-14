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

/*
const FIXED_DEPOSITS: FixedDeposit[] = [
  {
    id: "fd1",
    fdNumber: "HDFC-3421-FD",
    bankName: "HDFC Bank",
    bankShortName: "HDFC",
    bankLogoInitials: "HB",
    bankLogoColor: "bg-blue-800",
    category: "bank",
    type: "cumulative",
    interestFrequency: "at_maturity",
    account: "rahul",
    nominee: "Priya Kumar",
    isJointHolder: true,
    jointHolderName: "Priya Kumar",
    principal: 200000,
    interestRate: 7.25,
    startDate: "15 Jun 2023",
    maturityDate: "15 Jun 2026",
    tenureMonths: 36,
    daysRemaining: 17,
    status: "maturing_soon",
    accruedInterest: 46842,
    maturityValue: 246842,
    currentValue: 246842,
    interestEarnedTillDate: 46842,
    interestRemainingToEarn: 0,
    totalInterestAtMaturity: 46842,
    tdsDeducted: 0,
    tdsRate: 10,
    form15GSubmitted: false,
    form15HSubmitted: false,
    isTaxSaver: false,
    dicgcCovered: true,
    dicgcLimit: 500000,
    autoRenewal: false,
    renewalCount: 0,
    renewalHistory: [],
    prematureWithdrawalPenalty: 1,
    linkedGoal: "Dream Home",
    notes: "Opened for home down payment savings",
  },
  {
    id: "fd2",
    fdNumber: "PNB-8821-FD",
    bankName: "Punjab National Bank",
    bankShortName: "PNB",
    bankLogoInitials: "PB",
    bankLogoColor: "bg-orange-700",
    category: "bank",
    type: "non_cumulative",
    interestFrequency: "quarterly",
    account: "priya",
    nominee: "Rahul Kumar",
    isJointHolder: false,
    principal: 75000,
    interestRate: 7.1,
    startDate: "22 Nov 2025",
    maturityDate: "22 Nov 2026",
    tenureMonths: 12,
    daysRemaining: 177,
    status: "active",
    accruedInterest: 2318,
    maturityValue: 80325,
    currentValue: 77318,
    interestEarnedTillDate: 2318,
    interestRemainingToEarn: 3007,
    totalInterestAtMaturity: 5325,
    tdsDeducted: 0,
    tdsRate: 10,
    form15GSubmitted: false,
    form15HSubmitted: false,
    isTaxSaver: false,
    dicgcCovered: true,
    dicgcLimit: 500000,
    autoRenewal: true,
    renewalCount: 1,
    renewalHistory: [{ date: "22 Nov 2024", principal: 70000, rate: 6.8, tenureMonths: 12 }],
    prematureWithdrawalPenalty: 0.5,
  },
  {
    id: "fd3",
    fdNumber: "AXIS-2241-FD",
    bankName: "Axis Bank",
    bankShortName: "Axis",
    bankLogoInitials: "AB",
    bankLogoColor: "bg-red-700",
    category: "bank",
    type: "cumulative",
    interestFrequency: "at_maturity",
    account: "joint",
    nominee: "Rahul Kumar",
    isJointHolder: true,
    jointHolderName: "Priya Kumar",
    principal: 125000,
    interestRate: 7.0,
    startDate: "04 Jan 2025",
    maturityDate: "04 Jan 2027",
    tenureMonths: 24,
    daysRemaining: 220,
    status: "active",
    accruedInterest: 9956,
    maturityValue: 143469,
    currentValue: 134956,
    interestEarnedTillDate: 9956,
    interestRemainingToEarn: 8513,
    totalInterestAtMaturity: 18469,
    tdsDeducted: 0,
    tdsRate: 10,
    form15GSubmitted: false,
    form15HSubmitted: false,
    isTaxSaver: false,
    dicgcCovered: true,
    dicgcLimit: 500000,
    autoRenewal: false,
    renewalCount: 0,
    renewalHistory: [],
    prematureWithdrawalPenalty: 1,
    linkedGoal: "Education Fund",
  },
  {
    id: "fd4",
    fdNumber: "SBI-5521-TSFG",
    bankName: "State Bank of India",
    bankShortName: "SBI",
    bankLogoInitials: "SI",
    bankLogoColor: "bg-blue-900",
    category: "tax_saver",
    type: "cumulative",
    interestFrequency: "at_maturity",
    account: "huf",
    nominee: "Rahul Kumar",
    isJointHolder: false,
    principal: 150000,
    interestRate: 6.5,
    startDate: "01 Apr 2023",
    maturityDate: "01 Apr 2028",
    tenureMonths: 60,
    daysRemaining: 672,
    status: "active",
    accruedInterest: 21813,
    maturityValue: 205828,
    currentValue: 171813,
    interestEarnedTillDate: 21813,
    interestRemainingToEarn: 34015,
    totalInterestAtMaturity: 55828,
    tdsDeducted: 0,
    tdsRate: 10,
    form15GSubmitted: false,
    form15HSubmitted: false,
    isTaxSaver: true,
    lockInPeriod: 60,
    dicgcCovered: true,
    dicgcLimit: 500000,
    autoRenewal: false,
    renewalCount: 0,
    renewalHistory: [],
    prematureWithdrawalPenalty: 0, // lock-in — no premature withdrawal
    notes: "Section 80C tax saving FD · Lock-in until Apr 2028",
  },
  {
    id: "fd5",
    fdNumber: "ICICI-7741-FD",
    bankName: "ICICI Bank",
    bankShortName: "ICICI",
    bankLogoInitials: "IB",
    bankLogoColor: "bg-orange-600",
    category: "bank",
    type: "non_cumulative",
    interestFrequency: "monthly",
    account: "rahul",
    nominee: "Priya Kumar",
    isJointHolder: false,
    principal: 300000,
    interestRate: 7.15,
    startDate: "10 Oct 2025",
    maturityDate: "10 Oct 2026",
    tenureMonths: 12,
    daysRemaining: 133,
    status: "active",
    accruedInterest: 11431,
    maturityValue: 321450,
    currentValue: 311431,
    interestEarnedTillDate: 11431,
    interestRemainingToEarn: 10019,
    totalInterestAtMaturity: 21450,
    tdsDeducted: 1143,
    tdsRate: 10,
    form15GSubmitted: false,
    form15HSubmitted: false,
    isTaxSaver: false,
    dicgcCovered: true,
    dicgcLimit: 500000,
    autoRenewal: true,
    renewalCount: 0,
    renewalHistory: [],
    prematureWithdrawalPenalty: 1,
    notes: "Monthly payout — credited to savings account",
  },
];
*/

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

  const activeFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === activeFDId), [activeFDId]);
  const renewalFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === renewalFDId), [renewalFDId]);
  const breakFD = useMemo(() => FIXED_DEPOSITS.find((f) => f.id === breakFDId), [breakFDId]);

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
            <RateBenchmarkPanel fds={FIXED_DEPOSITS} marketRates={MARKET_RATES} />
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
