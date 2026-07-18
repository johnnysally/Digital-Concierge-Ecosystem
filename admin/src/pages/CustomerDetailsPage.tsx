import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, suspendCustomer, activateCustomer, deleteCustomer } from '../api/customerApi';
import SectionHeader from '../components/ui/SectionHeader';
import StatsCard from '../components/ui/StatsCard';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatDateTime } from '../utils/formatDate';

const CustomerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<any>(null);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        try {
            const res = await getCustomer(id);
            setCustomer(res.customer);
            setBookings(res.bookings || []);
            setPayments(res.payments || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleSuspend = async () => {
        setActionLoading(true);
        await suspendCustomer(id!);
        setCustomer({ ...customer, isActive: false });
        setActionLoading(false);
    };

    const handleActivate = async () => {
        setActionLoading(true);
        await activateCustomer(id!);
        setCustomer({ ...customer, isActive: true });
        setActionLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm('Delete this customer and all associated data permanently?')) return;
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

    const paymentColumns = [
        { key: 'method', label: 'Method', render: (val: string) => <span className="uppercase">{val}</span> },
        { key: 'type', label: 'Type', render: (val: string) => <span className="capitalize">{val}</span> },
        { key: 'amount', label: 'Amount', render: (val: number) => formatCurrency(val) },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={val === 'completed' ? 'success' : 'danger'} /> },
        { key: 'createdAt', label: 'Date', render: (val: string) => formatDateTime(val) },
    ];

    if (loading) return <div className="p-8 text-center text-slate-400">Loading customer...</div>;
    if (!customer) return <div className="p-8 text-center text-slate-400">Customer not found.</div>;

    return (
        <div className="space-y-6">
            <SectionHeader
                title={`${customer.firstName} ${customer.lastName}`}
                subtitle={customer.email}
                action={<button onClick={() => navigate('/customers')} className="text-sm text-primary-500 hover:underline">← Back to Customers</button>}
            />
            <div className="grid gap-4 sm:grid-cols-3">
                <StatsCard title="Phone" value={customer.phone || 'N/A'} />
                <StatsCard title="Joined" value={formatDate(customer.createdAt)} />
                <StatsCard title="Status" value={customer.isActive ? 'Active' : 'Suspended'} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                {customer.isActive ? (
                    <button onClick={handleSuspend} disabled={actionLoading}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">Suspend</button>
                ) : (
                    <button onClick={handleActivate} disabled={actionLoading}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">Activate</button>
                )}
                <button onClick={handleDelete}
                    className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600">Delete</button>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Bookings ({bookings.length})</h2>
                    <DataTable columns={bookingColumns} data={bookings} loading={false} />
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Payments ({payments.length})</h2>
                    <DataTable columns={paymentColumns} data={payments} loading={false} />
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsPage;