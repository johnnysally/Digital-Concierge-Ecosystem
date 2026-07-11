import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import { useTheme } from '../../../context/customer/ThemeContext';

const CustomerLayout = () => {
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className={`min-h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-white to-slate-50 text-slate-900'}`}>
            <div className="h-screen w-full px-3 sm:px-4 lg:px-6">
                <div className="relative flex h-full flex-col lg:flex-row lg:gap-4">
                    <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start">
                        <CustomerSidebar />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <header className={`sticky top-0 z-20 mb-3 mt-2 rounded-[28px] border px-4 py-3.5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:px-5 lg:mt-3 ${isDark ? 'border-slate-800 bg-slate-900/85' : 'border-slate-200/80 bg-white/85'}`}>
                            <div className="flex items-center justify-between gap-3">
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

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
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

                        <div className="flex-1 pb-3 sm:pb-4 lg:pb-6">
                            <main className="h-full min-w-0">
                                <div className={`group h-[calc(100vh-6rem)] overflow-y-auto rounded-[24px] border p-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-22px_rgba(15,23,42,0.55)] sm:p-4 lg:p-8 ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-gray-200 bg-white'}`}>
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
                    className={`absolute inset-0 bg-slate-950/70 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
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