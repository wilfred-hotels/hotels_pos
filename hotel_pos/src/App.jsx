import './App.css'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import { Toaster } from 'react-hot-toast'

function App() {
  // Determine stored hotel id (used for scoping dashboard routes)
  const storedHotel = typeof window !== 'undefined' ? (localStorage.getItem('hotel_id') || localStorage.getItem('hotelId')) : null;

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* root redirects to dashboard with hotel id when available, otherwise to login */}
        <Route path="/" element={<Navigate to={storedHotel ? `/dashboard/${storedHotel}/dashboard` : '/login'} replace />} />
        <Route path="/login" element={<LoginPage onLogin={(opts) => {
          // opts may be undefined or an object like { isSuperAdmin: true, userId }
          if (opts && opts.isSuperAdmin && opts.userId) {
            // navigate super admin to their dashboard (userId used as the route param)
            window.location.href = `/dashboard/${opts.userId}/dashboard`;
            return;
          }
          const hid = localStorage.getItem('hotel_id') || localStorage.getItem('hotelId');
          window.location.href = hid ? `/dashboard/${hid}/dashboard` : '/login';
        }} />} />
        <Route path="/register" element={<RegisterPage onRegistered={() => window.location.href = '/login'} />} />
        {/* Dashboard now requires a hotel id and optional section in the path */}
        <Route path="/dashboard/:hotelId/:section?" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
