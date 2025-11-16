import { mockProducts, mockCategories } from '../data/mockData';
import { apiFetch } from './client';
import { API } from './index';



export interface ProductData {
  id?: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  isAvailable: boolean;
  hotelId: string;
  hotelName: string;
  profitMargin: number;
  salesData: {
    totalSales: number;
    lastMonthSales: number;
    revenue: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryData {
  id?: string;
  name: string;
  description?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Get catalog products with optional filtering
export const getCatalogProducts = async (
  token: string,
  userId?: string,
  filters?: { 
    categoryId?: string;
    search?: string;
    sortBy?: 'name' | 'price' | 'createdAt';
    order?: 'asc' | 'desc';
  }
) => {
  // Try to fetch real catalog products from backend; fall back to mock data on error
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const data = await apiFetch(API.catalog_products as any, headers ? { headers } : undefined);
    console.log("Fetched catalog products:", data);
    // normalize commonly seen shapes: array or { data: [...] }
    const list = Array.isArray(data) ? data : (data && Array.isArray((data as any).data) ? (data as any).data : null);
    if (list) return list;
  } catch (err) {
    // ignore and fall back to mock data
    console.warn('getCatalogProducts: backend fetch failed, using mock data', err);
  }

  // Fallback: return mock products
  return Promise.resolve(mockProducts);
};

// Add a new product
export const addProduct = async (
  token: string,
  userId: string,
  productData: ProductData
) => {
  const newProduct = {
    ...productData,
    id: `p${mockProducts.length + 1}`,
    description: productData.description || '',
    salesData: {
      totalSales: 0,
      lastMonthSales: 0,
      revenue: 0
    }
  };
  mockProducts.push(newProduct);
  return Promise.resolve(newProduct);
};

// Update a product
export const updateProduct = async (
  token: string,
  userId: string,
  productId: string,
  productData: Partial<ProductData>
) => {
  const index = mockProducts.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  const updatedProduct = {
    ...mockProducts[index],
    ...productData,
    description: productData.description || mockProducts[index].description
  };
  mockProducts[index] = updatedProduct;
  
  return Promise.resolve(mockProducts[index]);
};

// Delete a product
export const deleteProduct = async (
  token: string,
  userId: string,
  productId: string
) => {
  const index = mockProducts.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  mockProducts.splice(index, 1);
  return Promise.resolve({ success: true });
};

// Get product categories
export const getCategories = async (token: string, userId?: string) => {
  return Promise.resolve(mockCategories);
};

export const createCatalogProduct = async (payload: any) => {
  const tokenKeys = ['access_token', 'access token', 'token', 'auth_token', 'authToken'];
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    for (const k of tokenKeys) {
      const t = localStorage.getItem(k);
      if (t) { token = t; break; }
    }
  }
  // POST to admin products endpoint
  const res = await apiFetch(API.catalog_products as any, { method: 'POST', body: payload, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
  // backend commonly returns { data: {...} } or the created resource directly
  if (res && (res.data || res.data === null)) return res.data || res;
  return res;
};