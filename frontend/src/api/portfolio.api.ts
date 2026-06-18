const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getHeaders = () => {
  const mockToken = 'mock-token';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mockToken}`
  };
};

export const getPortfolioSummary = async () => {
  const response = await fetch(`${BASE_URL}/portfolio/summary`, {
    headers: getHeaders()
  });
  return response.json();
};

export const getPortfolioAllocation = async () => {
  const response = await fetch(`${BASE_URL}/portfolio/allocation`, {
    headers: getHeaders()
  });
  return response.json();
};

export const getPortfolioPnl = async () => {
  const response = await fetch(`${BASE_URL}/portfolio/pnl`, {
    headers: getHeaders()
  });
  return response.json();
};

export const getHoldings = async (filters?: Record<string, unknown>) => {
  const response = await fetch(`${BASE_URL}/portfolio/holdings`, {
    headers: getHeaders()
  });
  return response.json();
};

export const addHolding = async (data: Record<string, unknown>) => {
  const response = await fetch(`${BASE_URL}/portfolio/holdings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return response.json();
};

export const editHolding = async (id: string, data: Record<string, unknown>) => {
  const response = await fetch(`${BASE_URL}/portfolio/holdings/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteHolding = async (id: string) => {
  const response = await fetch(`${BASE_URL}/portfolio/holdings/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};

export const getTransactions = async (filters?: Record<string, unknown>) => {
  const response = await fetch(`${BASE_URL}/transaction/all`, {
    headers: getHeaders()
  });
  return response.json();
};

export const getWatchlist = async () => {
  // Placeholder until backend supports watchlist
  return { success: true, data: [] };
};

export const addToWatchlist = async (symbol: string) => {
  console.log('Add to watchlist:', symbol);
};

export const removeFromWatchlist = async (symbol: string) => {
  console.log('Remove from watchlist:', symbol);
};

export const bulkDeleteHoldings = async (ids: string[]) => {
  console.log('Bulk delete:', ids);
};

export const bulkTagHoldings = async (ids: string[], tag: string) => {
  console.log('Bulk tag:', ids, tag);
};

export const bulkMoveAccount = async (ids: string[], account: string) => {
  console.log('Bulk move account:', ids, account);
};
