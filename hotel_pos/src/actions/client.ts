import { API } from './index';

type FetchOptions = {
  method?: string;
  body?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
};

function buildUrl(url: string, params?: Record<string, string | number>) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}${url}`;
  if (!params) return fullUrl;
  const u = new URL(fullUrl);
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

// shared refresh promise stored on the function object to serialize refresh attempts
let _refreshPromise: Promise<string | null> | null = null;

export async function apiFetch<T = any>(url: string, opts: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, params, headers = {} } = opts;
  const finalUrl = buildUrl(url, params);

  const performFetch = async (tokenOverride?: string | null) => {
    const auth = tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : getAuthHeader();
    return fetch(finalUrl, {
      method,
      headers: ({
        'Content-Type': 'application/json',
        ...auth,
        ...headers,
      } as unknown) as HeadersInit,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let res = await performFetch();

  const text = await res.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch (e) {
    // non-json response
    data = text;
  }

  // If 401 or 403 (some backends use 403 for invalid/expired token)
  // try a single shared refresh attempt and retry the request
  if (res.status === 401 || res.status === 403) {
    try {
      if (!_refreshPromise) {
        _refreshPromise = (async () => {
          try {
            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) return null;
            const r = await fetch(API.token_refresh, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refresh }),
            });
            if (!r.ok) return null;
            const t = await r.text();
            let parsed: any;
            try { parsed = t ? JSON.parse(t) : undefined; } catch { parsed = undefined; }
            const newAccess = parsed && (parsed.access_token || parsed.accessToken || parsed.token);
            if (newAccess) {
              localStorage.setItem('access_token', String(newAccess));
              return String(newAccess);
            }
            return null;
          } catch (e) {
            return null;
          }
        })();
      }

      const newAccess = await _refreshPromise;
      // clear the shared promise so next time we create a new one if needed
      _refreshPromise = null;

      if (newAccess) {
        // retry the original request
        res = await performFetch(newAccess);
        const text2 = await res.text();
        let data2: any = undefined;
        try { data2 = text2 ? JSON.parse(text2) : undefined; } catch { data2 = text2; }
        if (!res.ok) {
          const err: any = new Error(data2?.message || res.statusText || 'API error');
          err.status = res.status;
          err.data = data2;
          throw err;
        }
        return data2 as T;
      }
    } catch (e) {
      // fallthrough to clearing
    }

    // refresh failed or not present -> clear storage and redirect to login
    try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch (e) {}
    if (typeof window !== 'undefined') window.location.href = '/login';
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  // If non-ok, handle GET retries with backoff then fail
  if (!res.ok) {
    try {
      const authHeader = (getAuthHeader() as any).Authorization || '';
      const masked = authHeader ? `${authHeader.slice(0, 16)}...` : '(none)';
      console.warn('[apiFetch] request failed', { method, url: finalUrl, status: res.status, token: masked, response: data });
    } catch (e) {}

    if (method.toUpperCase() === 'GET') {
      const maxRetries = 3;
      const delays = [500, 1000, 2000];
      for (let i = 0; i < maxRetries; i++) {
        const delay = delays[i] || 2000;
        await new Promise((r) => setTimeout(r, delay));
        try {
          const retryRes = await performFetch();
          const retryText = await retryRes.text();
          let retryData: any = undefined;
          try { retryData = retryText ? JSON.parse(retryText) : undefined; } catch { retryData = retryText; }
          if (retryRes.ok) {
            if (typeof window !== 'undefined') {
              try { window.location.reload(); } catch (e) {}
            }
            return retryData as T;
          }
        } catch (e) {
          // network error, continue
        }
      }
    }

    const err: any = new Error(data?.message || res.statusText || 'API error');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export default apiFetch;
