import { FixedDeposit, InterestFrequency } from "../store/deposit.store";

// Cumulative FD — quarterly compounding (Indian standard)
export const computeCumulativeFD = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
): { maturityValue: number; totalInterest: number; effectiveYield: number } => {
  const r = annualRate / 100;
  const n = 4; // quarterly
  const t = tenureMonths / 12;
  const maturityValue = Math.round(principal * Math.pow(1 + r / n, n * t));
  const totalInterest = maturityValue - principal;
  const effectiveYield = parseFloat((((maturityValue / principal - 1) / t) * 100).toFixed(2));
  return { maturityValue, totalInterest, effectiveYield };
};

// Non-cumulative FD — simple interest per payout
export const computeNonCumulativeFD = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  frequency: InterestFrequency,
): { periodicPayout: number; totalInterest: number; maturityValue: number } => {
  const monthlyInterest = (principal * annualRate) / (100 * 12);
  const periodsPerYear: Record<InterestFrequency, number> = {
    monthly: 12,
    quarterly: 4,
    half_yearly: 2,
    annual: 1,
    at_maturity: 1,
  };
  const periodicPayout = Math.round(monthlyInterest * (12 / (periodsPerYear[frequency] || 1)));
  const totalInterest = Math.round(monthlyInterest * tenureMonths);
  return { periodicPayout, totalInterest, maturityValue: principal };
};

// FD ladder health score (HHI-inspired)
export const computeLadderScore = (fds: FixedDeposit[]): number => {
  if (fds.length === 0) return 0;
  // Group maturities by year
  // Score down for gaps, score down for single-year concentration
  const byYear: Record<number, number> = {};
  fds.forEach((fd) => {
    const year = new Date(fd.maturityDate).getFullYear();
    byYear[year] = (byYear[year] || 0) + fd.principal;
  });
  const years = Object.keys(byYear).map(Number);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const totalYears = maxYear - minYear + 1;
  const coveredYears = years.length;
  const gapPenalty = ((totalYears - coveredYears) / totalYears) * 50;
  const totalPrincipal = fds.reduce((s, fd) => s + fd.principal, 0);
  const maxYearAmount = Math.max(...Object.values(byYear));
  const concentrationPenalty = maxYearAmount / totalPrincipal > 0.6 ? 25 : 0;
  return Math.max(0, Math.round(100 - gapPenalty - concentrationPenalty));
};

// DICGC per-bank exposure
export const computeDICGCExposure = (
  fds: FixedDeposit[],
): Record<string, { totalDeposit: number; percentOfLimit: number; withinLimit: boolean }> => {
  const byBank: Record<string, number> = {};
  fds.forEach((fd) => {
    const key = fd.bankShortName;
    byBank[key] = (byBank[key] || 0) + fd.currentValue;
  });
  return Object.fromEntries(
    Object.entries(byBank).map(([bank, amt]) => [
      bank,
      {
        totalDeposit: amt,
        percentOfLimit: parseFloat(((amt / 500000) * 100).toFixed(1)),
        withinLimit: amt <= 500000,
      },
    ]),
  );
};
