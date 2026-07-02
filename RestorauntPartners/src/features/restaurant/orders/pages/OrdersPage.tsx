import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus } from '../../orders/services/ordersService';

type Order = {
  id: string;
  customer: string;
  status: string;
  total: string;
  eta?: string;
};

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['restaurant-orders'],
    queryFn: fetchOrders,
  });

  const mutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
    },
  });

  const handleUpdate = async (orderId: string, status: string) => {
    setActiveOrderId(orderId);
    try {
      await mutation.mutateAsync({ orderId, status });
    } catch (err) {
      // keep console logging minimal; UI shows mutation.isError
      console.error('Failed to update order status', err);
    } finally {
      setActiveOrderId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load orders.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Order Management</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage order fulfillment and view incoming requests.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 text-left dark:bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Order</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">ETA</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data?.orders?.map((order: Order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.status}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.total}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.eta ?? '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      onClick={() => handleUpdate(order.id, 'Preparing')}
                      disabled={mutation.isLoading && activeOrderId === order.id}
                    >
                      {mutation.isLoading && activeOrderId === order.id ? 'Updating...' : 'Preparing'}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      onClick={() => handleUpdate(order.id, 'Ready')}
                      disabled={mutation.isLoading && activeOrderId === order.id}
                    >
                      {mutation.isLoading && activeOrderId === order.id ? 'Updating...' : 'Ready'}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      onClick={() => handleUpdate(order.id, 'Delivered')}
                      disabled={mutation.isLoading && activeOrderId === order.id}
                    >
                      {mutation.isLoading && activeOrderId === order.id ? 'Updating...' : 'Delivered'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mutation.isError && <div className="text-sm text-red-500">Unable to update order at this time.</div>}
    </div>
  );
}
