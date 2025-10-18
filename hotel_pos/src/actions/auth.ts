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
export const checkToken = async () => apiFetch(API.token_check);
export const refreshToken = async () => apiFetch(API.token_refresh, { method: 'POST' });
