import { Bond, BondType, BondRating } from "../pages/bonds/_data/bonds.data";

/**
 * Returns calendar days from today to maturity_date (negative if past)
 */
export function computeDaysToMaturity(maturityDate: string): number {
  const today = new Date();
  const maturity = new Date(maturityDate);
  const diffTime = maturity.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns years as float rounded to 2 dp
 */
export function computeYearsToMaturity(maturityDate: string): number {
  const days = computeDaysToMaturity(maturityDate);
  return parseFloat((days / 365).toFixed(2));
}

/**
 * Returns current_value = quantity × current_price
 */
export function computeCurrentValue(quantity: number, currentPrice: number): number {
  const q = Number(quantity ?? 0);
  const p = Number(currentPrice ?? 0);
  return q * p;
}

/**
 * Returns gain_loss = current_value - invested_amount
 */
export function computeGainLoss(currentValue: number, investedAmount: number): number {
  const cv = Number(currentValue ?? 0);
  const ia = Number(investedAmount ?? 0);
  return cv - ia;
}

/**
 * Returns gain_loss_pct = (gain_loss / invested_amount) × 100, rounded to 2 dp
 */
export function computeGainLossPct(gainLoss: number, investedAmount: number): number {
  const gl = Number(gainLoss ?? 0);
  const ia = Number(investedAmount ?? 0);
  if (ia === 0) return 0;
  const pct = (gl / ia) * 100;
  return isNaN(pct) ? 0 : parseFloat(pct.toFixed(2));
}

/**
 * Returns weighted average YTM = Σ(ytm × current_value) / Σ(current_value)
 */
export function computeWeightedAvgYTM(bonds: Bond[]): number {
  const totalCurrentValue = bonds.reduce((sum, b) => sum + Number(b.current_value ?? 0), 0);
  if (totalCurrentValue === 0) return 0;
  const weightedSum = bonds.reduce(
    (sum, b) => sum + Number(b.ytm ?? 0) * Number(b.current_value ?? 0),
    0,
  );
  const avg = weightedSum / totalCurrentValue;
  return isNaN(avg) ? 0 : parseFloat(avg.toFixed(2));
}

/**
 * Returns the number of days between two ISO date strings
 */
export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generates the next N coupon dates forward from a starting date,
 * given a coupon frequency string
 */
export function generateCouponDates(startDate: string, frequency: string, count: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  let monthsToAdd = 12;
  if (frequency === "Semi-Annual") monthsToAdd = 6;
  else if (frequency === "Quarterly") monthsToAdd = 3;
  else if (frequency === "Zero Coupon") return [];

  for (let i = 0; i < count; i++) {
    const nextDate = new Date(start);
    nextDate.setMonth(start.getMonth() + i * monthsToAdd);
    dates.push(nextDate.toISOString().split("T")[0]);
  }

  return dates;
}

export const MATURITY_BUCKETS = [
  { label: "<6M", maxDays: 182 },
  { label: "6M–1Y", maxDays: 365 },
  { label: "1–2Y", maxDays: 730 },
  { label: "2–3Y", maxDays: 1095 },
  { label: "3–5Y", maxDays: 1825 },
  { label: "5Y+", maxDays: Infinity },
] as const;

export type MaturityBucketLabel = (typeof MATURITY_BUCKETS)[number]["label"];

/**
 * Returns the maturity bucket label for a bond
 */
export function getMaturityBucket(daysToMaturity: number): MaturityBucketLabel {
  for (const bucket of MATURITY_BUCKETS) {
    if (daysToMaturity <= bucket.maxDays) {
      return bucket.label;
    }
  }
  return "5Y+";
}

export interface FormFields {
  bond_name: string;
  bond_type: BondType;
  isin: string;
  issuer: string;
  coupon_rate: number;
  maturity_date: string;
  face_value: number;
  coupon_frequency: string;
  rating: BondRating;
  is_taxable: boolean;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}

/**
 * Validates the bond form fields
 */
export function validateBondForm(fields: FormFields): Partial<Record<keyof FormFields, string>> {
  const errors: Partial<Record<keyof FormFields, string>> = {};

  if (!fields.bond_name.trim()) errors.bond_name = "Bond name is required";
  if (!fields.bond_type) errors.bond_type = "Bond type is required";
  if (!fields.issuer.trim()) errors.issuer = "Issuer is required";
  if (
    fields.coupon_rate === undefined ||
    fields.coupon_rate === null ||
    isNaN(fields.coupon_rate)
  ) {
    errors.coupon_rate = "Coupon rate is required";
  }
  if (!fields.maturity_date) errors.maturity_date = "Maturity date is required";
  if (!fields.face_value) errors.face_value = "Face value is required";
  if (!fields.coupon_frequency) errors.coupon_frequency = "Coupon frequency is required";
  if (!fields.quantity) errors.quantity = "Quantity is required";
  if (!fields.purchase_date) errors.purchase_date = "Purchase date is required";

  return errors;
}
