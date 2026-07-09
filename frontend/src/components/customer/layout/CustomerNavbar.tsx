import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/customer/ThemeContext";

const CustomerNavbar = () => {
  const { isDark } = useTheme();

  return (
    <header className={`sticky top-0 z-40 border-b ${isDark ? "border-slate-800 bg-slate-950/90" : "border-gray-200 bg-white"}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/customer" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 text-sm font-semibold text-white shadow-sm">
            DS
          </div>
          <div>
            <p className={`text-lg font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>DigitalSafaris</p>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Premium guest experience</p>
          </div>
        </Link>

        <div className={`flex items-center gap-2 rounded-full border px-2 py-2 text-sm ${isDark ? "border-slate-800 bg-slate-900/80 text-slate-300" : "border-gray-100 bg-white text-slate-700"}`}>
          <Link to="/customer/support" className={`rounded-full px-3 py-2 transition ${isDark ? "hover:bg-slate-800 hover:text-white" : "hover:bg-gray-50 hover:text-slate-900"}`}>
            Support
          </Link>
          <Link to="/customer/profile" className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-sm font-semibold text-white transition">
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;
