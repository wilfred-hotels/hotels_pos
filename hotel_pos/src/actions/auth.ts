import { parseJsonSafe } from './_utils';
import { apiFetch } from './client';
import { API } from './index';

// Using a flexible any for the login result because a LoginResult type is not defined in the repo.
export async function login(username: string, password: string, hotelId?: string): Promise<any> {
    const res = await fetch(API.auth_login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, hotelId }),
    });

    // parseJsonSafe replacement: try to parse JSON, fall back to text
    let data: any;
    try {
        const text = await res.text();
        data = text ? JSON.parse(text) : undefined;
    } catch (e) {
        // non-json response
        try {
            // try reading as json directly
            data = await res.json();
        } catch (e2) {
            data = undefined;
        }
    }

    if (!res.ok) return data;
    return data;
}

export const register = async (payload: any) => apiFetch(API.auth_register, { method: 'POST', body: payload });

export async function authCheck(accessToken: string | null) {
  console.log("checking the token")
  const res = await fetch(`${API.token_check}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ accessToken })
  });
  if (res.status === 401) {
    "Token expired"
  } else {
    return res.status === 201;
  }
}

export async function authRefresh(refreshToken: string): Promise<{ access_token?: string } | null> {
  console.log("refreshing the token")
  const res = await fetch(`${API.token_refresh}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return (await parseJsonSafe(res)) as { access_token?: string } | null;
}

