import { useEffect, useState } from 'react';
import { getReservations } from '../../api/accommodation/reservationApi';

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [summary, setSummary] = useState({ total: 0, paid: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const response = await getReservations({ limit: 50 });
                const reservations = (response.reservations || []).filter((reservation: any) => Number(reservation.totalAmount) > 0);
                const total = reservations.reduce((sum: number, item: any) => sum + Number(item.totalAmount || 0), 0);
                const paid = reservations.filter((item: any) => item.paymentStatus === 'paid').length;
                const pending = reservations.filter((item: any) => item.paymentStatus !== 'paid').length;
                setPayments(reservations);
                setSummary({ total, paid, pending });
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load payments');
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Payments</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Payment activity</h2>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Gross value</p>
                    <p className="mt-2 text-2xl font-semibold text-white">KES {summary.total.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Paid</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-300">{summary.paid}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Pending</p>
                    <p className="mt-2 text-2xl font-semibold text-amber-300">{summary.pending}</p>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Loading payment activity...</p>
                ) : payments.length === 0 ? (
                    <p className="text-sm text-slate-400">No payment activity found yet.</p>
                ) : (
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <div key={payment._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-white">{payment.guestName || 'Guest'}</p>
                                        <p className="text-sm text-slate-400">{payment.paymentStatus || 'pending'} • {payment.status || 'Pending'}</p>
                                    </div>
                                    <div className="text-sm text-emerald-300">KES {Number(payment.totalAmount || 0).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentsPage;
