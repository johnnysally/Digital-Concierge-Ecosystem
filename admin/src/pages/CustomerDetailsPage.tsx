import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, suspendCustomer, activateCustomer, deleteCustomer } from '../api/customerApi';
import SectionHeader from '../components/ui/SectionHeader';
import StatsCard from '../components/ui/StatsCard';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';
import MetricCard from '../components/ui/MetricCard';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatDateTime } from '../utils/formatDate';

const CustomerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<any>(null);
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'rides' | 'payments' | 'reviews'>('bookings');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        getCustomer(id)
            .then((res) => {
                setCustomer(res.customer);
                setData(res);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleSuspend = async () => { setActionLoading(true); await suspendCustomer(id!); setCustomer({ ...customer, isActive: false }); setActionLoading(false); };
    const handleActivate = async () => { setActionLoading(true); await activateCustomer(id!); setCustomer({ ...customer, isActive: true }); setActionLoading(false); };
    const handleDelete = async () => {
        if (!confirm('Delete this customer and ALL associated data permanently?')) return;
        await deleteCustomer(id!);
        navigate('/customers');
    };

    const bookingColumns = [
        { key: 'property', label: 'Property', render: (_: any, row: any) => row.property?.name || 'N/A' },
        { key: 'checkIn', label: 'Check In', render: (val: string) => formatDate(val) },
        { key: 'checkOut', label: 'Check Out', render: (val: string) => formatDate(val) },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'confirmed' ? 'success' : val === 'cancelled' ? 'danger' : 'warning'} /> },
        { key: 'totalAmount', label: 'Amount', render: (val: number) => formatCurrency(val) },
    ];

    const orderColumns = [
        { key: 'partner', label: 'Restaurant', render: (_: any, row: any) => row.partnerName || 'N/A' },
        { key: 'items', label: 'Items', render: (val: any[]) => val?.length || 0 },
        { key: 'total', label: 'Amount', render: (val: number) => formatCurrency(val) },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'delivered' ? 'success' : 'warning'} /> },
        { key: 'createdAt', label: 'Date', render: (val: string) => formatDateTime(val) },
    ];

    const rideColumns = [
        { key: 'vehicle', label: 'Vehicle', render: (_: any, row: any) => row.vehicleName || 'N/A' },
        { key: 'pickup', label: 'Pickup', render: (_: any, row: any) => row.pickup?.address || 'N/A' },
        { key: 'dropoff', label: 'Dropoff', render: (_: any, row: any) => row.dropoff?.address || 'N/A' },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'completed' ? 'success' : 'warning'} /> },
        { key: 'fare.total', label: 'Fare', render: (_: any, row: any) => formatCurrency(row.fare?.total || row.totalAmount) },
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

    if (loading) return <div className="p-8 text-center text-slate-400">Loading customer...</div>;
    if (!customer) return <div className="p-8 text-center text-slate-400">Customer not found.</div>;

    const tabs = [
        { key: 'bookings', label: '🏨 Bookings', count: data.bookings?.length || 0 },
        { key: 'orders', label: '🍽️ Orders', count: data.orders?.length || 0 },
        { key: 'rides', label: '🚗 Rides', count: data.rides?.length || 0 },
        { key: 'payments', label: '💳 Payments', count: data.payments?.length || 0 },
        { key: 'reviews', label: '⭐ Reviews', count: data.reviews?.length || 0 },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader title={`${customer.firstName} ${customer.lastName}`} subtitle={customer.email}
                action={<button onClick={() => navigate('/customers')} className="text-sm text-primary-500 hover:underline">← Back to Customers</button>} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard label="Wallet" value={formatCurrency(data.stats?.walletBalance || 0)} icon="💰" />
                <MetricCard label="Total Spent" value={formatCurrency(data.stats?.totalSpent || 0)} icon="💳" />
                <MetricCard label="Bookings" value={data.stats?.totalBookings || 0} icon="🏨" />
                <MetricCard label="Orders" value={data.stats?.totalOrders || 0} icon="🍽️" />
                <MetricCard label="Rides" value={data.stats?.totalRides || 0} icon="🚗" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatsCard title="Phone" value={customer.phone || 'N/A'} />
                <StatsCard title="Joined" value={formatDate(customer.createdAt)} />
                <StatsCard title="Status" value={customer.isActive ? 'Active' : 'Suspended'} />
            </div>

            <div className="flex gap-3">
                {customer.isActive ? (
                    <button onClick={handleSuspend} disabled={actionLoading} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">Suspend</button>
                ) : (
                    <button onClick={handleActivate} disabled={actionLoading} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">Activate</button>
                )}
                <button onClick={handleDelete} className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">Delete</button>
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
                {activeTab === 'orders' && <DataTable columns={orderColumns} data={data.orders || []} loading={loading} />}
                {activeTab === 'rides' && <DataTable columns={rideColumns} data={data.rides || []} loading={loading} />}
                {activeTab === 'payments' && <DataTable columns={paymentColumns} data={data.payments || []} loading={loading} />}
                {activeTab === 'reviews' && <DataTable columns={reviewColumns} data={data.reviews || []} loading={loading} />}
            </div>
        </div>
    );
};

export default CustomerDetailsPage;