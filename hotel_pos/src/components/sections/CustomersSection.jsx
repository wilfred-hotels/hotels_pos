import React from 'react';

const CustomerCard = ({name, room, total, vip}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">{name.charAt(0)}</div>
    <div className="flex-1">
      <div className="font-medium">{name} {vip && <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded text-xs">VIP</span>}</div>
      <div className="text-sm text-gray-400">Room {room} • ${total}</div>
    </div>
  </div>
);

export default function CustomersSection(){
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input placeholder="Search customers" className="flex-1 p-2 border rounded" />
        <button className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded">Search</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <CustomerCard name="John Doe" room={401} total={120} vip />
        <CustomerCard name="Jane Smith" room={210} total={80} />
        <CustomerCard name="Carlos" room={102} total={45} />
      </div>
    </div>
  )
}
