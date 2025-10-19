import { apiFetch } from './client';
import { API } from './index';

function resolveHotelId(provided?: string) {
  if (provided) return provided;
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('hotel_id') || localStorage.getItem('hotelId');
  if (stored) return stored;
  const m = window.location.pathname.match(/\/dashboard\/([^\/]+)/);
  if (m) return m[1];
  return null;
}

export const placeOrder = async (payload: any) => apiFetch(API.orders_place, { method: 'POST', body: payload });

export const listOrders = async (params?: Record<string, string | number>) => {
  // accept either hotel_id or hotelId from callers
  const providedHotelId = params && ((params as any).hotel_id || (params as any).hotelId);
  const rest: Record<string, string | number> = {};
  if (params) {
    Object.keys(params).forEach(k => { if (k !== 'hotel_id' && k !== 'hotelId') (rest as any)[k] = (params as any)[k]; });
  }
  const hid = providedHotelId || resolveHotelId();
  const url = (typeof API.orders === 'function' && hid) ? API.orders(String(hid)) : (typeof API.orders === 'function' ? ((API as any).base ? `${(API as any).base}/orders` : API.orders) : API.orders);
  // diagnostic log to help debug auth/403 issues
  try { console.debug('[orders.listOrders] url=', url, 'params=', rest, 'hotelId=', hid); } catch (e) {}
  return apiFetch(url as any, Object.keys(rest).length ? { params: rest } : undefined);
};

export const getOrder = async (id: string | number, hotelId?: string) => {
  const hid = hotelId || resolveHotelId();
  let url: string;
  if (typeof API.orders === 'function' && hid) {
    url = `${API.orders(hid)}/${id}`;
  } else {
    // fallback to base /orders/:id if hotel-scoped route isn't available
    const base = (API as any).base || '';
    url = `${base}/orders/${id}`;
  }
  return apiFetch(url);
};
