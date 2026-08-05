import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReservations } from '../../api/accommodation/reservationApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';

const WalletPage = () => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'payouts'>('transactions');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [summary, setSummary] = useState({ revenue: 0, paid: 0, pending: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'transactions') {
            setLoading(true);
            getReservations({ limit: 1000 })
                .then((response) => {
                    const reservations = Array.isArray(response.reservations) ? response.reservations : [];
                    const valid = reservations.filter((r: any) => Number(r.totalAmount) > 0);
                    const revenue = valid.reduce((sum: number, item: any) => sum + Number(item.totalAmount || 0), 0);
                    const paid = valid.filter((item: any) => item.paymentStatus === 'paid').length;
                    const pending = valid.filter((item: any) => item.paymentStatus !== 'paid').length;
                    setTransactions(valid);
                    setSummary({ revenue, paid, pending, count: valid.length });
                })
                .catch((err: any) => setError(err?.response?.data?.message || 'Unable to load.'))
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            api.get('/accommodation/wallet/payouts')
                .then((res) => {
                    setPayouts(res.data.payouts || []);
                    setTotalPayouts(res.data.totalAmount || 0);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Wallet</p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">Revenue & Payouts</h1>
                    </div>
                    <Link to="/accommodation/dashboard" className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">Back to dashboard</Link>
                </div>
            </div>

            <div className="flex gap-2">
                {[
                    { key: 'transactions', label: '📊 Transactions' },
                    { key: 'payouts', label: '💰 Payouts' },
                ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}

            {activeTab === 'transactions' && (
                <>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total revenue</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : formatCurrency(summary.revenue, 'KES')}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Paid</p>
                            <p className="mt-3 text-3xl font-semibold text-emerald-300">{loading ? '—' : summary.paid}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pending</p>
                            <p className="mt-3 text-3xl font-semibold text-amber-300">{loading ? '—' : summary.pending}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Count</p>
                            <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : summary.count}</p>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                        {loading ? <p className="text-slate-400 p-4">Loading...</p> :
                         transactions.length === 0 ? <p className="text-slate-400 p-4">No transactions found.</p> :
                         <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {transactions.map((t) => (
                                <div key={t._id} className="p-4 rounded-xl bg-slate-900 text-sm hover:bg-slate-800/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{t.guestName || t.customer?.firstName || 'Guest'} {t.customer?.lastName || ''}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{t.property?.name || 'N/A'}</p>
                                            {t.room && <p className="text-xs text-slate-500">Room {t.room.roomNumber} · {t.room.type}</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-emerald-400 font-semibold text-base">{formatCurrency(t.totalAmount, 'KES')}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${t.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{t.paymentStatus || 'pending'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                                        <span>📅 {t.checkIn ? new Date(t.checkIn).toLocaleDateString() : 'N/A'} → {t.checkOut ? new Date(t.checkOut).toLocaleDateString() : 'N/A'}</span>
                                        <span>🕐 {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</span>
                                        <span className="capitalize">📍 {t.source || 'booking'}</span>
                                        <span className="capitalize">📋 {t.status || 'N/A'}</span>
                                    </div>
                                </div>
                            ))}
                         </div>}
                    </div>
                </>
            )}

            {activeTab === 'payouts' && (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
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