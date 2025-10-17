"use client";
import React, { useEffect, useState } from "react";
import * as AuthAPI from "../../actions/auth";
import * as HotelsAPI from "../../actions/hotels";
import { motion } from "framer-motion";

export default function LoginPage({ onLogin }) {
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const h = await HotelsAPI.listHotels();
        setHotels(h || []);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.login({ username, password, hotelId });
      const token = res?.token || res?.access_token || res?.data?.token;
      if (token) localStorage.setItem("access_token", token);
      if (onLogin) onLogin();
    } catch (err) {
      setError(err);
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
      <Carousel hotels={hotels} />

      {/* Floating Login Card */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-md p-8 md:p-10 text-white">
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
            <select
              className="w-full bg-white/15 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              required
            >
              <option value="" className="text-black">
                Select hotel
              </option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id} className="text-black">
                  {h.name}
                </option>
              ))}
            </select>

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

          <p className="text-center text-sm text-white/80 mt-5">
            Don’t have an account?{" "}
            <a href="#/register" className="font-semibold underline">
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
function Carousel({ hotels = [] }) {
  const defaultImages = [
    '/1.jpeg',
    '/2.jpeg',
    '/3.jpeg',
    '/4.jpeg',
    '/5.jpeg',
    '/6.jpeg',
  ];

  const images =
    Array.isArray(hotels) && hotels.length > 0
      ? hotels.flatMap((h) => (h.imageUrl ? [h.imageUrl] : []))
      : defaultImages;

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 6000); // Change every 6 seconds
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
