import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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

interface ReportType {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'inventory' | 'performance';
  lastGenerated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  status: 'available' | 'generating' | 'scheduled';
  dataPoints?: number;
  formats?: string[];
}

// Mock data - replace with actual API calls
const mockReports: ReportType[] = [
  {
    id: 'fin-rev-001',
    name: 'Revenue Analysis Report',
    description: 'Detailed analysis of revenue streams across all hotels',
    category: 'financial',
    lastGenerated: '2025-11-09T10:00:00Z',
    frequency: 'daily',
    status: 'available',
    dataPoints: 523,
    formats: ['pdf', 'xlsx', 'csv']
  },
  {
    id: 'op-perf-001',
    name: 'Operational Performance Report',
    description: 'Key performance indicators for hotel operations',
    category: 'operational',
    lastGenerated: '2025-11-08T10:00:00Z',
    frequency: 'weekly',
    status: 'available',
    dataPoints: 342,
    formats: ['pdf', 'xlsx']
  },
  {
    id: 'inv-stock-001',
    name: 'Inventory Status Report',
    description: 'Current stock levels and reorder recommendations',
    category: 'inventory',
    lastGenerated: '2025-11-09T10:00:00Z',
    frequency: 'daily',
    status: 'generating'
  },
  // Add more reports...
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const ReportsSection: React.FC<SectionProps> = ({ userId }) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportType['category'] | 'all'>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<ReportType['frequency'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: string) => {
    try {
      setDownloading(format);
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Report downloaded in ${format.toUpperCase()} format`);
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const filteredReports = mockReports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesFrequency = selectedFrequency === 'all' || report.frequency === selectedFrequency;
    const matchesSearch = searchTerm === '' || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesFrequency && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <AdminHeader title="Reports" subtitle="Generate & download reports" />
      {/* Filters and Controls */}
      <div className="grid gap-4 md:flex md:flex-wrap md:items-center md:gap-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
        </div>

        <select
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ReportType['category'] | 'all')}
        >
          <option value="all">All Categories</option>
          <option value="financial">Financial</option>
          <option value="operational">Operational</option>
          <option value="inventory">Inventory</option>
          <option value="performance">Performance</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value as ReportType['frequency'] | 'all')}
        >
          <option value="all">All Frequencies</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Create Custom Report
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${
                    report.status === 'available' ? 'bg-green-500' :
                    report.status === 'generating' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {report.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {report.frequency}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                {report.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {report.description}
              </p>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Last Generated: {new Date(report.lastGenerated).toLocaleString()}
              </div>

              <div className="flex space-x-3">
                <button 
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  disabled={report.status === 'generating'}
                >
                  Generate Now
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="bg-gradient-to-br from-emerald-400/20 to-teal-600/20 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">Analytics Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">Report Generation Trends</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Financial', count: 45 },
                    { name: 'Operational', count: 32 },
                    { name: 'Inventory', count: 28 },
                    { name: 'Performance', count: 36 }
                  ]}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">Report Categories</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Financial', value: 35 },
                      { name: 'Operational', value: 25 },
                      { name: 'Inventory', value: 20 },
                      { name: 'Performance', value: 20 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#10B981"
                    dataKey="value"
                  >
                    {mockReports.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-gradient-to-br from-emerald-400/20 to-teal-600/20 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">Download Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
            <motion.button
              key={format}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
              onClick={() => handleDownload(format.toLowerCase())}
            >
              <span className="text-emerald-600 dark:text-emerald-400">{format}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/10 rounded-xl shadow-lg overflow-hidden border border-emerald-100 dark:border-emerald-800">
        <div className="p-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">Recent Reports</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-200 dark:divide-emerald-700">
              <thead className="bg-emerald-50 dark:bg-emerald-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockReports.slice(0, 5).map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {report.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.lastGenerated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-sm ${
                        report.status === 'available' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Download
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Schedule Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Scheduled Reports</h3>
        <div className="space-y-4">
          {mockReports.filter(r => r.status === 'scheduled').map((report) => (
            <div key={report.id} className="flex items-center justify-between py-2 border-b dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{report.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next generation: {new Date(report.lastGenerated).toLocaleDateString()}
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Edit Schedule
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsSection;