import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDeliveries, acceptDelivery, updateDeliveryStatus } from '../../deliveries/services/deliveriesService';

export default function DeliveriesPage() {
  const queryClient = useQueryClient();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['transport-deliveries'],
    queryFn: () => fetchDeliveries('rider-1'), // Replace with actual rider ID
  });

  const acceptMutation = useMutation({
    mutationFn: (deliveryId: string) => acceptDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-deliveries'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ deliveryId, status }: { deliveryId: string; status: string }) =>
      updateDeliveryStatus(deliveryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-deliveries'] });
    },
  });

  const handleAcceptDelivery = async (deliveryId: string) => {
    setSelectedDeliveryId(deliveryId);
    try {
      await acceptMutation.mutateAsync(deliveryId);
    } catch (error) {
      console.error('Failed to accept delivery', error);
    } finally {
      setSelectedDeliveryId(null);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, status: string) => {
    setSelectedDeliveryId(deliveryId);
    try {
      await statusMutation.mutateAsync({ deliveryId, status });
    } catch (error) {
      console.error('Failed to update delivery status', error);
    } finally {
      setSelectedDeliveryId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Deliveries</h2>
            <p className="mt-2 text-sm text-slate-500">Manage your active and past deliveries.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing…' : 'Refresh list'}
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-sm text-red-700">
          Unable to load deliveries. Please refresh the page.
        </div>
      ) : (
        <div className="space-y-6">
          {data?.deliveries?.length ? (
            data.deliveries.map((delivery: any) => (
              <div
                key={delivery.id}
                className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/80"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Order #{delivery.orderDetails.id}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      From: {delivery.pickupLocation.address}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">To: {delivery.deliveryLocation.address}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Earning: KES {delivery.earning.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {delivery.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleAcceptDelivery(delivery.id)}
                        disabled={acceptMutation.isLoading && selectedDeliveryId === delivery.id}
                        className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {acceptMutation.isLoading && selectedDeliveryId === delivery.id ? 'Accepting…' : 'Accept'}
                      </button>
                    )}
                    {delivery.status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(delivery.id, 'picked_up')}
                        disabled={statusMutation.isLoading && selectedDeliveryId === delivery.id}
                        className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        {statusMutation.isLoading && selectedDeliveryId === delivery.id ? 'Updating…' : 'Picked Up'}
                      </button>
                    )}
                    {delivery.status === 'picked_up' && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(delivery.id, 'in_transit')}
                        disabled={statusMutation.isLoading && selectedDeliveryId === delivery.id}
                        className="rounded-3xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                      >
                        {statusMutation.isLoading && selectedDeliveryId === delivery.id ? 'Updating…' : 'In Transit'}
                      </button>
                    )}
                    {delivery.status === 'in_transit' && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                        disabled={statusMutation.isLoading && selectedDeliveryId === delivery.id}
                        className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {statusMutation.isLoading && selectedDeliveryId === delivery.id ? 'Updating…' : 'Delivered'}
                      </button>
                    )}
                    <span className="rounded-3xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900">
                      {delivery.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80">
              No deliveries available.
            </div>
          )}
        </div>
      )}

      {(acceptMutation.isError || statusMutation.isError) && (
        <div className="text-sm text-red-500">Unable to update delivery. Please try again.</div>
      )}
    </div>
  );
}
