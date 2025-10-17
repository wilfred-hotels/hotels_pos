import { apiFetch } from './client';
import { API } from './index';

export const getCart = async () => apiFetch(API.cart);
export const getCartItems = async () => apiFetch(API.items);
export const addItem = async (payload: any) => apiFetch(API.items, { method: 'POST', body: payload });
export const updateItem = async (itemId: number, payload: any) => apiFetch(API.item(itemId), { method: 'PUT', body: payload });
export const removeItem = async (itemId: number) => apiFetch(API.item(itemId), { method: 'DELETE' });
