import React from 'react';

export default function InventorySection(){
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Inventory</h2>
        <button className="px-3 py-2 rounded bg-indigo-600 text-white">Add Stock</button>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
        <p className="text-sm text-gray-500">Inventory table and charts will appear here.</p>
      </div>
    </div>
  )
}
