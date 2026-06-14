/**
 * Calculates the Sharpe Ratio for a set of returns.
 * Formula: (Mean Return - Risk Free Rate) / Standard Deviation of Returns
 * @param returns Array of periodic returns (%)
 * @param riskFreeRate Annual risk free rate (default: 6% for India)
 */
export function sharpeRatio(returns: number[], riskFreeRate: number = 6): number {
  if (returns.length === 0) return 0;
  const periodicRF = riskFreeRate / 12; // Monthly if returns are monthly
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  return (avgReturn - periodicRF) / stdDev;
}

/**
 * Calculates the Maximum Drawdown for a set of prices.
 * Formula: (Trough Value - Peak Value) / Peak Value
 * @param prices Array of asset prices over time
 */
export function maxDrawdown(prices: number[]): number {
  if (prices.length === 0) return 0;
  let peak = -Infinity;
  let maxDD = 0;
  for (const price of prices) {
    if (price > peak) peak = price;
    const dd = (price - peak) / peak;
    if (dd < maxDD) maxDD = dd;
  }
  return Math.abs(maxDD * 100);
}

/**
 * Calculates the Annualised Volatility for a set of returns.
 * Formula: Standard Deviation of Returns * sqrt(Periodicity)
 * @param returns Array of periodic returns (%)
 */
export function annualisedVolatility(returns: number[]): number {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  return stdDev * Math.sqrt(12); // Assuming monthly returns
}

/**
 * Calculates the Sortino Ratio for a set of returns.
 * Similar to Sharpe but only considers downside deviation.
 * @param returns Array of periodic returns (%)
 * @param riskFreeRate Annual risk free rate
 */
export function sortinoRatio(returns: number[], riskFreeRate: number = 6): number {
  if (returns.length === 0) return 0;
  const periodicRF = riskFreeRate / 12;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const downsideReturns = returns.filter((r) => r < periodicRF);
  const downsideVariance =
    downsideReturns.reduce((a, b) => a + Math.pow(b - periodicRF, 2), 0) / returns.length;
  const downsideStdDev = Math.sqrt(downsideVariance);
  if (downsideStdDev === 0) return 0;
  return (avgReturn - periodicRF) / downsideStdDev;
}
