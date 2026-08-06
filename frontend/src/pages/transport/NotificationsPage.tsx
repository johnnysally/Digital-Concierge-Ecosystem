import { useEffect, useState } from 'react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../api/transport/notificationApi';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        getNotifications()
            .then((res) => setNotifications(res.notifications || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Updates</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Notifications</h2>
            </div>

            {notifications.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{unreadCount} unread</p>
                    {unreadCount > 0 && (
                        <button onClick={async () => { await markAllAsRead(); load(); }} className="text-sm text-sky-400 hover:text-sky-300">Mark all read</button>
                    )}
                </div>
            )}

            {notifications.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">No notifications.</div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div key={n._id} className={`rounded-3xl border p-5 transition group ${n.isRead ? 'border-slate-800 bg-slate-950/80' : 'border-sky-800 bg-sky-950/50'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                                        <h4 className="font-semibold text-white text-sm">{n.title}</h4>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-400">{n.message}</p>
                                    <span className="text-xs text-slate-500 mt-2 inline-block">{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                                    {!n.isRead && (
                                        <button onClick={async () => { await markAsRead(n._id); load(); }} className="text-xs text-sky-400 hover:text-sky-300">Read</button>
                                    )}
                                    <button onClick={async () => { await deleteNotification(n._id); load(); }} className="text-xs text-slate-500 hover:text-red-400">✕</button>
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