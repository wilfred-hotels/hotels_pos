

import React, { useState, useEffect } from 'react';

export default function InventorySection() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);

  // Generate sophisticated dummy data
  const generateInventoryData = () => {
    const categories = {
      'Food & Beverage': ['Fresh Produce', 'Beverages', 'Dairy', 'Meat & Poultry', 'Pantry Items'],
      'Housekeeping': ['Linens', 'Toiletries', 'Cleaning Supplies', 'Guest Amenities'],
      'Amenities': ['Towels', 'Robes', 'Slippers', 'Bath Products'],
      'Maintenance': ['Spare Parts', 'Tools', 'Equipment', 'Electrical'],
      'Office Supplies': ['Stationery', 'Printer Supplies', 'Forms', 'Electronics']
    };

    const suppliers = ['Global Hotel Supply', 'Premier Distributors', 'Elite Amenities Co.', 'Maintenance Pro', 'Office Essentials Ltd.'];
    
    let inventory = [];
    let id = 1;

    Object.entries(categories).forEach(([category, subcategories]) => {
      subcategories.forEach(subcategory => {
        for (let i = 0; i < 3; i++) {
          const currentStock = Math.floor(Math.random() * 100);
          const optimalStock = Math.floor(Math.random() * 50) + 30;
          const cost = (Math.random() * 50 + 5).toFixed(2);
          const usageRate = (Math.random() * 10 + 2).toFixed(1);
          
          inventory.push({
            id: id++,
            name: `${subcategory} Item ${i + 1}`,
            category,
            subcategory,
            currentStock,
            optimalStock,
            unit: 'units',
            cost: parseFloat(cost),
            value: (currentStock * cost).toFixed(2),
            supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
            usageRate: parseFloat(usageRate),
            lastOrdered: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: currentStock < optimalStock * 0.2 ? 'critical' : 
                   currentStock < optimalStock * 0.5 ? 'warning' : 
                   currentStock > optimalStock * 1.5 ? 'overstock' : 'optimal',
            reorderRecommended: currentStock < optimalStock * 0.3,
            daysUntilStockout: Math.floor(currentStock / usageRate)
          });
        }
      });
    });

    return inventory;
  };

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setInventory(generateInventoryData());
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate metrics
  const metrics = {
    totalValue: inventory.reduce((sum, item) => sum + parseFloat(item.value), 0).toFixed(2),
    lowStockItems: inventory.filter(item => item.status === 'critical' || item.status === 'warning').length,
    overstockItems: inventory.filter(item => item.status === 'overstock').length,
    totalItems: inventory.length,
    reorderRecommended: inventory.filter(item => item.reorderRecommended).length,
    inventoryHealth: ((inventory.filter(item => item.status === 'optimal').length / inventory.length) * 100).toFixed(1),
    monthlyUsage: inventory.reduce((sum, item) => sum + (item.usageRate * 30), 0).toFixed(0)
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesStock = stockFilter === 'all' || item.status === stockFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStock && matchesSearch;
  });

  const criticalItems = inventory.filter(item => item.status === 'critical');
  const warningItems = inventory.filter(item => item.status === 'warning');

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time tracking and predictive analytics for hotel inventory
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowAddStock(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Stock
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            📊 Generate Orders
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {(criticalItems.length > 0 || warningItems.length > 0) && (
        <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <span className="font-semibold text-red-700 dark:text-red-300">
                {criticalItems.length} critical items • {warningItems.length} warnings
              </span>
              <span className="text-sm text-red-600 dark:text-red-400 ml-2">
                Immediate attention required
              </span>
            </div>
            <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors">
              View All
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Value</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">${metrics.totalValue}</div>
          <div className="text-xs text-green-500 mt-1">↑ 12.3%</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Low Stock</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{metrics.lowStockItems}</div>
          <div className="text-xs text-red-500 mt-1">Attention needed</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Overstock</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{metrics.overstockItems}</div>
          <div className="text-xs text-orange-500 mt-1">Review required</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Reorder Items</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.reorderRecommended}</div>
          <div className="text-xs text-blue-500 mt-1">Suggested orders</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Health Score</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.inventoryHealth}%</div>
          <div className="text-xs text-green-500 mt-1">Optimal stock</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Monthly Usage</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.monthlyUsage}</div>
          <div className="text-xs text-purple-500 mt-1">Units consumed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
          />
        </div>
        
        <select 
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
        >
          <option value="all">All Categories</option>
          <option value="Food & Beverage">Food & Beverage</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Amenities">Amenities</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Office Supplies">Office Supplies</option>
        </select>

        <select 
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
        >
          <option value="all">All Status</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="optimal">Optimal</option>
          <option value="overstock">Overstock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 overflow-hidden">
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Inventory Items</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredInventory.length} items found • {criticalItems.length} need immediate attention
          </p>
        </div>

        <div className="overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Item</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Category</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Stock Level</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Value</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.supplier}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-slate-400">
                            {item.currentStock} / {item.optimalStock} {item.unit}
                          </span>
                          <span className="font-medium">{Math.round((item.currentStock / item.optimalStock) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.status === 'critical' ? 'bg-red-500' :
                              item.status === 'warning' ? 'bg-yellow-500' :
                              item.status === 'overstock' ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.currentStock / item.optimalStock) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse' :
                      item.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                      item.status === 'overstock' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }`}>
                      {item.status === 'critical' && '🚨 Critical'}
                      {item.status === 'warning' && '⚠️ Warning'}
                      {item.status === 'optimal' && '✅ Optimal'}
                      {item.status === 'overstock' && '📦 Overstock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">${item.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">${item.cost}/unit</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {item.reorderRecommended && (
                        <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
                          Order
                        </button>
                      )}
                      <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Fast Movers</div>
          <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">12 items need frequent restocking</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">Cost Savings</div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">$2,450 potential monthly</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Supplier Performance</div>
          <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">94% on-time delivery</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">Waste Reduction</div>
          <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">18% improvement target</div>
        </div>
      </div>
    </div>
  );
}
