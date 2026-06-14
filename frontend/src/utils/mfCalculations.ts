import { MFCategory } from "../store/mutualfund.store";

// SIP future value (using SIP FV formula)
export const computeSIPFutureValue = (
  monthlyAmount: number,
  annualXIRR: number,
  tenureMonths: number,
): { futureValue: number; totalInvested: number; totalGain: number } => {
  const r = annualXIRR / 100 / 12;
  const n = tenureMonths;
  const fv = monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalInvested = monthlyAmount * n;
  return {
    futureValue: Math.round(fv),
    totalInvested,
    totalGain: Math.round(fv - totalInvested),
  };
};

// XIRR approximation for SIP (Newton-Raphson)
// simplified: use annualized return approximation
export const computeSIPXIRR = (
  investments: { date: Date; amount: number }[],
  currentValue: number,
): number => {
  // Simplified approximation for display
  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  if (totalInvested === 0) return 0;
  const avgHoldingYears =
    investments.reduce((s, i) => {
      const daysDiff = (new Date().getTime() - i.date.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return s + daysDiff;
    }, 0) / investments.length;

  if (avgHoldingYears <= 0) return 0;

  return parseFloat(
    ((Math.pow(currentValue / totalInvested, 1 / avgHoldingYears) - 1) * 100).toFixed(1),
  );
};

// MF capital gains tax calculation
export const computeMFTax = (
  gainLoss: number,
  holdingDays: number,
  category: MFCategory,
  slabRate: number = 30,
): { taxType: string; taxAmount: number; taxRate: number } => {
  const isEquity = [
    "large_cap",
    "mid_cap",
    "small_cap",
    "flexi_cap",
    "multi_cap",
    "elss",
    "index",
    "sectoral",
  ].includes(category);

  if (isEquity) {
    if (holdingDays > 365) {
      // LTCG: 12.5% above ₹1.25L (simplified — no exemption check here)
      return {
        taxType: "LTCG",
        taxAmount: Math.round(Math.max(0, gainLoss) * 0.125),
        taxRate: 12.5,
      };
    } else {
      return {
        taxType: "STCG",
        taxAmount: Math.round(Math.max(0, gainLoss) * 0.2),
        taxRate: 20,
      };
    }
  } else {
    // Debt: slab rate (post Apr 2023), no holding period distinction
    return {
      taxType: "Slab Rate",
      taxAmount: Math.round((Math.max(0, gainLoss) * slabRate) / 100),
      taxRate: slabRate,
    };
  }
};

// Portfolio overlap percentage between two funds
export const computeOverlap = (
  holdingsA: { stock: string; pct: number }[],
  holdingsB: { stock: string; pct: number }[],
): number => {
  const stocksA = new Set(holdingsA.map((h) => h.stock));
  const stocksB = new Set(holdingsB.map((h) => h.stock));
  const shared = [...stocksA].filter((s) => stocksB.has(s)).length;
  const maxSize = Math.max(stocksA.size, stocksB.size);
  if (maxSize === 0) return 0;
  return Math.round((shared / maxSize) * 100);
};

// Weighted average TER of portfolio
export const computeWeightedTER = (funds: { currentValue: number; expenseRatio: number }[]): number => {
  const totalValue = funds.reduce((s, f) => s + f.currentValue, 0);
  if (totalValue === 0) return 0;
  const weightedSum = funds.reduce((s, f) => s + (f.expenseRatio * f.currentValue) / totalValue, 0);
  return parseFloat(weightedSum.toFixed(3));
};
