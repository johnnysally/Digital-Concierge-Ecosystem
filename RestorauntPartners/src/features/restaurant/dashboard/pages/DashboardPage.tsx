import { useQuery } from '@tanstack/react-query';
import { fetchDashboardMetrics } from '../../dashboard/services/dashboardService';

export default function DashboardPage() {
  const { data } = useQuery({ queryKey: ['dashboard-metrics'], queryFn: fetchDashboardMetrics });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data?.metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-50">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{metric.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Today's Orders</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review latest restaurant orders and statuses.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">AI Business Insights</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Predict demand, pricing, and promotion performance.</p>
        </div>
      </section>
    </div>
  );
}
