import { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import MetricCard from '../components/ui/MetricCard';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import { api } from '../api/axios';

const methodLabels: Record<string, string> = {
    mpesa_send: 'M-Pesa Send Money',
    mpesa_till: 'M-Pesa Till Number',
    mpesa_paybill: 'M-Pesa Paybill',
    bank: 'Bank Transfer',
    cash: 'Cash',
};

const PaymentsPage = () => {
    const [activeTab, setActiveTab] = useState<'transactions' | 'payouts' | 'commissions'>('transactions');
    const [payments, setPayments] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [commissions, setCommissions] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [releaseModal, setReleaseModal] = useState<any>(null);
    const [releaseMethod, setReleaseMethod] = useState('');
    const [releaseAccountNumber, setReleaseAccountNumber] = useState('');
    const [releaseAccountName, setReleaseAccountName] = useState('');
    const [releaseBankName, setReleaseBankName] = useState('');

    useEffect(() => {
        if (activeTab === 'transactions') {
            setLoading(true);
            api.get('/admin/payments', { params: filter ? { status: filter } : {} })
                .then((res) => {
                    setPayments(res.data.payments || []);
                    setTotal(res.data.total || 0);
                    setTotalRevenue(res.data.totalRevenue || 0);
                })
                .finally(() => setLoading(false));
        } else if (activeTab === 'payouts') {
            setLoading(true);
            api.get('/admin/payments/payouts')
                .then((res) => setPayouts(res.data.payouts || []))
                .finally(() => setLoading(false));
        } else if (activeTab === 'commissions') {
            setLoading(true);
            api.get('/admin/payments/commissions')
                .then((res) => setCommissions(res.data.rates || {}))
                .finally(() => setLoading(false));
        }
    }, [activeTab, filter]);

    const handleRefund = async (id: string) => {
        if (!confirm('Refund this payment?')) return;
        try {
            await api.put(`/admin/payments/${id}/refund`);
            setMessage('Payment refunded.');
            setPayments(payments.map(p => p._id === id ? { ...p, status: 'refunded' } : p));
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to refund.'); }
    };

    const handleReleaseClick = (payout: any) => {
        setReleaseModal(payout);
        const defaultMethod = payout.payoutMethods?.[0];
        if (defaultMethod) {
            setReleaseMethod(defaultMethod.type);
            setReleaseAccountNumber(defaultMethod.accountNumber || '');
            setReleaseAccountName(defaultMethod.accountName || '');
            setReleaseBankName(defaultMethod.bankName || '');
        } else {
            setReleaseMethod('bank');
            setReleaseAccountNumber('');
            setReleaseAccountName('');
            setReleaseBankName('');
        }
    };

    const handleReleasePayout = async () => {
        if (!releaseModal) return;
        try {
            await api.post('/admin/payments/payouts/release', {
                partnerId: releaseModal.partnerId,
                amount: releaseModal.netPayable,
                method: releaseMethod,
                accountNumber: releaseAccountNumber,
                accountName: releaseAccountName,
                bankName: releaseBankName,
            });
            setMessage('Payout released to ' + releaseModal.partnerName + '.');
            setPayouts(payouts.map(p => p.partnerId === releaseModal.partnerId ? { ...p, released: true } : p));
            setReleaseModal(null);
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to release payout.'); }
    };

    const handleCommissionUpdate = async (type: string, percentage: number) => {
        try {
            await api.put(`/admin/payments/commissions/${type}`, { percentage });
            setCommissions({ ...commissions, [type]: percentage });
            setMessage('Commission updated.');
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed.'); }
    };

    const transactionColumns = [
        { key: 'customer', label: 'Customer', render: (_: any, row: any) => row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : 'N/A' },
        { key: 'partnerName', label: 'Partner', render: (val: string) => val || 'N/A' },
        { key: 'method', label: 'Method', render: (val: string) => <span className="uppercase text-xs font-medium">{val}</span> },
        { key: 'amount', label: 'Amount', render: (val: number) => <span className="font-semibold">{formatCurrency(val)}</span> },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'completed' ? 'success' : val === 'pending' ? 'warning' : val === 'refunded' ? 'info' : 'danger'} /> },
        { key: 'createdAt', label: 'Date', render: (val: string) => formatDateTime(val) },
        {
            key: '_id', label: 'Actions',
            render: (val: string, row: any) => (
                <div className="flex gap-2">
                    <button onClick={() => setSelectedPayment(row)} className="text-xs text-primary-500 hover:underline font-semibold">View</button>
                    {row.status === 'completed' && <button onClick={() => handleRefund(val)} className="text-xs text-rose-500 hover:underline font-semibold">Refund</button>}
                </div>
            ),
        },
    ];

    const payoutColumns = [
        { key: 'partnerName', label: 'Partner', render: (val: string) => <span className="font-semibold">{val || 'N/A'}</span> },
        { key: 'partnerType', label: 'Type', render: (val: string) => <span className="capitalize text-xs">{val}</span> },
        { key: 'totalCollected', label: 'Collected', render: (val: number) => <span className="font-semibold">{formatCurrency(val)}</span> },
        { key: 'commission', label: 'Commission', render: (val: number) => <span className="text-rose-500">{formatCurrency(val)}</span> },
        { key: 'netPayable', label: 'Net Payable', render: (val: number) => <span className="text-emerald-500 font-bold">{formatCurrency(val)}</span> },
        {
            key: 'partnerId', label: 'Actions',
            render: (val: string, row: any) => (
                row.released ? (
                    <span className="text-xs text-slate-400">✓ Released</span>
                ) : (
                    <button onClick={() => handleReleaseClick(row)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors">Release</button>
                )
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader title="Payments" subtitle="Manage transactions, partner payouts, and commission rates" />
            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            <div className="flex gap-2">
                {[{ key: 'transactions', label: '💳 Transactions' }, { key: 'payouts', label: '💰 Payouts' }, { key: 'commissions', label: '📊 Commissions' }].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{tab.label}</button>
                ))}
            </div>

            {activeTab === 'transactions' && (
                <>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <MetricCard label="Total Transactions" value={total} icon="💳" />
                        <MetricCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon="💰" />
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                            <p className="text-sm text-slate-500 mb-2">Filter</p>
                            <div className="flex gap-1 flex-wrap">
                                {['', 'completed', 'pending', 'failed', 'refunded'].map((s) => (
                                    <button key={s} onClick={() => setFilter(s)} className={`text-xs px-2 py-1 rounded-lg ${filter === s ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{s || 'All'}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                        <DataTable columns={transactionColumns} data={payments} loading={loading} />
                    </div>
                </>
            )}

            {activeTab === 'payouts' && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                    <h2 className="text-lg font-semibold mb-1">Partner Payouts</h2>
                    <p className="text-sm text-slate-500 mb-6">Amounts owed to partners after commission deduction</p>
                    <DataTable columns={payoutColumns} data={payouts} loading={loading} />
                </div>
            )}

            {activeTab === 'commissions' && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                    <h2 className="text-lg font-semibold mb-1">Commission Rates</h2>
                    <p className="text-sm text-slate-500 mb-6">Platform commission per partner type</p>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {Object.entries(commissions).map(([type, rate]) => (
                            <div key={type} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                                <p className="font-semibold capitalize text-lg">{type}</p>
                                <p className="text-4xl font-bold text-primary-500 mt-3">{rate}%</p>
                                <div className="flex gap-2 mt-4 justify-center">
                                    {[5, 10, 15, 20, 25].map((p) => (
                                        <button key={p} onClick={() => handleCommissionUpdate(type, p)} className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${rate === p ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>{p}%</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedPayment(null)}>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Payment Details</h3>
                            <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Reference</span><span className="font-mono text-xs">{selectedPayment.reference || 'N/A'}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Customer</span><span className="font-medium">{selectedPayment.customer?.firstName} {selectedPayment.customer?.lastName}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Partner</span><span className="font-medium">{selectedPayment.partnerName || 'N/A'}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Method</span><span className="font-medium uppercase">{selectedPayment.method}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Amount</span><span className="font-bold text-lg">{formatCurrency(selectedPayment.amount)}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Status</span><StatusBadge status={selectedPayment.status} type={selectedPayment.status === 'completed' ? 'success' : 'warning'} /></div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Date</span><span>{formatDateTime(selectedPayment.createdAt)}</span></div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            {selectedPayment.status === 'completed' && <button onClick={() => { handleRefund(selectedPayment._id); setSelectedPayment(null); }} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500">Refund Payment</button>}
                            <button onClick={() => setSelectedPayment(null)} className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {releaseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setReleaseModal(null)}>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Release Payout</h3>
                            <button onClick={() => setReleaseModal(null)} className="text-slate-400 hover:text-white text-xl">×</button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Partner</span><span className="font-medium">{releaseModal.partnerName}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold text-emerald-500">{formatCurrency(releaseModal.netPayable)}</span></div>

                            <div>
                                <label className="block text-slate-500 mb-2">Payout Method</label>
                                {releaseModal.payoutMethods?.length > 0 ? (
                                    <select value={releaseMethod} onChange={(e) => {
                                        setReleaseMethod(e.target.value);
                                                        const m = releaseModal.payoutMethods.find((pm: any) => pm.type === e.target.value);
                                        if (m) { setReleaseAccountNumber(m.accountNumber || ''); setReleaseAccountName(m.accountName || ''); setReleaseBankName(m.bankName || ''); }
                                    }} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm">
                                        {releaseModal.payoutMethods.map((pm: any, i: number) => (
                                            <option key={i} value={pm.type}>{pm.label || methodLabels[pm.type] || pm.type} {pm.accountNumber ? '- ' + pm.accountNumber : ''}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <select value={releaseMethod} onChange={(e) => setReleaseMethod(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm">
                                        {Object.entries(methodLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                )}
                            </div>

                            {releaseMethod === 'bank' && (
                                <>
                                    <div><label className="block text-slate-500 mb-1">Bank Name</label><input value={releaseBankName} onChange={(e) => setReleaseBankName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-slate-500 mb-1">Account Number</label><input value={releaseAccountNumber} onChange={(e) => setReleaseAccountNumber(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-slate-500 mb-1">Account Name</label><input value={releaseAccountName} onChange={(e) => setReleaseAccountName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm" /></div>
                                </>
                            )}

                            {(releaseMethod === 'mpesa_send' || releaseMethod === 'mpesa_till' || releaseMethod === 'mpesa_paybill') && (
                                <>
                                    <div><label className="block text-slate-500 mb-1">Account/Phone Number</label><input value={releaseAccountNumber} onChange={(e) => setReleaseAccountNumber(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm" /></div>
                                    <div><label className="block text-slate-500 mb-1">Account Name</label><input value={releaseAccountName} onChange={(e) => setReleaseAccountName(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm" /></div>
                                </>
                            )}
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button onClick={handleReleasePayout} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Confirm Release</button>
                            <button onClick={() => setReleaseModal(null)} className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;