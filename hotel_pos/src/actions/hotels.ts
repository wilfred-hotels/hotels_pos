import { API } from './index';

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : undefined;
  } catch (e) {
    return text;
  }
}

function ensureArrayOrItems(parsed: any) {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.data)) return parsed.data;
  if (Array.isArray(parsed.items)) return parsed.items;
  return [];
}

export async function getHotels(): Promise<any[]> {
  const res = await fetch(API.hotels);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  const parsed = await parseJsonSafe(res);
  const list = ensureArrayOrItems(parsed) as any[];
  // normalize shape and provide safe defaults for nullable fields
  return list.map(h => ({
    id: String(h.id || h._id || ''),
    name: h.name || 'Unnamed Hotel',
    address: h.address || '',
    city: h.city || '',
    country: h.country || '',
    phone: h.phone || '',
    openingTime: h.openingTime || '',
    closingTime: h.closingTime || '',
    imageUrl: h.imageUrl || '',
    description: h.description || '',
    workersCount: typeof h.workersCount === 'number' ? h.workersCount : (h.workers_count || 0),
  }));
}

export async function getHotel(id: string): Promise<any> {
  const res = await fetch(API.hotel(id));
  if (!res.ok) throw new Error('Failed to fetch hotel');
  return (await parseJsonSafe(res)) as any;
}

// Backwards-compatible wrapper
export const listHotels = async (params?: Record<string, string | number>) => getHotels();
