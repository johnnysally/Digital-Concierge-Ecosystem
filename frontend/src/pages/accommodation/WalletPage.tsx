import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReservations } from '../../api/accommodation/reservationApi';
import { formatCurrency } from '../../utils/formatCurrency';

const WalletPage = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState({ revenue: 0, paid: 0, pending: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadWallet = async () => {
            try {
                const response = await getReservations({ limit: 1000 });
                const reservations = Array.isArray(response.reservations)
                    ? response.reservations
                    : Array.isArray(response.items)
                    ? response.items
                    : [];
                const validTransactions = reservations.filter((reservation: any) => Number(reservation.totalAmount) > 0);
                const revenue = validTransactions.reduce((sum: number, item: any) => sum + Number(item.totalAmount || 0), 0);
                const paid = validTransactions.filter((item: any) => item.paymentStatus === 'paid').length;
                const pending = validTransactions.filter((item: any) => item.paymentStatus !== 'paid').length;

                setTransactions(validTransactions);
                setSummary({ revenue, paid, pending, count: validTransactions.length });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load wallet data.');
            } finally {
                setLoading(false);
            }
        };

        loadWallet();
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Wallet</p>
                        <h1 className="mt-2 text-3xl font-semibold text-white">Accommodation revenue and transactions</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400">Review reservation revenue, transaction counts, and payment status across the accommodation portal.</p>
                    </div>
                    <Link
                        to="/accommodation/dashboard"
                        className="inline-flex shrink-0 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>

            {error ? (
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {error}
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total revenue</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : formatCurrency(summary.revenue, 'KES')}</p>
                    <p className="mt-2 text-sm text-slate-500">All confirmed revenue from reservations.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Paid transactions</p>
                    <p className="mt-3 text-3xl font-semibold text-emerald-300">{loading ? '—' : summary.paid}</p>
                    <p className="mt-2 text-sm text-slate-500">Reservations marked as paid.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pending transactions</p>
                    <p className="mt-3 text-3xl font-semibold text-amber-300">{loading ? '—' : summary.pending}</p>
                    <p className="mt-2 text-sm text-slate-500">Reservations still waiting for payment.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transaction count</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : summary.count}</p>
                    <p className="mt-2 text-sm text-slate-500">Total reservation transactions included.</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-sm">
                <div className="hidden sm:block min-w-[900px]">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-xs text-slate-200 sm:text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-3 py-3 sm:px-4">Reservation</th>
                                <th className="px-3 py-3 sm:px-4">Guest</th>
                                <th className="px-3 py-3 sm:px-4">Status</th>
                                <th className="px-3 py-3 sm:px-4">Payment</th>
                                <th className="px-3 py-3 sm:px-4">Amount</th>
                                <th className="px-3 py-3 sm:px-4">Property</th>
                                <th className="px-3 py-3 sm:px-4">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-3 py-6 sm:px-4 text-center text-slate-400">Loading transactions...</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-3 py-6 sm:px-4 text-center text-slate-400">No revenue transactions found.</td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id || transaction.id} className="border-t border-slate-800 hover:bg-slate-900 transition">
                                        <td className="px-3 py-3 sm:px-4 text-slate-100 truncate">{(transaction._id || transaction.id)?.slice(-8)}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300 truncate">{transaction.guestName || transaction.customer?.firstName || 'Guest'}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${transaction.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-amber-500/10 text-amber-200'}`}>
                                                {transaction.paymentStatus || transaction.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300 truncate">{transaction.paymentMethod || transaction.method || 'N/A'}</td>
                                        <td className="px-3 py-3 sm:px-4 font-semibold text-emerald-400">{formatCurrency(Number(transaction.totalAmount || 0), transaction.currency || 'KES')}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300 truncate">{transaction.propertyName || transaction.property?.name || 'N/A'}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-400 text-xs">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 sm:hidden p-4">
                    {loading ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-center text-slate-400">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-center text-slate-400">No revenue transactions found.</div>
                    ) : (
                        transactions.map((transaction) => (
                            <div key={transaction._id || transaction.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Reservation</p>
                                        <p className="mt-1 truncate text-sm font-semibold text-white">{(transaction._id || transaction.id)?.slice(-8)}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-400">{formatCurrency(Number(transaction.totalAmount || 0), transaction.currency || 'KES')}</p>
                                </div>
                                <div className="mt-4 space-y-3 text-sm text-slate-300">
                                    <div>
                                        <p className="text-slate-400">Guest</p>
                                        <p className="truncate">{transaction.guestName || transaction.customer?.firstName || 'Guest'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Payment</p>
                                        <p className="truncate">{transaction.paymentMethod || transaction.method || 'N/A'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                                        <div>
                                            <p>Status</p>
                                            <p className="mt-1 text-slate-200">{transaction.paymentStatus || transaction.status || 'Pending'}</p>
                                        </div>
                                        <div>
                                            <p>Date</p>
                                            <p className="mt-1 text-slate-200">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
