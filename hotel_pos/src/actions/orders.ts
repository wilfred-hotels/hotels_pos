import { apiFetch } from './client';
import { API } from './index';

export const placeOrder = async (payload: any) => apiFetch(API.orders_place, { method: 'POST', body: payload });
export const listOrders = async (params?: Record<string, string | number>) => apiFetch(API.orders, { params });
export const getOrder = async (id: string | number) => apiFetch(`${API.orders}/${id}`);
