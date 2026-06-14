const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getHeaders = () => {
  // AUTH BYPASS — re-enable for production
  return {
    'Content-Type': 'application/json'
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // window.location.href = '/login';
    // throw new Error('Unauthorized');
  }
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Request failed');
  return json;
}

export interface Holding {
  id: string;
  folio_number: string;
  units: string;
  avg_nav: string;
  invested_amount: string;
  scheme_id: string;
  scheme_name: string;
  fund_house: string;
  category: string;
  sub_category: string;
  display_category: string;
  plan_type: string;
  current_nav: string;
  nav_date: string;
  day_change_percent: string;
  current_value: string;
  gain_loss: string;
  gain_pct: string;
  expense_ratio: string;
  fund_manager_name: string | null;
  star_rating: number;
  active_sip_count: number;
}

export interface MFSummary {
  total_funds: number;
  total_invested: string;
  total_current_value: string;
  total_gain_loss: string;
  total_gain_pct: string;
  today_change: string;
  today_change_pct: string;
  active_sips: number;
  monthly_sip_amount: string;
}

export interface Scheme {
  scheme_id: string;
  scheme_code: string;
  isin: string;
  scheme_name: string;
  fund_house: string;
  category: string;
  sub_category: string;
  plan_type: string;
}

export interface AddHoldingPayload {
  scheme_id: string;
  folio_number: string;
  units: number;
  avg_nav: number;
  invested_amount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export const fetchMFHoldings = async (params: Record<string, string | number> = {}) => {
  const queryParams = new URLSearchParams({
    page: '1',
    limit: '20',
    sort: 'current_value',
    sortDir: 'DESC',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const url = `${BASE_URL}/mf/holdings?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse<{ success: boolean; data: { data: Holding[]; pagination: Pagination } }>(response)
    .then(res => res.data);
};

export const fetchMFSummary = async () => {
  const url = `${BASE_URL}/mf/holdings/summary`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse<{ success: boolean; data: MFSummary }>(response)
    .then(res => res.data);
};

export const createMFHoldingAPI = async (data: AddHoldingPayload) => {
  const response = await fetch(`${BASE_URL}/mf/holdings/add`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ success: boolean; data: Holding }>(response);
};

export const updateMFHoldingAPI = async (id: string, data: Partial<AddHoldingPayload>) => {
  const response = await fetch(`${BASE_URL}/mf/holdings/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ success: boolean; data: Holding }>(response);
};

export const deleteMFHoldingAPI = async (id: string) => {
  const response = await fetch(`${BASE_URL}/mf/holdings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<{ success: boolean; message: string }>(response);
};

export const fetchMFSchemes = async (search: string) => {
  const url = `${BASE_URL}/mf/schemes?search=${encodeURIComponent(search)}&limit=10`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse<{ success: boolean; data: Scheme[] }>(response)
    .then(res => res.data);
};

export const fetchMFTransactions = async (filters: any = {}) => {
  const queryParams = new URLSearchParams(filters);
  const url = `${BASE_URL}/mf/transactions?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse<{ success: boolean; data: any[] }>(response)
    .then(res => res.data);
};
