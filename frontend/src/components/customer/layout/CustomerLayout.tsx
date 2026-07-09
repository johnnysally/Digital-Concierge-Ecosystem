import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import { useTheme } from "../../../context/customer/ThemeContext";

const CustomerLayout = () => {
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen overflow-hidden ${isDark ? "bg-slate-950 text-slate-100" : "bg-gradient-to-b from-white to-slate-50 text-slate-900"}`}>
      <div className="h-screen w-full px-3 sm:px-4 lg:px-8">
        <div className="relative flex h-full flex-col lg:flex-row lg:gap-6">
          <div className="hidden lg:sticky lg:top-4 lg:block lg:h-[calc(100vh-2rem)] lg:self-start">
            <CustomerSidebar />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between px-1 py-3 lg:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-lg ${isDark ? "border-slate-700 bg-slate-900/80 text-slate-100" : "border-slate-200 bg-white/80 text-slate-800"}`}
                >
                  ☰
                </button>
                <div>
                  <p className="text-sm font-semibold">DigitalSafaris</p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Customer portal</p>
                </div>
              </div>
            </div>

            <div className="flex-1 py-1 sm:py-2 lg:py-6">
              <main className="h-full min-w-0">
                <div className={`h-[calc(100vh-2rem)] overflow-y-auto rounded-[24px] border p-3 shadow-sm sm:p-4 lg:p-8 ${isDark ? "border-slate-800 bg-slate-900/95" : "border-gray-200 bg-white"}`}>
                  <div className="min-h-full">
                    <Outlet />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-slate-950/70 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={`absolute left-0 top-0 h-full w-[85vw] max-w-80 transform transition-transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <CustomerSidebar onNavigate={() => setMobileMenuOpen(false)} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
