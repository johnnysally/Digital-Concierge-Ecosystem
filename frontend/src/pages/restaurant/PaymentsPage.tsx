import { useEffect, useState } from 'react';
import { getRestaurantPayments } from './mockData';

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPayments(getRestaurantPayments());
        setLoading(false);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Payments</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">View restaurant payments</h1>
            </div>

            <div className="grid gap-4">
                {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading payments...</div> : payments.length ? payments.map((payment) => (
                    <div key={payment._id} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-semibold text-white">{payment.reference || 'Payment'}</p>
                                <p className="mt-2 text-sm text-slate-400">{payment.status || 'Pending'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-amber-300">{payment.amount || '—'}</p>
                                <p className="mt-1 text-sm text-slate-400">{payment.currency || 'KES'}</p>
                            </div>
                        </div>
                    </div>
                )) : <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No payments found.</div>}
            </div>
        </div>
    );
};

export default PaymentsPage;
