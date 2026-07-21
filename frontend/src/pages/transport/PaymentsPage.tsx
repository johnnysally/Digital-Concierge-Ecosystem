import { useEffect, useState } from 'react';
import { getPayments } from '../../api/transport/paymentApi';
import { getRides } from '../../api/transport/rideApi';
import { formatCurrency } from '../../utils/formatCurrency';

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPayments();
                setPayments(Array.isArray(data) ? data : data.payments ?? data.items ?? []);
            } catch (err) {
                // payments endpoint may not exist on transport API; fallback to rides
                try {
                    const ridesRes = await getRides({ limit: 200 });
                    const ridesArray = Array.isArray(ridesRes) ? ridesRes : ridesRes.rides ?? [];
                    const derived = ridesArray
                        .filter((r: any) => r.fare && (r.fare.total !== undefined))
                        .map((r: any) => ({ reference: r._id || r.id, amount: r.fare.total, currency: r.fare.currency || 'KES', status: r.paymentStatus || 'unknown', createdAt: r.createdAt }));
                    setPayments(derived);
                } catch {
                    setPayments([]);
                }
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Payments</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Transport payments</h2>
                <p className="mt-2 text-sm text-slate-400">Recent payment transactions from the transport system.</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading payments...</div>
            ) : payments.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">No payment records available.</div>
            ) : (
                <div className="grid gap-4">
                    {payments.map((p, idx) => (
                        <div key={p._id || p.id || idx} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Reference</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{p.reference || p._id || `#${idx + 1}`}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">Amount</p>
                                    <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(p.amount || 0, p.currency || 'KES')}</p>
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-slate-300">Status: {p.status || 'Unknown'}</div>
                            <div className="mt-2 text-xs text-slate-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;
