import React from 'react';
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
import { mockDashboardData } from '../../data/mockDashboardData';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardSection: React.FC<SectionProps> = ({ userId }) => {
  const {
    overview,
    revenueByHotel,
    topProducts,
    revenueOverTime,
    customerSegments,
    ordersByStatus
  } = mockDashboardData;

  return (
    <div className="p-6 space-y-6">
      <AdminHeader title="Dashboard" subtitle="Overview & quick insights" />
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              overview.growthRate >= 0 
                ? 'bg-green-400 bg-opacity-20 text-green-100' 
                : 'bg-red-400 bg-opacity-20 text-red-100'
            }`}>
              {overview.growthRate >= 0 ? '+' : ''}{overview.growthRate}%
            </span>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            ${overview.totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center text-indigo-100">
            <span className="text-sm">From {overview.totalOrders.toLocaleString()} orders</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Active Hotels</h3>
          <p className="text-4xl font-bold text-white mb-2">
            {overview.activeHotels}
          </p>
          <div className="flex items-center text-blue-100">
            <span className="text-sm">Avg. ${overview.avgOrderValue.toFixed(2)} per order</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Total Customers</h3>
          <p className="text-4xl font-bold text-white mb-2">
            {overview.totalCustomers.toLocaleString()}
          </p>
          <div className="flex items-center text-violet-100">
            <span className="text-sm">Across all hotels</span>
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-indigo-100 dark:border-indigo-900"
      >
        <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Revenue Trends
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
              <XAxis dataKey="date" stroke="#6366F1" />
              <YAxis stroke="#6366F1" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #6366F1' }} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#colorGradient)" 
                strokeWidth={3}
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, fill: '#818CF8' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
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
          className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-blue-100 dark:border-blue-900"
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Hotel Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByHotel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FF" />
                <XAxis dataKey="name" stroke="#2563EB" />
                <YAxis stroke="#2563EB" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #2563EB' }} />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {revenueByHotel.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#3B82F6', '#60A5FA', '#93C5FD'][index % 3]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-violet-100 dark:border-violet-900"
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Customer Segments
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                >
                  {customerSegments.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #7C3AED' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl overflow-hidden border border-indigo-100 dark:border-indigo-900"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Top Products
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-200 dark:divide-indigo-800">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100 dark:divide-indigo-800">
                {topProducts.map((product, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {product.sales.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                        product.growth >= 0 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                          : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      }`}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Order Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {ordersByStatus.map((status, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${
              index === 0
                ? 'from-violet-500 to-purple-600'
                : index === 1
                ? 'from-blue-500 to-indigo-600'
                : 'from-cyan-500 to-blue-600'
            } rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-200`}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{status.status}</h3>
            <p className="text-4xl font-bold text-white mb-2">
              {status.count.toLocaleString()}
            </p>
            <div className="flex items-center text-white/80">
              <span className="text-sm">
                {status.percentage}% of total orders
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardSection;