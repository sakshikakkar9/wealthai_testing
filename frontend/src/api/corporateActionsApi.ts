import { MOCK_CORPORATE_ACTIONS } from "../lib/mockEquityData";

export type CorporateAction = {
  symbol: string;
  action: "Dividend" | "Bonus" | "Split" | "Rights" | "Buyback";
  date: string;
  detail: string;
  exDate: string;
};

export const getCorporateActions = async (): Promise<CorporateAction[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_CORPORATE_ACTIONS as CorporateAction[];
};
