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
