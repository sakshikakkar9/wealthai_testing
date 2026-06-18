const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock-token'
  };
};

export const getPortfolioSummary = async () => {
  const res = await fetch(`${BASE_URL}/portfolio/summary`, { headers: getHeaders() });
  const json = await res.json();
  return json.success ? json.data : null;
};

export const getAllocation = async () => {
  const res = await fetch(`${BASE_URL}/portfolio/allocation`, { headers: getHeaders() });
  const json = await res.json();
  return json.success ? json.data : [];
};

export const getHoldings = async () => {
  // Aggregate holdings from all modules
  const [bonds, deposits, mf, equity] = await Promise.all([
    fetch(`${BASE_URL}/bond/all`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${BASE_URL}/deposits/holdings`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${BASE_URL}/mutual-funds/holdings`, { headers: getHeaders() }).then(r => r.json()),
    fetch(`${BASE_URL}/market/equity/holdings`, { headers: getHeaders() }).then(r => r.json()),
  ]);

  const allHoldings: any[] = [];

  if (bonds.success) {
    allHoldings.push(...bonds.data.map((h: any) => ({ ...h, asset_class: 'bond' })));
  }
  if (deposits.success) {
    allHoldings.push(...deposits.data.map((h: any) => ({ ...h, asset_class: 'fd' })));
  }
  if (mf.success && mf.data.data) {
    allHoldings.push(...mf.data.data.map((h: any) => ({ ...h, asset_class: 'mutual_fund' })));
  }
  if (equity.success) {
    allHoldings.push(...equity.data.map((h: any) => ({ ...h, asset_class: 'equity' })));
  }

  return allHoldings;
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
