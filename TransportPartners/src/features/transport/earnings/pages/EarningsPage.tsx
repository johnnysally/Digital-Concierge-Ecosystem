import { useQuery } from '@tanstack/react-query';
import { fetchEarnings } from '../../earnings/services/earningsService';

export default function EarningsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-earnings'],
    queryFn: () => fetchEarnings('rider-1'), // Replace with actual rider ID
  });

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Earnings</h2>
            <p className="mt-2 text-sm text-slate-500">Track your income and payment history.</p>
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
          Unable to load earnings. Please refresh the page.
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Total Earnings</h3>
              <p className="mt-3 text-3xl font-bold text-emerald-600">KES {data?.totalEarnings?.toFixed(2) ?? '0.00'}</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Pending Payments</h3>
              <p className="mt-3 text-3xl font-bold text-orange-600">KES {data?.pendingAmount?.toFixed(2) ?? '0.00'}</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
              <h3 className="text-sm text-slate-500">Paid Out</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">KES {data?.paidOut?.toFixed(2) ?? '0.00'}</p>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-900">Earnings History</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Delivery</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.earnings?.length ? (
                    data.earnings.map((earning: any) => (
                      <tr key={earning.id} className="border-b border-slate-200">
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(earning.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{earning.deliveryId}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                          KES {earning.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              earning.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {earning.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-sm text-slate-500">
                        No earnings history.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
