interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
    <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
        <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center justify-start sm:justify-end">{action}</div>}
    </div>
);

export default SectionHeader;