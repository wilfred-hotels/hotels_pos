import { API } from './index';

type FetchOptions = {
  method?: string;
  body?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
};

function buildUrl(url: string, params?: Record<string, string | number>) {
  if (!params) return url;
  const u = new URL(url, window.location.origin);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  return u.toString();
}

function getAuthHeader() {
  const tokenKeys = ['access_token', 'access token', 'token', 'auth_token', 'authToken'];
  let token: string | null = null;
  for (const k of tokenKeys) {
    token = localStorage.getItem(k);
    if (token) break;
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = any>(url: string, opts: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, params, headers = {} } = opts;
  const finalUrl = buildUrl(url, params);

  const res = await fetch(finalUrl, {
    method,
    headers: ({
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...headers,
    } as unknown) as HeadersInit,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch (e) {
    // non-json response
    data = text;
  }

  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || 'API error');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}
