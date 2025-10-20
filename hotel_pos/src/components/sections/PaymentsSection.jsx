
import React, { useState, useEffect } from 'react';

export default function PaymentsSection() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mpesa');
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
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

  // Manual Payment State
  const [manualPayment, setManualPayment] = useState({
    customerName: '',
    phone: '',
    amount: '',
    method: 'cash',
    orderId: '',
    category: 'room'
  });

  // Generate realistic dummy data
  const generateData = () => {
    const paymentMethods = ['mpesa', 'cash', 'card', 'bank_transfer'];
    const categories = ['room', 'food', 'amenities', 'services', 'incidentals'];
    const statuses = ['success', 'pending', 'failed'];
    const customerNames = ['John Kamau', 'Sarah Mwangi', 'David Ochieng', 'Grace Wambui', 'Mike Otieno'];
    
    let paymentsData = [];
    let customersData = [];

    // Generate customers with loyalty tracking
    customerNames.forEach((name, index) => {
      const visitCount = Math.floor(Math.random() * 10) + 1;
      const totalSpent = (Math.random() * 50000 + 5000).toFixed(2);
      
      customersData.push({
        id: index + 1,
        name,
        phone: `07${Math.floor(Math.random() * 90000000 + 10000000)}`,
        visitCount,
        totalSpent: parseFloat(totalSpent),
        averageSpent: (totalSpent / visitCount).toFixed(2),
        lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerType: visitCount > 5 ? 'loyal' : visitCount > 2 ? 'returning' : 'first-time',
        loyaltyPoints: visitCount * 100
      });
    });

    // Generate payment records
    for (let i = 0; i < 25; i++) {
      const customer = customersData[Math.floor(Math.random() * customersData.length)];
      const amount = (Math.random() * 10000 + 500).toFixed(2);
      const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      paymentsData.push({
        id: `PAY${1000 + i}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: parseFloat(amount),
        method,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        customer: {
          name: customer.name,
          phone: customer.phone,
          type: customer.customerType
        },
        orderRef: `ORD${2000 + i}`,
        roomNumber: method === 'room' ? `R${Math.floor(Math.random() * 100) + 101}` : null,
        tableNumber: method === 'food' ? `T${Math.floor(Math.random() * 20) + 1}` : null,
        receiptNumber: `RC${3000 + i}`,
        mpesaCode: method === 'mpesa' ? `MP${4000 + i}` : null,
        loyaltyPoints: Math.floor(amount / 10)
      });
    }

    return { payments: paymentsData, customers: customersData };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = generateData();
      setPayments(data.payments);
      setCustomers(data.customers);
      setLoading(false);
    };
    loadData();
  }, []);

  // Simulate M-Pesa STK Push
  const initiateStkPush = async () => {
    if (!stkPush.phone || !stkPush.amount) return;
    
    setStkPush(prev => ({ ...prev, processing: true, status: 'processing' }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate success (80% success rate)
    const success = Math.random() > 0.2;
    
    if (success) {
      const newPayment = {
        id: `PAY${1000 + payments.length}`,
        timestamp: new Date().toISOString(),
        amount: parseFloat(stkPush.amount),
        method: 'mpesa',
        status: 'success',
        category: 'room',
        customer: {
          name: 'Customer',
          phone: stkPush.phone,
          type: 'walk-in'
        },
        orderRef: stkPush.orderId || `ORD${2000 + payments.length}`,
        receiptNumber: `RC${3000 + payments.length}`,
        mpesaCode: `MP${4000 + payments.length}`,
        loyaltyPoints: Math.floor(stkPush.amount / 10)
      };
      
      setPayments(prev => [newPayment, ...prev]);
      setStkPush(prev => ({ ...prev, processing: false, status: 'success', phone: '', amount: '', orderId: '' }));
    } else {
      setStkPush(prev => ({ ...prev, processing: false, status: 'failed' }));
    }
  };

  // Process manual payment
  const processManualPayment = () => {
    const newPayment = {
      id: `PAY${1000 + payments.length}`,
      timestamp: new Date().toISOString(),
      amount: parseFloat(manualPayment.amount),
      method: manualPayment.method,
      status: 'success',
      category: manualPayment.category,
      customer: {
        name: manualPayment.customerName,
        phone: manualPayment.phone,
        type: 'walk-in'
      },
      orderRef: manualPayment.orderId || `ORD${2000 + payments.length}`,
      receiptNumber: `RC${3000 + payments.length}`,
      loyaltyPoints: Math.floor(manualPayment.amount / 10)
    };
    
    setPayments(prev => [newPayment, ...prev]);
    setManualPayment({
      customerName: '',
      phone: '',
      amount: '',
      method: 'cash',
      orderId: '',
      category: 'room'
    });
  };

  // Calculate metrics
  const metrics = {
    todayRevenue: payments
      .filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString() && p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0)
      .toFixed(2),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    successfulToday: payments.filter(p => 
      new Date(p.timestamp).toDateString() === new Date().toDateString() && p.status === 'success'
    ).length,
    loyalCustomers: customers.filter(c => c.customerType === 'loyal').length
  };

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
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'mpesa'
                  ? 'text-green-600 border-b-2 border-green-500 bg-green-50/50 dark:bg-green-900/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              📱 M-Pesa STK Push
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'manual'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              💰 Manual Payment
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                activeTab === 'bulk'
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
                {/* <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Amount (KSh)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={stkPush.amount}
                    onChange={(e) => setStkPush(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div> */}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Payment Category
                  </label>
                  <select className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500/50 backdrop-blur-sm transition-all duration-300">
                    <option value="room">Room Booking</option>
                    <option value="food">Food & Beverage</option>
                    <option value="amenities">Amenities</option>
                    <option value="services">Extra Services</option>
                    <option value="incidentals">Incidentals</option>
                  </select>
                </div>
              </div>

              {/* STK Push Status */}
              {stkPush.status !== 'idle' && (
                <div className={`p-4 rounded-xl border ${
                  stkPush.status === 'processing' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                  stkPush.status === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      stkPush.status === 'processing' ? 'bg-yellow-500' :
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

          {/* Manual Payment Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={manualPayment.customerName}
                    onChange={(e) => setManualPayment(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={manualPayment.phone}
                    onChange={(e) => setManualPayment(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Amount (KSh)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={manualPayment.amount}
                    onChange={(e) => setManualPayment(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={manualPayment.method}
                    onChange={(e) => setManualPayment(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={manualPayment.category}
                    onChange={(e) => setManualPayment(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="room">Room Booking</option>
                    <option value="food">Food & Beverage</option>
                    <option value="amenities">Amenities</option>
                    <option value="services">Extra Services</option>
                    <option value="incidentals">Incidentals</option>
                  </select>
                </div>
              </div>

              <button
                onClick={processManualPayment}
                disabled={!manualPayment.customerName || !manualPayment.amount}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:shadow-none"
              >
                💰 Process Manual Payment
              </button>
            </div>
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

        <div className="overflow-auto max-h-96">
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
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${
                      payment.customer.type === 'loyal' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      payment.method === 'mpesa' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
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
