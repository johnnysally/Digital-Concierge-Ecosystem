import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { formatCompact } from '../../utils/formatCurrency';

interface AdminNavbarProps {
    onToggleSidebar?: () => void;
}

const AdminNavbar = ({ onToggleSidebar }: AdminNavbarProps) => {
    const { user, logout } = useAuth();
    const { stats } = useDashboard();

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:px-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-base text-slate-700 shadow-sm transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
                        >
                            ☰
                        </button>
                        <div>
                            <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Digital Safaris</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Admin console</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm font-medium sm:block">{user?.firstName}</span>
                        <button onClick={logout} className="rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;