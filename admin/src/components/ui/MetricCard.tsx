import { cn } from '../../utils/helpers';

interface MetricCardProps {
    label: string;
    value: string | number;
    trend?: string;
    icon?: string;
    color?: string;
}

const MetricCard = ({ label, value, trend, icon, color }: MetricCardProps) => (
    <div className={cn('rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900', color)}>
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            {icon && <span className="text-xl">{icon}</span>}
        </div>
        <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
    </div>
);

export default MetricCard;