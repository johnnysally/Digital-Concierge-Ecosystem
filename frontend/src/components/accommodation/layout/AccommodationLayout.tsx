import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAccommodationTheme } from '../../../context/accommodation/ThemeContext';
import { getNotifications } from '../../../api/accommodation/notificationApi';
import { getMyProperties } from '../../../api/accommodation/propertyApi';
import { getReservations } from '../../../api/accommodation/reservationApi';
import { getGuests } from '../../../api/accommodation/guestApi';
import { getRooms } from '../../../api/accommodation/roomApi';
import { getStaff } from '../../../api/accommodation/staffApi';
import { getAccommodationAnalytics } from '../../../api/accommodation/analyticsApi';

    const navGroups = [
        {
            title: 'Core',
            items: [
                { to: '/accommodation/dashboard', label: 'Dashboard', description: 'Command center' },
                { to: '/accommodation/analytics', label: 'Analytics', description: 'Performance insights' },
            ],
        },
        {
            title: 'Property management',
            items: [
                { to: '/accommodation/properties', label: 'Properties', description: 'Manage sites' },
                { to: '/accommodation/rooms', label: 'Rooms', description: 'Availability & setup' },
                { to: '/accommodation/staff', label: 'Staff', description: 'Team roster' },
            ],
        },
        {
            title: 'Guest operations',
            items: [
                { to: '/accommodation/reservations', label: 'Reservations', description: 'Bookings & arrivals' },
                { to: '/accommodation/guests', label: 'Guests', description: 'Guest records' },
                { to: '/accommodation/housekeeping', label: 'Housekeeping', description: 'Room readiness' },
            ],
        },
        {
            title: 'Business tools',
            items: [
                { to: '/accommodation/promotions', label: 'Promotions', description: 'Offers & campaigns' },
                { to: '/accommodation/documents', label: 'Documents', description: 'Files & policies' },
                { to: '/accommodation/profile', label: 'Profile', description: 'Account details' },
                { to: '/accommodation/settings', label: 'Settings', description: 'Portal preferences' },
            ],
        },
    ];

type AccommodationNotification = {
    id: string;
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

type GuestCareItem = {
    id: string;
    guestName: string;
    note: string;
    date: string;
    status: string;
};

const AccommodationLayout = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useAccommodationTheme();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [notificationError, setNotificationError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [summaryStats, setSummaryStats] = useState({
        properties: 0,
        reservations: 0,
        guests: 0,
        rooms: 0,
        staff: 0,
        occupancy: 0,
    });
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [guestCareData, setGuestCareData] = useState({
        pendingRequests: 0,
        upcomingArrivals: 0,
        items: [] as GuestCareItem[],
    });
    const [guestCareLoading, setGuestCareLoading] = useState(true);

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

    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        setNotificationError(null);

        try {
            const data = await getNotifications({ limit: 5 });
            const rawNotifications = (data.notifications || []) as AccommodationNotification[];
            const formattedNotifications = rawNotifications.map((notification) => ({
                id: notification.id || notification._id || 'unknown',
                title: notification.title || 'Notification',
                message: notification.message || notification.text || '',
                time: formatRelativeTime(notification.createdAt),
                unread: notification.isRead === undefined ? Boolean(notification.unread) : !notification.isRead,
            }));

            setNotifications(formattedNotifications);
            setUnreadCount(formattedNotifications.filter((notification) => notification.unread).length);
        } catch (error) {
            setNotificationError('Unable to load notifications');
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const loadSummaryStats = async () => {
            try {
                setSummaryLoading(true);
                setGuestCareLoading(true);
                const [propertiesRes, reservationsRes, guestsRes, roomsRes, staffRes, analyticsRes] = await Promise.all([
                    getMyProperties(),
                    getReservations({ limit: 1000 }),
                    getGuests(),
                    getRooms({ limit: 1000 }),
                    getStaff({ limit: 1000 }),
                    getAccommodationAnalytics().catch(() => null),
                ]);

                const reservations = reservationsRes?.reservations || [];
                const now = new Date();
                const upcomingWindow = new Date(now);
                upcomingWindow.setDate(now.getDate() + 3);

                const followUpItems = reservations
                    .filter((reservation: any) => Boolean(reservation.notes) || ['pending', 'checked_in'].includes(reservation.status))
                    .slice(0, 3)
                    .map((reservation: any) => ({
                        id: reservation._id || reservation.id || `${reservation.guestName}-${reservation.checkIn}`,
                        guestName: reservation.guestName || reservation.customer?.firstName || 'Guest',
                        note: reservation.notes || (reservation.status === 'pending' ? 'Awaiting arrival confirmation.' : 'Needs a follow-up before check-in.'),
                        date: reservation.checkIn ? new Date(reservation.checkIn).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'TBD',
                        status: reservation.status || 'pending',
                    }));

                const upcomingArrivals = reservations.filter((reservation: any) => {
                    if (!['confirmed', 'pending'].includes(reservation.status)) return false;
                    const checkIn = new Date(reservation.checkIn);
                    return checkIn >= now && checkIn <= upcomingWindow;
                }).length;

                setSummaryStats({
                    properties: propertiesRes?.properties?.length || 0,
                    reservations: reservations.length,
                    guests: guestsRes?.guests?.length || 0,
                    rooms: roomsRes?.rooms?.length || 0,
                    staff: staffRes?.staff?.length || 0,
                    occupancy: analyticsRes?.analytics?.occupancy || 0,
                });
                setGuestCareData({
                    pendingRequests: followUpItems.length,
                    upcomingArrivals,
                    items: followUpItems,
                });
            } catch (error) {
                setSummaryStats({ properties: 0, reservations: 0, guests: 0, rooms: 0, staff: 0, occupancy: 0 });
                setGuestCareData({ pendingRequests: 0, upcomingArrivals: 0, items: [] });
            } finally {
                setSummaryLoading(false);
                setGuestCareLoading(false);
            }
        };

        loadSummaryStats();
    }, []);

    const handleToggleNotifications = () => {
        const next = !showNotifications;
        setShowNotifications(next);
        if (next && notifications.length === 0) {
            fetchNotifications();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('digitalsafaris_accommodation');
        localStorage.removeItem('digitalsafaris_partner');
        localStorage.removeItem('digitalsafaris_customer');
        navigate('/accommodation/login', { replace: true });
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <div className="flex min-h-screen flex-col lg:flex-row lg:h-screen overflow-hidden">
                <aside
                    className={`w-full border-b p-6 shadow-sm lg:w-80 lg:border-b-0 lg:border-r lg:pb-10 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto ${isDark ? 'border-slate-800 bg-slate-900/95 text-slate-100 shadow-slate-950/40' : 'border-slate-200 bg-white/95 text-slate-900 shadow-slate-900/10'}`}
                >
                    <div className="flex min-h-[100%] flex-col justify-between gap-8">
                        <div className="space-y-8">
                            <div className={`rounded-[32px] border p-5 shadow-sm transition ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                        <span className="text-xl">🏨</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">Digital Safaris</p>
                                        <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Accommodation</h1>
                                    </div>
                                </div>
                                <p className={`mt-4 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Manage stays, reservations, and guest operations from one beautifully organized workspace.
                                </p>
                            </div>

                            <div className={`rounded-[32px] border p-5 shadow-sm transition ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'}`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Quick actions</p>
                                        <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            Switch theme or jump to your most used sections.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-slate-500 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-100'}`}
                                    >
                                        {isDark ? 'Light' : 'Dark'}
                                    </button>
                                </div>
                            </div>

                            <nav className="space-y-4">
                                {navGroups.map((group) => (
                                    <div key={group.title} className="space-y-2">
                                        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{group.title}</p>
                                        <div className="space-y-1.5">
                                            {group.items.map((item: any) => (
                                                <NavLink
                                                    key={item.to}
                                                    to={item.to}
                                                    className={({ isActive }) =>
                                                        `flex flex-col rounded-2xl border px-4 py-3 text-left transition ${
                                                            isActive
                                                                ? isDark
                                                                    ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 shadow-sm'
                                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm'
                                                                : isDark
                                                                ? 'border-transparent bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                                                                : 'border-transparent bg-white/70 text-slate-700 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                                        }`
                                                    }
                                                >
                                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                                        <span className={`h-2.5 w-2.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                                                        {item.label}
                                                    </span>
                                                    <span className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.description}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${
                                isDark
                                    ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-rose-400 hover:text-rose-300'
                                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-rose-400 hover:text-rose-600'
                            }`}
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-slate-950/90' : 'bg-slate-100'}`}>
                    <div className="mx-auto w-full max-w-7xl space-y-6">
                        <section className={`rounded-[32px] border px-6 py-6 shadow-xl transition ${isDark ? 'border-slate-800 bg-slate-950/95 text-slate-100 shadow-slate-950/30' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] ${isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                                            Digital Safaris dashboard
                                        </span>
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                            Operations center
                                        </span>
                                    </div>
                                    <h1 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Accommodation overview
                                    </h1>
                                    <p className={`max-w-2xl text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        A polished command center for arrivals, room readiness, guest care, and daily performance.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                                            isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:border-slate-500 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-100'
                                        }`}
                                    >
                                        {isDark ? 'Light' : 'Dark'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleToggleNotifications}
                                        className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold transition ${
                                            isDark ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-slate-900/10 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900 shadow-slate-900/5 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span className="text-base">🔔</span>
                                        <div className="flex flex-col text-left">
                                            <span>Notifications</span>
                                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {unreadCount > 0 ? `${unreadCount} new` : 'No new alerts'}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className={`mb-6 grid gap-3 rounded-[24px] border p-4 md:grid-cols-4 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>●</div>
                                    <div>
                                        <p className={`text-xs uppercase tracking-[0.24em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Occupancy</p>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{summaryLoading ? '...' : `${summaryStats.occupancy}%`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>⏱</div>
                                    <div>
                                        <p className={`text-xs uppercase tracking-[0.24em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Arrivals</p>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{guestCareLoading ? '...' : `${guestCareData.upcomingArrivals} today`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>✉</div>
                                    <div>
                                        <p className={`text-xs uppercase tracking-[0.24em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Follow-ups</p>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{guestCareLoading ? '...' : `${guestCareData.pendingRequests} pending`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDark ? 'bg-violet-500/15 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>⚡</div>
                                    <div>
                                        <p className={`text-xs uppercase tracking-[0.24em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Alerts</p>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{unreadCount > 0 ? `${unreadCount} new` : 'Stable'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div className={`rounded-[28px] border px-5 py-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Properties</p>
                                    <p className={`mt-4 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {summaryLoading ? '...' : summaryStats.properties}
                                    </p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Live properties connected to your account.
                                    </p>
                                </div>
                                <div className={`rounded-[28px] border px-5 py-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Reservations</p>
                                    <p className={`mt-4 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {summaryLoading ? '...' : summaryStats.reservations}
                                    </p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Active bookings in your current pipeline.
                                    </p>
                                </div>
                                <div className={`rounded-[28px] border px-5 py-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Guests</p>
                                    <p className={`mt-4 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {summaryLoading ? '...' : summaryStats.guests}
                                    </p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Returning guests linked to your reservations.
                                    </p>
                                </div>
                                <div className={`rounded-[28px] border px-5 py-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Performance</p>
                                    <p className={`mt-4 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {summaryLoading ? '...' : `${summaryStats.occupancy}%`}
                                    </p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Current occupancy pulse from your operations data.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Active workspace moved up to follow the navbar/header */}
                        <section>
                            <div className={`rounded-[28px] border p-6 shadow-xl transition ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-slate-950/30' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            Workspace
                                        </p>
                                        <h2 className={`mt-1 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Active workspace
                                        </h2>
                                        <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Manage your reservation flow, guest interactions, and daily operations from one refined workspace.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={fetchNotifications}
                                            className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                                                isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                                            }`}>
                                            Refresh alerts
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/accommodation/reservations')}
                                            className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                                                isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                                            }`}>
                                            New reservation
                                        </button>
                                    </div>
                                </div>
                                <div className={`rounded-[28px] border p-5 transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                                    <Outlet />
                                </div>
                            </div>
                        </section>

                        <section className={`rounded-[28px] border p-6 shadow-xl transition ${isDark ? 'border-slate-800 bg-slate-950/95 text-slate-100 shadow-slate-950/30' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Recent activity</p>
                                    <h3 className={`mt-1 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Latest updates across the property</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/accommodation/reservations')}
                                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
                                >
                                    View all
                                </button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-3">
                                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming arrivals</p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{guestCareLoading ? 'Loading...' : `${guestCareData.upcomingArrivals} reservations are due within the next 3 days.`}</p>
                                </div>
                                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Guest care queue</p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{guestCareLoading ? 'Loading...' : `${guestCareData.pendingRequests} follow-up items are waiting for attention.`}</p>
                                </div>
                                <div className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>System health</p>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Portal data is synced and operational for reservations, guests, and rooms.</p>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[2.3fr_1fr]">
                            <div className="space-y-6">
                                <div className={`rounded-[28px] border p-8 min-h-[420px] shadow-xl transition ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-slate-950/30' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className={`text-xs uppercase tracking-[0.24em] text-emerald-400`}>Today's priority</p>
                                            <h3 className={`mt-2 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                Confirm arrival readiness
                                            </h3>
                                        </div>
                                        <span className={`rounded-full px-4 py-2 text-sm font-semibold uppercase ${isDark ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                                            High priority
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Review today’s incoming reservations, verify room readiness, and follow up on pending guest requests to keep operations smooth.
                                    </p>
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/accommodation/reservations')}
                                            className={`w-full rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15' : 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'}`}
                                        >
                                            Review reservation queue
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/accommodation/rooms')}
                                            className={`w-full rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-100'}`}
                                        >
                                            Confirm room readiness
                                        </button>
                                    </div>
                                </div>

                                <div className={`rounded-[28px] border p-8 shadow-xl transition ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-slate-950/30' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className={`text-xs uppercase tracking-[0.24em] ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Guest care</p>
                                            <h3 className={`mt-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                Follow up on special requests
                                            </h3>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${isDark ? 'bg-amber-500/20 text-amber-200' : 'bg-amber-100 text-amber-700'}`}>
                                            {guestCareLoading ? '...' : `${guestCareData.pendingRequests} pending`}
                                        </span>
                                    </div>
                                    <p className={`mt-4 text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Keep arrival surprises low by checking special requests, notes, and upcoming arrivals before guests check in.
                                    </p>
                                    <div className={`mt-5 rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Upcoming arrivals</span>
                                            <span className="font-semibold text-emerald-500">{guestCareLoading ? '...' : `${guestCareData.upcomingArrivals} in 3 days`}</span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Special requests</span>
                                            <span className="font-semibold text-amber-500">{guestCareLoading ? '...' : `${guestCareData.pendingRequests} active`}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {guestCareLoading ? (
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading guest follow-ups...</p>
                                        ) : guestCareData.items.length > 0 ? (
                                            guestCareData.items.map((item) => (
                                                <div key={item.id} className={`rounded-2xl border px-3 py-3 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.guestName}</p>
                                                        <span className={`text-xs uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.date}</span>
                                                    </div>
                                                    <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.note}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No guest follow-ups from the current reservation pool.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-6">
                                <div className={`rounded-[28px] border p-5 transition ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-slate-950/20' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                Notifications
                                            </p>
                                            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                Latest alerts at a glance.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleToggleNotifications}
                                            className={`rounded-2xl border px-3 py-2 text-sm transition ${
                                                isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                                            }`}>
                                            {showNotifications ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {showNotifications ? (
                                        <div className="space-y-3">
                                            {notificationError ? (
                                                <p className="text-sm text-rose-400">{notificationError}</p>
                                            ) : notifications.length === 0 ? (
                                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No recent notifications.</p>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`rounded-3xl border px-4 py-3 ${
                                                            notification.unread ? 'border-emerald-500/20 bg-emerald-500/5' : isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
                                                        }`}>
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p className={`font-medium ${notification.unread ? 'text-emerald-300' : isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                                                {notification.title}
                                                            </p>
                                                            <span className="text-xs text-slate-400">{notification.time}</span>
                                                        </div>
                                                        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ) : (
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Notifications are hidden. Toggle to see your latest alerts.
                                        </p>
                                    )}
                                </div>

                                <div className={`rounded-[32px] border p-6 transition ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100 shadow-slate-950/20' : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'}`}>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quick actions</p>
                                    <div className="mt-6 grid gap-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/accommodation/reservations')}
                                            className={`w-full min-h-[72px] rounded-3xl border px-5 py-4 text-left text-base font-semibold transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-100'}`}
                                        >
                                            View reservations
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/accommodation/guests')}
                                            className={`w-full min-h-[72px] rounded-3xl border px-5 py-4 text-left text-base font-semibold transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-100'}`}
                                        >
                                            Review guest list
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/accommodation/rooms')}
                                            className={`w-full min-h-[72px] rounded-3xl border px-5 py-4 text-left text-base font-semibold transition ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-100'}`}
                                        >
                                            Update availability
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccommodationLayout;
