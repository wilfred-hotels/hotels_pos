import React from 'react';

const sample = [
  { id: 342, room: 401, total: '$18.50', status: 'paid', waiter: 'John', date: '2025-10-17' },
  { id: 341, room: 210, total: '$25.00', status: 'pending', waiter: 'Sara', date: '2025-10-17' }
];

export default function OrdersSection(){
  return (
    <div className="space-y-6 p-2">
  {/* Filter Section */}
  <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
    <div className="relative">
      <input 
        type="date" 
        className="px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 w-48"
      />
    </div>
    <div className="relative">
      <input 
        placeholder="Room #" 
        className="px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 w-32 placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
    </div>
    <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
      </svg>
      Filter
    </button>
  </div>

  {/* Table Section */}
  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden relative">
    {/* GitHub-style header badge */}
    <div className="flex items-center gap-2 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
        <span className="font-semibold text-slate-700 dark:text-slate-300">Orders Dashboard</span>
      </div>
      <div className="flex items-center gap-1 ml-auto text-sm text-slate-500 dark:text-slate-400">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
        </svg>
        <span>127 stars</span>
      </div>
    </div>
    
  );
}
