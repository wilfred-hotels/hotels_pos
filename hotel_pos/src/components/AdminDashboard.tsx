import React, { JSX, useState } from 'react';
import Products from './products.jsx';
import AddNewSale from './AddNewSale';
import DashboardSection from './sections/DashboardSection';
import SalesSection from './sections/SalesSection';
import OrdersSection from './sections/OrdersSection';
import ProductsSection from './sections/ProductsSection';
import InventorySection from './sections/InventorySection';
import CustomersSection from './sections/CustomersSection';
import ReservationsSection from './sections/ReservationsSection';
import RoomsSection from './sections/RoomsSection';
import StaffSection from './sections/StaffSection';
import ReportsSection from './sections/ReportsSection';
import PaymentsSection from './sections/PaymentsSection';
import SettingsSection from './sections/SettingsSection';

type NavKey =
  | 'dashboard'
  | 'sales'
  | 'orders'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'reservations'
  | 'rooms'
  | 'staff'
  | 'reports'
  | 'payments'
  | 'settings';

const navItems: { key: NavKey; label: string; icon?: JSX.Element }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'sales', label: 'Sales' },
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'customers', label: 'Customers' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'staff', label: 'Staff' },
  { key: 'reports', label: 'Reports' },
  { key: 'payments', label: 'Payments' },
  { key: 'settings', label: 'Settings' },
];

const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<NavKey>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <div className="flex w-full h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        // desktop sidebar
        className={`hidden md:flex transition-all duration-300 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex-col ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
              HP
            </div>
            {!collapsed && <h3 className="text-lg font-semibold">Hotel POS</h3>}
          </div>
          <button
            className="text-sm text-gray-500 dark:text-gray-300"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

  {/* Navigation */}
  <nav className="px-2 py-2 flex-1 overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md my-1 transition-colors
              ${
                active === item.key
                  ? 'bg-slate-200 dark:bg-slate-700 font-semibold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {item.label.charAt(0)}
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t dark:border-slate-700">
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            Help & Support
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <div className={`md:hidden ${mobileOpen ? 'block' : 'hidden'} fixed inset-0 z-40`}> 
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-4 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">HP</div>
              <h3 className="text-lg font-semibold">Hotel POS</h3>
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-gray-600 dark:text-gray-300">Close</button>
          </div>
          <nav className="space-y-1">
            {navItems.map(i => (
              <button key={i.key} onClick={() => { setActive(i.key); setMobileOpen(false); }} className={`w-full text-left px-2 py-2 rounded ${active === i.key ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                {i.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white dark:bg-slate-900 dark:border-slate-700">
          <div>
            <h1 className="text-xl font-bold">
              {active === 'dashboard'
                ? 'Dashboard'
                : active.charAt(0).toUpperCase() + active.slice(1)}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admin control panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* mobile menu button */}
            <button className="md:hidden mr-2 p-2 rounded" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Admin User
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          {active === 'dashboard' && (
            <section className="h-full">
              <DashboardSection />
            </section>
          )}

          {active === 'products' && (
            <section className="h-full">
              <ProductsSection />
            </section>
          )}

          {active === 'sales' && (
            <section className="h-full">
              <SalesSection />
            </section>
          )}

          {active === 'orders' && (
            <section className="h-full">
              <OrdersSection />
            </section>
          )}

          {active === 'inventory' && (
            <section className="h-full"><InventorySection /></section>
          )}
          {active === 'customers' && (
            <section className="h-full"><CustomersSection /></section>
          )}
          {active === 'reservations' && (
            <section className="h-full"><ReservationsSection /></section>
          )}
          {active === 'rooms' && (
            <section className="h-full"><RoomsSection /></section>
          )}
          {active === 'staff' && (
            <section className="h-full"><StaffSection /></section>
          )}
          {active === 'reports' && (
            <section className="h-full"><ReportsSection /></section>
          )}
          {active === 'payments' && (
            <section className="h-full"><PaymentsSection /></section>
          )}
          {active === 'settings' && (
            <section className="h-full"><SettingsSection /></section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
