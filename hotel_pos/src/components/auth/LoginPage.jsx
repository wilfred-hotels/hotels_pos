"use client";
import React, { useEffect, useState } from "react";
import * as AuthAPI from "../../actions/auth";
import { getHotels } from "../../actions/hotels";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

export default function LoginPage({ onLogin }) {
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const h = await getHotels();
        setHotels(h || []);
      } catch (e) {
        // ignore
        setHotels([]);
      }
    })();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    function onDoc(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selectedHotel = hotels.find((h) => String(h.id) === String(hotelId));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!hotelId) {
      setError({ message: 'Please select a hotel' });
      setLoading(false);
      return;
    }
    try {
  const res = await AuthAPI.login(username, password, hotelId);
      console.log('Login response:', res);
      // If server returned a validation/error object, show messages and do not store
      if (res && (res.statusCode || res.error || res.message)) {
        const msgs = Array.isArray(res.message) ? res.message.join(', ') : (res.message || res.error || 'Login failed');
        toast.error(msgs);
        setLoading(false);
        return;
      }

      // only store on successful response
      if (res && (res.access_token || res.token)) {
        try {
          const token = res.access_token || res.token;
          const refresh = res.refresh_token || res.refreshToken;
          if (token) localStorage.setItem('access_token', token);
          if (refresh) localStorage.setItem('refresh_token', refresh);

          // store minimal user fields separately
          if (res.user) {
            const uid = res.user.id || res.user._id || res.user.userId || '';
            const uname = res.user.username || res.user.name || '';
            const urole = res.user.role || '';
            if (uid) localStorage.setItem('user_id', String(uid));
            if (uname) localStorage.setItem('user_name', String(uname));
            if (urole) localStorage.setItem('user_role', String(urole));
          }

          // store minimal hotel fields (prefer selectedHotel from dropdown)
          try {
            const hid = (selectedHotel && selectedHotel.id) || (res.user && (res.user.hotelId || res.user.hotel_id)) || hotelId || '';
            const hname = (selectedHotel && selectedHotel.name) || '';
            if (hid) localStorage.setItem('hotel_id', String(hid));
            if (hname) localStorage.setItem('hotel_name', String(hname));
          } catch (e) {}

          // keep raw response for debug if needed
          localStorage.setItem('login_response', JSON.stringify(res));
        } catch (e) {}
        toast.success('Signed in successfully');
        setTimeout(() => { if (onLogin) onLogin(); }, 600);
      } else {
        // server returned non-success payload
        toast.error('Login failed: invalid response');
      }
    } catch (err) {
      setError(err);
      // show server validation errors in toast if present
      if (err && err.data && err.data.message) {
        const msg = Array.isArray(err.data.message) ? err.data.message.join(', ') : err.data.message;
        toast.error(msg);
      } else {
        toast.error(err?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Header */}
      <motion.header
        className="absolute top-0 w-full flex items-center justify-between px-8 py-4 z-30 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            HotelPOS
          </span>
        </div>
        <p className="hidden md:block text-sm text-gray-300 italic">
          “Smart management for elegant hospitality.”
        </p>
      </motion.header>

      {/* 🌆 Background Carousel */}
      <Carousel />

      {/* Floating Login Card */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="bg-blue-900/70 backdrop-blur-2xl border border-blue-700/40 shadow-2xl rounded-3xl w-full max-w-md p-8 md:p-10 text-white">
          <motion.h2
            className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to POS
          </motion.h2>
          <p className="text-center text-sm text-white/70 mb-8">
            Manage reservations, staff, and sales in one elegant dashboard.
          </p>

          <form onSubmit={submit} className="space-y-4">
            {/* Custom dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full text-left bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center justify-between"
              >
                <span className="truncate">
                  {selectedHotel ? `${selectedHotel.name}${selectedHotel.city ? ' — ' + selectedHotel.city : ''}` : 'Select hotel'}
                </span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" clipRule="evenodd" /></svg>
              </button>

              {open && (
                <div className="absolute z-40 left-0 right-0 mt-2 bg-white/10 backdrop-blur-3xl rounded-lg border border-white/10 overflow-auto max-h-56 shadow-lg">
                  <ul className="divide-y divide-white/5">
                    {hotels.map((h) => (
                      <li key={h.id}>
                        <button
                          type="button"
                          onClick={() => { setHotelId(String(h.id)); setOpen(false); setError(null); }}
                          className="w-full text-left p-3 hover:bg-white/10 flex items-center gap-3"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-white text-sm truncate">{h.name}</div>
                            <div className="text-xs text-white/70 truncate">{h.city}{h.country ? ', ' + h.country : ''}</div>
                          </div>
                          {h.imageUrl ? (
                            <img src={h.imageUrl} alt={h.name} className="w-14 h-10 object-cover rounded-md" />
                          ) : (
                            <div className="w-14 h-10 bg-slate-700 rounded-md flex items-center justify-center text-xs text-white">No Image</div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <input
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="text-red-400 text-sm">
                {error.message || String(error)}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg text-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          {/* toasts rendered globally by react-hot-toast <Toaster /> in App.jsx */}

          <p className="text-center text-sm text-white/80 mt-5">
            Don’t have an account?{" "}
            <a href="/register" className="font-semibold underline">
              Register
            </a>
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-0 w-full text-center py-3 text-white/70 text-xs z-30 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="italic">
          “Efficiency meets luxury — your hotel’s best companion.”
        </p>
        <p className="mt-1 text-[11px]">
          © {new Date().getFullYear()} HotelPOS Systems. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
}

/** ========================
 * 🏞 Background Carousel Component
 ==========================*/
function Carousel() {
  const images = ['/1.jpeg', '/2.jpeg', '/3.jpeg', '/4.jpeg', '/5.jpeg', '/6.jpeg'];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIdx(i => (i + 1) % images.length), 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt={`hotel-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === idx ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: i === idx ? 1 : 0 }}
        />
      ))}

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />
    </div>
  );
}
