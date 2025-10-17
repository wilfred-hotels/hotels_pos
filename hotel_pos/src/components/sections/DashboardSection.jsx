import React from 'react';

const KPI = ({ title, value, subtitle, gradient }) => (
  <div className={`p-4 rounded-xl shadow-md text-white ${gradient}`}>
    <div className="text-sm font-medium opacity-90">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
    {subtitle && <div className="text-xs opacity-80 mt-1">{subtitle}</div>}
  </div>
);

const RecentItem = ({ text, time }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <div className="text-sm">{text}</div>
    <div className="text-xs text-gray-400">{time}</div>
  </div>
);

export default function DashboardSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Revenue Today" value="$1,420" subtitle="+8% vs yesterday" gradient="bg-gradient-to-r from-blue-600 to-indigo-600" />
        <KPI title="Active Rooms" value="78" subtitle="12 check-ins" gradient="bg-gradient-to-r from-teal-500 to-cyan-600" />
        <KPI title="Bookings" value="24" subtitle="5 pending" gradient="bg-gradient-to-r from-purple-600 to-pink-500" />
        <KPI title="Low Stock" value="7" subtitle="Needs restock" gradient="bg-gradient-to-r from-orange-500 to-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Revenue (Last 7 days)</h3>
          <div className="h-48 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded"></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="divide-y">
            <RecentItem text="Order #342 completed" time="2m ago" />
            <RecentItem text="Room 401 checked in" time="10m ago" />
            <RecentItem text="Low stock alert: Milk" time="30m ago" />
          </div>
        </div>
      </div>
    </div>
  );
}
