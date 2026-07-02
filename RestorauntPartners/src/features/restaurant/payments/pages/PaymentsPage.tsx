import { useQuery } from '@tanstack/react-query';
import { fetchPaymentsOverview } from '../../payments/services/paymentsService';

export default function PaymentsPage() {
  const { data, isFetching, refetch } = useQuery({ queryKey: ['restaurant-payments'], queryFn: fetchPaymentsOverview });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Payments</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track payouts, commissions, and wallet settlement history.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {isFetching ? 'Refreshing…' : 'Refresh overview'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Wallet Balance</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">{data?.balance ?? '--'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending Payouts</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">{data?.pending ?? '--'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">{data?.totalRevenue ?? '--'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Commissions</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-50">{data?.commissions ?? '--'}</p>
        </div>
      </div>
    </div>
  );
}
