import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../../analytics/services/analyticsService';

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-analytics'],
    queryFn: () => fetchAnalytics('rider-1'), // Replace with actual rider ID
  });

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Analytics</h2>
            <p className="mt-2 text-sm text-slate-500">Performance insights and detailed metrics.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load analytics. Please refresh the page.
        </div>
      ) : isLoading ? (
        <div className="text-sm text-slate-500">Loading analytics...</div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Total Deliveries</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">{data?.totalDeliveries ?? 0}</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Completion Rate</h3>
              <p className="mt-3 text-3xl font-bold text-emerald-600">{data?.completionRate?.toFixed(1) ?? '0.0'}%</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Average Rating</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {data?.averageRating?.toFixed(1) ?? '0.0'} ★
              </p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Total Earnings</h3>
              <p className="mt-3 text-3xl font-bold text-emerald-600">KES {data?.totalEarnings?.toFixed(2) ?? '0.00'}</p>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Peak Delivery Hours</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {data?.peakHours?.length ? (
                data.peakHours.map((hour: string, idx: number) => (
                  <div key={idx} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-sm text-slate-600">{hour}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No peak hours data available.</p>
              )}
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
        </>
      )}
    </div>
  );
}
