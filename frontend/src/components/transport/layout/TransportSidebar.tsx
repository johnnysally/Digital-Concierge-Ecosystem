import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTransportTheme } from '../../../context/transport/ThemeContext';
import { getTransportPath } from '../../../utils/transportRoutes';
import BrandLogo from '../../ui/BrandLogo';
import {
    DashboardIcon,
    NotificationsIcon,
    MapIcon,
    OrdersIcon,
    PaymentsIcon,
    CustomersIcon,
    BusIcon,
    TransportIcon,
    MaintenanceIcon,
    WalletIcon,
    PromotionsIcon,
    ProfileIcon,
    SettingsIcon,
    SupportIcon,
    SunIcon,
    MoonIcon,
    ChevronLeftIcon,
    LogoutIcon,
} from '../../ui/Icons';

const getStoredTransportSession = () => {
    try {
        const stored = localStorage.getItem('digitalsafaris_transport');
        return stored ? JSON.parse(stored) : null;
    } catch { return null; }
};

type TransportSidebarProps = {
    onNavigate?: () => void;
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
};

const TransportSidebar = ({ onNavigate, className = '', collapsed = false, onToggleCollapse }: TransportSidebarProps) => {
    const { isDark, toggleTheme } = useTransportTheme();
    const navigate = useNavigate();
    const session = getStoredTransportSession();
    const isShuttle = ['shuttle', 'bus'].includes(session?.user?.businessType || '');

    const groups = [
        {
            title: 'General',
            items: [
                { label: 'Dashboard', path: getTransportPath(''), icon: <DashboardIcon size={18} /> },
                { label: 'Notifications', path: getTransportPath('/notifications'), icon: <NotificationsIcon size={18} /> },
                { label: 'Live Map', path: getTransportPath('/live'), icon: <MapIcon size={18} /> },
            ],
        },
        {
            title: 'Operations',
            items: [
                { label: isShuttle ? 'Bus/Shuttle Trips' : 'Ride Requests', path: getTransportPath('/rides'), icon: <OrdersIcon size={18} /> },
                { label: isShuttle ? 'Bus/Shuttle Prices' : 'Destination Prices', path: getTransportPath('/pricing'), icon: <PaymentsIcon size={18} /> },
            ],
        },
        {
            title: 'Fleet',
            items: [
                { label: 'Drivers', path: getTransportPath('/drivers'), icon: <CustomersIcon size={18} /> },
                { label: isShuttle ? 'Bus/Shuttle' : 'Vehicles', path: getTransportPath('/vehicles'), icon: isShuttle ? <BusIcon size={18} /> : <TransportIcon size={18} /> },
                { label: 'Maintenance', path: getTransportPath('/maintenance'), icon: <MaintenanceIcon size={18} /> },
            ],
        },
        {
            title: 'Payments',
            items: [
                { label: 'Wallet', path: getTransportPath('/wallet'), icon: <WalletIcon size={18} /> },
                { label: 'Transactions', path: getTransportPath('/transactions'), icon: <PaymentsIcon size={18} /> },
                { label: 'Promotions', path: getTransportPath('/promotions'), icon: <PromotionsIcon size={18} /> },
            ],
        },
        {
            title: 'Account',
            items: [
                { label: 'Profile', path: getTransportPath('/profile'), icon: <ProfileIcon size={18} /> },
                { label: 'Settings', path: getTransportPath('/settings'), icon: <SettingsIcon size={18} /> },
                { label: 'Support', path: getTransportPath('/support'), icon: <SupportIcon size={18} /> },
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('digitalsafaris_transport');
        navigate(getTransportPath('/login'), { replace: true });
    };

    return (
        <aside className={`w-full transition-all duration-300 ease-in-out ${className}`}>
            <div className={`flex h-full max-h-full flex-col overflow-hidden rounded-[28px] border shadow-[0_20px_60px_-25px_rgba(15,23,42,0.55)] transition-colors duration-300 ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-gray-200 bg-white'}`}>
                <div className={`shrink-0 border-b transition-all duration-300 ${collapsed ? 'p-3' : 'p-6'} ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between gap-2">
                        {!collapsed ? (
                            <div className="flex-1 min-w-0">
                                <BrandLogo className={isDark ? 'text-slate-100' : 'text-slate-900'} />
                                <div className="ml-14">
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {isShuttle ? 'Bus/Shuttle command center' : 'Transport command center'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full items-center justify-center py-1">
                                {isShuttle ? <BusIcon size={22} className="text-cyan-500" /> : <TransportIcon size={22} className="text-cyan-500" />}
                            </div>
                        )}
                        {onToggleCollapse && (
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                className={`hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                                    isDark
                                        ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                <ChevronLeftIcon size={16} className={`transition-transform duration-300 transform ${collapsed ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                        )}
                    </div>
                    {!collapsed && (
                        <div className={`mt-4 rounded-2xl border p-3 text-sm transition-all duration-300 ${isDark ? 'border-slate-800 bg-slate-800/70 text-slate-300' : 'border-gray-100 bg-gray-50 text-slate-700'}`}>
                            {isShuttle ? 'Manage shuttle routes, seats, and departures.' : 'Manage rides, drivers, and fleet operations seamlessly.'}
                        </div>
                    )}
                </div>

                <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                            collapsed ? 'justify-center px-2 py-2.5' : ''
                        } ${isDark ? 'border-slate-700 bg-slate-800/90 text-slate-100 shadow-sm hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    >
                        <span>{isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}</span>
                        {!collapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
                        {!collapsed && <span className="text-xs uppercase tracking-[0.2em] opacity-70">Theme</span>}
                    </button>

                    {groups.map((g) => (
                        <div key={g.title} className="space-y-2">
                            {!collapsed && (
                                <h4 className={`px-2 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{g.title}</h4>
                            )}
                            <div className="space-y-1">
                                {g.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onNavigate}
                                        end={item.path === getTransportPath('')}
                                        title={collapsed ? item.label : undefined}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                                collapsed ? 'justify-center px-2 py-2.5' : ''
                                            } ${
                                                isActive
                                                    ? isDark
                                                        ? 'bg-cyan-500/15 text-amber-200 shadow'
                                                        : 'bg-amber-50 text-slate-900 shadow'
                                                    : isDark
                                                        ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                                                        : 'text-slate-700 hover:bg-gray-50 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm shadow-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-gray-50 text-slate-700'}`}>
                                            {item.icon}
                                        </span>
                                        {!collapsed && <span className="truncate">{item.label}</span>}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className={`mt-4 border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <button
                            type="button"
                            onClick={handleLogout}
                            title={collapsed ? 'Logout' : undefined}
                            className={`flex w-full items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition duration-200 ${
                                collapsed ? 'px-2 py-2.5' : ''
                            } ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                        >
                            <LogoutIcon size={18} />
                            {!collapsed && <span className="ml-2">Logout</span>}
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default TransportSidebar;
