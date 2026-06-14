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

// ── DUMMY DATA ────────────────────────────────────────────────────────

const RAW_BONDS: RawBond[] = [
  {
    id: "B001",
    bond_name: "7.26% GOI 2032",
    bond_type: "Govt",
    isin: "IN0020180066",
    issuer: "Government of India",
    coupon_rate: 7.26,
    maturity_date: "2032-01-15",
    face_value: 1000,
    coupon_frequency: "Semi-Annual",
    rating: "AAA",
    is_taxable: true,
    issue_date: "2021-06-15",
    holding_id: "H001",
    quantity: 100,
    invested_amount: 100000,
    purchase_price: 1000,
    purchase_date: "2022-03-10",
    accrued_interest: 1815,
    status: "Active",
    current_price: 1060,
    ytm: 6.82,
    next_coupon_date: "2026-07-15",
    annual_income: 7260,
  },
  {
    id: "B002",
    bond_name: "8.40% HDFC Bank NCD 2027",
    bond_type: "Corporate",
    isin: "INE040A08397",
    issuer: "HDFC Bank Ltd",
    coupon_rate: 8.4,
    maturity_date: "2027-09-20",
    face_value: 1000,
    coupon_frequency: "Annual",
    rating: "AAA",
    is_taxable: true,
    sector: "Banking & Finance",
    issue_date: "2022-12-20",
    holding_id: "H002",
    quantity: 50,
    invested_amount: 50000,
    purchase_price: 1000,
    purchase_date: "2023-09-20",
    accrued_interest: 924,
    status: "Active",
    current_price: 1018,
    ytm: 7.98,
    next_coupon_date: "2026-09-20",
    annual_income: 4200,
  },
  {
    id: "B003",
    bond_name: "7.38% GOI 2027",
    bond_type: "Govt",
    isin: "IN0020170033",
    issuer: "Government of India",
    coupon_rate: 7.38,
    maturity_date: "2027-06-20",
    face_value: 1000,
    coupon_frequency: "Semi-Annual",
    rating: "AAA",
    is_taxable: true,
    issue_date: "2021-01-20",
    holding_id: "H003",
    quantity: 200,
    invested_amount: 198000,
    purchase_price: 990,
    purchase_date: "2021-11-05",
    accrued_interest: 2460,
    status: "Active",
    current_price: 1004,
    ytm: 7.12,
    next_coupon_date: "2026-06-20",
    annual_income: 14760,
  },
  {
    id: "B004",
    bond_name: "Tata Capital 9.10% 2026",
    bond_type: "Corporate",
    isin: "INE306N07JP2",
    issuer: "Tata Capital Financial Services",
    coupon_rate: 9.1,
    maturity_date: "2026-08-15",
    face_value: 1000,
    coupon_frequency: "Annual",
    rating: "AA+",
    is_taxable: true,
    sector: "NBFC",
    issue_date: "2023-01-15",
    holding_id: "H004",
    quantity: 75,
    invested_amount: 75000,
    purchase_price: 1000,
    purchase_date: "2023-08-15",
    accrued_interest: 1880,
    status: "Active",
    current_price: 1024,
    ytm: 7.65,
    next_coupon_date: "2026-08-15",
    annual_income: 6825,
  },
  {
    id: "B005",
    bond_name: "Sovereign Gold Bond 2.50% 2028-IV",
    bond_type: "SGB",
    isin: "IN0020200061",
    issuer: "Government of India (RBI)",
    coupon_rate: 2.5,
    maturity_date: "2028-11-05",
    face_value: 4800,
    coupon_frequency: "Semi-Annual",
    rating: "AAA",
    is_taxable: false,
    issue_date: "2020-05-05",
    holding_id: "H005",
    quantity: 10,
    invested_amount: 48000,
    purchase_price: 4800,
    purchase_date: "2020-11-05",
    accrued_interest: 200,
    status: "Active",
    current_price: 7420,
    ytm: 14.2,
    next_coupon_date: "2026-11-05",
    annual_income: 1200,
  },
  {
    id: "B006",
    bond_name: "NHAI 7.60% 2025",
    bond_type: "Govt",
    isin: "INE202E07031",
    issuer: "National Highways Authority of India",
    coupon_rate: 7.6,
    maturity_date: "2025-12-20",
    face_value: 1000,
    coupon_frequency: "Annual",
    rating: "AAA",
    is_taxable: true,
    sector: "Infrastructure",
    issue_date: "2020-06-20",
    holding_id: "H006",
    quantity: 120,
    invested_amount: 120000,
    purchase_price: 1000,
    purchase_date: "2020-12-20",
    accrued_interest: 3040,
    status: "Active",
    current_price: 1002,
    ytm: 7.58,
    next_coupon_date: "2025-12-20",
    annual_income: 9120,
  },
  {
    id: "B007",
    bond_name: "Bajaj Finance NCD 8.75% 2027",
    bond_type: "Corporate",
    isin: "INE296A08038",
    issuer: "Bajaj Finance Ltd",
    coupon_rate: 8.75,
    maturity_date: "2027-03-15",
    face_value: 1000,
    coupon_frequency: "Annual",
    rating: "AAA",
    is_taxable: true,
    sector: "NBFC",
    issue_date: "2021-09-15",
    holding_id: "H007",
    quantity: 60,
    invested_amount: 60000,
    purchase_price: 1000,
    purchase_date: "2022-03-15",
    accrued_interest: 1458,
    status: "Active",
    current_price: 1031,
    ytm: 7.92,
    next_coupon_date: "2026-03-15",
    annual_income: 5250,
  },
  {
    id: "B008",
    bond_name: "8.83% SDL Maharashtra 2026",
    bond_type: "SDL",
    isin: "IN2720200073",
    issuer: "Government of Maharashtra",
    coupon_rate: 8.83,
    maturity_date: "2026-10-28",
    face_value: 1000,
    coupon_frequency: "Semi-Annual",
    rating: "AA+",
    is_taxable: true,
    issue_date: "2021-04-28",
    holding_id: "H008",
    quantity: 80,
    invested_amount: 80000,
    purchase_price: 1000,
    purchase_date: "2021-10-28",
    accrued_interest: 1178,
    status: "Active",
    current_price: 1008,
    ytm: 8.21,
    next_coupon_date: "2026-10-28",
    annual_income: 7064,
  },
];

export const BONDS: Bond[] = hydrateBonds(RAW_BONDS);

// ── COUPON SCHEDULE ───────────────────────────────────────────────────

export interface CouponEvent {
  id: string;
  bond_name: string;
  coupon_date: string;
  coupon_amount: number;
  bond_type: BondType;
}

export const COUPON_SCHEDULE: CouponEvent[] = [
  {
    id: "B003",
    bond_name: "7.38% GOI 2027",
    coupon_date: "2026-06-20",
    coupon_amount: 7380,
    bond_type: "Govt",
  },
  {
    id: "B007",
    bond_name: "Bajaj Finance NCD 8.75%",
    coupon_date: "2026-06-15",
    coupon_amount: 2625,
    bond_type: "Corporate",
  },
  {
    id: "B001",
    bond_name: "7.26% GOI 2032",
    coupon_date: "2026-07-15",
    coupon_amount: 3630,
    bond_type: "Govt",
  },
  {
    id: "B004",
    bond_name: "Tata Capital 9.10% 2026",
    coupon_date: "2026-08-15",
    coupon_amount: 6825,
    bond_type: "Corporate",
  },
  {
    id: "B006",
    bond_name: "NHAI 7.60% 2025",
    coupon_date: "2026-08-20",
    coupon_amount: 4560,
    bond_type: "Govt",
  },
  {
    id: "B008",
    bond_name: "SDL Maharashtra 8.83%",
    coupon_date: "2026-10-28",
    coupon_amount: 3532,
    bond_type: "SDL",
  },
  {
    id: "B002",
    bond_name: "HDFC Bank NCD 8.40%",
    coupon_date: "2026-09-20",
    coupon_amount: 4200,
    bond_type: "Corporate",
  },
  {
    id: "B005",
    bond_name: "SGB 2.50% 2028-IV",
    coupon_date: "2026-11-05",
    coupon_amount: 600,
    bond_type: "SGB",
  },
];
