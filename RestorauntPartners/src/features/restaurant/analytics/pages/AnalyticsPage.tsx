import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../../analytics/services/analyticsService';

export default function AnalyticsPage() {
  const { data } = useQuery({ queryKey: ['restaurant-analytics'], queryFn: fetchAnalytics });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Analytics</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Understand sales trends and order performance.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {data?.insights.map((insight) => (
          <div key={insight.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{insight.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-50">{insight.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
