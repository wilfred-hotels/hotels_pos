import { apiFetch } from './client';
import type {
  SalesAnalytics,
  InventoryAnalytics,
  ProfitAnalytics,
  OrderAnalytics,
  ReportTimeframe,
  ProductPerformance,
  HotelSummary
} from '../types/analytics';

// Dashboard Overview
export const getDashboardAnalytics = async (
  token: string,
  userId: string,
  timeframe: ReportTimeframe
) => {
  return apiFetch('/analytics/dashboard', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, ...timeframe })
  });
};

// Hotel Performance
export const getHotelPerformance = async (
  token: string,
  userId: string,
  timeframe: ReportTimeframe,
  hotelIds?: string[]
): Promise<HotelSummary[]> => {
  return apiFetch('/analytics/hotels/performance', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, hotelIds, ...timeframe })
  });
};

// Product Performance
export const getProductPerformance = async (
  token: string,
  userId: string,
  timeframe: ReportTimeframe,
  productIds?: string[]
): Promise<ProductPerformance[]> => {
  return apiFetch('/analytics/products/performance', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, productIds, ...timeframe })
  });
};

// Sales Analytics
export const getSalesAnalytics = async (
  token: string,
  userId: string,
  timeframe: ReportTimeframe,
  filters?: {
    hotelIds?: string[];
    categoryIds?: string[];
    productIds?: string[];
  }
): Promise<SalesAnalytics> => {
  return apiFetch('/analytics/sales', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, ...timeframe, ...filters })
  });
};

// Inventory Analytics
export const getInventoryAnalytics = async (
  token: string,
  userId: string,
  filters?: {
    hotelIds?: string[];
    categoryIds?: string[];
    lowStockOnly?: boolean;
    overstockOnly?: boolean;
  }
): Promise<InventoryAnalytics> => {
  return apiFetch('/analytics/inventory', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, ...filters })
  });
};

// Order Analytics
export const getOrderAnalytics = async (
  token: string,
  userId: string,
  timeframe: ReportTimeframe,
  filters?: {
    hotelIds?: string[];
    status?: string[];
  }
): Promise<OrderAnalytics> => {
  return apiFetch('/analytics/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, ...timeframe, ...filters })
  });
};

// Profit Analytics
export const getProfitAnalytics = async (
  token: string,
  userId: string,
  timeframe: ReportTimeframe,
  filters?: {
    hotelIds?: string[];
    categoryIds?: string[];
    productIds?: string[];
    minMargin?: number;
    maxMargin?: number;
  }
): Promise<ProfitAnalytics> => {
  return apiFetch('/analytics/profit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, ...timeframe, ...filters })
  });
};