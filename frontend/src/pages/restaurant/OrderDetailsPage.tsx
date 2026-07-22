import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../api/restaurant/orderApi';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        const loadOrder = async () => {
            try {
                const response = await getOrder(id);
                setOrder(response.order);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load order details.');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    if (loading) return <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Loading order...</div>;
    if (error) return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>;
    if (!order) return <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Order not found.</div>;

    const formatAddress = (address: any) => {
        if (!address) return '—';
        if (typeof address === 'string') return address;
        return [address.street, address.city].filter(Boolean).join(', ') || 'Address provided';
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Order Details</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">{order.customer?.firstName || 'Customer'} {order.customer?.lastName || ''}</h1>
            </div>

            <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3 text-sm text-slate-400">
                        <p><span className="font-semibold text-slate-200">Status:</span> {order.status}</p>
                        <p><span className="font-semibold text-slate-200">Phone:</span> {order.customer?.phone || '—'}</p>
                        <p><span className="font-semibold text-slate-200">Order type:</span> {order.orderType || 'delivery'}</p>
                        <p><span className="font-semibold text-slate-200">Payment:</span> {order.paymentStatus || 'pending'}</p>
                        <p><span className="font-semibold text-slate-200">Delivery address:</span> {formatAddress(order.deliveryAddress)}</p>
                        <p><span className="font-semibold text-slate-200">Notes:</span> {order.notes || '—'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-sm font-semibold text-white">Items</p>
                        <div className="mt-3 space-y-2">
                            {order.items?.map((item: any) => (
                                <div key={item._id} className="flex items-center justify-between text-sm text-slate-400">
                                    <span>{item.menuItem?.name || item.name || 'Item'}</span>
                                    <span>{item.quantity || 1} × {item.price ? `KES ${Number(item.price).toFixed(2)}` : '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
