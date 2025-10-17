import { apiFetch } from './client';
import { API } from './index';

const DUMMY_HOTELS = [
	{ id: 'hotel-1', name: 'Seaside Hotel', city: 'Mombasa' },
	{ id: 'hotel-2', name: 'Mountain View Inn', city: 'Nairobi' },
	{ id: 'hotel-3', name: 'Downtown Suites', city: 'Kisumu' },
];

export const listHotels = async (params?: Record<string, string | number>) => {
	// if API base is not configured, return dummy data
	try {
		const base = (API && (API as any).base) || '';
		if (!base) return DUMMY_HOTELS;
		const data = await apiFetch(API.hotels, { params });
		if (Array.isArray(data)) return data;
		if (data && Array.isArray((data as any).data)) return (data as any).data;
		return DUMMY_HOTELS;
	} catch (e) {
		return DUMMY_HOTELS;
	}
};

export const getHotel = async (id: string | number) => {
	try {
		const data = await apiFetch(API.hotel(String(id)));
		return data;
	} catch (e) {
		return DUMMY_HOTELS.find(h => h.id === String(id)) || null;
	}
};
