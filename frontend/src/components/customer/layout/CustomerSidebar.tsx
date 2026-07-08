import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/customer" },
  { label: "Search", path: "/customer/search" },
  { label: "Bookings", path: "/customer/bookings" },
  { label: "Food", path: "/customer/food" },
  { label: "Transport", path: "/customer/transport" },
  { label: "Wallet", path: "/customer/wallet" },
];

const CustomerSidebar = () => {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-500">Explore</p>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
