// use Vite's import.meta.env in the browser; fall back to empty string
const envBase = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.NEXT_PUBLIC_API_BASE) || '';
const BASE = String(envBase || '').replace(/\/+$/, '');

export const API = {
  products: `${BASE}/products`,
  products_for_hotel: (id: string) => `${BASE}/hotels/${id}/products`,
  orders_place: `${BASE}/orders/checkout`,
  orders: `${BASE}/orders`,
  hotels: `${BASE}/hotels`,
  hotel: (id: string) => (`${BASE}/hotels/${id}`),
  auth_login: `${BASE}/auth/login`,
  auth_register: `${BASE}/auth/register`,
  token_check:`${BASE}/auth/check`,
  token_refresh:`${BASE}/auth/refresh`,
  cart: `${BASE}/cart`,
  items: `${BASE}/cart/items`,
  item: (itemId: number) => `${BASE}/cart/items/${itemId}`,
  itemUpdate: (itemId: number, userId: string | number) => `${BASE}/cart/items/${itemId}?userId=${userId}`,
  base: BASE,
};

export default BASE;
