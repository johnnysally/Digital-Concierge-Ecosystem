import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const links = [
    { to: '/', label: 'Dashboard', icon: '📊', end: true },
    { to: '/partners', label: 'Partners', icon: '🏨' },
    { to: '/customers', label: 'Customers', icon: '👥' },
    { to: '/transactions', label: 'Transactions', icon: '💳' },
    { to: '/disputes', label: 'Disputes', icon: '⚖️' },
    { to: '/reports', label: 'Reports', icon: '📈' },
    { to: '/backups', label: 'Backups', icon: '💾' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
    { to: '/legal', label: 'Legal', icon: '📜' },
];

const AdminSidebar = () => (
    <aside className="w-64 h-full border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
        <nav className="space-y-1">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-primary-500 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        )
                    }
                >
                    <span>{link.icon}</span>
                    {link.label}
                </NavLink>
            ))}
        </nav>
    </aside>
);

export default AdminSidebar;