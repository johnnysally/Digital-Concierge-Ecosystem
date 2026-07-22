import { NavLink, useNavigate } from 'react-router-dom';
import { RestaurantTheme } from './theme';

const groups = [
    {
        title: 'Operations',
        items: [
            { label: 'Dashboard', path: '/restaurant-admin', icon: '📊' },
            { label: 'Menu', path: '/restaurant-admin/menu', icon: '🍽️' },
            { label: 'Orders', path: '/restaurant-admin/orders', icon: '🧾' },
        ],
    },
    {
        title: 'People',
        items: [
            { label: 'Staff', path: '/restaurant-admin/staff', icon: '👥' },
            { label: 'Reviews', path: '/restaurant-admin/reviews', icon: '⭐' },
        ],
    },
    {
        title: 'Growth',
        items: [
            { label: 'Promotions', path: '/restaurant-admin/promotions', icon: '🎁' },
            { label: 'Payments', path: '/restaurant-admin/payments', icon: '💳' },
        ],
    },
    {
        title: 'Account',
        items: [
            { label: 'Profile', path: '/restaurant-admin/profile', icon: '👤' },
            { label: 'Settings', path: '/restaurant-admin/settings', icon: '⚙️' },
        ],
    },
];

type RestaurantSidebarProps = {
    onNavigate?: () => void;
    theme: RestaurantTheme;
    onToggleTheme: () => void;
};

const RestaurantSidebar = ({ onNavigate, theme, onToggleTheme }: RestaurantSidebarProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('digitalsafaris_restaurant');
        navigate('/restaurant-admin/login', { replace: true });
    };

    const isLight = theme === 'light';

    return (
        <aside className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border p-4 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] transition-colors duration-200 lg:w-72 ${isLight ? 'border-slate-200 bg-white/95 text-slate-800' : 'border-slate-800 bg-slate-900/95 text-slate-100'}`}>
            <div className={`mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 ${isLight ? 'bg-amber-50' : 'bg-amber-500/10'}`}>
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-400 to-rose-500 text-sm font-semibold text-white">
                        RS
                    </div>
                    <div>
                        <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Digital Safaris</p>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Restaurant Suite</p>
                    </div>
                </div>
                <p className={`mt-3 text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Manage menus, orders, staff, and promotions from one focused workspace.</p>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto">
                {groups.map((group) => (
                    <div key={group.title} className="space-y-2">
                        <h4 className={`px-2 text-xs font-semibold uppercase tracking-[0.24em] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{group.title}</h4>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onNavigate}
                                    end={item.path === '/restaurant-admin'}
                                    className={({ isActive }) => `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? (isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/15 text-amber-200') : (isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white')}`}
                                >
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}`}>{item.icon}</span>
                                    <span>{item.label}</span>
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
                    className={`w-full rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors duration-200 ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                >
                    {theme === 'light' ? '☀️ Light mode' : '🌙 Dark mode'}
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className={`w-full rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors duration-200 ${isLight ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default RestaurantSidebar;
