
import React, { useState, useEffect } from 'react';
import AdminHeader from '../common/AdminHeader';
import { getOrderByCode } from '../../actions/orders';
import { initiateMpesaPayment, fetchPayments } from '../../actions/payments';
import { getPaymentsSummary, getPaymentsByProvider, getPaymentsRevenue } from '../../actions/stats';
import ManualPayment from './ManualPayment';
import toast from 'react-hot-toast';

export default function PaymentsSection() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mpesa');
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [paymentsSummary, setPaymentsSummary] = useState(null);
  const [providerStats, setProviderStats] = useState([]);
  const [revenueRows, setRevenueRows] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    dateRange: 'today',
    search: ''
  });

  // M-Pesa STK Push State
  const [stkPush, setStkPush] = useState({
    phone: '',
    amount: '',
    orderId: '',
    processing: false,
    status: 'idle' // idle, processing, success, failed
  });

  const [refLoading, setRefLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState(null);

  // Manual Payment State
  const [manualPayment, setManualPayment] = useState({
    orderId: '',
    amount: '',
    customerPaid: ''
  });

  // load real stats (summary, by-provider, revenue) and fall back gracefully
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
  const fmt = (d) => d.toISOString().split('T')[0];
  // compute start/end for revenue and recent payments (first of month -> yesterday)
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - 1); // yesterday
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // first day of month
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        // fetch summary
        try {
          const summary = await getPaymentsSummary(token);
          console.log('--- PAYMENTS SUMMARY ---', summary);
          setPaymentsSummary(summary);
        } catch (err) {
          console.error('Failed to load payments summary', err);
          toast.error('Failed to load payments summary');
        }

        // fetch provider breakdown
        try {
          const providers = await getPaymentsByProvider(token);
          setProviderStats(providers || []);
        } catch (err) {
          console.error('Failed to load payments by provider', err);
          toast.error('Failed to load payments by provider');
        }

        // fetch recent revenue rows (daily) — pass explicit start and end dates (first of month -> yesterday)
        try {
          const revenue = await getPaymentsRevenue(token, 'daily', fmt(startDate), fmt(endDate));
          setRevenueRows(revenue || []);
        } catch (err) {
          console.error('Failed to load revenue rows', err);
          // non-critical, don't spam toast
        }

        // Fetch recent transactions from the payments list endpoint
        try {
          // Fetch all pages from the payments endpoint and aggregate results.
          const aggregated = [];
          const pageLimit = 200; // page size per request
          let page = 1;
          const maxPages = 50; // safety cap to avoid accidental infinite loops (50 * 200 = 10k rows)
          while (page <= maxPages) {
            // fetch one page
            // Note: fetchPayments returns either { data: [...], meta: {...} } or an array
            const resp = await fetchPayments(token, { page, limit: pageLimit, start: fmt(startDate), end: fmt(endDate) });
            const pageRows = resp?.data || (Array.isArray(resp) ? resp : []);
            if (!pageRows || pageRows.length === 0) break;
            aggregated.push(...pageRows);
            // Stop if this page returned fewer than pageLimit (likely last page)
            if (pageRows.length < pageLimit) break;
            page += 1;
          }

          const rows = aggregated;
          setPayments(rows.map(r => ({
            id: r.id || r.paymentId || `${r.method || 'pay'}-${Math.random().toString(36).slice(2,8)}`,
            timestamp: r.createdAt || r.timestamp || new Date().toISOString(),
            amount: Number(r.amount || r.total || 0),
            method: r.method || r.provider || 'cash',
            status: r.status || (r.success ? 'success' : 'pending'),
            category: r.category || 'room',
            customer: {
              name: (r.customer && (r.customer.name || r.customer.username)) || r.customerName || 'Customer',
              phone: (r.customer && (r.customer.phone || r.customer.msisdn)) || r.phone || '',
              type: (r.customer && r.customer.type) || 'first'
            },
            orderRef: r.orderRef || r.orderCode || r.reference || r.order?.code || r.orderId || r.order_id,
            receiptNumber: r.receiptNumber || r.receipt || null,
            mpesaCode: r.mpesaCode || r.code || null,
            raw: r
          })));

          // derive customers list for metrics (simple de-dup)
          const custMap = {};
          (rows || []).forEach(r => {
            const name = (r.customer && (r.customer.name || r.customer.username)) || r.customerName || 'Customer';
            const phone = (r.customer && (r.customer.phone || r.customer.msisdn)) || r.phone || '';
            custMap[phone || name] = { customerType: r.customer?.type || 'first', name, phone };
          });
          setCustomers(Object.values(custMap));
        } catch (err) {
          console.error('Failed to load recent payments', err);
          toast.error('Failed to load recent transactions');
          setPayments([]);
          setCustomers([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Simulate M-Pesa STK Push
  const initiateStkPush = async () => {
    if (!stkPush.phone || !stkPush.amount) return;

    setStkPush(prev => ({ ...prev, processing: true, status: 'processing' }));

    try {
      // Build payload: include the found order payload if available plus phone and amount
      // Build a minimal, explicit payload for the MPesa initiation.
      // Prefer the orderId from one of the items (items[0].orderId) as requested.
      let payload;
      if (foundOrder) {
        const orderIdFromItem = foundOrder.items && foundOrder.items.length > 0 ? (foundOrder.items[0].orderId || foundOrder.items[0].orderId) : null;
        const orderId = orderIdFromItem || foundOrder.id;
        const userId = foundOrder.user?.id || foundOrder.userId || null;
        payload = {
          userId,
          orderId,
          code: foundOrder.code,
          amount: Number(stkPush.amount),
          phone: stkPush.phone,
          items: foundOrder.items || []
        };
      } else {
        payload = { phone: stkPush.phone, amount: Number(stkPush.amount), orderRef: stkPush.orderId };
      }

      // token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const res = await initiateMpesaPayment(token, payload);

      // Assume success if we get a successful response
      toast.success('M-Pesa STK initiated');

      const newPayment = {
        id: `PAY${1000 + payments.length}`,
        timestamp: new Date().toISOString(),
        amount: Number(stkPush.amount),
        method: 'mpesa',
        status: 'pending',
        category: 'room',
        customer: {
          name: foundOrder?.user?.username || 'Customer',
          phone: stkPush.phone,
          type: 'walk-in'
        },
        orderRef: foundOrder?.code || stkPush.orderId || `ORD${2000 + payments.length}`,
        receiptNumber: res?.receiptNumber || `RC${3000 + payments.length}`,
        mpesaCode: res?.mpesaCode || null,
        rawResponse: res
      };

      setPayments(prev => [newPayment, ...prev]);
      setStkPush(prev => ({ ...prev, processing: false, status: 'processing', phone: '', amount: '', orderId: '' }));
      // Optionally clear foundOrder after initiating
      setFoundOrder(null);
    } catch (err) {
      console.error('STK initiation failed', err);
      toast.error('Failed to initiate STK Push');
      setStkPush(prev => ({ ...prev, processing: false, status: 'failed' }));
    }
  };

  // Process manual payment
  const processManualPayment = () => {
    const amount = Number(manualPayment.amount || 0);
    const paid = Number(manualPayment.customerPaid || 0);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount');
      return;
    }
    if (isNaN(paid) || paid < 0) {
      toast.error('Enter the cash provided');
      return;
    }

    const change = paid - amount;
    const paidInFull = change >= 0;
    const status = paidInFull ? 'success' : 'partial';

    const newPayment = {
      id: `PAY${1000 + payments.length}`,
      timestamp: new Date().toISOString(),
      amount: amount,
      method: 'cash',
      status,
      category: 'manual',
      customer: {
        name: 'Customer',
        phone: ''
      },
      orderRef: manualPayment.orderId || `ORD${2000 + payments.length}`,
      receiptNumber: `RC${3000 + payments.length}`,
      paidAmount: paid,
      change: paidInFull ? Number(change.toFixed(2)) : 0,
      balance: !paidInFull ? Number((amount - paid).toFixed(2)) : 0
    };

    setPayments(prev => [newPayment, ...prev]);
    setManualPayment({ orderId: '', amount: '', customerPaid: '' });

    if (paidInFull) {
      toast.success(`Payment successful — change: KSh ${newPayment.change}`);
    } else {
      toast('Partial payment recorded — balance: KSh ' + newPayment.balance, { icon: '⚠️' });
    }
  };

  // Lookup order by code and autofill amount into either 'stk' or 'manual' form
  const lookupOrderFor = async (target = 'stk') => {
    const code = target === 'stk' ? stkPush.orderId : manualPayment.orderId;
    if (!code) return;
    setRefLoading(true);
    try {
      const data = await getOrderByCode(code);
      const order = data && data.id ? data : data?.data || null;
      if (!order) {
        toast.error('Order not found');
        if (target === 'stk') setStkPush(prev => ({ ...prev, amount: '' }));
        else setManualPayment(prev => ({ ...prev, amount: '' }));
      } else {
        toast.success('Order found — amount autofilled');
        const amount = order.total ?? order.amount ?? 0;
        if (target === 'stk') {
          setStkPush(prev => ({ ...prev, amount: String(amount) }));
          setFoundOrder(order);
        } else {
          setManualPayment(prev => ({ ...prev, amount: String(amount) }));
          setFoundOrder(order);
        }
      }
    } catch (err) {
      console.error('Order lookup failed', err);
      toast.error('Failed to lookup order');
    } finally {
      setRefLoading(false);
    }
  };

  // Calculate metrics
  const metrics = {
    todayRevenue: paymentsSummary && paymentsSummary.totalRevenue ? Number(paymentsSummary.totalRevenue).toFixed(2) : '0.00',
    pendingPayments: paymentsSummary && typeof paymentsSummary.totalPending === 'number' ? paymentsSummary.totalPending : payments.filter(p => p.status === 'pending').length,
    successfulToday: paymentsSummary && typeof paymentsSummary.totalCompleted === 'number' ? paymentsSummary.totalCompleted : payments.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString() && p.status === 'success').length,
    loyalCustomers: customers.filter(c => c.customerType === 'loyal').length
  };

  // Debug: log full metrics and related stats for easier debugging in console
  // Log once after data arrives (use console.log so it's visible regardless of devtools filters)
  React.useEffect(() => {
    try {
      if (paymentsSummary || (providerStats && providerStats.length) || (revenueRows && revenueRows.length)) {
        console.log('[PaymentsSection METRICS]', { metrics, paymentsSummary, providerStats, revenueRows });
      }
    } catch (e) {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsSummary, providerStats, revenueRows]);

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filters.status === 'all' || payment.status === filters.status;
    const matchesMethod = filters.method === 'all' || payment.method === filters.method;
    const matchesSearch = payment.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.customer.phone.includes(filters.search) ||
      payment.orderRef.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesMethod && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <AdminHeader title="Payments" subtitle="Process payments and track transactions" />
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Payments Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Process payments, track transactions, and manage customer loyalty
          </p>
        </div>

        <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
          📋 View Orders
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Today's Revenue</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">KSh {metrics.todayRevenue}</div>
          <div className="text-xs text-green-500 mt-1">↑ 8.2% from yesterday</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Pending Payments</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{metrics.pendingPayments}</div>
          <div className="text-xs text-yellow-500 mt-1">Require attention</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Successful Today</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.successfulToday}</div>
          <div className="text-xs text-green-500 mt-1">Transactions completed</div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Loyal Customers</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.loyalCustomers}</div>
          <div className="text-xs text-purple-500 mt-1">5+ visits</div>
        </div>
      </div>

      {/* Payment Processing Tabs */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
        <div className="border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('mpesa')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === 'mpesa'
                  ? 'text-green-600 border-b-2 border-green-500 bg-green-50/50 dark:bg-green-900/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              📱 M-Pesa STK Push
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === 'manual'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              💰 Manual Payment
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === 'bulk'
                  ? 'text-purple-600 border-b-2 border-purple-500 bg-purple-50/50 dark:bg-purple-900/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              📦 Bulk Payments
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* M-Pesa STK Push Tab */}
          {activeTab === 'mpesa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={stkPush.phone}
                    onChange={(e) => setStkPush(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Order Reference (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ORD12345"
                      value={stkPush.orderId}
                      onChange={(e) => setStkPush(prev => ({ ...prev, orderId: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') lookupOrderFor('stk'); }}
                      className="flex-1 px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => lookupOrderFor('stk')}
                      disabled={!stkPush.orderId || refLoading}
                      className="px-3 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-60 transition-colors"
                    >
                      {refLoading ? '...' : 'Lookup'}
                    </button>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Amount (KSh)
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="0.00"
                    value={stkPush.amount}
                    onChange={(e) => setStkPush(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

              </div>

              {/* STK Push Status */}
              {stkPush.status !== 'idle' && (
                <div className={`p-4 rounded-xl border ${stkPush.status === 'processing' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                    stkPush.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                      'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${stkPush.status === 'processing' ? 'bg-yellow-500' :
                        stkPush.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    <div>
                      <span className="font-medium">
                        {stkPush.status === 'processing' && '🔄 Processing M-Pesa STK Push...'}
                        {stkPush.status === 'success' && '✅ Payment Successful!'}
                        {stkPush.status === 'failed' && '❌ Payment Failed'}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {stkPush.status === 'processing' && 'Waiting for customer to enter PIN...'}
                        {stkPush.status === 'success' && `M-Pesa Code: ${payments[0]?.mpesaCode || 'MP4001'}`}
                        {stkPush.status === 'failed' && 'Customer declined or transaction timed out'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={initiateStkPush}
                disabled={stkPush.processing || !stkPush.phone || !stkPush.amount}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {stkPush.processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Initiating STK Push...
                  </>
                ) : (
                  <>
                    📱 Initiate M-Pesa STK Push
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manual Payment Tab: simplified external component */}
          {activeTab === 'manual' && (
            <ManualPayment
              onCreate={(newPayment) => {
                setPayments(prev => [newPayment, ...prev]);
              }}
            />
          )}

          {/* Bulk Payments Tab */}
          {activeTab === 'bulk' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Bulk Payment Processing
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Process multiple room charges, group bookings, or corporate invoices in one batch.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Upload Payment Batch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by customer, phone, or order..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={filters.method}
          onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
          className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
        >
          <option value="all">All Methods</option>
          <option value="mpesa">M-Pesa</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
          className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all duration-300"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 overflow-hidden">
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent Transactions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredPayments.length} payments found • {metrics.successfulToday} successful today
          </p>
        </div>

        {/* Mobile: card list */}
        <div className="md:hidden space-y-3">
          {filteredPayments.map(payment => (
            <div key={payment.id} className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{payment.customer.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{payment.customer.phone}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(payment.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">KSh {payment.amount.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{payment.orderRef}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300">{payment.method}</span>
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {payment.status === 'success' ? 'text-green-600' : ''}">{payment.status}</span>
                </div>
                <div>
                  <button className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-auto max-h-96">
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Time</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Customer</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Method</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                  <td className="p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(payment.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(payment.timestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{payment.customer.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{payment.customer.phone}</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${payment.customer.type === 'loyal' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                        payment.customer.type === 'returning' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                          'bg-slate-100 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300'
                      }`}>
                      {payment.customer.type === 'loyal' ? '⭐ Loyal' :
                        payment.customer.type === 'returning' ? '↩️ Returning' : '👤 First-time'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">KSh {payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{payment.category}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${payment.method === 'mpesa' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        payment.method === 'cash' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                          payment.method === 'card' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      }`}>
                      {payment.method === 'mpesa' && '📱 M-Pesa'}
                      {payment.method === 'cash' && '💰 Cash'}
                      {payment.method === 'card' && '💳 Card'}
                      {payment.method === 'bank_transfer' && '🏦 Bank Transfer'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                        payment.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                      {payment.status === 'success' && '✅ Success'}
                      {payment.status === 'pending' && '⏳ Pending'}
                      {payment.status === 'failed' && '❌ Failed'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">{payment.orderRef}</div>
                    {payment.mpesaCode && (
                      <div className="text-xs text-green-600 dark:text-green-400">M-Pesa: {payment.mpesaCode}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">M-Pesa Popularity</div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">62% of all transactions</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Customer Retention</div>
          <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">45% returning customers</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Loyalty Points</div>
          <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">12,450 points issued today</div>
        </div>
      </div>
    </div>
  );
}
