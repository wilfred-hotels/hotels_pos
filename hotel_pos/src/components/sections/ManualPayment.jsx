import React, { useState } from 'react';
import { getOrderByCode } from '../../actions/orders';
import { createCashPayment } from '../../actions/payments';
import toast from 'react-hot-toast';

export default function ManualPayment({ onCreate }) {
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const lookup = async () => {
    if (!code) return;
    setLookupLoading(true);
    try {
      const data = await getOrderByCode(code);
      const order = data && data.id ? data : data?.data || null;
      if (!order) {
        toast.error('Order not found');
        setAmount('');
        setFoundOrder(null);
      } else {
        const value = order.total ?? order.amount ?? 0;
        setAmount(String(value));
        // store the found order so we can use item-level orderId when creating cash payment
        setFoundOrder(order);
        toast.success('Order found — amount autofilled');
      }
    } catch (err) {
      console.error('Lookup failed', err);
      toast.error('Lookup failed');
    } finally {
      setLookupLoading(false);
    }
  };

  const computeChange = () => {
    const a = Number(amount || 0);
    const p = Number(paid || 0);
    if (isNaN(a) || a <= 0) return null;
    if (isNaN(p)) return null;
    const diff = Number((p - a).toFixed(2));
    return diff;
  };

  const submit = async () => {
    const a = Number(amount || 0);
    const p = Number(paid || 0);
    if (!a || a <= 0) {
      toast.error('Invalid amount');
      return;
    }
    if (isNaN(p) || p < 0) {
      toast.error('Enter the cash provided');
      return;
    }

    const diff = computeChange();
    const paidInFull = diff >= 0;

    // prefer orderId from one of the items if a found order exists
    let orderIdToUse = '';
    let userIdToUse = undefined;
    if (foundOrder) {
      orderIdToUse = (foundOrder.items && foundOrder.items.length > 0 && (foundOrder.items[0].orderId || foundOrder.items[0].orderId)) || foundOrder.id || '';
      userIdToUse = foundOrder.user?.id || foundOrder.userId || undefined;
    } else {
      orderIdToUse = code || '';
    }

    const payload = {
      orderId: orderIdToUse,
      amount: a,
    };
    if (userIdToUse) payload.userId = userIdToUse;

    // include optional user/hotel ids when available in localStorage
    try {
      const maybeUser = typeof window !== 'undefined' && (localStorage.getItem('user_id') || localStorage.getItem('userId'));
      const maybeHotel = typeof window !== 'undefined' && (localStorage.getItem('hotel_id') || localStorage.getItem('hotelId'));
      if (maybeUser) payload.userId = maybeUser;
      if (maybeHotel) payload.hotelId = maybeHotel;
    } catch (e) {
      // ignore
    }

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const res = await createCashPayment(token, payload);

      // build payment object for UI. prefer server returned payment if present
      const serverPayment = res?.payment || res?.data || null;

      const newPayment = serverPayment
        ? {
            id: serverPayment.id || `PAY${Date.now()}`,
            timestamp: serverPayment.timestamp || new Date().toISOString(),
            amount: serverPayment.amount ?? a,
            method: serverPayment.method || 'cash',
            status: serverPayment.status || (paidInFull ? 'success' : 'partial'),
            category: serverPayment.category || 'manual',
            customer: serverPayment.customer || { name: 'Customer', phone: '' },
            orderRef: serverPayment.orderRef || code || `ORD${Date.now()}`,
            receiptNumber: serverPayment.receiptNumber || `RC${Date.now()}`,
            paidAmount: p,
            change: paidInFull ? diff : 0,
            balance: !paidInFull ? Math.abs(diff) : 0,
            raw: res,
          }
        : {
            id: `PAY${Date.now()}`,
            timestamp: new Date().toISOString(),
            amount: a,
            method: 'cash',
            status: paidInFull ? 'success' : 'partial',
            category: 'manual',
            customer: { name: 'Customer', phone: '' },
            orderRef: code || `ORD${Date.now()}`,
            receiptNumber: `RC${Date.now()}`,
            paidAmount: p,
            change: paidInFull ? diff : 0,
            balance: !paidInFull ? Math.abs(diff) : 0,
            raw: res,
          };

      if (typeof onCreate === 'function') onCreate(newPayment);

      toast.success(paidInFull ? `Payment successful — change: KSh ${newPayment.change}` : `Partial payment recorded — balance: KSh ${newPayment.balance}`);

  setCode('');
  setAmount('');
  setPaid('');
  setFoundOrder(null);
    } catch (err) {
      console.error('Failed to create payment', err);
      const msg = err?.message || 'Failed to record payment';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const diff = computeChange();

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 text-center">
        💵 Manual Payment Entry
      </h2>

      {/* Form grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT column */}
        <div className="space-y-6">
          {/* Lookup and Amount aligned */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Order Reference & Amount
            </label>

            <div className="grid grid-cols-[1fr_120px] gap-2">
              {/* Input section */}
              <div className="flex flex-col gap-3">
                {/* Order Ref */}
                <input
                  type="text"
                  placeholder="Enter order code (e.g. ORD12345)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') lookup(); }}
                  className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

                {/* Amount (same width) */}
                <input
                  type="text"
                  readOnly
                  value={amount}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Lookup button (reduced size) */}
              <button
                onClick={lookup}
                disabled={!code || lookupLoading}
                className="h-12 px-3 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow hover:shadow-lg hover:scale-105 transition disabled:opacity-60 flex items-center justify-center"
              >
                {lookupLoading ? '...' : 'Lookup'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Money Provided (KSh)
            </label>
            <input
              type="number"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />

            {diff !== null && (
              <div
                className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  diff >= 0
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}
              >
                {diff >= 0
                  ? `✅ Change to give: KSh ${diff}`
                  : `⚠️ Balance remaining: KSh ${Math.abs(diff)}`}
              </div>
            )}
          </div>

          <button
            onClick={submit}
            disabled={loading || !amount}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? 'Processing...' : '💰 Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
