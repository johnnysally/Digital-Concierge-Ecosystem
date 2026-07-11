import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { formatCompact } from '../../utils/formatCurrency';

const AdminNavbar = () => {
    const { user, logout } = useAuth();
    const { stats } = useDashboard();

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tracking-tight">Digital Concierge</span>
                    <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">Admin</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex gap-4 text-xs text-slate-500">
                        <span>Partners: <strong className="text-slate-900 dark:text-white">{stats.totalPartners}</strong></span>
                        <span>Customers: <strong className="text-slate-900 dark:text-white">{stats.totalCustomers}</strong></span>
                        <span>Bookings: <strong className="text-slate-900 dark:text-white">{stats.totalBookings}</strong></span>
                        <span>Revenue: <strong className="text-slate-900 dark:text-white">{formatCompact(stats.totalRevenue)}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{user?.firstName}</span>
                        <button onClick={logout} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;