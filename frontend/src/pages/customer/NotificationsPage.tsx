import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { api } from '../../api/axios';
import { timeAgo } from '../../utils/formatDate';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/notifications')
            .then((res) => setNotifications(res.data.notifications || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="space-y-8"><SectionHeader title="Notifications" subtitle="Stay updated on bookings, orders, rides, and promotions." /><div className="text-slate-400">Loading...</div></div>;

    return (
        <div className="space-y-8">
            <SectionHeader title="Notifications" subtitle="Stay updated on bookings, orders, rides, and promotions." />
            {notifications.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">No notifications yet.</div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div key={n._id} className={`rounded-3xl border p-5 ${n.isRead ? 'border-slate-800 bg-slate-900' : 'border-sky-800 bg-sky-950/50'}`}>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-white text-sm">{n.title}</h4>
                                <span className="text-xs text-slate-500">{timeAgo(n.createdAt)}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-400">{n.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;