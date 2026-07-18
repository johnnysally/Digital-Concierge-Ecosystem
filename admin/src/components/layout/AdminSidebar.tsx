import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';

type AdminSidebarProps = {
    onNavigate?: () => void;
    className?: string;
};

const navGroups = [
    {
        title: 'Overview',
        items: [
            { to: '/', label: 'Dashboard', icon: '📊', end: true },
            { to: '/reports', label: 'Reports', icon: '📈' },
        ],
    },
    {
        title: 'Management',
        items: [
            { to: '/partners', label: 'Partners', icon: '🏨' },
            { to: '/customers', label: 'Customers', icon: '👥' },
            { to: '/transactions', label: 'Transactions', icon: '💳' },
            { to: '/disputes', label: 'Disputes', icon: '⚖️' },
            { to: '/backups', label: 'Backups', icon: '💾' },
        ],
    },
    {
        title: 'Configuration',
        items: [
            { to: '/settings', label: 'Settings', icon: '⚙️' },
            { to: '/legal', label: 'Legal', icon: '📜' },
        ],
    },
];

const AdminSidebar = ({ onNavigate, className = '' }: AdminSidebarProps) => (
    <aside className={cn('h-full overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950', className)}>
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:px-5">
            <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin Console</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Quick navigation for platform operations.</p>
            </div>
        </div>
        <nav className="space-y-4 px-4 py-4 lg:px-5">
            {navGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                        {group.title}
                    </p>
                    <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        {group.items.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    cn(
                                        'flex w-full items-center gap-3 rounded-3xl px-3 py-3 text-sm font-semibold transition-all duration-200 sm:px-4 sm:py-3',
                                        isActive
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                            : 'text-slate-700 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                    )
                                }
                            >
                                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-lg dark:bg-slate-800">
                                    {link.icon}
                                </span>
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    </aside>
);

export default AdminSidebar;