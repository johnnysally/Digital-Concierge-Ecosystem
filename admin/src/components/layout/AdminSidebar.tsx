import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import {
    DashboardIcon,
    ReportsIcon,
    PartnersIcon,
    CustomersIcon,
    LocationsIcon,
    PaymentsIcon,
    DisputesIcon,
    BackupsIcon,
    SettingsIcon,
    BrandingIcon,
    LegalIcon,
    ChevronLeftIcon,
    ShieldIcon,
} from '../ui/Icons';

type AdminSidebarProps = {
    onNavigate?: () => void;
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
};

const navGroups = [
    {
        title: 'Overview',
        items: [
            { to: '/', label: 'Dashboard', icon: <DashboardIcon size={20} />, end: true },
            { to: '/reports', label: 'Reports', icon: <ReportsIcon size={20} /> },
        ],
    },
    {
        title: 'Management',
        items: [
            { to: '/partners', label: 'Partners', icon: <PartnersIcon size={20} /> },
            { to: '/customers', label: 'Customers', icon: <CustomersIcon size={20} /> },
            { to: '/locations', label: 'Locations', icon: <LocationsIcon size={20} /> },
            { to: '/payments', label: 'Payments', icon: <PaymentsIcon size={20} /> },
            { to: '/disputes', label: 'Disputes', icon: <DisputesIcon size={20} /> },
            { to: '/backups', label: 'Backups', icon: <BackupsIcon size={20} /> },
        ],
    },
    {
        title: 'Configuration',
        items: [
            { to: '/settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
            { to: '/branding', label: 'Branding', icon: <BrandingIcon size={20} /> },
            { to: '/legal', label: 'Legal', icon: <LegalIcon size={20} /> },
        ],
    },
];

const AdminSidebar = ({ onNavigate, className = '', collapsed = false, onToggleCollapse }: AdminSidebarProps) => (
    <aside className={cn('h-full overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 transition-all duration-300 ease-in-out', className)}>
        <div className={cn('sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 transition-all duration-300', collapsed ? 'px-3 py-4' : 'px-4 py-5 lg:px-5')}>
            <div className="flex items-center justify-between gap-2">
                {!collapsed ? (
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Admin Console</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">Quick navigation for platform operations.</p>
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-center">
                        <ShieldIcon size={22} className="text-primary-500" />
                    </div>
                )}
                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white active:scale-95"
                    >
                        <ChevronLeftIcon size={16} className={cn('transition-transform duration-300 transform', collapsed ? 'rotate-180' : 'rotate-0')} />
                    </button>
                )}
            </div>
        </div>
        <nav className={cn('space-y-4 transition-all duration-300', collapsed ? 'p-2' : 'px-4 py-4 lg:px-5')}>
            {navGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                    {!collapsed && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                            {group.title}
                        </p>
                    )}
                    <div className={cn('space-y-2 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300', collapsed ? 'p-1.5' : 'p-3')}>
                        {group.items.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={onNavigate}
                                title={collapsed ? link.label : undefined}
                                className={({ isActive }) =>
                                    cn(
                                        'flex w-full items-center gap-3 rounded-3xl text-sm font-semibold transition-all duration-200',
                                        collapsed ? 'justify-center px-2 py-2' : 'px-3 py-3 sm:px-4 sm:py-3',
                                        isActive
                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                            : 'text-slate-700 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                                    )
                                }
                            >
                                <span className={cn('inline-flex items-center justify-center rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0 transition-all duration-300', collapsed ? 'h-9 w-9' : 'h-11 w-11')}>
                                    {link.icon}
                                </span>
                                {!collapsed && <span className="truncate">{link.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    </aside>
);

export default AdminSidebar;