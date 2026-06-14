import { differenceInDays } from "date-fns";

export interface Holding {
  symbol: string;
  buyDate: Date;
  buyPrice: number;
  currentPrice: number;
  quantity: number;
  gain: number;
}

/**
 * Classifies a holding as Short Term or Long Term Capital Gain.
 * Indian Rule: > 365 days is LTCG for listed equities.
 */
export function classifyHolding(buyDate: Date): "STCG" | "LTCG" {
  const days = differenceInDays(new Date(), buyDate);
  return days > 365 ? "LTCG" : "STCG";
}

/**
 * Calculates STCG Tax.
 * Indian Rule (FY 2025-26): 20% flat.
 */
export function stcgTax(gain: number): number {
  return gain > 0 ? gain * 0.2 : 0;
}

/**
 * Calculates LTCG Tax.
 * Indian Rule (FY 2025-26): 12.5% above ₹1.25L exemption.
 * Note: This function calculates tax per holding, so exemption should be applied globally.
 * For individual holding display, we show potential tax without exemption or prorated.
 * Requirement specifies: 12.5% above ₹1.25L.
 */
export function ltcgTax(gain: number): number {
  // Simplification: returns 12.5% of gain if gain > 0
  return gain > 0 ? gain * 0.125 : 0;
}

/**
 * Suggests tax-loss harvesting by identifying stocks with unrealized losses.
 */
export function taxLossHarvestingSuggestions(
  holdings: Holding[],
): { symbol: string; suggestedAction: string; potentialSaving: number }[] {
  return holdings
    .filter((h) => h.gain < 0)
    .map((h) => ({
      symbol: h.symbol,
      suggestedAction: "Sell and Repurchase (after 24h)",
      potentialSaving: Math.abs(h.gain) * 0.2, // Assuming offset against STCG
    }));
}
