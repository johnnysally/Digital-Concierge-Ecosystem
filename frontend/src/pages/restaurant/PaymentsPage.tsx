import { useEffect, useState } from 'react';
import { getOrders } from '../../api/restaurant/orderApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const response = await getOrders({ limit: 50 });
                const derivedPayments = (response.orders || []).map((order: any) => ({
                    _id: order._id,
                    reference: `Order #${String(order._id).slice(-6).toUpperCase()}`,
                    amount: order.total,
                    currency: order.currency || 'KES',
                    status: order.paymentStatus || 'pending',
                    paymentMethod: order.paymentMethod || 'Unspecified',
                    createdAt: order.createdAt,
                    orderStatus: order.status,
                }));
                setPayments(derivedPayments);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load payment data.');
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Payments</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Live payment activity</h1>
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Settlement records are derived from the restaurant orders endpoint in the backend.</p>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4">
                {loading ? <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>Loading payments...</div> : payments.length ? payments.map((payment) => (
                    <div key={payment._id} className={`rounded-[24px] border p-5 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{payment.reference || 'Payment'}</p>
                                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Status: {payment.status || 'Pending'} • {payment.paymentMethod || 'Unspecified'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-amber-500">{payment.amount ? `${payment.currency} ${payment.amount}` : '—'}</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>
                    </div>
                )) : <div className={`rounded-2xl border p-3 text-sm ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-950/70 text-slate-400'}`}>No payment activity found.</div>}
            </div>
        </div>
    );
};

export default PaymentsPage;
