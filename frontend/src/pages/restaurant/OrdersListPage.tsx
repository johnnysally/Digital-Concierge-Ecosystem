import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurantOrders, setRestaurantOrders } from './mockData';

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

const OrdersListPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setOrders(getRestaurantOrders());
        setLoading(false);
    }, []);

    const handleStatusChange = (id: string, status: string) => {
        const nextOrders = orders.map((order) => order._id === id ? { ...order, status } : order);
        setOrders(nextOrders);
        setRestaurantOrders(nextOrders);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Orders</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Track restaurant orders</h1>
                <p className="mt-2 text-sm text-slate-400">Use the backend order service to keep the kitchen flow moving.</p>
            </div>

            <div className="grid gap-4">
                {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading orders...</div> : orders.length ? orders.map((order) => (
                    <div key={order._id} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-semibold text-white">{order.customer?.firstName || 'Customer'} {order.customer?.lastName || ''}</p>
                                <p className="mt-2 text-sm text-slate-400">{order.items?.length || 0} items • {order.orderType || 'delivery'} • {order.total ? `KES ${Number(order.total).toFixed(2)}` : 'Total pending'}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <select className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" value={order.status || 'pending'} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                                    {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <Link to={`/restaurant-admin/orders/${order._id}`} className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">View</Link>
                            </div>
                        </div>
                    </div>
                )) : <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No orders yet.</div>}
            </div>
        </div>
    );
};

export default OrdersListPage;
