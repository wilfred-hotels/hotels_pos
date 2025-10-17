import { apiFetch } from './client';
import { API } from './index';

export const login = async (credentials: { email: string; password: string }) => apiFetch(API.auth_login, { method: 'POST', body: credentials });
export const register = async (payload: any) => apiFetch(API.auth_register, { method: 'POST', body: payload });
export const checkToken = async () => apiFetch(API.token_check);
export const refreshToken = async () => apiFetch(API.token_refresh, { method: 'POST' });
