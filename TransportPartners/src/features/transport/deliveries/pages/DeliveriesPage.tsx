import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDeliveries, acceptDelivery, updateDeliveryStatus } from '../../deliveries/services/deliveriesService';

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  accepted: 'bg-sky-100 text-sky-700',
  picked_up: 'bg-amber-100 text-amber-700',
  in_transit: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
};

export default function DeliveriesPage() {
  const queryClient = useQueryClient();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [filter, setFilter] = useState('active');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-deliveries'],
    queryFn: () => fetchDeliveries('rider-1'),
  });

  const acceptMutation = useMutation({
    mutationFn: (deliveryId: string) => acceptDelivery(deliveryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transport-deliveries'] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ deliveryId, status }: { deliveryId: string; status: string }) =>
      updateDeliveryStatus(deliveryId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transport-deliveries'] }),
  });

  const deliveries = data?.deliveries ?? [];
  const filteredDeliveries = useMemo(() => {
    if (filter === 'active') return deliveries.filter((item: any) => item.status !== 'delivered');
    if (filter === 'completed') return deliveries.filter((item: any) => item.status === 'delivered');
    return deliveries;
  }, [deliveries, filter]);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Deliveries</h2>
            <p className="mt-2 text-sm text-slate-500">Track and manage every delivery assigned to you.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing…' : 'Refresh list'}
            </button>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {filteredDeliveries.length} items
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {['active', 'completed', 'all'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                filter === option ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {isError ? (
            <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
              Unable to load deliveries. Please refresh the page.
            </div>
          ) : (
            <> 
              {filteredDeliveries.length ? (
                filteredDeliveries.map((delivery: any) => (
                  <div
                    key={delivery.id}
                    className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/80"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">Order #{delivery.orderDetails?.id || delivery.id}</h3>
                          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[delivery.status] || 'bg-slate-100 text-slate-700'}`}>
                            {delivery.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">From: {delivery.pickupLocation?.address ?? 'N/A'}</p>
                        <p className="text-sm text-slate-500">To: {delivery.deliveryLocation?.address ?? 'N/A'}</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Delivery ETA</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{delivery.eta || '22 min'}</p>
                          </div>
                          <div className="rounded-3xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Earning</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">KES {delivery.earning?.toFixed(2) ?? '0.00'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {delivery.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeliveryId(delivery.id);
                              acceptMutation.mutateAsync(delivery.id).finally(() => setSelectedDeliveryId(null));
                            }}
                            disabled={acceptMutation.isLoading && selectedDeliveryId === delivery.id}
                            className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {acceptMutation.isLoading && selectedDeliveryId === delivery.id ? 'Accepting…' : 'Accept'}
                          </button>
                        )}
                        {delivery.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeliveryId(delivery.id);
                              statusMutation.mutateAsync({ deliveryId: delivery.id, status: 'picked_up' }).finally(() => setSelectedDeliveryId(null));
                            }}
                            disabled={statusMutation.isLoading && selectedDeliveryId === delivery.id}
                            className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                          >
                            {statusMutation.isLoading && selectedDeliveryId === delivery.id ? 'Updating…' : 'Picked Up'}
                          </button>
                        )}
                        {delivery.status === 'picked_up' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeliveryId(delivery.id);
                              statusMutation.mutateAsync({ deliveryId: delivery.id, status: 'in_transit' }).finally(() => setSelectedDeliveryId(null));
                            }}
                            disabled={statusMutation.isLoading && selectedDeliveryId === delivery.id}
                            className="rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                          >
                            {statusMutation.isLoading && selectedDeliveryId === delivery.id ? 'Updating…' : 'In Transit'}
                          </button>
                        )}
                        {delivery.status === 'in_transit' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeliveryId(delivery.id);
                              statusMutation.mutateAsync({ deliveryId: delivery.id, status: 'delivered' }).finally(() => setSelectedDeliveryId(null));
                            }}
                            disabled={statusMutation.isLoading && selectedDeliveryId === delivery.id}
                            className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {statusMutation.isLoading && selectedDeliveryId === delivery.id ? 'Updating…' : 'Delivered'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80">
                  No deliveries match this filter.
                </div>
              )}
            </>
          )}

          {(acceptMutation.isError || statusMutation.isError) && (
            <div className="text-sm text-red-500">Unable to update delivery. Please try again.</div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-xl font-semibold text-slate-900">Live map</h3>
            <p className="mt-2 text-sm text-slate-500">Track your current route at a glance.</p>
            <div className="mt-6 h-72 rounded-3xl bg-slate-100 p-6">
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Map preview goes here</div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="text-xl font-semibold text-slate-900">Delivery metrics</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Pending assignments</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{deliveries.filter((item: any) => item.status === 'pending').length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">In transit</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{deliveries.filter((item: any) => item.status === 'in_transit').length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Completed today</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{deliveries.filter((item: any) => item.status === 'delivered').length}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
