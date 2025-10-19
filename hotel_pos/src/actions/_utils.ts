export async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('Failed to parse JSON response:', err);
    return null;
  }
}

export function ensureArrayOrItems(parsed: any) {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;
  if (parsed.items && Array.isArray(parsed.items)) return parsed.items;
  return [];
}
