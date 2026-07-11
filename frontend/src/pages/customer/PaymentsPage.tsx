import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getPaymentHistory } from '../../api/customer/paymentApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPaymentHistory()
            .then((res) => setPayments(res.payments || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <SectionHeader title="Payments" subtitle="View your payment history and transaction details." />
            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">Loading payments...</div>
            ) : payments.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">No payments yet.</div>
            ) : (
                <div className="space-y-3">
                    {payments.map((p) => (
                        <div key={p._id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900 p-5">
                            <div>
                                <p className="text-sm font-semibold text-white capitalize">{p.type} - {p.method}</p>
                                <p className="text-xs text-slate-400">{formatDate(p.createdAt)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white">{formatCurrency(p.amount, p.currency)}</p>
                                <span className={`text-xs ${p.status === 'completed' ? 'text-emerald-400' : p.status === 'failed' ? 'text-rose-400' : 'text-amber-400'}`}>
                                    {p.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;