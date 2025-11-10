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

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

interface Product {
  id: string;
  name: string;
  hotelId: string;
  hotelName: string;
  category: string;
  price: number;
  isAvailable: boolean;
  tags: string[];
  description: string;
  imageUrl: string;
  inventory: number;
  createdAt: string;
}

interface FilterState {
  name: string;
  hotelId: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  isAvailable: boolean | null;
  tags: string[];
  sortBy: 'price' | 'name' | 'createdAt';
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

// Mock data - replace with actual API calls
const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: `prod${i + 1}`,
  name: ['Deluxe Coffee', 'Breakfast Set', 'Room Service', 'Spa Package', 'Business Lunch'][Math.floor(Math.random() * 5)],
  hotelId: `hotel${Math.floor(Math.random() * 3) + 1}`,
  hotelName: ['Grand Hotel', 'Plaza Inn', 'Seaside Resort'][Math.floor(Math.random() * 3)],
  category: ['Food', 'Beverage', 'Service', 'Amenity'][Math.floor(Math.random() * 4)],
  price: Math.random() * 100 + 10,
  isAvailable: Math.random() > 0.2,
  tags: ['premium', 'popular', 'seasonal', 'special'].slice(0, Math.floor(Math.random() * 3) + 1),
  description: 'Product description here',
  imageUrl: 'https://example.com/image.jpg',
  inventory: Math.floor(Math.random() * 100),
  createdAt: new Date(2025, 10, Math.floor(Math.random() * 30) + 1).toISOString()
}));

const categories = [...new Set(mockProducts.map(p => p.category))];
const hotels = [...new Set(mockProducts.map(p => ({ id: p.hotelId, name: p.hotelName })))];
const allTags = [...new Set(mockProducts.flatMap(p => p.tags))];

const COLORS = {
  primary: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6'
};

const ProductsSection: React.FC<SectionProps> = ({ userId }) => {
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    hotelId: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    isAvailable: null,
    tags: [],
    sortBy: 'name',
    sortOrder: SortOrder.ASC,
    page: 1,
    limit: 10
  });

  const filteredProducts = mockProducts.filter(product => {
    const matchesName = !filters.name || product.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesHotel = !filters.hotelId || product.hotelId === filters.hotelId;
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
    const matchesAvailability = filters.isAvailable === null || product.isAvailable === filters.isAvailable;
    const matchesTags = filters.tags.length === 0 || filters.tags.every(tag => product.tags.includes(tag));
    
    return matchesName && matchesHotel && matchesCategory && matchesMinPrice && 
           matchesMaxPrice && matchesAvailability && matchesTags;
  }).sort((a, b) => {
    const sortOrder = filters.sortOrder === SortOrder.ASC ? 1 : -1;
    switch (filters.sortBy) {
      case 'price':
        return (a.price - b.price) * sortOrder;
      case 'name':
        return a.name.localeCompare(b.name) * sortOrder;
      case 'createdAt':
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortOrder;
      default:
        return 0;
    }
  });

  const paginatedProducts = filteredProducts.slice(
    (filters.page - 1) * filters.limit,
    filters.page * filters.limit
  );

  const totalPages = Math.ceil(filteredProducts.length / filters.limit);

  // Calculate metrics
  const metrics = {
    totalProducts: filteredProducts.length,
    totalValue: filteredProducts.reduce((sum, product) => sum + product.price * product.inventory, 0),
    averagePrice: filteredProducts.reduce((sum, product) => sum + product.price, 0) / filteredProducts.length,
    outOfStock: filteredProducts.filter(product => product.inventory === 0).length
  };

  return (
    <div className="p-6 space-y-6">
      <AdminHeader title="Products" subtitle="Manage products across hotels" />
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-white">
            {metrics.totalProducts.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Total Inventory Value</h3>
          <p className="text-3xl font-bold text-white">
            ${metrics.totalValue.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Average Price</h3>
          <p className="text-3xl font-bold text-white">
            ${metrics.averagePrice.toFixed(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-white">
            {metrics.outOfStock.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search by Name
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Search products..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hotel
            </label>
            <select
              value={filters.hotelId}
              onChange={(e) => setFilters({ ...filters, hotelId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="">All Hotels</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Availability
            </label>
            <select
              value={filters.isAvailable === null ? '' : filters.isAvailable.toString()}
              onChange={(e) => setFilters({ ...filters, isAvailable: e.target.value === '' ? null : e.target.value === 'true' })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Min price..."
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              placeholder="Max price..."
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'price' | 'name' | 'createdAt' })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="createdAt">Date Added</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as SortOrder })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <option value={SortOrder.ASC}>Ascending</option>
              <option value={SortOrder.DESC}>Descending</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter(t => t !== tag)
                    : [...filters.tags, tag];
                  setFilters({ ...filters, tags: newTags });
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${filters.tags.includes(tag)
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {paginatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index % 8) }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.isAvailable
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm">
                  {product.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>

              <p className="text-purple-600 dark:text-purple-400 mb-4">
                {product.hotelName}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  product.inventory > 50
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : product.inventory > 20
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  Stock: {product.inventory}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105">
                  Edit
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hover:border-indigo-500 dark:hover:border-indigo-500">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
            disabled={filters.page === 1}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
            disabled={filters.page === totalPages}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;