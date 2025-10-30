"use server";

import { API } from ".";
import { parseJsonSafe } from './_utils';

type MpesaInitiatePayload = {
  userId?: string;
  orderId?: string;
  phone: string;
  amount: number | string;
  accountReference?: string;
  transactionDesc?: string;
};

type CashPaymentPayload = {
  orderId: string;
  amount: number | string;
  userId?: string;
  hotelId?: string;
  note?: string;
};
/**
 * Initiate an M-Pesa STK push.
 * Returns whatever the backend returns for the STK initiation (raw response parsed as JSON).
 */
export async function initiateMpesaPayment(token: string, payload: MpesaInitiatePayload): Promise<any> {
  console.log('initiating mpesa payment', payload);
  const url = API.payments_mpesa_initiate;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Failed to initiate mpesa payment: ${res.status} ${res.statusText} ${bodyText}`);
  }

  const parsed = await parseJsonSafe(res);
  return parsed;
}

/**
 * Record a cash/manual payment via the admin endpoint.
 * Expects the backend to return an object with { success: true, paymentId?: string } or similar.
 */
export async function createCashPayment(token: string, payload: CashPaymentPayload): Promise<any> {
  console.log('creating cash payment', payload);
  const url = API.payments_cash;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Failed to create cash payment: ${res.status} ${res.statusText} ${bodyText}`);
  }

  const parsed = await parseJsonSafe(res);

  if (!parsed || parsed.success !== true) {
    const debug = JSON.stringify(parsed || {});
    throw new Error(`Cash payment failed or returned unexpected response: ${debug}`);
  }

  return parsed;
}

/**
 * Fetch paginated payments list (recent transactions).
 * Accepts optional filters: page, limit, hotelId, provider, start, end
 * Returns the parsed JSON from the backend (expected shape: { data: [...], meta: { page, total, limit } })
 */
export async function fetchPayments(token: string, params?: {
  page?: number;
  limit?: number;
  hotelId?: string;
  provider?: string;
  start?: string; // YYYY-MM-DD
  end?: string;   // YYYY-MM-DD
}): Promise<any> {
  const url = new URL(API.payments);

  if (params) {
    if (params.page) url.searchParams.set('page', String(params.page));
    if (params.limit) url.searchParams.set('limit', String(params.limit));
    if (params.hotelId) url.searchParams.set('hotelId', params.hotelId);
    if (params.provider) url.searchParams.set('provider', params.provider);
    if (params.start) url.searchParams.set('start', params.start);
    if (params.end) url.searchParams.set('end', params.end);
  }

  const res = await fetch(String(url), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch (e) {}
    throw new Error(`Failed to fetch payments: ${res.status} ${res.statusText} ${bodyText}`);
  }

  const parsed = await parseJsonSafe(res);
  return parsed;
}