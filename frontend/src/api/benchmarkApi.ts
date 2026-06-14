import { MOCK_PORTFOLIO_HISTORY } from "../lib/mockEquityData";

export const getBenchmarkData = async (index: "Nifty 50" | "Sensex" | "Both") => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_PORTFOLIO_HISTORY.map((item) => ({
    date: item.month,
    portfolio: item.portfolio,
    nifty: item.nifty,
    sensex: item.nifty * 1.02, // Mock sensex based on nifty
  }));
};
