import { cn } from '../../utils/helpers';

interface StatusBadgeProps {
    status: string;
    type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const variants: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

const StatusBadge = ({ status, type = 'neutral' }: StatusBadgeProps) => (
    <span className={cn('inline-block rounded-full px-3 py-1 text-xs font-medium', variants[type])}>
        {status}
    </span>
);

export default StatusBadge;