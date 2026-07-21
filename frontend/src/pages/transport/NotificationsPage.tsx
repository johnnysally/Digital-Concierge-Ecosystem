import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/transport/notifications')
            .then((res) => setNotifications(res.data.notifications || []))
            .catch(() => setNotifications([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Notifications</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Transport alerts</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">View transport system notifications, driver alerts, and ride updates.</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">No transport notifications available yet.</div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id || notification._id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">{notification.title || 'Notification'}</p>
                                    <p className="mt-1 text-sm text-slate-400">{notification.message || notification.text || 'No details available.'}</p>
                                </div>
                                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Unknown'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
