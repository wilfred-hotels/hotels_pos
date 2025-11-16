export const mockDashboardData = {
  overview: {
    totalRevenue: 1254890.45,
    totalOrders: 15678,
    activeHotels: 8,
    avgOrderValue: 80.04,
    growthRate: 12.5,
    totalCustomers: 8945
  },
  revenueByHotel: [
    { name: 'Grand Hotel', revenue: 425678.90, orders: 4567, growth: 15.4 },
    { name: 'Luxury Resort', revenue: 389456.78, orders: 3890, growth: 8.9 },
    { name: 'Boutique Inn', revenue: 234567.89, orders: 2345, growth: 10.2 },
    { name: 'City Suites', revenue: 198765.43, orders: 1987, growth: 5.7 },
    { name: 'Beach Resort', revenue: 178945.67, orders: 1789, growth: 18.3 }
  ],
  topProducts: [
    { name: 'Premium Coffee', sales: 2345, revenue: 11678.90, growth: 25.4 },
    { name: 'Deluxe Breakfast', sales: 1890, revenue: 28345.67, growth: 12.8 },
    { name: 'Spa Package', sales: 1456, revenue: 87345.23, growth: 15.6 },
    { name: 'Room Service', sales: 3456, revenue: 34567.89, growth: 8.9 },
    { name: 'Weekend Package', sales: 890, revenue: 89012.34, growth: 20.1 }
  ],
  revenueOverTime: [
    { date: '2025-01', revenue: 98765.43, orders: 987 },
    { date: '2025-02', revenue: 102345.67, orders: 1023 },
    { date: '2025-03', revenue: 115678.90, orders: 1156 },
    { date: '2025-04', revenue: 123456.78, orders: 1234 },
    { date: '2025-05', revenue: 134567.89, orders: 1345 },
    { date: '2025-06', revenue: 145678.90, orders: 1456 },
    { date: '2025-07', revenue: 156789.01, orders: 1567 },
    { date: '2025-08', revenue: 167890.12, orders: 1678 },
    { date: '2025-09', revenue: 178901.23, orders: 1789 },
    { date: '2025-10', revenue: 189012.34, orders: 1890 },
    { date: '2025-11', revenue: 195678.90, orders: 1956 }
  ],
  customerSegments: [
    { segment: 'Luxury', percentage: 35, revenue: 438711.66 },
    { segment: 'Business', percentage: 28, revenue: 351169.33 },
    { segment: 'Family', percentage: 22, revenue: 276075.90 },
    { segment: 'Budget', percentage: 15, revenue: 188933.57 }
  ],
  ordersByStatus: [
    { status: 'Completed', count: 12567, percentage: 80.2 },
    { status: 'In Progress', count: 2345, percentage: 14.9 },
    { status: 'Cancelled', count: 766, percentage: 4.9 }
  ]
};