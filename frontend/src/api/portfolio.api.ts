// Empty API shell — to be wired later.

export const getPortfolioSummary = async () => {};
export const getHoldings = async (filters?: Record<string, unknown>) => {
  console.log(filters);
};
export const addHolding = async (data: Record<string, unknown>) => {
  console.log(data);
};
export const editHolding = async (id: string, data: Record<string, unknown>) => {
  console.log(id, data);
};
export const deleteHolding = async (id: string) => {
  console.log(id);
};
export const getTransactions = async (filters?: Record<string, unknown>) => {
  console.log(filters);
};
export const getWatchlist = async () => {};
export const addToWatchlist = async (symbol: string) => {
  console.log(symbol);
};
export const removeFromWatchlist = async (symbol: string) => {
  console.log(symbol);
};
export const bulkDeleteHoldings = async (ids: string[]) => {
  console.log(ids);
};
export const bulkTagHoldings = async (ids: string[], tag: string) => {
  console.log(ids, tag);
};
export const bulkMoveAccount = async (ids: string[], account: string) => {
  console.log(ids, account);
};
