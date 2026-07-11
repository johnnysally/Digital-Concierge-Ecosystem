import { useRevenueReport } from '../../hooks/useReports';
import { formatCompact } from '../../utils/formatCurrency';

const RevenueChart = () => {
    const { revenue, loading } = useRevenueReport();

    if (loading) return <div className="p-8 text-center text-slate-400">Loading chart...</div>;

    const max = Math.max(...revenue.map((r: any) => r.total), 1);

    return (
        <div className="space-y-3">
            {revenue.slice(-7).map((item: any) => (
                <div key={item._id} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-slate-500">{item._id}</span>
                    <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(item.total / max) * 100}%` }} />
                    </div>
                    <span className="w-20 text-xs font-medium text-right">{formatCompact(item.total)}</span>
                </div>
            ))}
        </div>
    );
};

export default RevenueChart;