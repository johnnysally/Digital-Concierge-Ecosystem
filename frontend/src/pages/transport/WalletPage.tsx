import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPayments } from '../../api/transport/paymentApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { getTransportPath } from '../../utils/transportRoutes';
import { api } from '../../api/axios';

const parsePayments = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.payments)) return data.payments;
    if (Array.isArray(data.items)) return data.items;
    return [];
};

const WalletPage = () => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'payouts'>('transactions');
    const [payments, setPayments] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'transactions') {
            setLoading(true);
            getPayments({ limit: 20 })
                .then((result) => setPayments(parsePayments(result)))
                .catch(() => { setError('Unable to load payments.'); setPayments([]); })
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            api.get('/transport/wallet/payouts')
                .then((res) => {
                    setPayouts(res.data.payouts || []);
                    setTotalPayouts(res.data.totalAmount || 0);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    const totalAmount = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Wallet</p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">Payments & Payouts</h1>
                    </div>
                    <Link to={getTransportPath('')} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800">Back to dashboard</Link>
                </div>
            </div>

            <div className="flex gap-2">
                {[
                    { key: 'transactions', label: '📊 Transactions' },
                    { key: 'payouts', label: '💰 Payouts' },
                ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

            {activeTab === 'transactions' && (
                <>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total Volume</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : formatCurrency(totalAmount, 'KES')}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transactions</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : payments.length}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Latest Status</p>
                            <p className="mt-3 text-lg font-semibold text-white">{payments[0]?.status || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                        {loading ? <p className="text-slate-400 p-4">Loading...</p> :
                         payments.length === 0 ? <p className="text-slate-400 p-4">No transactions found.</p> :
                         <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {payments.map((payment, i) => (
                                <div key={payment._id || i} className="p-4 rounded-xl bg-slate-900 text-sm hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{payment.reference || 'Payment #' + (i + 1)}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 capitalize">{payment.method} · {payment.type}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-emerald-400 font-semibold text-base">{formatCurrency(payment.amount, 'KES')}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${payment.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{payment.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3 text-xs text-slate-500">
                                        <span>🕐 {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'} · {payment.createdAt ? new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
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