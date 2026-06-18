const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getHeaders = () => {
  // AUTH BYPASS — re-enable for production
  return {
    'Content-Type': 'application/json'
  };
};

export const fetchDepositsFromAPI = async (filters: any = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
    if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sort) queryParams.append('sort', filters.sort);

    const queryString = queryParams.toString();
    const url = `${BASE_URL}/deposits/holdings${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    const result = await response.json();
    return result.success ? result.data : { data: [], pagination: {} };
  } catch (error) {
    console.error("Deposits fetch error:", error);
    return { data: [], pagination: {} };
  }
};

export const createDepositAPI = async (data: any) => {
  const response = await fetch(`${BASE_URL}/deposits/holdings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateDepositAPI = async (id: string, data: any) => {
  const response = await fetch(`${BASE_URL}/deposits/holdings/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteDepositAPI = async (id: string) => {
  const response = await fetch(`${BASE_URL}/deposits/holdings/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
};

export const closeDepositAPI = async (id: string, closeData: any) => {
  const response = await fetch(`${BASE_URL}/deposits/holdings/${id}/close`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(closeData),
  });
  return response.json();
};
