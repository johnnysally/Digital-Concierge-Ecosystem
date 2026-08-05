import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';
import { getOrders } from '../../api/restaurant/orderApi';
import { getItems } from '../../api/restaurant/menuApi';
import { getStaff } from '../../api/restaurant/staffApi';
import { getPayments } from '../../api/restaurant/paymentApi';
import { useRestaurantTheme } from '../../components/restaurant/layout/theme';

const DashboardPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersRes, itemsRes, staffRes, paymentsRes] = await Promise.all([
                    getOrders({ limit: 6 }).catch((err) => {
                        if (err?.response?.status === 401 || err?.response?.status === 404) return { orders: [] };
                        throw err;
                    }),
                    getItems({ limit: 8 }).catch((err) => {
                        if (err?.response?.status === 401 || err?.response?.status === 404) return { items: [] };
                        throw err;
                    }),
                    getStaff({ active: true }).catch((err) => {
                        if (err?.response?.status === 401 || err?.response?.status === 404) return { staff: [] };
                        throw err;
                    }),
                    getPayments({ limit: 6 }).catch((err) => {
                        if (err?.response?.status === 401 || err?.response?.status === 404) return { payments: [] };
                        throw err;
                    }),
                ]);

                setOrders(ordersRes.orders || []);
                setItems(itemsRes.items || []);
                setStaff(staffRes.staff || []);
                setPayments(paymentsRes.payments || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load restaurant dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const theme = useRestaurantTheme();
    const isLight = theme === 'light';

    const totalRevenue = useMemo(() => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0), [payments]);
    const deliveredOrders = useMemo(() => orders.filter((order) => order.status === 'delivered').length, [orders]);
    const cancelledOrders = useMemo(() => orders.filter((order) => order.status === 'cancelled').length, [orders]);
    const activeOrders = useMemo(() => orders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length, [orders]);
    const averageOrderValue = useMemo(() => (orders.length ? totalRevenue / orders.length : 0), [orders.length, totalRevenue]);
    const averageItemsPerOrder = useMemo(() => {
        if (!orders.length) return 0;
        const totalItems = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
        return Math.round(totalItems / orders.length);
    }, [orders]);
    const largestOrderSize = useMemo(() => {
        if (!orders.length) return 0;
        return Math.max(...orders.map((order) => order.items?.length || 0));
    }, [orders]);
    const activeOrderRatio = useMemo(() => (orders.length ? Math.round((activeOrders / orders.length) * 100) : 0), [activeOrders, orders.length]);

    const stats = useMemo(() => [
        { label: 'Orders', value: orders.length, hint: 'Latest orders', icon: '📦' },
        { label: 'Revenue', value: formatCurrency(totalRevenue, 'KES'), hint: 'Collected payments', icon: '💰' },
        { label: 'Active staff', value: staff.length, hint: 'On shift', icon: '👩‍🍳' },
        { label: 'Menu items', value: items.length, hint: 'Live catalog', icon: '🍽️' },
    ], [orders.length, formatCurrency(totalRevenue, 'KES'), items.length, staff.length]);

    const pendingOrders = activeOrders;

    const orderStatusData = useMemo(() => {
        const breakdown = orders.reduce((acc: Record<string, number>, order) => {
            const status = order.status || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(breakdown).map(([status, count]) => ({ status, count }));
    }, [orders]);

    const paymentTrend = useMemo(() => {
        const buckets: Record<string, number> = {};
        payments.forEach((payment) => {
            if (!payment.createdAt) return;
            const date = new Date(payment.createdAt);
            const key = date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
            buckets[key] = (buckets[key] || 0) + Number(payment.amount || 0);
        });
        return Object.entries(buckets).map(([date, amount]) => ({ date, amount }));
    }, [payments]);

    const getDeliveryAddress = (order: any) => {
        if (!order.deliveryAddress) return 'No address';
        if (typeof order.deliveryAddress === 'string') return order.deliveryAddress;
        return order.deliveryAddress.street || order.deliveryAddress.address || 'Address provided';
    };

    return (
        <div className="space-y-6">
            <div className={`rounded-[28px] border border-amber-500/20 p-4 shadow-[0_18px_60px_-20px_rgba(245,158,11,0.35)] sm:p-6 ${isLight ? 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))]' : 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(135deg,_rgba(17,24,39,0.95),_rgba(2,6,23,0.95))]'}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Restaurant Dashboard</p>
                        <h1 className={`mt-3 text-2xl font-semibold sm:text-3xl ${isLight ? 'text-slate-900' : 'text-white'}`}>Run your kitchen from one live workspace</h1>
                        <p className={`mt-3 max-w-2xl text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>The restaurant portal is now aligned with the backend menu, orders, staff, payments, and profile modules.</p>
                    </div>
                    <div className={`rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm ${isLight ? 'text-amber-700' : 'text-amber-200'}`}>
                        <p className="font-semibold">Today's pulse</p>
                        <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{pendingOrders} live orders need attention</p>
                    </div>
                </div>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((card) => (
                    <div key={card.label} className={`rounded-[24px] border p-4 shadow-sm sm:p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <div className="flex items-center justify-between">
                            <p className={`text-xs uppercase tracking-[0.24em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{card.label}</p>
                            <span className="text-xl">{card.icon}</span>
                        </div>
                        <p className={`mt-3 text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{card.value}</p>
                        <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{card.hint}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className={`rounded-[24px] border p-4 shadow-sm sm:p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Recent orders</h2>
                            <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Status updates come directly from the restaurant order API.</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-700 bg-slate-950 text-slate-300'}`}>Live</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {loading ? (
                            <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>Loading orders...</div>
                        ) : orders.length ? (
                            <>
                                <div className={`rounded-[24px] border p-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/80'}`}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Average items per order</p>
                                            <p className={`mt-2 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{averageItemsPerOrder}</p>
                                            <p className="mt-1 text-sm text-slate-500">Aligned with recent orders volume</p>
                                        </div>
                                        <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'}`}>Order insight</div>
                                    </div>
                                </div>
                                <div className={`rounded-[24px] border p-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/80'}`}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Largest order size</p>
                                            <p className={`mt-2 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{largestOrderSize}</p>
                                            <p className="mt-1 text-sm text-slate-500">Max item count in a recent order</p>
                                        </div>
                                        <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'}`}>Order size</div>
                                    </div>
                                </div>
                                <div className={`rounded-[24px] border p-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/80'}`}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Active order share</p>
                                            <p className={`mt-2 text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeOrders}</p>
                                            <p className="mt-1 text-sm text-slate-500">{activeOrderRatio}% of recent orders are still active</p>
                                        </div>
                                        <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'}`}>Order health</div>
                                    </div>
                                </div>
                                <div className={`rounded-[24px] border p-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/80'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Order status diagram</p>
                                            <p className="mt-1 text-sm text-slate-500">Visual representation of recent order counts.</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'}`}>Live</span>
                                    </div>
                                    <div className="mt-4 h-28 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={orderStatusData.length ? orderStatusData : [{ status: 'none', count: 1 }]} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#334155'} vertical={false} />
                                                <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: isLight ? '#475569' : '#cbd5e1', fontSize: 11 }} />
                                                <YAxis hide />
                                                <Tooltip
                                                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                                                    contentStyle={{ backgroundColor: isLight ? '#ffffff' : '#0f172a', borderColor: isLight ? '#e2e8f0' : '#1e293b', color: isLight ? '#0f172a' : '#f8fafc' }}
                                                    itemStyle={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                                                />
                                                <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                {orders.map((order: any) => (
                                    <div key={order._id} className={`rounded-2xl border p-3 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                                    {order.customer?.firstName || 'Customer'} {order.customer?.lastName || ''}
                                                </p>
                                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                                    {order.items?.length || 0} items · {getDeliveryAddress(order)}
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                                order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                                                order.status === 'ready' ? 'bg-amber-500/10 text-amber-600' :
                                                order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600' :
                                                isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
                                            }`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>No recent orders found.</div>
                        )}
                    </div>
                </div>

                <div className={`rounded-[24px] border p-4 shadow-sm sm:p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                    <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Kitchen readiness</h2>
                    <div className="mt-4 space-y-3">
                        <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>
                            <p className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold`}>Total revenue</p>
                            <p className="mt-1">{formatCurrency(totalRevenue, 'KES')} captured from recent payments.</p>
                        </div>
                        <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>
                            <p className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold`}>Delivered orders</p>
                            <p className="mt-1">{deliveredOrders} orders were marked delivered.</p>
                        </div>
                        <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>
                            <p className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold`}>Average order value</p>
                            <p className="mt-1">{formatCurrency(averageOrderValue, 'KES')} per order.</p>
                        </div>
                    </div>
                    <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/80 p-5">
                        <h3 className="text-base font-semibold text-white">Order status distribution</h3>
                        <div className="mt-4 h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData.length ? orderStatusData : [{ status: 'no data', count: 1 }]}
                                        dataKey="count"
                                        nameKey="status"
                                        innerRadius={44}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        stroke="transparent"
                                        labelLine={false}
                                        label={({ status, percent }) => `${status}: ${Math.round(percent * 100)}%`}
                                    >
                                        {orderStatusData.length
                                            ? orderStatusData.map((entry, index) => (
                                                <Cell key={`order-status-${entry.status}`} fill={['#f59e0b', '#22c55e', '#38bdf8', '#f97316', '#a855f7'][index % 5]} />
                                            ))
                                            : <Cell fill="#475569" />}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ color: '#cbd5e1', fontSize: 12, marginTop: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/80 p-5">
                        <h3 className="text-base font-semibold text-white">Payment trend</h3>
                        <div className="mt-4 h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={paymentTrend} margin={{ top: 8, right: 12, left: -10, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={40} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Bar dataKey="amount" name="Payments" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;