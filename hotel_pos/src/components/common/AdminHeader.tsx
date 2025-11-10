import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
  userName?: string;
  hotelName?: string;
}

const AdminHeader: React.FC<Props> = ({
  title = "Admin Dashboard",
  subtitle = "Control Panel",
  showLogout = true,
  userName = "Admin User",
  hotelName = "Hotel POS",
}) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement | null>(null);

  useHeaderHeightSync(headerRef);

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    navigate("/login");
  };

  return (
    <motion.header
      ref={(el) => {headerRef.current = el}}
      className="fixed top-0 left-0 z-50 w-full bg-gradient-to-r from-slate-900/80 via-indigo-900/70 to-fuchsia-900/80 backdrop-blur-xl border-b border-white/10 shadow-xl px-8 py-5 md:left-64 md:w-[calc(100%-16rem)] h-14 md:h-20"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="space-y-1">
          <motion.h2
            className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(168,85,247,0.35)]"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <p className="text-sm text-gray-300/90 font-medium tracking-wide">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Info */}
          <div className="text-right leading-tight">
            <div className="text-white font-semibold text-base tracking-wide drop-shadow-sm">
              {userName}
            </div>
            <div className="text-sm text-cyan-300 italic">{hotelName}</div>
          </div>

          {/* Avatar */}
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 0 15px rgba(139,92,246,0.6)",
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-white/10"
          >
            {userName.charAt(0).toUpperCase()}
          </motion.div>

          {/* Logout */}
          {showLogout && (
            <motion.button
              whileHover={{
                scale: 1.06,
                background:
                  "linear-gradient(90deg, rgba(239,68,68,0.25), rgba(244,114,182,0.15))",
                boxShadow: "0 0 10px rgba(239,68,68,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg border border-rose-400/30 bg-gradient-to-r from-rose-500/10 to-fuchsia-500/10 text-rose-300 font-semibold text-sm transition-all shadow-sm"
            >
              Logout
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

// ✅ Fixed: properly closed function and added cleanup
function useHeaderHeightSync(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;

    const setVar = () => {
      const el = ref.current;
      if (!el) return;
      const height = el.offsetHeight;
      document.documentElement.style.setProperty(
        "--admin-header-height",
        `${height}px`
      );
    };

    setVar();
    window.addEventListener("resize", setVar);

    const t = setTimeout(setVar, 200);
    return () => {
      window.removeEventListener("resize", setVar);
      clearTimeout(t);
    };
  }, [ref]);
}

export default AdminHeader;
