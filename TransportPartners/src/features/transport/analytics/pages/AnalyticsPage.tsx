import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../../analytics/services/analyticsService';

const metricCards = [
  { title: 'Total Deliveries', key: 'totalDeliveries', highlight: false },
  { title: 'On-time delivery', key: 'completionRate', highlight: true },
  { title: 'Average rating', key: 'averageRating', highlight: false },
  { title: 'Total earnings', key: 'totalEarnings', highlight: true },
];

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-analytics'],
    queryFn: () => fetchAnalytics('rider-1'),
  });

  const insightItems = useMemo(
    () => data?.insights ?? [
      'Delivery accuracy improved by 8% this week.',
      'Peak demand is expected at 5 PM.',
      'Customer satisfaction has held steady above 4.7 stars.',
    ],
    [data],
  );

  if (isLoading) {
    return (
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="text-sm text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
        Unable to load analytics. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Analytics</h2>
            <p className="mt-2 text-sm text-slate-500">Understand your performance and discover opportunities to improve.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const value = data?.[metric.key];
          const display = metric.key === 'completionRate' ? `${value?.toFixed(1) ?? '0.0'}%` : metric.key === 'averageRating' ? `${value?.toFixed(1) ?? '0.0'} ★` : metric.key === 'totalEarnings' ? `KES ${value?.toFixed(2) ?? '0.00'}` : `${value ?? 0}`;
          return (
            <article key={metric.key} className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">{metric.title}</p>
              <p className={`mt-4 text-4xl font-semibold ${metric.highlight ? 'text-emerald-600' : 'text-slate-900'}`}>{display}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-xl font-semibold text-slate-900">Insight feed</h3>
          <div className="mt-6 space-y-4">
            {insightItems.map((insight: string) => (
              <div key={insight} className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                {insight}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-xl font-semibold text-slate-900">Peak delivery hours</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {data?.peakHours?.length ? (
              data.peakHours.map((hour: string, idx: number) => (
                <div key={idx} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Hourly window</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{hour}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">No peak hours data available.</div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Route efficiency</h3>
          <p className="mt-2 text-sm text-slate-500">Average time saved per delivery.</p>
          <p className="mt-6 text-4xl font-semibold text-slate-900">{data?.routeEfficiency?.toFixed(1) ?? '0.0'}%</p>
        </article>

        <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Customer satisfaction</h3>
          <p className="mt-2 text-sm text-slate-500">Average score from recent feedback.</p>
          <p className="mt-6 text-4xl font-semibold text-slate-900">{data?.customerSatisfaction?.toFixed(1) ?? '0.0'} ★</p>
        </article>

        <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900">Weekly growth</h3>
          <p className="mt-2 text-sm text-slate-500">Change in delivery activity compared to last week.</p>
          <p className="mt-6 text-4xl font-semibold text-emerald-600">{data?.weeklyGrowth?.toFixed(1) ?? '0.0'}%</p>
        </article>
      </section>
    </div>
  );
}
