export interface Holding {
  symbol: string;
  sector: string;
  currentValue: number;
}

/**
 * Detects portfolio drift from target sector allocations.
 */
export function detectDrift(
  holdings: Holding[],
  targetAllocations: Record<string, number>,
): { sector: string; current: number; target: number; drift: number }[] {
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const sectorValues: Record<string, number> = {};

  holdings.forEach((h) => {
    sectorValues[h.sector] = (sectorValues[h.sector] || 0) + h.currentValue;
  });

  return Object.keys(targetAllocations).map((sector) => {
    const currentWeight = (sectorValues[sector] || 0) / totalValue;
    const targetWeight = targetAllocations[sector];
    return {
      sector,
      current: currentWeight,
      target: targetWeight,
      drift: currentWeight - targetWeight,
    };
  });
}

/**
 * Suggests rebalancing trades based on calculated drifts.
 */
export function suggestRebalancingTrades(
  drifts: ReturnType<typeof detectDrift>,
  totalPortfolioValue: number,
): { action: "BUY" | "SELL"; symbol: string; amount: number; reason: string }[] {
  return drifts
    .filter((d) => Math.abs(d.drift) > 0.05) // 5% threshold
    .map((d) => ({
      action: d.drift > 0 ? "SELL" : "BUY",
      symbol: d.sector, // Simplified: suggesting sector level trade or needing stock selection
      amount: Math.abs(d.drift) * totalPortfolioValue,
      reason: `${d.sector} has drifted ${(d.drift * 100).toFixed(1)}% from target.`,
    }));
}
