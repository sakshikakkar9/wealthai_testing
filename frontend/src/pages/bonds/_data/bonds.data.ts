/**
 * Backend integration: replace RAW_BONDS with API response,
 * then call hydrateBonds() on it. hydrateBonds() is idempotent —
 * safe to call even if the server already computed these fields.
 *
 * DB schema reference: WealthAI_Design_Document_V1.0.pdf, page 6
 */

import {
  computeDaysToMaturity,
  computeYearsToMaturity,
  computeCurrentValue,
  computeGainLoss,
  computeGainLossPct,
} from "../../../utils/bondUtils";

// ── TYPES ─────────────────────────────────────────────────────────────

export type BondType = "Govt" | "Corporate" | "SDL" | "T-Bill" | "SGB";
export type BondStatus = "Active" | "Matured" | "Called" | "Sold";
export type BondRating = "AAA" | "AA+" | "AA" | "AA-" | "A+" | "A" | "A-" | "BBB+" | "Unrated";

export interface BondMaster {
  id: string;
  bond_name: string;
  bond_type: BondType;
  isin: string;
  issuer: string;
  coupon_rate: number | null;
  maturity_date: string;
  face_value: number | null;
  coupon_frequency: "Annual" | "Semi-Annual" | "Quarterly" | "Zero Coupon";
  rating: BondRating;
  is_taxable: boolean;
  sector?: string;
  issue_date?: string; // Added in Task 5b/Task 2 refactor
}

export interface BondHolding {
  holding_id: string;
  bond_id: string;
  quantity: number | null;
  invested_amount: number | null;
  purchase_price: number | null;
  purchase_date: string;
  current_price: number | null;
  status: BondStatus;
  account_id?: string;
  accrued_interest: number | null;
}

export interface Bond {
  bond_id: string;
  // From bond_master
  id: string;
  bond_name: string;
  bond_type: BondType;
  isin: string;
  issuer: string;
  coupon_rate: number | null;
  maturity_date: string;
  face_value: number | null;
  coupon_frequency: string;
  rating: BondRating;
  is_taxable: boolean;
  sector?: string;
  issue_date?: string;

  // From bond_holdings
  holding_id: string;
  quantity: number | null;
  invested_amount: number | null;
  purchase_price: number | null;
  purchase_date: string;
  accrued_interest: number | null;
  status: BondStatus;

  // Computed fields
  current_price: number | null;
  current_value: number | null;
  gain_loss: number | null;
  gain_loss_pct: number | null;
  ytm: number | null;
  days_to_maturity: number;
  years_to_maturity: number;
  next_coupon_date: string;
  annual_income: number | null;
}

export type RawBond = Omit<
  Bond,
  "current_value" | "gain_loss" | "gain_loss_pct" | "days_to_maturity" | "years_to_maturity"
>;

// ── HYDRATION ─────────────────────────────────────────────────────────

export function hydrateBonds(raw: RawBond[]): Bond[] {
  return raw.map((b) => {
    const quantity = Number(b.quantity ?? 0);
    const currentPrice = Number(b.current_price ?? 0);
    const investedAmount = Number(b.invested_amount ?? 0);

    const currentValue = computeCurrentValue(quantity, currentPrice);
    const gainLoss = computeGainLoss(currentValue, investedAmount);
    const gainLossPct = computeGainLossPct(gainLoss, investedAmount);
    const daysToMaturity = computeDaysToMaturity(b.maturity_date);
    const yearsToMaturity = computeYearsToMaturity(b.maturity_date);

    return {
      ...b,
      current_value: currentValue,
      gain_loss: gainLoss,
      gain_loss_pct: gainLossPct,
      days_to_maturity: daysToMaturity,
      years_to_maturity: yearsToMaturity,
    };
  });
}

// ── ASYNC FETCHERS ────────────────────────────────────────────────────

export async function fetchRawBonds(): Promise<RawBond[]> {
  try {
    const res = await fetch('http://localhost:3000/api/v1/bond/all', {
      headers: { 'Authorization': 'Bearer mock-token' }
    });
    const json = await res.json();
    if (json.success) {
      return json.data.map((b: any) => ({
        id: b.id,
        bond_id: b.bond_id || b.id,
        bond_name: b.bond_name,
        bond_type: b.bond_type as BondType,
        isin: b.isin,
        issuer: b.issuer_name,
        coupon_rate: Number(b.coupon_rate),
        maturity_date: b.maturity_date,
        face_value: 1000,
        coupon_frequency: "Annual",
        rating: "AAA",
        is_taxable: true,
        holding_id: b.id,
        quantity: Number(b.quantity),
        invested_amount: Number(b.invested_amount),
        purchase_price: Number(b.avg_purchase_price),
        purchase_date: b.purchase_date,
        accrued_interest: 0,
        status: b.status as BondStatus,
        current_price: Number(b.avg_purchase_price),
        ytm: Number(b.coupon_rate),
        next_coupon_date: "N/A",
        annual_income: Number(b.invested_amount) * (Number(b.coupon_rate)/100)
      }));
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchCouponSchedule(): Promise<CouponEvent[]> {
  // Mocking coupon schedule from master bonds for now
  return [];
}

// ── DUMMY DATA (DEPRECATED) ───────────────────────────────────────────

export const RAW_BONDS: RawBond[] = [];
export const BONDS: Bond[] = [];

// ── COUPON SCHEDULE ───────────────────────────────────────────────────

export interface CouponEvent {
  id: string;
  bond_name: string;
  coupon_date: string;
  coupon_amount: number;
  bond_type: BondType;
}

export const COUPON_SCHEDULE: CouponEvent[] = [];
