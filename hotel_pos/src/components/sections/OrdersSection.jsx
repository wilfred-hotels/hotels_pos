import React, { useEffect, useState } from 'react';
import { listOrders } from '../../actions/orders';

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const hid =
        typeof window !== 'undefined'
          ? localStorage.getItem('hotel_id') || localStorage.getItem('hotelId')
          : null;

      if (hid) {
        const data = await listOrders({ hotelId: hid });
        const arr = Array.isArray(data) ? data : data?.data || [];
        setOrders(arr);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 p-2">
      {/* Filter Section */}
      <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
        <input
          type="date"
          className="px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:ring-blue-500/50 w-48 transition-all duration-300"
        />
        <input
          placeholder="Room # / Source"
          className="px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:ring-blue-500/50 w-40 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-300"
        />
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 overflow-hidden relative">
        <div className="flex items-center gap-2 p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Orders Dashboard
            </span>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/80">
              <tr>
                <th className="p-4 text-left font-semibold">Code</th>
                <th className="p-4 text-left font-semibold">Source</th>
                <th className="p-4 text-left font-semibold">Created</th>
                <th className="p-4 text-left font-semibold">Total</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Items</th>
                <th className="p-4 text-left font-semibold">Product</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {(loading ? [] : Array.isArray(orders) ? orders : []) .map((s) => (
                <React.Fragment key={s.id}>
                  <tr
                    onClick={() =>
                      setExpanded(expanded === s.id ? null : s.id)
                    }
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="p-4 text-slate-600 dark:text-slate-400">{s?.code ?? '-'}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{s?.source ?? '-'}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{s?.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">${Number(s.total ?? 0).toFixed(2)}</td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        s?.status === 'paid'
                          ? 'bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm shadow-green-500/20'
                          : 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 shadow-sm shadow-yellow-500/20'
                      }`}>{s?.status === 'paid' ? 'Paid' : 'Not Paid'}</div>
                    </td>
                    <td className="p-4">{Array.isArray(s?.items) ? s.items.length : 0} items</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{Array.isArray(s?.items) && s.items[0]?.product?.name ? s.items[0].product.name : '-'}</td>
                  </tr>

                  {expanded === s.id && (
                    <tr className="bg-slate-50/60 dark:bg-slate-800/60">
                      <td colSpan={5} className="p-4">
                        <div className="space-y-3">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Items in this order:
                          </div>
                          {(Array.isArray(s?.items) ? s.items : []).map((item) => {
                            const name = item?.product?.name || item?.productId || 'Unknown';
                            const qty = item?.quantity ?? 0;
                            const pricePresent = item?.product && (item.product.price !== undefined && item.product.price !== null);
                            const priceText = pricePresent ? `$${Number(item.product.price).toFixed(2)}` : '';
                            return (
                              <div
                                key={item?.id || Math.random()}
                                className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-semibold text-slate-700 dark:text-slate-200">{name}</div>
                                  <div className="text-sm text-slate-500">Qty: {qty}</div>
                                </div>
                                {pricePresent ? (
                                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{priceText}</span>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-500 dark:text-slate-400">
          Showing {orders.length} orders • Updated just now
        </div>
      </div>
    </div>
  );
}
