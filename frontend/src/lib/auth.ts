// src/lib/auth.ts
const TOKEN_KEY = 'wealthai_token';

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = (): boolean => !!getToken();