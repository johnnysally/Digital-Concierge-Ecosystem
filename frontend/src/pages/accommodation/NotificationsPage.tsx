import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/accommodation/notificationApi';
import { useAccommodationTheme } from '../../context/accommodation/ThemeContext';

type AccommodationNotification = {
    id?: string;
    _id?: string;
    title?: string;
    message?: string;
    text?: string;
    createdAt?: string | Date;
    isRead?: boolean;
    unread?: boolean;
};

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
};

const NotificationsPage = () => {
    const navigate = useNavigate();
    const { isDark, accentColor } = useAccommodationTheme();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const formatRelativeTime = (value?: string | Date) => {
        if (!value) return 'Just now';
        const now = new Date();
        const then = new Date(value);
        const diffMinutes = Math.floor((now.getTime() - then.getTime()) / 60000);
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const loadNotifications = async (showSpinner = true) => {
        if (showSpinner) {
            setLoading(true);
        }
        setError(null);

        try {
            const data = await getNotifications({ limit: 50 });
            const rawNotifications = (data.notifications || []) as AccommodationNotification[];
            const formatted = rawNotifications.map((item) => ({
                id: item.id || item._id || 'unknown',
                title: item.title || 'Notification',
                message: item.message || item.text || '',
                time: formatRelativeTime(item.createdAt),
                unread: item.isRead === undefined ? Boolean(item.unread) : !item.isRead,
            }));
            setNotifications(formatted);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to load notifications');
        } finally {
            if (showSpinner) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        void loadNotifications(true);
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await markNotificationRead(id);
            setNotifications((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to update notification');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            setRefreshing(true);
            await markAllNotificationsRead();
            setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to update notifications');
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Notifications</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Activity and alerts</h2>
                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Stay on top of new bookings, guest updates, and property activity from the backend notification service.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => void loadNotifications(true)}
                        className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
                    >
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={() => void handleMarkAllRead()}
                        className="rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                        {refreshing ? 'Updating...' : 'Mark all read'}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
            ) : null}

            <div className={`rounded-[28px] border p-4 shadow-xl ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white'}`}>
                {loading ? (
                    <div className={`rounded-2xl border p-6 text-sm ${isDark ? 'border-slate-800 bg-slate-900/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className={`rounded-2xl border p-6 text-sm ${isDark ? 'border-slate-800 bg-slate-900/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                        No notifications yet. New alerts from the backend will appear here.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                className={`rounded-3xl border p-4 transition ${item.unread ? `border-emerald-500/20 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}` : isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                                            {item.unread ? <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-400">New</span> : null}
                                        </div>
                                        <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.message}</p>
                                        <p className={`mt-3 text-xs uppercase tracking-[0.24em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.time}</p>
                                    </div>
                                    {item.unread ? (
                                        <button
                                            type="button"
                                            onClick={() => void handleMarkRead(item.id)}
                                            className="rounded-2xl border border-emerald-500/30 px-3 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
                                        >
                                            Mark read
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
