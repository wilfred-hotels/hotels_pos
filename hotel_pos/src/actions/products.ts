import { apiFetch } from './client';
import { API } from './index';

function resolveHotelId(provided?: string) {
	if (provided) return provided;
	if (typeof window === 'undefined') return null;
	// check localStorage first
	const stored = localStorage.getItem('hotel_id') || localStorage.getItem('hotelId');
	if (stored) return stored;
	// try to extract from URL: /dashboard/:hotelId
	const m = window.location.pathname.match(/\/dashboard\/([^\/]+)/);
	if (m) return m[1];
	return null;
}

export const getProducts = async (hotelId?: string) => {
	const hid = resolveHotelId(hotelId);
	if (hid) return getProductsForHotel(hid);

	const data = await apiFetch(API.products as any);
	if (Array.isArray(data)) return data;
	// common API shape: { data: [...] }
	if (data && Array.isArray((data as any).data)) return (data as any).data;
	return [] as any[];
};

export const getProductsForHotel = async (hotelId: string) => {
	const data = await apiFetch(API.products_for_hotel(hotelId) as any);
	if (Array.isArray(data)) return data;
	if (data && Array.isArray((data as any).data)) return (data as any).data;
	return [] as any[];
};

export const getProduct = async (id: string | number, hotelId?: string) => {
	const hid = resolveHotelId(hotelId);
	return apiFetch(`${API.products}/${id}` + (hid ? `?hotel_id=${encodeURIComponent(hid)}` : ''));
};

export const createProduct = async (payload: any, hotelId?: string) => {
	const hid = resolveHotelId(hotelId);
	// POST to /products and include hotelId in body (server may prefer hotelId in body)
	const body = hid ? { ...payload, hotelId: hid } : payload;
	return apiFetch(API.products as any, { method: 'POST', body });
};

export const updateProduct = async (id: string | number, payload: any, hotelId?: string) => {
	const hid = resolveHotelId(hotelId);
	// PUT to /products/:id and include hotelId in the body so backend can validate scope
	const body = hid ? { ...payload, hotelId: hid } : payload;
	return apiFetch(`${API.products}/${id}`, { method: 'PUT', body });
};

export const deleteProduct = async (id: string | number, hotelId?: string) => {
	const hid = resolveHotelId(hotelId);
	// include hotel id as a query param for delete to help the backend validate
	return apiFetch(`${API.products}/${id}`, { method: 'DELETE', params: hid ? { hotelId: hid } : undefined });
};

const ProductsAPI = {
	resolveHotelId,
	getProducts,
	getProductsForHotel,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};

export default ProductsAPI;
