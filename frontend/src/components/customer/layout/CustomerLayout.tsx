import React from "react";
import { Outlet } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";
import CustomerSidebar from "./CustomerSidebar";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <CustomerNavbar />
      <div className="mx-auto flex max-w-[1600px] px-4 py-6 lg:px-8">
        <CustomerSidebar />
        <main className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-900/20 lg:ml-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
