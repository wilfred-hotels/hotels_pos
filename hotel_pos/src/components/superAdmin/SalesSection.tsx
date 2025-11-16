import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  hotelId: string;
}

interface Product {
  name: string;
  revenue: number;
  quantity: number;
}

interface HotelPerformance {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  topProducts: Product[];
  value?: number; // For pie chart compatibility
}

// Mock data - replace with actual API calls
const mockSalesData: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2025, 10, i + 1).toISOString().split('T')[0],
  revenue: Math.random() * 10000 + 5000,
  orders: Math.floor(Math.random() * 100 + 50),
  hotelId: ['hotel1', 'hotel2', 'hotel3'][Math.floor(Math.random() * 3)]
}));

const mockHotelPerformance: HotelPerformance[] = [
  {
    id: 'hotel1',
    name: 'Grand Hotel',
    revenue: 150000,
    orders: 1200,
    averageOrderValue: 125,
    value: 150000, // For pie chart
    topProducts: [
      { name: 'Premium Coffee', revenue: 15000, quantity: 500 },
      { name: 'Breakfast Set', revenue: 12000, quantity: 300 },
      { name: 'Room Service', revenue: 10000, quantity: 200 },
    ]
  },
  {
    id: 'hotel2',
    name: 'Seaside Resort',
    revenue: 180000,
    orders: 1500,
    averageOrderValue: 120,
    value: 180000, // For pie chart
    topProducts: [
      { name: 'Seafood Dinner', revenue: 20000, quantity: 400 },
      { name: 'Spa Package', revenue: 15000, quantity: 150 },
      { name: 'Beach Service', revenue: 12000, quantity: 300 },
    ]
  },
  {
    id: 'hotel3',
    name: 'City Center Hotel',
    revenue: 200000,
    orders: 2000,
    averageOrderValue: 100,
    value: 200000, // For pie chart
    topProducts: [
      { name: 'Business Lunch', revenue: 25000, quantity: 1000 },
      { name: 'Conference Room', revenue: 20000, quantity: 100 },
      { name: 'Executive Suite', revenue: 18000, quantity: 50 },
    ]
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const SalesSection: React.FC<SectionProps> = ({ userId }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedHotel, setSelectedHotel] = useState<string>('all');

  // Calculate total metrics
  const totalRevenue = mockHotelPerformance.reduce((sum, hotel) => sum + hotel.revenue, 0);
  const totalOrders = mockHotelPerformance.reduce((sum, hotel) => sum + hotel.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  // Calculate growth (mock values)
  const revenueGrowth = 15.2;
  const ordersGrowth = 8.7;

  return (
    <div className="p-6 space-y-6">
      <AdminHeader title="Sales" subtitle="Revenue & orders analytics" />
      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="space-x-4">
          <select
            className="rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <select
            className="rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
          >
            <option value="all">All Hotels</option>
            {mockHotelPerformance.map(hotel => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
        </div>

        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg">
          Download Report
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
            <span className={`text-sm px-3 py-1 rounded-full ${
              revenueGrowth >= 0 
                ? 'bg-green-400 bg-opacity-20 text-green-100' 
                : 'bg-red-400 bg-opacity-20 text-red-100'
            }`}>
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}%
            </span>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-indigo-100">
            Last 30 days
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Orders</h3>
            <span className={`text-sm px-3 py-1 rounded-full ${
              ordersGrowth >= 0 
                ? 'bg-green-400 bg-opacity-20 text-green-100' 
                : 'bg-red-400 bg-opacity-20 text-red-100'
            }`}>
              {ordersGrowth >= 0 ? '+' : ''}{ordersGrowth}%
            </span>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {totalOrders.toLocaleString()}
          </p>
          <p className="text-sm text-emerald-100">
            Last 30 days
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Average Order Value
          </h3>
          <p className="text-4xl font-bold text-white mb-2">
            ${averageOrderValue.toFixed(2)}
          </p>
          <p className="text-sm text-amber-100">
            Last 30 days
          </p>
        </motion.div>
      </div>

      {/* Revenue Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900 rounded-lg shadow-lg p-6 border border-indigo-100 dark:border-indigo-800"
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Revenue Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6366F1" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6366F1" />
              <YAxis stroke="#6366F1" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #818CF8',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#colorRevenue)" 
                strokeWidth={3}
                dot={{ fill: '#6366F1', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#818CF8' }}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hotel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900 rounded-lg shadow-lg p-6 border border-purple-100 dark:border-purple-800"
        >
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Hotel Revenue Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockHotelPerformance.map(hotel => ({
                    name: hotel.name,
                    value: hotel.revenue
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                >
                  {mockHotelPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[
                      'rgba(99, 102, 241, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(139, 92, 246, 0.8)'
                    ][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F5F3FF',
                    border: '1px solid #818CF8',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900 rounded-lg shadow-lg p-6 border border-emerald-100 dark:border-emerald-800"
        >
          <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Orders by Hotel
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockHotelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10B981" opacity={0.1} />
                <XAxis dataKey="name" stroke="#10B981" />
                <YAxis stroke="#10B981" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F5F3FF',
                    border: '1px solid #818CF8',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="url(#colorOrders)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900 rounded-lg shadow-lg overflow-hidden border border-amber-100 dark:border-amber-800"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Top Selling Products
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200 dark:divide-amber-700">
              <thead className="bg-amber-50 dark:bg-amber-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                    Avg. Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-amber-200 dark:divide-amber-700">
                {mockHotelPerformance[0].topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900 dark:text-amber-100">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800 dark:text-amber-200">
                      <span className="font-semibold text-amber-700 dark:text-amber-300">$</span>
                      {product.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800 dark:text-amber-200">
                      {product.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-800 dark:text-amber-200">
                      <span className="font-semibold text-amber-700 dark:text-amber-300">$</span>
                      {(product.revenue / product.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesSection;