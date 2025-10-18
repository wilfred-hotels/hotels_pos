"use client";
import React, { useState } from "react";
import * as AuthAPI from "../../actions/auth";
import { motion } from "framer-motion";

export default function RegisterPage({ onRegistered }) {
  const [hotel, setHotel] = useState({ name: '', address: '', city: '', country: '', phone: '', openingTime: '', closingTime: '', imageUrl: '', description: '', workersCount: 0 });
  const [user, setUser] = useState({ username: '', password: '', role: 'manager' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { hotel, user };
      const res = await AuthAPI.register(payload);
      setToast({ type: 'success', text: 'Hotel and admin created' });
      setTimeout(() => { if (onRegistered) onRegistered(res); }, 600);
    } catch (err) {
      setError(err);
      setToast({ type: 'error', text: err?.message || 'Registration failed' });
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
        <p className="hidden md:block text-sm text-gray-300 italic">Create your hotel and admin</p>
      </motion.header>

      {/* Background Carousel */}
      <Carousel />

      {/* Floating Register Card */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="bg-blue-900/70 backdrop-blur-2xl border border-blue-700/40 shadow-2xl rounded-3xl w-full max-w-3xl p-8 md:p-10 text-white">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create Hotel & Admin
          </motion.h2>
          <p className="text-center text-sm text-white/70 mb-6">
            Register a hotel and an initial admin user to get started.
          </p>

            <h3 className="text-center italic mb-5 underline decoration-2 text-black text-lg font-semibold tracking-wide">
              Hotel Details
            </h3>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <input
              placeholder="Hotel name"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.name}
              onChange={e => setHotel({ ...hotel, name: e.target.value })}
              required
            />

            <input
              placeholder="City"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.city}
              onChange={e => setHotel({ ...hotel, city: e.target.value })}
            />

            <input
              placeholder="Address"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.address}
              onChange={e => setHotel({ ...hotel, address: e.target.value })}
            />

            <input
              placeholder="Country"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.country}
              onChange={e => setHotel({ ...hotel, country: e.target.value })}
            />

            <input
              placeholder="Phone"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.phone}
              onChange={e => setHotel({ ...hotel, phone: e.target.value })}
            />

            <input
              placeholder="Opening Time (08:00)"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.openingTime}
              onChange={e => setHotel({ ...hotel, openingTime: e.target.value })}
            />

            <input
              placeholder="Closing Time (22:00)"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.closingTime}
              onChange={e => setHotel({ ...hotel, closingTime: e.target.value })}
            />
            <input
              placeholder="Workers Count"
              type="number"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotel.workersCount}
              onChange={e => setHotel({ ...hotel, workersCount: Number(e.target.value) })}
            />
            <textarea
              placeholder="Description"
              className="md:col-span-2 w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none h-28 resize-y"
              value={hotel.description}
              onChange={e => setHotel({ ...hotel, description: e.target.value })}
            />

            <h3 className="md:col-span-2 text-center italic underline decoration-2 text-black text-lg font-semibold tracking-wide">
              User Details
            </h3>

            <input
              placeholder="Admin username"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={user.username}
              onChange={e => setUser({ ...user, username: e.target.value })}
              required
            />

            <input
              placeholder="Password"
              type="password"
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={user.password}
              onChange={e => setUser({ ...user, password: e.target.value })}
              required
            />

            {error && <div className="text-red-400 md:col-span-2">{error.message || String(error)}</div>}

            <div className="md:col-span-2 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg text-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Hotel & Admin'}
              </motion.button>

            </div>
          </form>

          {/* Toast */}
          {toast && (
            <div className={`absolute top-6 right-6 z-50 max-w-sm ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-3 rounded-md shadow-lg`}>
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm">{toast.text}</div>
                <button onClick={() => setToast(null)} className="text-white/80 text-xs">Dismiss</button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-white/80 mt-5">
            Already have an account? <a href="/login" className="font-semibold underline">Sign in</a>
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
        <p className="italic">“Efficiency meets luxury — your hotel’s best companion.”</p>
        <p className="mt-1 text-[11px]">© {new Date().getFullYear()} HotelPOS Systems. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

function Carousel() {
  const images = ['/1.jpeg', '/2.jpeg', '/3.jpeg', '/4.jpeg', '/5.jpeg', '/6.jpeg'];
  const [idx, setIdx] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setIdx(i => (i + 1) % images.length), 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt={`bg-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === idx ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: i === idx ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />
    </div>
  );
}
