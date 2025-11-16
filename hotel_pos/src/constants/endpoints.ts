// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  CHECK: '/auth/check',
  LOGOUT: '/auth/logout'
};

// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
  DASHBOARD: '/analytics/dashboard',
  HOTEL_PERFORMANCE: '/analytics/hotels/performance',
  PRODUCT_PERFORMANCE: '/analytics/products/performance',
  SALES: '/analytics/sales',
  INVENTORY: '/analytics/inventory',
  ORDERS: '/analytics/orders',
  PROFIT: '/analytics/profit'
};

// Hotel management endpoints
export const HOTEL_ENDPOINTS = {
  LIST: '/hotels',
  DETAILS: (id: string) => `/hotels/${id}`,
  CREATE: '/hotels',
  UPDATE: (id: string) => `/hotels/${id}`,
  DELETE: (id: string) => `/hotels/${id}`,
  STAFF: (id: string) => `/hotels/${id}/staff`
};

// Product management endpoints
export const PRODUCT_ENDPOINTS = {
  LIST: '/api/products',
  DETAILS: (id: string) => `/api/products/${id}`,
  CREATE: '/api/products',
  UPDATE: (id: string) => `/api/products/${id}`,
  DELETE: (id: string) => `/api/products/${id}`,
  CATALOG: '/api/catalog/products',
  CATEGORIES: '/api/catalog/categories'
};

// Order management endpoints
export const ORDER_ENDPOINTS = {
  LIST: '/orders',
  DETAILS: (id: string) => `/orders/${id}`,
  CREATE: '/orders',
  UPDATE: (id: string) => `/orders/${id}`,
  CANCEL: (id: string) => `/orders/${id}/cancel`,
  STATUS: (id: string) => `/orders/${id}/status`
};

// Sales management endpoints
export const SALES_ENDPOINTS = {
  LIST: '/sales',
  DETAILS: (id: string) => `/sales/${id}`,
  CREATE: '/sales',
  VOID: (id: string) => `/sales/${id}/void`,
  REFUND: (id: string) => `/sales/${id}/refund`
};

// Inventory management endpoints
export const INVENTORY_ENDPOINTS = {
  LIST: '/inventory',
  DETAILS: (id: string) => `/inventory/${id}`,
  UPDATE: (id: string) => `/inventory/${id}`,
  STOCK_LEVEL: (id: string) => `/inventory/${id}/stock`,
  TRANSFER: '/inventory/transfer',
  AUDIT: '/inventory/audit'
};

// Report generation endpoints
export const REPORT_ENDPOINTS = {
  GENERATE: '/reports/generate',
  LIST: '/reports',
  DOWNLOAD: (id: string) => `/reports/${id}/download`,
  SCHEDULE: '/reports/schedule'
};

// User management endpoints
export const USER_ENDPOINTS = {
  LIST: '/users',
  DETAILS: (id: string) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  PERMISSIONS: (id: string) => `/users/${id}/permissions`
};

// Customer management endpoints
export const CUSTOMER_ENDPOINTS = {
  LIST: '/customers',
  DETAILS: (id: string) => `/customers/${id}`,
  CREATE: '/customers',
  UPDATE: (id: string) => `/customers/${id}`,
  DELETE: (id: string) => `/customers/${id}`
};