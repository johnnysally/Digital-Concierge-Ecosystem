import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTransportTheme } from '../../../context/transport/ThemeContext';

const groups = [
    {
        title: 'General',
        items: [
            { label: 'Dashboard', path: '/transport-admin', icon: '📊' },
            { label: 'Notifications', path: '/transport-admin/notifications', icon: '🔔' },
            { label: 'Live Map', path: '/transport-admin/live', icon: '🗺️' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { label: 'Ride Requests', path: '/transport-admin/ride-requests', icon: '📥' },
            { label: 'Active Rides', path: '/transport-admin/rides', icon: '🚗' },
            { label: 'Dispatch', path: '/transport-admin/dispatch', icon: '🎯' },
        ],
    },
    {
        title: 'Fleet',
        items: [
            { label: 'Drivers', path: '/transport-admin/drivers', icon: '👥' },
            { label: 'Vehicles', path: '/transport-admin/vehicles', icon: '🚘' },
            { label: 'Maintenance', path: '/transport-admin/maintenance', icon: '🛠️' },
        ],
    },
    {
        title: 'Payments',
        items: [
            { label: 'Wallet', path: '/transport-admin/wallet', icon: '👛' },
            { label: 'Transactions', path: '/transport-admin/transactions', icon: '💳' },
            { label: 'Promotions', path: '/transport-admin/promotions', icon: '🎁' },
        ],
    },
    {
        title: 'Account',
        items: [
            { label: 'Profile', path: '/transport-admin/profile', icon: '👤' },
            { label: 'Settings', path: '/transport-admin/settings', icon: '⚙️' },
            { label: 'Support', path: '/transport-admin/support', icon: '🆘' },
        ],
    },
];

type TransportSidebarProps = {
    onNavigate?: () => void;
    className?: string;
};

const TransportSidebar = ({ onNavigate, className = '' }: TransportSidebarProps) => {
    const { isDark, toggleTheme } = useTransportTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('digitalsafaris_transport');
        navigate('/transport-admin/login', { replace: true });
    };

    return (
        <aside className={`w-full lg:w-72 lg:shrink-0 ${className}`}>
            <div className={`flex h-screen flex-col overflow-hidden rounded-[28px] border shadow-[0_20px_60px_-25px_rgba(15,23,42,0.55)] lg:h-screen ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-gray-200 bg-white'}`}>
                <div className={`border-b p-6 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-400 to-indigo-400 text-sm font-semibold text-white shadow-sm">
                            DS
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>DigitalSafaris</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Transport Command Center</p>
                        </div>
                    </div>
                    <div className={`rounded-2xl border p-3 text-sm ${isDark ? 'border-slate-800 bg-slate-800/70 text-slate-300' : 'border-gray-100 bg-gray-50 text-slate-700'}`}>
                        Manage rides, drivers and fleet operations seamlessly.
                    </div>
                </div>

                <nav className="flex-1 space-y-4 overflow-y-auto p-4">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${isDark ? 'border-slate-700 bg-slate-800/90 text-slate-100 shadow-sm hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    >
                        <span>{isDark ? '☀️ Light mode' : '🌙 Dark mode'}</span>
                        <span className="text-xs uppercase tracking-[0.2em] opacity-70">Theme</span>
                    </button>

                    {groups.map((g) => (
                        <div key={g.title} className="space-y-2">
                            <h4 className={`px-2 text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{g.title}</h4>
                            <div className="space-y-1">
                                {g.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onNavigate}
                                        end={item.path === '/transport-admin'}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
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
                                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm shadow-sm ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-gray-50 text-slate-700'}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={`flex w-full items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition duration-200 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default TransportSidebar;
