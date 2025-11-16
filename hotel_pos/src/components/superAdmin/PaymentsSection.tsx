import React, { useMemo, useState } from 'react';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';
import toast from 'react-hot-toast';
import ManualPayment from '../sections/ManualPayment';

type Payment = {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  hotel: string;
  status: 'completed' | 'pending' | 'refunded';
  customer?: {
    name: string;
    phone: string;
    type: 'loyal' | 'returning' | 'new';
  };
  mpesaCode?: string;
};

const mockPayments: Payment[] = [
  {
    id: 'P001',
    date: '2025-11-09T10:15:00Z',
    amount: 250.0,
    method: 'mpesa',
    reference: 'CHG-1001',
    hotel: 'Grand Plaza',
    status: 'completed',
    customer: { name: 'Alice Smith', phone: '0711000001', type: 'loyal' },
    mpesaCode: 'MP123456'
  },
  {
    id: 'P002',
    date: '2025-11-09T12:20:00Z',
    amount: 120.5,
    method: 'cash',
    reference: 'CHG-1002',
    hotel: 'Riverside Inn',
    status: 'completed',
    customer: { name: 'Bob Johnson', phone: '0711000002', type: 'returning' }
  },
  {
    id: 'P003',
    date: '2025-11-09T09:40:00Z',
    amount: 89.99,
    method: 'mpesa',
    reference: 'CHG-1003',
    hotel: 'Mountain View',
    status: 'pending',
    customer: { name: 'Carol Davis', phone: '0711000003', type: 'loyal' },
    mpesaCode: 'MP123457'
  },
  {
    id: 'P004',
    date: '2025-11-08T16:30:00Z',
    amount: 499.0,
    method: 'card',
    reference: 'CHG-0999',
    hotel: 'Grand Plaza',
    status: 'refunded',
    customer: { name: 'David Wilson', phone: '0711000004', type: 'new' }
  }
];

const PaymentsSection: React.FC<SectionProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('mpesa');
  const [stkPush, setStkPush] = useState({
    phone: '',
    amount: '',
    orderId: '',
    processing: false,
    status: 'idle' as 'idle' | 'processing' | 'success' | 'failed'
  });
  const [payments, setPayments] = useState(mockPayments);

  const metrics = useMemo(() => ({
    todayRevenue: payments.reduce((s, p) => s + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    successfulToday: payments.filter(p => p.status === 'completed').length,
    loyalCustomers: new Set(payments.filter(p => p.customer?.type === 'loyal').map(p => p.customer?.phone)).size
  }), [payments]);

  const initiateStkPush = async () => {
    if (!stkPush.phone || !stkPush.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setStkPush(prev => ({ ...prev, processing: true, status: 'processing' }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      const newPayment = {
        id: `P${Date.now()}`,
        date: new Date().toISOString(),
        amount: parseFloat(stkPush.amount),
        method: 'mpesa',
        reference: stkPush.orderId || `ORD${Date.now()}`,
        hotel: 'Demo Hotel',
        status: 'completed' as const,
        customer: {
          name: 'STK Customer',
          phone: stkPush.phone,
          type: 'new' as const
        },
        mpesaCode: `MP${Math.floor(Math.random() * 1000000)}`
      };

      setPayments(prev => [newPayment, ...prev]);
      setStkPush(prev => ({ ...prev, processing: false, status: 'success' }));
      toast.success('Payment successful!');
    } else {
      setStkPush(prev => ({ ...prev, processing: false, status: 'failed' }));
      toast.error('Payment failed. Please try again.');
    }
  };

  const fmtCurrency = (v: number) => `$${(v || 0).toFixed(2)}`;
  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleString() : '—';

  return (
    <div className="space-y-6 p-4">
      <AdminHeader title="Payments Management" subtitle="Process payments, track transactions, and manage customer loyalty" />
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30">
          <div className="text-sm text-slate-500 dark:text-slate-400">Today's Revenue</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">KSh {metrics.todayRevenue.toFixed(2)}</div>
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
                    Amount (KSh)
                  </label>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={stkPush.amount}
                    onChange={(e) => setStkPush(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Order Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="ORD12345"
                    value={stkPush.orderId}
                    onChange={(e) => setStkPush(prev => ({ ...prev, orderId: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              {/* STK Push Status */}
              {stkPush.status !== 'idle' && (
                <div className={`p-4 rounded-xl border ${stkPush.status === 'processing'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : stkPush.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${stkPush.status === 'processing'
                      ? 'bg-yellow-500'
                      : stkPush.status === 'success'
                        ? 'bg-green-500'
                        : 'bg-red-500'
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

          {/* Manual Payment Tab */}
          {activeTab === 'manual' && (
            <ManualPayment
              onCreate={(newPayment: any) => {
                setPayments(prev => [newPayment, ...prev]);
                toast.success('Manual payment recorded successfully');
              }}
            />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/30 overflow-hidden">
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent Transactions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {payments.length} payments • {metrics.successfulToday} successful today
          </p>
        </div>

        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {payments.map(p => (
            <div key={p.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${p.method === 'mpesa'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : p.method === 'cash'
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    } text-white flex items-center justify-center font-bold text-lg`}>
                    {p.method === 'mpesa' ? '📱' : p.method === 'cash' ? '💰' : '💳'}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {p.customer?.name || 'Guest'} • {p.reference}
                    </div>
                    <div className="text-sm text-slate-500">{new Date(p.date).toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    KSh {p.amount.toFixed(2)}
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : p.status === 'pending'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                    {p.status === 'completed' && '✅ Completed'}
                    {p.status === 'pending' && '⏳ Pending'}
                    {p.status === 'refunded' && '↩️ Refunded'}
                  </span>
                </div>
              </div>
              {p.mpesaCode && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  M-Pesa Code: {p.mpesaCode}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsSection;