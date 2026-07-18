import { cn } from '../../utils/helpers';

interface MetricCardProps {
    label: string;
    value: string | number;
    trend?: string;
    icon?: string;
    color?: string;
}

const MetricCard = ({ label, value, trend, icon, color }: MetricCardProps) => (
    <div className={cn('flex min-h-[150px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900', color)}>
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
            </div>
            {icon && <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-xl dark:bg-slate-800">{icon}</span>}
        </div>
        {trend && <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{trend}</p>}
    </div>
);

export default MetricCard;