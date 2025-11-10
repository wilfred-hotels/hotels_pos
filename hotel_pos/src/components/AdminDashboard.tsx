import React, { JSX, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddNewSale from './AddNewSale';
import DashboardSection from './superAdmin/DashboardSection';
import SalesSection from './superAdmin/SalesSection';
import OrdersSection from './superAdmin/OrdersSection';
import ProductsSection from './superAdmin/ProductsSection';
import InventorySection from './superAdmin/InventorySection';
import CustomersSection from './superAdmin/CustomersSection';
import ReservationsSection from './superAdmin/ReservationsSection';
import RoomsSection from './superAdmin/RoomsSection';
import StaffSection from './superAdmin/StaffSection';
import ReportsSection from './superAdmin/ReportsSection';
import PaymentsSection from './superAdmin/PaymentsSection';
import SettingsSection from './superAdmin/SettingsSection';
import CatalogSection from './superAdmin/CatalogSection';

// legacy (hotel user) sections
import LegacyDashboardSection from './sections/DashboardSection';
import LegacySalesSection from './sections/SalesSection';
import LegacyOrdersSection from './sections/OrdersSection';
import LegacyProductsSection from './sections/ProductsSection';
import LegacyInventorySection from './sections/InventorySection';
import LegacyCustomersSection from './sections/CustomersSection';
import LegacyReservationsSection from './sections/ReservationsSection';
import LegacyRoomsSection from './sections/RoomsSection';
import LegacyStaffSection from './sections/StaffSection';
import LegacyReportsSection from './sections/ReportsSection';
import LegacyPaymentsSection from './sections/PaymentsSection';
import LegacySettingsSection from './sections/SettingsSection';
import toast from 'react-hot-toast';
import { authCheck, authRefresh } from '../actions/auth';

type NavKey =
  | 'dashboard'
  | 'sales'
  | 'orders'
  | 'catalog'
  | 'products'
  | 'payments'
  | 'inventory'
  | 'customers'
  | 'reservations'
  | 'rooms'
  | 'staff'
  | 'reports'
  | 'settings'

const navItems: { key: NavKey; label: string; icon?: JSX.Element; superAdminOnly?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'sales', label: 'Sales' },
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'customers', label: 'Customers', superAdminOnly: false },
  { key: 'reservations', label: 'Reservations', superAdminOnly: false },
  { key: 'rooms', label: 'Rooms' },
  { key: 'staff', label: 'Staff' },
  { key: 'reports', label: 'Reports' },
  { key: 'payments', label: 'Payments' },
  { key: 'settings', label: 'Settings' },
  { key: 'catalog', label: 'Catalog', superAdminOnly: true },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const hotelId = params.hotelId || '';
  const sectionParam = (params.section as NavKey) || 'dashboard';
  const [active, setActive] = useState<NavKey>(sectionParam);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; isSuperAdmin?: boolean; userId?: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);


  useEffect(() => {
    // Run hydration and auth check flow
    (async () => {
      setIsHydrated(true);
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken && !refreshToken) {
        // no tokens -> redirect to login
        try { localStorage.clear(); } catch (e) { }
        navigate('/login');
        return;
      }

      try {
        // Prefer quick server validation if access token exists
        if (accessToken) {
          const ok = await authCheck(accessToken);
          if (ok) {
            const username = localStorage.getItem('username');
            const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
            const userId = localStorage.getItem('userId');
            setUser(username ? {
              name: username,
              isSuperAdmin,
              userId: isSuperAdmin ? userId || undefined : undefined
            } : null);
            setIsCheckingAuth(false);
            return;
          }
        }

        // Try refresh if available
        if (refreshToken) {
          const refreshed = await authRefresh(refreshToken);
          if (refreshed && refreshed.access_token) {
            localStorage.setItem('access_token', refreshed.access_token);
            const username = localStorage.getItem('username');
            setUser(username ? { name: username } : null);
            toast.success('Session refreshed');
            setIsCheckingAuth(false);
            return;
          }
        }

        // If we get here, tokens are invalid -> clear and redirect
        try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch (e) { }
        setUser(null);
        toast.error('Session required — please sign in');
        navigate('/login');
      } catch (err) {
        console.error('Auth flow error', err);
        try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch (e) { }
        setUser(null);
        toast.error('Auth validation failed — please sign in');
        navigate('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    })();
  }, []);

  useEffect(() => {
    // when route section changes (eg on initial load), sync to state
    setActive(sectionParam);
  }, [sectionParam]);

  const goTo = (key: NavKey) => {
    setActive(key);
    // update URL so refresh lands on same section
    if (hotelId) navigate(`/dashboard/${hotelId}/${key}`);
    else navigate(`/dashboard/${key}`);
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        // desktop sidebar
        className={`hidden md:flex transition-all duration-300 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex-col ${collapsed ? 'w-16' : 'w-64'
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
          {navItems.map((item) => {
            // Skip superAdmin only items for non-super users
            if (item.superAdminOnly && !user?.isSuperAdmin) return null;

            return (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md my-1 transition-colors
                ${active === item.key
                    ? 'bg-slate-200 dark:bg-slate-700 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                <div className="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {item.label.charAt(0)}
                </div>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
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
              <button key={i.key} onClick={() => { goTo(i.key); setMobileOpen(false); }} className={`w-full text-left px-2 py-2 rounded ${active === i.key ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                {i.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Content */}
        <main
          className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900"
          style={{ paddingTop: 'var(--admin-header-height)' }}
        >
          {active === 'dashboard' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <DashboardSection userId={user.userId} />
              ) : (
                <LegacyDashboardSection />
              )}
            </section>
          )}

          {active === 'products' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <ProductsSection userId={user.userId} />
              ) : (
                <LegacyProductsSection />
              )}
            </section>
          )}

          {active === 'sales' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <SalesSection userId={user.userId} />
              ) : (
                <LegacySalesSection />
              )}
            </section>
          )}

          {active === 'orders' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <OrdersSection userId={user.userId} />
              ) : (
                <LegacyOrdersSection />
              )}
            </section>
          )}

          {active === 'inventory' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <InventorySection userId={user.userId} />
              ) : (
                <LegacyInventorySection />
              )}
            </section>
          )}

          {active === 'customers' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <CustomersSection userId={user.userId} />
              ) : (
                <LegacyCustomersSection />
              )}
            </section>
          )}

          {active === 'reservations' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <ReservationsSection userId={user.userId} />
              ) : (
                <LegacyReservationsSection />
              )}
            </section>
          )}

          {active === 'rooms' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <RoomsSection userId={user.userId} />
              ) : (
                <LegacyRoomsSection />
              )}
            </section>
          )}

          {active === 'staff' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <StaffSection userId={user.userId} />
              ) : (
                <LegacyStaffSection />
              )}
            </section>
          )}

          {active === 'reports' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <ReportsSection userId={user.userId} />
              ) : (
                <LegacyReportsSection />
              )}
            </section>
          )}

          {active === 'payments' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <PaymentsSection userId={user.userId} />
              ) : (
                <LegacyPaymentsSection />
              )}
            </section>
          )}

          {active === 'settings' && (
            <section className="h-full">
              {user?.isSuperAdmin ? (
                <SettingsSection userId={user.userId} />
              ) : (
                <LegacySettingsSection />
              )}
            </section>
          )}

          {active === 'catalog' && user?.isSuperAdmin && user.userId && (
            <section className="h-full">
              <CatalogSection userId={user.userId} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
