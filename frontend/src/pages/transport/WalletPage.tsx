import { useEffect, useState } from 'react';
import { getPayments } from '../../api/transport/paymentApi';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

const parsePayments = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.payments)) return data.payments;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

const WalletPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const result = await getPayments({ limit: 20 });
                setPayments(parsePayments(result));
            } catch {
                setError('Wallet payments are unavailable for transport right now.');
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, []);

    const totalAmount = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Wallet</p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">Transport payment tracker</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400">Track your transport payments, recent wallet transactions, and payment status in one place.</p>
                    </div>
                    <Link
                        to="/transport-admin"
                        className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Wallet balance</p>
                            <p className="mt-3 text-4xl font-semibold text-white">{loading ? '—' : formatCurrency(totalAmount, 'KES')}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-200">
                            <p className="text-slate-400">Transactions</p>
                            <p className="mt-2 text-2xl font-semibold text-white">{loading ? '—' : payments.length}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Latest status</p>
                            <p className="mt-3 text-lg font-semibold text-white">{payments[0]?.status || (loading ? '—' : 'Unavailable')}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Payment source</p>
                            <p className="mt-3 text-lg font-semibold text-white">{payments[0]?.method || (loading ? '—' : 'system')}</p>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                            {error}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
                            {loading ? 'Loading wallet transactions...' : payments.length === 0 ? 'No transport wallet payment transactions found.' : `${payments.length} recent transport payments loaded.`}
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Wallet actions</p>
                    <div className="mt-5 space-y-4">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                            <p className="text-sm font-medium text-white">Payment overview</p>
                            <p className="mt-2 text-sm text-slate-400">Review your system payments and reconcile transport balances.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                            <p className="text-sm font-medium text-white">Wallet guidance</p>
                            <p className="mt-2 text-sm text-slate-400">The transport API does not currently expose a dedicated wallet summary, so this page surfaces available payment data where possible.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-white">Recent transport payments</h2>
                {loading ? (
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">Loading transactions…</div>
                ) : payments.length === 0 ? (
                    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">No payment records available.</div>
                ) : (
                    <div className="mt-6 space-y-3">
                        {payments.map((payment, index) => (
                            <div key={payment._id || payment.id || index} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-slate-400">{payment.reference || payment._id || `Payment #${index + 1}`}</p>
                                        <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(payment.amount || 0, payment.currency || 'KES')}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Status</p>
                                        <p className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-slate-200">{payment.status || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <p className="text-sm text-slate-400">Method: {payment.method || 'N/A'}</p>
                                    <p className="text-sm text-slate-400">Date: {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'Unknown'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletPage;
