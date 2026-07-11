interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export default SectionHeader;