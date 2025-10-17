import React from 'react';

const sample = [
  { id: 342, room: 401, total: '$18.50', status: 'paid', waiter: 'John', date: '2025-10-17' },
  { id: 341, room: 210, total: '$25.00', status: 'pending', waiter: 'Sara', date: '2025-10-17' }
];

export default function OrdersSection(){
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input type="date" className="p-2 border rounded" />
        <input placeholder="Room #" className="p-2 border rounded" />
        <button className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded">Filter</button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500">
            <tr><th className="p-3">Order</th><th>Room</th><th>Total</th><th>Status</th><th>Waiter</th></tr>
          </thead>
          <tbody>
            {sample.map(s => (
              <tr key={s.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-3">#{s.id}</td>
                <td>{s.room}</td>
                <td>{s.total}</td>
                <td><span className={`px-2 py-1 rounded ${s.status==='paid'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
                <td>{s.waiter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
