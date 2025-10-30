// Resolve API base from environment in a robust way:
// 1) Vite's import.meta.env (browser builds)
// 2) process.env (Node / some runners)
// 3) empty string fallback

/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const BASE = import.meta.env.VITE_BACKEND_URL ?? '';

export const API = {
  payments_mpesa_initiate: `${BASE}/payments/mpesa/initiate`,
  products: `${BASE}/products`,
  products_for_hotel: (id: string) => `${BASE}/hotels/${id}/products`,
  orders_place: `${BASE}/orders/checkout`,
  orders: (hotelId: string) => `${BASE}/hotels/${hotelId}/orders`,
  hotels: `${BASE}/hotels`,
  hotel: (id: string) => (`${BASE}/hotels/${id}`),
  auth_login: `${BASE}/auth/login`,
  auth_register: `${BASE}/auth/register`,
  token_check: `${BASE}/auth/check`,
  token_refresh: `${BASE}/auth/refresh`,
  cart: `${BASE}/cart`,
  payments_cash:`${BASE}/payments/cash`,
  payments: `${BASE}/payments`,
  payments_stats_summary:`${BASE}/payments/stats/summary`,
  payments_stats_by_provider:`${BASE}/payments/stats/by-provider`,
  payments_stats_revenue:`${BASE}/payments/stats/revenue-by-day`,
  items: `${BASE}/cart/items`,
  item: (itemId: number) => `${BASE}/cart/items/${itemId}`,
  itemUpdate: (itemId: number, userId: string | number) => `${BASE}/cart/items/${itemId}?userId=${userId}`,
  base: BASE,
};

export default BASE;
