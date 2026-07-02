import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  markNotificationRead,
} from '../../notifications/services/notificationsService';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['restaurant-notifications'],
    queryFn: fetchNotifications,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurant-notifications'] }),
  });

  const handleMarkRead = async (id: string) => {
    setSelectedNotificationId(id);
    try {
      await mutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark notification read', error);
    } finally {
      setSelectedNotificationId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Notifications</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Stay on top of new orders, refunds, and platform alerts.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {isLoading ? 'Refreshing…' : 'Refresh list'}
          </button>
        </div>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          Unable to load notifications. Please refresh the page.
        </div>
      ) : (
        <div className="space-y-4">
          {data?.notifications?.length ? (
            data.notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{notification.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{notification.body}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {notification.read ? 'Read' : 'New'}
                    </span>
                    {!notification.read && (
                      <button
                        type="button"
                        className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={mutation.isLoading && selectedNotificationId === notification.id}
                      >
                        {mutation.isLoading && selectedNotificationId === notification.id ? 'Marking…' : 'Mark read'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              No notifications found.
            </div>
          )}
        </div>
      )}

      {mutation.isError && (
        <div className="text-sm text-red-500">Unable to update notification status. Please try again.</div>
      )}
    </div>
  );
}
