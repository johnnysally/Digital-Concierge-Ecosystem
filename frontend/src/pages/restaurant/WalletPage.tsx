import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../api/restaurant/orderApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';

const WalletPage = () => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'payouts'>('transactions');
    const [orders, setOrders] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'transactions') {
            setLoading(true);
            getOrders({ limit: 100 })
                .then((res) => setOrders(res.orders || res.items || []))
                .catch((err: any) => setError(err?.response?.data?.message || 'Unable to load.'))
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            api.get('/restaurant/wallet/payouts')
                .then((res) => {
                    setPayouts(res.data.payouts || []);
                    setTotalPayouts(res.data.totalAmount || 0);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const paidCount = orders.filter((o: any) => o.paymentStatus === 'paid').length;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Wallet</p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">Revenue & Payouts</h1>
                    </div>
                    <Link to="/restaurant-admin" className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800">Back to dashboard</Link>
                </div>
            </div>

            <div className="flex gap-2">
                {[
                    { key: 'transactions', label: '📊 Transactions' },
                    { key: 'payouts', label: '💰 Payouts' },
                ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

            {activeTab === 'transactions' && (
                <>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total Revenue</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : formatCurrency(totalRevenue, 'KES')}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Orders</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : orders.length}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Paid</p>
                            <p className="mt-3 text-3xl font-semibold text-emerald-300">{loading ? '—' : paidCount}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                        {loading ? <p className="text-slate-400 p-4">Loading...</p> :
                         orders.length === 0 ? <p className="text-slate-400 p-4">No orders found.</p> :
                         <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {orders.map((order) => (
                                <div key={order._id} className="p-4 rounded-xl bg-slate-900 text-sm hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{order.customer?.firstName || 'Customer'} {order.customer?.lastName || ''}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{order.items?.length || 0} items</p>
                                            {order.deliveryAddress?.street && <p className="text-xs text-slate-500">📍 {order.deliveryAddress.street}{order.deliveryAddress.city ? ', ' + order.deliveryAddress.city : ''}</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-amber-400 font-semibold text-base">{formatCurrency(order.total, 'KES')}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${order.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{order.paymentStatus || 'pending'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                                        <span>🕐 {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'} · {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        <span className="capitalize">📋 {order.status || 'N/A'}</span>
                                        <span className="capitalize">🚚 {order.orderType || 'delivery'}</span>
                                    </div>
                                </div>
                            ))}
                         </div>}
                    </div>
                </>
            )}

            {activeTab === 'payouts' && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total Payouts</p>
                            <p className="mt-3 text-3xl font-semibold text-emerald-300">{formatCurrency(totalPayouts, 'KES')}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Payout Count</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{payouts.length}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                        {loading ? <p className="text-slate-400 p-4">Loading...</p> :
                         payouts.length === 0 ? <p className="text-slate-400 p-4">No payouts released yet.</p> :
                         <div className="space-y-2">
                            {payouts.map((p) => (
                                <div key={p._id} className="flex justify-between p-4 rounded-xl bg-slate-900 text-sm">
                                    <div>
                                        <p className="text-white font-medium">{p.reference || 'Payout'}</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(p.createdAt).toLocaleDateString()} · {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-emerald-400 font-semibold text-base">{formatCurrency(p.amount, 'KES')}</p>
                                        <span className="text-xs text-slate-400 capitalize mt-1 inline-block">{p.method?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            ))}
                         </div>}
                    </div>
                </>
            )}
        </div>
    );
};

export default WalletPage;