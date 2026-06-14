// src/api/equity.ts

// ✅ This evaluates perfectly to: https://wealthai-7pt1.onrender.com/api/v1/market
const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/market`;

type FetchOptions = RequestInit & { headers?: Record<string, string> };

const apiFetch = (url: string, opts: FetchOptions = {}) =>
  fetch(url, {
    credentials: 'include',
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) }
  }).then(r => r.json());

// ✅ This correctly requests: .../api/v1/market/equity/holdings
export const getHoldings = () => apiFetch(`${BASE}/equity/holdings`);

export const createHolding = (data: {
  broker_account_id: string;
  instrument_id: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
}) => apiFetch(`${BASE}/equity/holdings`, { method: 'POST', body: JSON.stringify(data) });

export const updateHolding = (
  id: string,
  data: {
    quantity?: number;
    avg_buy_price?: number;
    current_price?: number;
  }
) => apiFetch(`${BASE}/equity/holdings/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteHolding = (id: string) => apiFetch(`${BASE}/equity/holdings/${id}`, { method: 'DELETE' });
// const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/market`;
// // const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// type FetchOptions = RequestInit & { headers?: Record<string, string> };

// const apiFetch = (url: string, opts: FetchOptions = {}) =>
//   fetch(url, {
//     credentials: 'include',
//     ...opts,
//     headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) }
//   }).then(r => r.json());

// export const getHoldings = () => apiFetch(`${BASE}/equity/holdings`);

// export const createHolding = (data: {
//   broker_account_id: string;
//   instrument_id: string;
//   quantity: number;
//   avg_buy_price: number;
//   current_price: number;
// }) => apiFetch(`${BASE}/equity/holdings`, { method: 'POST', body: JSON.stringify(data) });

// export const updateHolding = (
//   id: string,
//   data: {
//     quantity?: number;
//     avg_buy_price?: number;
//     current_price?: number;
//   }
// ) => apiFetch(`${BASE}/equity/holdings/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// export const deleteHolding = (id: string) => apiFetch(`${BASE}/equity/holdings/${id}`, { method: 'DELETE' });
