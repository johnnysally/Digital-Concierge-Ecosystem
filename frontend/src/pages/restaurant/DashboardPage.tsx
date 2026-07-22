import { useEffect, useMemo, useState } from 'react';
import { getOrders } from '../../api/restaurant/orderApi';
import { getItems } from '../../api/restaurant/menuApi';
import { getStaff } from '../../api/restaurant/staffApi';
import { getPayments } from '../../api/restaurant/paymentApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

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

    const isLight = getStoredRestaurantTheme() === 'light';

    const stats = useMemo(() => [
        { label: 'Orders', value: orders.length, hint: 'Latest orders', icon: '📦' },
        { label: 'Menu items', value: items.length, hint: 'Live catalog', icon: '🍽️' },
        { label: 'Active staff', value: staff.length, hint: 'On shift', icon: '👩‍🍳' },
        { label: 'Payments', value: payments.length, hint: 'Recent settlements', icon: '💳' },
    ], [orders.length, items.length, staff.length, payments.length]);

    const pendingOrders = orders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length;

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
                            orders.map((order: any) => (
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
                            ))
                        ) : (
                            <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>No recent orders found.</div>
                        )}
                    </div>
                </div>

                <div className={`rounded-[24px] border p-4 shadow-sm sm:p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                    <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Kitchen readiness</h2>
                    <div className="mt-4 space-y-3">
                        <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>
                            <p className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold`}>Menu coverage</p>
                            <p className="mt-1">{items.length} dishes currently available for guests.</p>
                        </div>
                        <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>
                            <p className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold`}>Staff availability</p>
                            <p className="mt-1">{staff.length} team members are set to active.</p>
                        </div>
                        <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>
                            <p className={`${isLight ? 'text-slate-900' : 'text-white'} font-semibold`}>Payment activity</p>
                            <p className="mt-1">{payments.length} recent payment records are available.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;