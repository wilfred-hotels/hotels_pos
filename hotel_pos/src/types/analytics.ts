export interface HotelSummary {
  id: string;
  name: string;
  location: string;
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  averageOrderValue: number;
  profitMargin: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  sku: string;
  totalSales: number;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  stockLevels: {
    hotelId: string;
    hotelName: string;
    inStock: number;
    reorderPoint: number;
    optimal: number;
  }[];
  salesTrend: {
    period: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface SalesAnalytics {
  totalRevenue: number;
  periodComparison: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  byHotel: {
    hotelId: string;
    hotelName: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }[];
  byProduct: ProductPerformance[];
  byCategory: {
    categoryId: string;
    name: string;
    revenue: number;
    profit: number;
    productCount: number;
  }[];
  trends: {
    period: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }[];
}

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStock: {
    hotelId: string;
    hotelName: string;
    products: {
      id: string;
      name: string;
      currentStock: number;
      reorderPoint: number;
      lastRestockDate: string;
    }[];
  }[];
  overstock: {
    hotelId: string;
    hotelName: string;
    products: {
      id: string;
      name: string;
      currentStock: number;
      optimalStock: number;
      excessValue: number;
    }[];
  }[];
  stockDistribution: {
    hotelId: string;
    hotelName: string;
    totalValue: number;
    itemCount: number;
    utilizationRate: number;
  }[];
}

export interface ProfitAnalytics {
  totalProfit: number;
  profitMargin: number;
  byHotel: {
    hotelId: string;
    hotelName: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }[];
  byProduct: {
    productId: string;
    name: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
    volumeSold: number;
  }[];
  trends: {
    period: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }[];
}

export interface OrderAnalytics {
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: {
    status: string;
    count: number;
    value: number;
  }[];
  byHotel: {
    hotelId: string;
    hotelName: string;
    orders: number;
    value: number;
    averageProcessingTime: number;
  }[];
  fulfillmentMetrics: {
    hotelId: string;
    hotelName: string;
    onTimeDelivery: number;
    averageDelay: number;
    returns: number;
  }[];
}

export interface ReportTimeframe {
  start: string;
  end: string;
  comparisonStart?: string;
  comparisonEnd?: string;
}