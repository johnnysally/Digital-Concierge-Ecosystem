import React from "react";
import { Link } from "react-router-dom";

const CustomerNavbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/customer" className="text-xl font-semibold tracking-tight text-white">
          DigitalSafaris
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <Link to="/customer/support" className="transition hover:text-white">
            Support
          </Link>
          <Link to="/customer/profile" className="transition hover:text-white">
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;
