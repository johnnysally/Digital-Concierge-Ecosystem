import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import { useTheme } from '../../../context/customer/ThemeContext';

const CustomerLayout = () => {
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className={`h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-white to-slate-50 text-slate-900'}`}>
            <div className="h-full w-full px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
                <div className="flex h-full flex-col lg:flex-row lg:gap-0">
                    <div className="hidden lg:block lg:shrink-0">
                        <div className="fixed left-0 top-0 h-screen w-72">
                            <CustomerSidebar className="h-full w-full" />
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-72">
                        <header className={`sticky top-0 z-20 mb-3 rounded-[28px] border px-3 py-3 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:px-5 sm:py-3.5 ${isDark ? 'border-slate-800 bg-slate-900/85' : 'border-slate-200/80 bg-white/85'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(true)}
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-md lg:hidden ${isDark ? 'border-slate-700 bg-slate-900/80 text-slate-100' : 'border-slate-200 bg-white/80 text-slate-800'}`}
                                    >
                                        ☰
                                    </button>
                                    <div>
                                        <p className="text-sm font-semibold tracking-wide">DigitalSafaris</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Concierge command center</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            to="/"
                                            className={`rounded-full px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDark ? 'border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                            aria-label="Go to profile"
                                        >
                                            <span className="text-base">👤</span>
                                        </Link>
                                    </div>

                                    <div className="hidden items-center gap-2 sm:flex">
                                        <Link
                                            to="/search"
                                            className={`rounded-full px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                                        >
                                            Search
                                        </Link>
                                        <Link
                                            to="/bookings"
                                            className={`rounded-full px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                                        >
                                            Book
                                        </Link>
                                        <Link
                                            to="/support"
                                            className={`rounded-full px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
                                        >
                                            Support
                                        </Link>
                                        <Link
                                            to="/notifications"
                                            className={`relative rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDark ? 'border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                        >
                                            🔔
                                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={toggleTheme}
                                            className={`rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDark ? 'border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                        >
                                            {isDark ? '☀️' : '🌙'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-3 sm:pb-4 lg:pb-6">
                            <main className="min-h-0 flex-1 overflow-y-auto min-w-0 px-0 pr-1 sm:px-0">
                                <div className={`min-h-full rounded-[24px] border border-transparent p-1 sm:p-2 lg:p-4 ${isDark ? 'bg-slate-900/20' : 'bg-white/40'}`}>
                                    <div className="min-h-full">
                                        <Outlet />
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'} ${isDark ? 'bg-slate-950/70' : 'bg-slate-900/20'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className={`absolute left-0 top-0 h-full w-[85vw] max-w-80 transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <CustomerSidebar onNavigate={() => setMobileMenuOpen(false)} className="h-full w-full" />
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;