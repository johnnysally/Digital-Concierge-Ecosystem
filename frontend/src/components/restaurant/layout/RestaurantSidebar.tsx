import { NavLink, useNavigate } from 'react-router-dom';
import { RestaurantTheme } from './theme';
import BrandLogo from '../../ui/BrandLogo';
import {
    DashboardIcon,
    FoodIcon,
    OrdersIcon,
    ReviewsIcon,
    ReportsIcon,
    PromotionsIcon,
    PaymentsIcon,
    SupportIcon,
    WalletIcon,
    ProfileIcon,
    SettingsIcon,
    SunIcon,
    MoonIcon,
    ChevronLeftIcon,
    LogoutIcon,
} from '../../ui/Icons';

const groups = [
    {
        title: 'Operations',
        items: [
            { label: 'Dashboard', path: '/restaurant-admin', icon: <DashboardIcon size={18} /> },
            { label: 'Menu', path: '/restaurant-admin/menu', icon: <FoodIcon size={18} /> },
            { label: 'Orders', path: '/restaurant-admin/orders', icon: <OrdersIcon size={18} /> },
        ],
    },
    {
        title: 'People',
        items: [
            { label: 'Reviews', path: '/restaurant-admin/reviews', icon: <ReviewsIcon size={18} /> },
        ],
    },
    {
        title: 'Growth',
        items: [
            { label: 'Reports', path: '/restaurant-admin/reports', icon: <ReportsIcon size={18} /> },
            { label: 'Promotions', path: '/restaurant-admin/promotions', icon: <PromotionsIcon size={18} /> },
            { label: 'Payments', path: '/restaurant-admin/payments', icon: <PaymentsIcon size={18} /> },
        ],
    },
    {
        title: 'Support',
        items: [
            { label: 'Help desk', path: '/restaurant-admin/help-desk', icon: <SupportIcon size={18} /> },
        ],
    },
    {
        title: 'Account',
        items: [
            { label: 'Wallet', path: '/restaurant-admin/wallet', icon: <WalletIcon size={18} /> },
            { label: 'Profile', path: '/restaurant-admin/profile', icon: <ProfileIcon size={18} /> },
            { label: 'Settings', path: '/restaurant-admin/settings', icon: <SettingsIcon size={18} /> },
        ],
    },
];

type RestaurantSidebarProps = {
    onNavigate?: () => void;
    theme: RestaurantTheme;
    onToggleTheme: () => void;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
};

const RestaurantSidebar = ({ onNavigate, theme, onToggleTheme, collapsed = false, onToggleCollapse }: RestaurantSidebarProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('digitalsafaris_restaurant');
        navigate('/restaurant-admin/login', { replace: true });
    };

    const isLight = theme === 'light';

    return (
        <aside className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border p-3 sm:p-4 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] transition-all duration-300 ease-in-out ${isLight ? 'border-slate-200 bg-white/95 text-slate-800' : 'border-slate-800 bg-slate-900/95 text-slate-100'}`}>
            <div className={`mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 transition-all duration-300 ${collapsed ? 'p-2' : 'p-4'} ${isLight ? 'bg-amber-50' : 'bg-amber-500/10'}`}>
                <div className="flex items-center justify-between gap-2">
                    {!collapsed ? (
                        <div className="min-w-0">
                            <BrandLogo className={isLight ? 'text-slate-900' : 'text-white'} />
                            <div className="ml-14">
                                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Restaurant Suite</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex w-full items-center justify-center">
                            <FoodIcon size={22} className="text-amber-500" />
                        </div>
                    )}
                    {onToggleCollapse && (
                        <button
                            type="button"
                            onClick={onToggleCollapse}
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className={`hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                                isLight
                                    ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <ChevronLeftIcon size={16} className={`transition-transform duration-300 transform ${collapsed ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                    )}
                </div>
                {!collapsed && (
                    <p className={`mt-3 text-sm transition-all duration-300 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        Manage menus, orders, staff, and promotions from one focused workspace.
                    </p>
                )}
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto">
                {groups.map((group) => (
                    <div key={group.title} className="space-y-2">
                        {!collapsed && (
                            <h4 className={`px-2 text-xs font-semibold uppercase tracking-[0.24em] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                                {group.title}
                            </h4>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onNavigate}
                                    end={item.path === '/restaurant-admin'}
                                    title={collapsed ? item.label : undefined}
                                    className={({ isActive }) =>
                                        `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                            collapsed ? 'justify-center px-2 py-2' : ''
                                        } ${
                                            isActive
                                                ? isLight
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-amber-500/15 text-amber-200'
                                                : isLight
                                                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}`}>
                                        {item.icon}
                                    </span>
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-4 space-y-2">
                <button
                    type="button"
                    onClick={onToggleTheme}
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    className={`w-full rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors duration-200 flex items-center justify-center ${
                        collapsed ? 'px-2 py-2.5' : ''
                    } ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                >
                    {theme === 'light' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                    {!collapsed && <span className="ml-2">{theme === 'light' ? 'Light mode' : 'Dark mode'}</span>}
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    title={collapsed ? 'Logout' : undefined}
                    className={`w-full rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors duration-200 flex items-center justify-center ${
                        collapsed ? 'px-2 py-2.5' : ''
                    } ${isLight ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                >
                    <LogoutIcon size={18} />
                    {!collapsed && <span className="ml-2">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default RestaurantSidebar;
