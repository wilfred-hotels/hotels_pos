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

interface Order {
  id: string;
  hotelId: string;
  hotelName: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface OrderMetrics {
  totalOrders: number;
  totalValue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

// Mock data - replace with actual API calls
const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
  id: `order${i + 1}`,
  hotelId: `hotel${Math.floor(Math.random() * 3) + 1}`,
  hotelName: ['Grand Hotel', 'Plaza Inn', 'Seaside Resort'][Math.floor(Math.random() * 3)],
  status: ['pending', 'processing', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as Order['status'],
  totalAmount: Math.random() * 500 + 100,
  items: [
    {
      productId: 'prod1',
      name: 'Premium Coffee',
      quantity: Math.floor(Math.random() * 5) + 1,
      price: 4.99
    },
    {
      productId: 'prod2',
      name: 'Breakfast Set',
      quantity: Math.floor(Math.random() * 3) + 1,
      price: 15.99
    }
  ],
  createdAt: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toISOString(),
  updatedAt: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toISOString()
}));

const calculateMetrics = (orders: Order[]): OrderMetrics => {
  return {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    averageOrderValue: orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    processingOrders: orders.filter(order => order.status === 'processing').length,
    completedOrders: orders.filter(order => order.status === 'completed').length,
    cancelledOrders: orders.filter(order => order.status === 'cancelled').length
  };
};

const OrdersSection: React.FC<SectionProps> = ({ userId }) => {
  const [selectedHotel, setSelectedHotel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = mockOrders.filter(order => {
    const matchesHotel = selectedHotel === 'all' || order.hotelId === selectedHotel;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.hotelName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesHotel && matchesStatus && matchesSearch;
  });

  const metrics = calculateMetrics(filteredOrders);

  // Prepare data for charts
  const statusDistribution = [
    { name: 'Pending', value: metrics.pendingOrders },
    { name: 'Processing', value: metrics.processingOrders },
    { name: 'Completed', value: metrics.completedOrders },
    { name: 'Cancelled', value: metrics.cancelledOrders }
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminHeader title="Orders" subtitle="Order management & fulfillment" />
      {/* Filters and Controls */}
      <div className="grid gap-4 md:flex md:flex-wrap md:items-center md:gap-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <select
          className="px-4 py-2 rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
        >
          <option value="all">All Hotels</option>
          <option value="hotel1">Grand Hotel</option>
          <option value="hotel2">Plaza Inn</option>
          <option value="hotel3">Seaside Resort</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Order['status'] | 'all')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg">
          Export Orders
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Orders</h3>
          <p className="text-4xl font-bold text-white">
            {metrics.totalOrders.toLocaleString()}
          </p>
          <div className="mt-2 text-violet-200">
            Daily Volume Tracking
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Value</h3>
          <p className="text-4xl font-bold text-white">
            ${metrics.totalValue.toLocaleString()}
          </p>
          <div className="mt-2 text-blue-200">
            Revenue Generated
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Avg. Order Value</h3>
          <p className="text-4xl font-bold text-white">
            ${metrics.averageOrderValue.toFixed(2)}
          </p>
          <div className="mt-2 text-emerald-200">
            Per Transaction
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Pending Orders</h3>
          <p className="text-4xl font-bold text-white">
            {metrics.pendingOrders.toLocaleString()}
          </p>
          <div className="mt-2 text-amber-200">
            Awaiting Processing
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-purple-100 dark:border-purple-900"
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Order Status Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #8B5CF6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-indigo-100 dark:border-indigo-900"
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Orders by Hotel
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockOrders.reduce((acc, order) => {
                const hotel = acc.find(h => h.name === order.hotelName);
                if (hotel) {
                  hotel.orders++;
                } else {
                  acc.push({ name: order.hotelName, orders: 1 });
                }
                return acc;
              }, [] as { name: string; orders: number }[])}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                <XAxis dataKey="name" stroke="#6366F1" />
                <YAxis stroke="#6366F1" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #6366F1' }} />
                <Bar dataKey="orders" radius={[8, 8, 0, 0]}>
                  {mockOrders.reduce((acc, order) => {
                    const hotel = acc.find(h => h.name === order.hotelName);
                    if (!hotel) {
                      acc.push({ name: order.hotelName, orders: 1 });
                    }
                    return acc;
                  }, [] as { name: string; orders: number }[]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8B5CF6', '#6366F1', '#3B82F6'][index % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl overflow-hidden border border-purple-100 dark:border-purple-900"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-200 dark:divide-purple-800">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-800">
              {filteredOrders.map((order) => (
                <motion.tr 
                  key={order.id}
                  className="hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {order.hotelName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                      order.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' :
                      order.status === 'processing' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                      order.status === 'pending' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                      'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3">
                    <button className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg px-4 py-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Showing <span className="font-semibold text-purple-600">{filteredOrders.length}</span> orders
          </span>
        </div>
        <div className="space-x-3">
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Previous
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersSection;