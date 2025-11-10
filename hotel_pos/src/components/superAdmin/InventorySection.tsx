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
  Cell
} from 'recharts';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevels: {
    hotelId: string;
    hotelName: string;
    currentStock: number;
    minimumStock: number;
    maximumStock: number;
    reorderPoint: number;
    lastRestocked: string;
  }[];
  totalStock: number;
  unitPrice: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Mock data - replace with actual API calls
const mockInventoryItems: InventoryItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `item${i + 1}`,
  name: ['Coffee Beans', 'Tea Bags', 'Sugar Sachets', 'Paper Cups', 'Napkins'][i % 5],
  category: ['Beverages', 'Supplies', 'Food Items'][Math.floor(Math.random() * 3)],
  stockLevels: [
    {
      hotelId: 'hotel1',
      hotelName: 'Grand Hotel',
      currentStock: Math.floor(Math.random() * 1000),
      minimumStock: 100,
      maximumStock: 1000,
      reorderPoint: 200,
      lastRestocked: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toISOString()
    },
    {
      hotelId: 'hotel2',
      hotelName: 'Plaza Inn',
      currentStock: Math.floor(Math.random() * 1000),
      minimumStock: 100,
      maximumStock: 1000,
      reorderPoint: 200,
      lastRestocked: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toISOString()
    }
  ],
  totalStock: Math.floor(Math.random() * 2000),
  unitPrice: Math.random() * 50 + 10,
  supplier: ['Supplier A', 'Supplier B', 'Supplier C'][Math.floor(Math.random() * 3)],
  status: ['in_stock', 'low_stock', 'out_of_stock'][Math.floor(Math.random() * 3)] as InventoryItem['status']
}));

const InventorySection: React.FC<SectionProps> = ({ userId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHotel, setSelectedHotel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<InventoryItem['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalValue = filteredItems.reduce((sum, item) => sum + item.totalStock * item.unitPrice, 0);
  const lowStockItems = filteredItems.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = filteredItems.filter(item => item.status === 'out_of_stock').length;

  return (
    <div className="p-6 space-y-6">
      <AdminHeader title="Inventory" subtitle="Monitor stock & suppliers" />
      {/* Filters and Controls */}
      <div className="grid gap-4 md:flex md:flex-wrap md:items-center md:gap-6 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-emerald-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <select
          className="px-4 py-2.5 rounded-lg border-2 border-teal-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Beverages">Beverages</option>
          <option value="Supplies">Supplies</option>
          <option value="Food Items">Food Items</option>
        </select>

        <select
          className="px-4 py-2.5 rounded-lg border-2 border-cyan-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
        >
          <option value="all">All Hotels</option>
          <option value="hotel1">Grand Hotel</option>
          <option value="hotel2">Plaza Inn</option>
        </select>

        <select
          className="px-4 py-2.5 rounded-lg border-2 border-emerald-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as InventoryItem['status'] | 'all')}
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium">
          Add New Item
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Items</h3>
          <p className="text-4xl font-bold text-white">
            {filteredItems.length}
          </p>
          <div className="mt-2 text-emerald-100">
            Inventory Items Tracked
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Value</h3>
          <p className="text-4xl font-bold text-white">
            ${totalValue.toLocaleString()}
          </p>
          <div className="mt-2 text-teal-100">
            Current Stock Worth
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Low Stock Items</h3>
          <p className="text-4xl font-bold text-white">
            {lowStockItems}
          </p>
          <div className="mt-2 text-amber-100">
            Need Attention
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Out of Stock</h3>
          <p className="text-4xl font-bold text-white">
            {outOfStockItems}
          </p>
          <div className="mt-2 text-red-100">
            Critical Items
          </div>
        </motion.div>
      </div>

      {/* Stock Level Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-emerald-100 dark:border-emerald-900"
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            Stock Levels by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockInventoryItems.reduce((acc, item) => {
                const category = acc.find(c => c.name === item.category);
                if (category) {
                  category.stock += item.totalStock;
                } else {
                  acc.push({ name: item.category, stock: item.totalStock });
                }
                return acc;
              }, [] as { name: string; stock: number }[])}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F2F1" />
                <XAxis dataKey="name" stroke="#059669" />
                <YAxis stroke="#059669" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #059669' }} />
                <Bar dataKey="stock" radius={[8, 8, 0, 0]}>
                  {mockInventoryItems.reduce((acc, item) => {
                    const category = acc.find(c => c.name === item.category);
                    if (!category) {
                      acc.push({ name: item.category, stock: item.totalStock });
                    }
                    return acc;
                  }, [] as { name: string; stock: number }[]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981', '#0D9488', '#0891B2'][index % 3]} />
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
          className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-teal-100 dark:border-teal-900"
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Stock Value by Hotel
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockInventoryItems[0].stockLevels.map(hotel => ({
                name: hotel.hotelName,
                value: mockInventoryItems.reduce((sum, item) => {
                  const hotelStock = item.stockLevels.find(s => s.hotelId === hotel.hotelId);
                  return sum + (hotelStock ? hotelStock.currentStock * item.unitPrice : 0);
                }, 0)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0F7FA" />
                <XAxis dataKey="name" stroke="#0D9488" />
                <YAxis stroke="#0D9488" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid #0D9488' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {mockInventoryItems[0].stockLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0D9488', '#0891B2'][index % 2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl overflow-hidden border border-emerald-100 dark:border-emerald-900"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-200 dark:divide-emerald-800">
            <thead className="bg-gradient-to-r from-emerald-500 to-teal-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Total Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100 dark:divide-emerald-800">
              {filteredItems.map((item) => (
                <motion.tr 
                  key={item.id}
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-150"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                      {item.totalStock.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                      item.status === 'in_stock' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                        : item.status === 'low_stock' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    }`}>
                      {item.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                      ${item.unitPrice.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${(item.totalStock * item.unitPrice).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                      Transfer
                    </button>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                      Restock
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default InventorySection;