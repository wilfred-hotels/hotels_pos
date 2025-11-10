import React, { useState } from 'react';
import AdminHeader from '../common/AdminHeader';

const sampleProducts = [
  { id: 1, name: 'Classic Burger', price: 8.5 },
  { id: 2, name: 'Margherita Pizza', price: 12 },
  { id: 3, name: 'Coke', price: 2.5 },
  { id: 4, name: 'Club Sandwich', price: 7 }
];

export default function SalesSection() {
  const [cart, setCart] = useState([]);

  const add = (p) => {
    setCart(prev => {
      const found = prev.find(x => x.id === p.id);
      if (found) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <AdminHeader title="Sales" subtitle="Point-of-sale & orders" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 flex-1">
        {sampleProducts.map(p => (
          <button key={p.id} onClick={() => add(p)} className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow hover:scale-105 transition-transform">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">${p.price.toFixed(2)}</div>
          </button>
        ))}
      </div>

      <aside className="w-full lg:w-96 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Cart</h3>
        <div className="divide-y">
          {cart.length === 0 && <div className="text-sm text-gray-500">No items</div>}
          {cart.map(i => (
            <div key={i.id} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-xs text-gray-400">Qty: {i.qty}</div>
              </div>
              <div className="font-semibold">${(i.price * i.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between font-bold">Total <span>${total}</span></div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded px-3 py-2">Checkout</button>
          <button className="bg-gray-100 dark:bg-slate-700 rounded px-3 py-2">Hold</button>
        </div>
      </aside>
    </div>
  );
}
