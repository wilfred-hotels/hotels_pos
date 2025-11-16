
import React, { useState, useEffect } from 'react';
import AdminHeader from '../common/AdminHeader';

export default function ReportsSection() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last30');
  const [activeHotel, setActiveHotel] = useState('all');
  const [exporting, setExporting] = useState(false);

  // Simulate API calls
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };
    loadData();
  }, [dateRange, activeHotel]);

  // Dummy data generators
  const generateRevenueData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 5000) + 2000,
      roomPayments: Math.floor(Math.random() * 4000) + 1500,
      extraServices: Math.floor(Math.random() * 2000) + 500,
      clients: Math.floor(Math.random() * 50) + 20
    }));
  };

  const generatePaymentMethods = () => [
    { method: 'Credit Card', value: 45, color: 'from-blue-500 to-cyan-500' },
    { method: 'Mobile Pay', value: 25, color: 'from-green-500 to-emerald-500' },
    { method: 'Cash', value: 15, color: 'from-yellow-500 to-amber-500' },
    { method: 'Bank Transfer', value: 10, color: 'from-purple-500 to-pink-500' },
    { method: 'Other', value: 5, color: 'from-gray-500 to-slate-500' }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$42,850',
      change: '+12.5%',
      icon: '💰',
      description: 'From all sections'
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '+5.2%',
      icon: '🏨',
      description: 'Average room occupancy'
    },
    {
      title: 'ADR',
      value: '$156',
      change: '+3.1%',
      icon: '📊',
      description: 'Average Daily Rate'
    },
    {
      title: 'RevPAR',
      value: '$122',
      change: '+8.7%',
      icon: '📈',
      description: 'Revenue Per Available Room'
    },
    {
      title: 'Client Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      icon: '⭐',
      description: 'Based on 284 reviews'
    },
    {
      title: 'Extra Revenue',
      value: '$8,420',
      change: '+15.3%',
      icon: '🍽️',
      description: 'Services & amenities'
    }
  ];

  const handleExport = async (format) => {
    setExporting(format);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExporting(false);
    // In real app, trigger download
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hotel Reports
          </h2>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <AdminHeader title="Reports" subtitle="Performance & exports" />
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hotel Performance Reports
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive analytics across all hotel sections and services
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
          >
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          <select 
            value={activeHotel}
            onChange={(e) => setActiveHotel(e.target.value)}
            className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
          >
            <option value="all">All Sections</option>
            <option value="main">Main Building</option>
            <option value="villas">Villas</option>
            <option value="suites">Executive Suites</option>
          </select>

          <div className="flex gap-2">
            <button 
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {exporting === 'pdf' ? '⏳' : '📄'} PDF
            </button>
            <button 
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {exporting === 'csv' ? '⏳' : '📊'} CSV
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                  {metric.icon}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {metric.title}
                </div>
              </div>
              <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
              {metric.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {generateRevenueData().map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ height: `${(day.revenue / 7000) * 100}%` }}
                  title={`$${day.revenue} - ${day.date}`}
                ></div>
                <div className="text-xs text-slate-500 mt-1">
                  {i % 5 === 0 ? day.date.split('-')[2] : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Payment Methods</h3>
          <div className="h-64 flex flex-col justify-center">
            {generatePaymentMethods().map((payment, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${payment.color}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300">{payment.method}</span>
                    <span className="font-medium">{payment.value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${payment.color} transition-all duration-1000`}
                      style={{ width: `${payment.value}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">142</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Rooms Booked</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
          <div className="text-sm text-green-700 dark:text-green-300">Active Clients</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">327</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Services Used</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">4.8</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">Avg. Rating</div>
        </div>
      </div>
    </div>
  );
}