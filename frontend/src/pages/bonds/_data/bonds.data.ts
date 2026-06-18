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
import { fetchBondsFromAPI } from "../../../api/bonds.api";

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

// ── ASYNC FETCH ──────────────────────────────────────────────────────

export async function fetchRAW_BONDS(): Promise<RawBond[]> {
    return fetchBondsFromAPI() as any;
}

export async function fetchBONDS(): Promise<Bond[]> {
    const raw = await fetchRAW_BONDS();
    return hydrateBonds(raw);
}

// ── COUPON SCHEDULE ───────────────────────────────────────────────────

export interface CouponEvent {
  id: string;
  bond_name: string;
  coupon_date: string;
  coupon_amount: number;
  bond_type: BondType;
}

export async function fetchCOUPON_SCHEDULE(): Promise<CouponEvent[]> {
    // BUG-008: Placeholder for bond/master or bond/coupons endpoint
    return [
      {
        id: "B003",
        bond_name: "7.38% GOI 2027",
        coupon_date: "2026-06-20",
        coupon_amount: 7380,
        bond_type: "Govt",
      },
    ];
}
