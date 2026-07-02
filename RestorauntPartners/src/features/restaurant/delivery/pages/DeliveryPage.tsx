import { useQuery } from '@tanstack/react-query';
import { fetchDeliveryRequests } from '../../delivery/services/deliveryService';

export default function DeliveryPage() {
  const { data, isFetching, refetch } = useQuery({ queryKey: ['restaurant-delivery'], queryFn: fetchDeliveryRequests });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Delivery Integration</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">View rider requests, assign pickup, and track arrival times.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {isFetching ? 'Refreshing…' : 'Refresh requests'}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {data?.requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Order #{request.orderId}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Rider: {request.rider || 'Unassigned'}</p>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">ETA: {request.eta}</div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">Delivery Type</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">{request.deliveryType}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-50">{request.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
