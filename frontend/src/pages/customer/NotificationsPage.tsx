import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../api/customer/notificationApi';
import { timeAgo } from '../../utils/formatDate';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = () => {
        getNotifications()
            .then((res) => setNotifications(res.notifications || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadNotifications(); }, []);

    const handleMarkRead = async (id: string) => {
        await markAsRead(id);
        setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleDelete = async (id: string) => {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (loading) return (
        <div className="space-y-8">
            <SectionHeader title="Notifications" subtitle="Stay updated on bookings, orders, rides, and promotions." />
            <div className="text-slate-400 py-12 text-center">Loading...</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <SectionHeader title="Notifications" subtitle="Stay updated on bookings, orders, rides, and promotions." />

            {notifications.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{unreadCount} unread</p>
                    {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-sm text-sky-400 hover:text-sky-300">
                            Mark all as read
                        </button>
                    )}
                </div>
            )}

            {notifications.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                    <div className="text-5xl mb-4">🔔</div>
                    <p className="text-lg text-white font-semibold">No notifications yet</p>
                    <p className="text-sm mt-2">We'll notify you about bookings, rides, orders, and promotions.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`rounded-3xl border p-5 transition group relative ${
                                n.isRead ? 'border-slate-800 bg-slate-900' : 'border-sky-800 bg-sky-950/50'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
                                        <h4 className="font-semibold text-white text-sm truncate">{n.title}</h4>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-400">{n.message}</p>
                                    <span className="inline-block mt-2 text-xs text-slate-500">{timeAgo(n.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition">
                                    {!n.isRead && (
                                        <button onClick={() => handleMarkRead(n._id)} className="text-xs text-sky-400 hover:text-sky-300">
                                            Read
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(n._id)} className="text-xs text-slate-500 hover:text-red-400">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;