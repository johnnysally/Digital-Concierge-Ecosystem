import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import { useTheme } from '../../../context/customer/ThemeContext';
import { getNotifications } from '../../../api/customer/notificationApi';
import BrandLogo from '../../ui/BrandLogo';

const CustomerLayout = () => {
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('customer_sidebar_collapsed') === 'true');

    useEffect(() => {
        let session = null;
        try {
            const stored = localStorage.getItem('digitalsafaris_customer');
            session = stored ? JSON.parse(stored) : null;
        } catch {
            session = null;
        }

        if (!session?.token) return;

        getNotifications()
            .then((res) => {
                const count = (res.notifications || []).filter((n: any) => !n.isRead).length;
                setUnreadCount(count);
            })
            .catch(() => {});
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed((current) => {
            const next = !current;
            localStorage.setItem('customer_sidebar_collapsed', String(next));
            return next;
        });
    };

    return (
        <div className={`relative h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f8fc] text-slate-900'}`}>
            <div className={`pointer-events-none absolute inset-0 opacity-80 ${isDark ? 'bg-[radial-gradient(circle_at_8%_0%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_92%_10%,rgba(245,158,11,0.12),transparent_25%)]' : 'bg-[radial-gradient(circle_at_8%_0%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_92%_10%,rgba(251,191,36,0.16),transparent_25%)]'}`} />
            <div className="relative h-full w-full px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
                <div className="flex h-full flex-col lg:flex-row lg:gap-0">
                    <div className="hidden lg:block lg:shrink-0">
                        <div className={`fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
                            <CustomerSidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} className="h-full w-full" />
                        </div>
                    </div>

                    <div className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
                        <header className={`sticky top-0 z-20 mb-3 rounded-[28px] border px-3 py-3 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:px-5 sm:py-3.5 ${isDark ? 'border-slate-800/90 bg-slate-900/85' : 'border-white/80 bg-white/80'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(true)}
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-md lg:hidden ${isDark ? 'border-slate-700 bg-slate-900/80 text-slate-100' : 'border-slate-200 bg-white/80 text-slate-800'}`}
                                    >
                                        ☰
                                    </button>
                                    <BrandLogo className={isDark ? 'text-slate-100' : 'text-slate-900'} />
                                    <div className="ml-14">
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
                                            className={`relative rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-visible ${isDark ? 'border-slate-700 bg-slate-800/90 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                        >
                                            🔔
                                            {unreadCount > 0 && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    borderRadius: '999px',
                                                    padding: '1px 6px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    lineHeight: '18px',
                                                    minWidth: '20px',
                                                    textAlign: 'center',
                                                    zIndex: 10,
                                                }}>
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </span>
                                            )}
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
                                <div className={`min-h-full rounded-[24px] border border-transparent p-1 sm:p-2 lg:p-4 ${isDark ? 'bg-slate-900/20' : 'bg-white/35'}`}>
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