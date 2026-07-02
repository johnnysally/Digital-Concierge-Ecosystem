import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../../analytics/services/analyticsService';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['transport-dashboard-analytics'],
    queryFn: () => fetchAnalytics('rider-1'), // Replace with actual rider ID from context
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        Unable to load dashboard. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-sm text-slate-500">Real-time delivery statistics and performance metrics.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm text-slate-500">Active Deliveries</h3>
          <p className="mt-3 text-3xl font-bold text-slate-900">{data?.activeDeliveries ?? 0}</p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm text-slate-500">Today's Earnings</h3>
          <p className="mt-3 text-3xl font-bold text-slate-900">KES {data?.totalEarnings?.toFixed(2) ?? '0.00'}</p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm text-slate-500">Average Rating</h3>
          <p className="mt-3 text-3xl font-bold text-slate-900">{data?.averageRating?.toFixed(1) ?? '0.0'} ★</p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-sm text-slate-500">Completion Rate</h3>
          <p className="mt-3 text-3xl font-bold text-slate-900">{data?.completionRate?.toFixed(0) ?? '0'}%</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Weekly Revenue</h3>
          <p className="mt-4 text-2xl font-bold text-emerald-600">KES {data?.weeklyRevenue?.toFixed(2) ?? '0.00'}</p>
          <p className="mt-2 text-sm text-slate-500">Last 7 days</p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Monthly Revenue</h3>
          <p className="mt-4 text-2xl font-bold text-emerald-600">KES {data?.monthlyRevenue?.toFixed(2) ?? '0.00'}</p>
          <p className="mt-2 text-sm text-slate-500">Current month</p>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <h3 className="text-lg font-semibold text-slate-900">Performance Stats</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Total Deliveries</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{data?.totalDeliveries ?? 0}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Peak Hours</p>
            <p className="mt-2 text-sm text-slate-900">{data?.peakHours?.join(', ') ?? 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
