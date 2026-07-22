import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../api/restaurant/orderApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

const OrdersListPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await getOrders({ limit: 50 });
                setOrders(response.orders || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load orders.');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateOrderStatus(id, status);
            setOrders((current) => current.map((order) => order._id === id ? { ...order, status } : order));
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to update order status.');
        }
    };

    return (
        <div className="space-y-6">
            <div className={`rounded-[24px] border p-4 sm:p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-950/70'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Orders</p>
                <h1 className={`mt-2 text-2xl font-semibold sm:text-3xl ${isLight ? 'text-slate-900' : 'text-white'}`}>Track restaurant orders</h1>
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Use the backend order service to keep the kitchen flow moving.</p>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4">
                {loading ? <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>Loading orders...</div> : orders.length ? orders.map((order) => (
                    <div key={order._id} className={`rounded-[24px] border p-5 shadow-sm ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{order.customer?.firstName || 'Customer'} {order.customer?.lastName || ''}</p>
                                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{order.items?.length || 0} items • {order.orderType || 'delivery'} • {order.total ? `KES ${Number(order.total).toFixed(2)}` : 'Total pending'}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <select className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`} value={order.status || 'pending'} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                                    {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <Link to={`/restaurant-admin/orders/${order._id}`} className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-950 text-slate-200'}`}>View</Link>
                            </div>
                        </div>
                    </div>
                )) : <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>No orders yet.</div>}
            </div>
        </div>
    );
};

export default OrdersListPage;
