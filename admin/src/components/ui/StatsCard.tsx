interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
}

const StatsCard = ({ title, value, subtitle }: StatsCardProps) => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
        <p className="text-xs uppercase tracking-wider text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
);

export default StatsCard;