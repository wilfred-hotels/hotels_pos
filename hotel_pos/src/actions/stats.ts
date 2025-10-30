"use server";

import { API } from ".";
import { parseJsonSafe } from "./_utils";

export type PaymentsSummary = {
  totalPending: number;
  totalCompleted: number;
  totalFailed: number;
  totalRevenue: string; // decimal as string
};

export type ProviderStat = {
  provider: string;
  count: number;
  total_amount: string; // decimal as string
};

export type RevenueRow = {
  period: string; // e.g. "2025-10-27"
  revenue: string; // decimal as string
};

/**
 * GET /payments/stats/summary
 */
export async function getPaymentsSummary(token: string): Promise<PaymentsSummary> {
  const res = await fetch(API.payments_stats_summary, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to fetch payments summary: ${res.status} ${res.statusText} ${bodyText}`);
  }

  const parsed = await parseJsonSafe(res);
  return parsed as PaymentsSummary;
}

/**
 * GET /payments/stats/by-provider
 */
export async function getPaymentsByProvider(token: string): Promise<ProviderStat[]> {
  const res = await fetch(API.payments_stats_by_provider, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to fetch payments by provider: ${res.status} ${res.statusText} ${bodyText}`);
  }

  const parsed = await parseJsonSafe(res);
  return parsed as ProviderStat[];
}

/**
 * GET /payments/stats/revenue?interval=daily|weekly|monthly&start=YYYY-MM-DD&end=YYYY-MM-DD
 *
 * Note: the backend currently expects interval/start/end either in the body or params.
 * We pass them as query params here (most RESTful). If the backend requires body, update it accordingly.
 */
export async function getPaymentsRevenue(
  token: string,
  interval: "daily" | "weekly" | "monthly" = "daily",
  start?: string,
  end?: string
): Promise<RevenueRow[]> {
  const qs = new URLSearchParams();
  if (interval) qs.set("interval", interval);
  if (start) qs.set("start", start);
  if (end) qs.set("end", end);

  const url = `${API.payments_stats_revenue}?${qs.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(`Failed to fetch payments revenue: ${res.status} ${res.statusText} ${bodyText}`);
  }

  const parsed = await parseJsonSafe(res);
  return parsed as RevenueRow[];
}