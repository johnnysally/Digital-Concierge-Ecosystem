import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEarnings } from '../../earnings/services/earningsService';

export default function EarningsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-earnings'],
    queryFn: () => fetchEarnings('rider-1'),
  });

  const history = useMemo(() => data?.earnings ?? [], [data]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Earnings</h2>
            <p className="mt-2 text-sm text-slate-500">Monitor your payout cadence, revenue growth, and payment history.</p>
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
      </section>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load earnings. Please refresh the page.
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">Total earnings</p>
              <p className="mt-4 text-4xl font-semibold text-emerald-600">KES {data?.totalEarnings?.toFixed(2) ?? '0.00'}</p>
              <p className="mt-3 text-sm text-slate-500">All-time earnings for your rider account.</p>
            </article>
            <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">Pending payout</p>
              <p className="mt-4 text-4xl font-semibold text-orange-600">KES {data?.pendingAmount?.toFixed(2) ?? '0.00'}</p>
              <p className="mt-3 text-sm text-slate-500">Amount currently waiting to be paid out.</p>
            </article>
            <article className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <p className="text-sm text-slate-500">Paid out</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">KES {data?.paidOut?.toFixed(2) ?? '0.00'}</p>
              <p className="mt-3 text-sm text-slate-500">Total amount already settled.</p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Revenue trend</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">This month</span>
              </div>
              <div className="mt-8 space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const amount = history[index]?.amount ?? Math.round(Math.random() * 2000 + 400);
                  return (
                    <div key={day} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{day}</span>
                        <span className="font-semibold text-slate-900">KES {amount.toFixed(0)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${Math.min(amount / 30, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-xl font-semibold text-slate-900">Upcoming payout</h3>
              <p className="mt-2 text-sm text-slate-500">Expected payout arrival and method.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Next payout</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">KES {data?.nextPayout?.amount?.toFixed(2) ?? '0.00'}</p>
                  <p className="mt-1 text-sm text-slate-500">Scheduled for {data?.nextPayout?.date ?? 'Friday, 25 April'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Payment method</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{data?.nextPayout?.method ?? 'Mobile money'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Earnings history</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Latest 12 entries</span>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 font-semibold text-slate-900">Date</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Reference</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Amount</th>
                    <th className="px-4 py-3 font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length ? (
                    history.map((earning: any) => (
                      <tr key={earning.id} className="border-b border-slate-200 last:border-none">
                        <td className="px-4 py-4">{new Date(earning.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">{earning.deliveryId || '#N/A'}</td>
                        <td className="px-4 py-4 font-semibold text-slate-900">KES {earning.amount.toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${earning.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                            {earning.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                        No earnings history available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
