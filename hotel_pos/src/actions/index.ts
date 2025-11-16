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

// Allow using `process` in environments where TypeScript's node types are not installed
declare const process: any;

const BASE = import.meta.env.VITE_BACKEND_URL ?? (typeof process !== 'undefined' && (process.env?.VITE_BACKEND_URL ?? process.env?.BACKEND_URL) ? (process.env?.VITE_BACKEND_URL ?? process.env?.BACKEND_URL) : '');

export const API = {
  payments_mpesa_initiate: `${BASE}/payments/mpesa/initiate`,
  products: `${BASE}/products`,
  // Admin-facing products endpoint (super-admin)
  admin_products: `${BASE}/admin/products`,
  catalog_products: `${BASE}/catalog`,
  products_for_hotel: (id: string) => `${BASE}/hotels/${id}/products`,
  orders_place: `${BASE}/orders/checkout`,
  orders: (hotelId: string) => `${BASE}/hotels/${hotelId}/orders`,
  hotels: `${BASE}/hotels`,
  hotel: (id: string) => (`${BASE}/hotels/${id}`),
  auth_login: `${BASE}/auth/login`,
  auth_super_admin_login: `${BASE}/auth/super-admin/login`,
  auth_register: `${BASE}/auth/register`,
  token_check: `${BASE}/auth/check`,
  token_refresh: `${BASE}/auth/refresh`,
  cart: `${BASE}/cart`,
  payments_cash:`${BASE}/payments/cash`,
  payments: `${BASE}/payments`,
  payments_stats_summary:`${BASE}/payments/stats/summary`,
  payments_stats_by_provider:`${BASE}/payments/stats/by-provider`,
  payments_stats_revenue: (interval?: 'daily' | 'weekly' | 'monthly', start?: string, end?: string) => {
    const qs = new URLSearchParams();
    if (interval) qs.set('interval', interval);
    if (start) qs.set('start', start);
    if (end) qs.set('end', end);
    const q = qs.toString();
    return `${BASE}/payments/stats/revenue${q ? `?${q}` : ''}`;
  },
  items: `${BASE}/cart/items`,
  item: (itemId: number) => `${BASE}/cart/items/${itemId}`,
  itemUpdate: (itemId: number, userId: string | number) => `${BASE}/cart/items/${itemId}?userId=${userId}`,
  base: BASE,
};

export default BASE;
