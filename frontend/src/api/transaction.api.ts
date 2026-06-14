const API_BASE_URL = 'http://localhost:3000/api/v1';

export interface TransactionFilters {
  type?: string;
  assetClass?: string;
  account?: string;
  search?: string;
  dateFilter?: string;
  customRange?: { from: string; to: string };
  sortField?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const fetchTransactionsFromAPI = async (filters: TransactionFilters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object') {
        queryParams.append(key, JSON.stringify(value));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/transaction?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const result = await response.json();
  return result.data; // { transactions: [], total: 0, page: 1, pageSize: 20 }
};

export const createTransactionAPI = async (transaction: any) => {
  const response = await fetch(`${API_BASE_URL}/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }
  return response.json();
};

export const updateTransactionAPI = async (id: string, transaction: any) => {
  const response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }
  return response.json();
};

export const deleteTransactionAPI = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
  return response.json();
};
