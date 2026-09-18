import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/customer/ThemeContext';
import { useAuth } from '../../../context/customer/AuthContext';
import BrandLogo from '../../ui/BrandLogo';
import {
    HomeIcon,
    FoodIcon,
    TransportIcon,
    NotificationsIcon,
    AIAssistantIcon,
    SearchIcon,
    BookingsIcon,
    ReviewsIcon,
    WalletIcon,
    PaymentsIcon,
    PromotionsIcon,
    ProfileIcon,
    SettingsIcon,
    SupportIcon,
    SunIcon,
    MoonIcon,
    ChevronLeftIcon,
    LogoutIcon,
    SparklesIcon,
} from '../../ui/Icons';

const groups = [
    {
        title: 'General',
        items: [
            { label: 'Dashboard', path: '/', icon: <HomeIcon size={18} /> },
            { label: 'Food', path: '/food', icon: <FoodIcon size={18} /> },
            { label: 'Transport', path: '/transport', icon: <TransportIcon size={18} /> },
            { label: 'Notifications', path: '/notifications', icon: <NotificationsIcon size={18} /> },
            { label: 'AI Assistant', path: '/chat', icon: <AIAssistantIcon size={18} /> },
        ],
    },
    {
        title: 'Accommodation',
        items: [
            { label: 'Search Stays', path: '/search', icon: <SearchIcon size={18} /> },
            { label: 'Bookings', path: '/bookings', icon: <BookingsIcon size={18} /> },
            { label: 'Reviews', path: '/reviews', icon: <ReviewsIcon size={18} /> },
        ],
    },
    {
        title: 'Payments & Wallet',
        items: [
            { label: 'Wallet', path: '/wallet', icon: <WalletIcon size={18} /> },
            { label: 'Payments', path: '/payments', icon: <PaymentsIcon size={18} /> },
            { label: 'Promotions', path: '/promotions', icon: <PromotionsIcon size={18} /> },
        ],
    },
    {
        title: 'Account',
        items: [
            { label: 'Profile', path: '/profile', icon: <ProfileIcon size={18} /> },
            { label: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
            { label: 'Help & Support', path: '/support', icon: <SupportIcon size={18} /> },
        ],
    },
];

type CustomerSidebarProps = {
    onNavigate?: () => void;
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
};

const CustomerSidebar = ({ onNavigate, className = '', collapsed = false, onToggleCollapse }: CustomerSidebarProps) => {
    const { isDark, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
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
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your concierge, reimagined</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full items-center justify-center py-1">
                                <SparklesIcon size={22} className="text-amber-500" />
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
                            Discover hotels, dining and rides — all in one place.
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
                                        end={item.path === '/'}
                                        title={collapsed ? item.label : undefined}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                                collapsed ? 'justify-center px-2 py-2.5' : ''
                                            } ${
                                                isActive
                                                    ? isDark
                                                        ? 'bg-amber-500/15 text-amber-200 shadow'
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
                    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
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

export default CustomerSidebar;
