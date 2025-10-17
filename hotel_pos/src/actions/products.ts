import { apiFetch } from './client';
import { API } from './index';

export const getProducts = async () => {
	const data = await apiFetch(API.products);
	if (Array.isArray(data)) return data;
	// common API shape: { data: [...] }
	if (data && Array.isArray((data as any).data)) return (data as any).data;
	return [];
};

export const getProductsForHotel = async (hotelId: string) => {
	const data = await apiFetch(API.products_for_hotel(hotelId));
	if (Array.isArray(data)) return data;
	if (data && Array.isArray((data as any).data)) return (data as any).data;
	return [];
};
export const getProduct = async (id: string | number) => apiFetch(`${API.products}/${id}`);
export const createProduct = async (payload: any) => apiFetch(API.products, { method: 'POST', body: payload });
export const updateProduct = async (id: string | number, payload: any) => apiFetch(`${API.products}/${id}`, { method: 'PUT', body: payload });
export const deleteProduct = async (id: string | number) => apiFetch(`${API.products}/${id}`, { method: 'DELETE' });
