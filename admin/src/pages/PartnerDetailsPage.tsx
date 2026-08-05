import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPartner, approvePartner, suspendPartner, activatePartner, deletePartner } from '../api/partnerApi';
import SectionHeader from '../components/ui/SectionHeader';
import StatusBadge from '../components/ui/StatusBadge';
import StatsCard from '../components/ui/StatsCard';
import DataTable from '../components/ui/DataTable';
import MetricCard from '../components/ui/MetricCard';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatDateTime } from '../utils/formatDate';

const methodLabels: Record<string, string> = {
    mpesa_send: 'M-Pesa Send', mpesa_till: 'M-Pesa Till', mpesa_paybill: 'M-Pesa Paybill', bank: 'Bank', cash: 'Cash',
};

const PartnerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partner, setPartner] = useState<any>(null);
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'rides' | 'payments' | 'reviews' | 'payouts'>('bookings');

    useEffect(() => {
        if (!id) return;
        getPartner(id).then((res) => { setPartner(res.partner); setData(res); }).finally(() => setLoading(false));
    }, [id]);

    const handleApprove = async () => { await approvePartner(id!); setPartner({ ...partner, isVerified: true, isActive: true }); };
    const handleSuspend = async () => { await suspendPartner(id!); setPartner({ ...partner, isActive: false }); };
    const handleActivate = async () => { await activatePartner(id!); setPartner({ ...partner, isActive: true }); };
    const handleDelete = async () => { if (!confirm('Delete permanently?')) return; await deletePartner(id!); navigate('/partners'); };

    const bookingColumns = [
        { key: 'property', label: 'Property', render: (_: any, row: any) => row.property?.name || 'N/A' },
        { key: 'checkIn', label: 'Check In', render: (val: string) => formatDate(val) },
        { key: 'checkOut', label: 'Check Out', render: (val: string) => formatDate(val) },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'confirmed' ? 'success' : 'warning'} /> },
        { key: 'totalAmount', label: 'Amount', render: (val: number) => formatCurrency(val) },
    ];

    const paymentColumns = [
        { key: 'method', label: 'Method', render: (val: string) => <span className="uppercase">{val}</span> },
        { key: 'type', label: 'Type', render: (val: string) => <span className="capitalize">{val}</span> },
        { key: 'amount', label: 'Amount', render: (val: number) => formatCurrency(val) },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'completed' ? 'success' : 'danger'} /> },
        { key: 'createdAt', label: 'Date', render: (val: string) => formatDateTime(val) },
    ];

    const reviewColumns = [
        { key: 'rating', label: 'Rating', render: (val: number) => '★'.repeat(val) + '☆'.repeat(5 - val) },
        { key: 'comment', label: 'Comment', render: (val: string) => val || 'No comment' },
        { key: 'createdAt', label: 'Date', render: (val: string) => formatDate(val) },
    ];

    if (loading) return <div className="p-8 text-center text-slate-400">Loading partner...</div>;
    if (!partner) return <div className="p-8 text-center text-slate-400">Partner not found.</div>;

    const tabs = [
        { key: 'bookings', label: '🏨 Bookings', count: data.bookings?.length || 0 },
        { key: 'payments', label: '💳 Payments', count: data.payments?.length || 0 },
        { key: 'reviews', label: '⭐ Reviews', count: data.reviews?.length || 0 },
        { key: 'payouts', label: '💰 Payout Methods', count: partner.payoutMethods?.length || 0 },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader title={`${partner.firstName} ${partner.lastName}`} subtitle={partner.businessName}
                action={<button onClick={() => navigate('/partners')} className="text-sm text-primary-500 hover:underline">← Back to Partners</button>} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard label="Revenue" value={formatCurrency(data.stats?.totalRevenue || 0)} icon="💰" />
                <MetricCard label="Payouts" value={formatCurrency(data.stats?.totalPayouts || 0)} icon="💸" />
                <MetricCard label="Net Earnings" value={formatCurrency(data.stats?.netEarnings || 0)} icon="📈" />
                <MetricCard label="Bookings" value={data.stats?.totalBookings || 0} icon="🏨" />
                <MetricCard label="Reviews" value={data.stats?.totalReviews || 0} icon="⭐" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Type" value={partner.partnerType || partner.businessType || 'N/A'} />
                <StatsCard title="Email" value={partner.email} />
                <StatsCard title="Joined" value={formatDate(partner.createdAt)} />
                <StatsCard title="Status" value={partner.isActive ? 'Active' : 'Suspended'} subtitle={partner.isVerified ? 'Verified' : 'Unverified'} />
            </div>

            <div className="flex gap-3">
                {!partner.isVerified && <button onClick={handleApprove} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Approve</button>}
                {partner.isActive ? (
                    <button onClick={handleSuspend} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Suspend</button>
                ) : (
                    <button onClick={handleActivate} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Activate</button>
                )}
                <button onClick={handleDelete} className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Delete</button>
            </div>

            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                {activeTab === 'bookings' && <DataTable columns={bookingColumns} data={data.bookings || []} loading={loading} />}
                {activeTab === 'payments' && <DataTable columns={paymentColumns} data={data.payments || []} loading={loading} />}
                {activeTab === 'reviews' && <DataTable columns={reviewColumns} data={data.reviews || []} loading={loading} />}
                {activeTab === 'payouts' && (
                    partner.payoutMethods?.length > 0 ? (
                        <div className="space-y-3">
                            {partner.payoutMethods.map((pm: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <div>
                                        <p className="font-medium capitalize">{pm.label || methodLabels[pm.type] || pm.type}</p>
                                        <p className="text-sm text-slate-500">{pm.accountNumber} {pm.accountName ? '· ' + pm.accountName : ''}</p>
                                        {pm.bankName && <p className="text-xs text-slate-400">{pm.bankName} {pm.branchCode ? '· ' + pm.branchCode : ''}</p>}
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 capitalize">{methodLabels[pm.type] || pm.type}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm py-8 text-center">No payout methods set by partner.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default PartnerDetailsPage;