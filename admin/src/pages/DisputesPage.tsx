import { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import useDisputes from '../hooks/useDisputes';
import { timeAgo } from '../utils/formatDate';
import { api } from '../api/axios';

const priorityColor: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
    urgent: 'danger', high: 'warning', medium: 'info', low: 'neutral',
};

const statusColor: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    open: 'warning', investigating: 'info', resolved: 'success', closed: 'neutral', in_progress: 'info',
};

const DisputesPage = () => {
    const [activeTab, setActiveTab] = useState<'disputes' | 'tickets'>('disputes');
    const [tickets, setTickets] = useState<any[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [resolution, setResolution] = useState('');
    const [message, setMessage] = useState('');

    const { disputes, loading: loadingDisputes, total: totalDisputes } = useDisputes();

    useEffect(() => {
        if (activeTab === 'tickets') {
            api.get('/admin/support')
                .then((res) => setTickets(res.data.tickets || []))
                .finally(() => setLoadingTickets(false));
        }
    }, [activeTab]);

    const handleResolve = async (id: string, type: 'dispute' | 'ticket') => {
        const endpoint = type === 'dispute' ? `/admin/disputes/${id}` : `/admin/support/${id}`;
        try {
            await api.put(endpoint, { status: 'resolved', resolution });
            setMessage('Resolved successfully.');
            setSelectedItem(null);
            setResolution('');
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setMessage('Failed to resolve.');
        }
    };

    const disputeColumns = [
        { key: 'subject', label: 'Subject' },
        { key: 'raisedBy', label: 'Raised By', render: (val: string) => <span className="capitalize">{val}</span> },
        { key: 'priority', label: 'Priority', render: (val: string) => <StatusBadge status={val} type={priorityColor[val] || 'neutral'} /> },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={statusColor[val] || 'neutral'} /> },
        { key: 'createdAt', label: 'Created', render: (val: string) => timeAgo(val) },
        {
            key: '_id',
            label: '',
            render: (val: string) => (
                <button onClick={() => setSelectedItem({ id: val, type: 'dispute' })} className="text-primary-500 hover:underline text-xs font-semibold">
                    View
                </button>
            ),
        },
    ];

    const ticketColumns = [
        { key: 'subject', label: 'Subject' },
        { key: 'customer', label: 'Customer', render: (_: any, row: any) => row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : 'N/A' },
        { key: 'priority', label: 'Priority', render: (val: string) => <StatusBadge status={val || 'medium'} type={priorityColor[val] || 'info'} /> },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={statusColor[val] || 'neutral'} /> },
        { key: 'createdAt', label: 'Created', render: (val: string) => timeAgo(val) },
        {
            key: '_id',
            label: '',
            render: (val: string) => (
                <button onClick={() => setSelectedItem({ id: val, type: 'ticket' })} className="text-primary-500 hover:underline text-xs font-semibold">
                    View
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader title="Support & Disputes" subtitle="Manage customer tickets and partner disputes" />

            {message && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>
            )}

            <div className="flex gap-2">
                <button onClick={() => setActiveTab('disputes')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'disputes' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    ⚖️ Disputes ({totalDisputes})
                </button>
                <button onClick={() => setActiveTab('tickets')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'tickets' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    🎫 Support Tickets ({tickets.length})
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                {activeTab === 'disputes' ? (
                    <DataTable columns={disputeColumns} data={disputes} loading={loadingDisputes} />
                ) : (
                    <DataTable columns={ticketColumns} data={tickets} loading={loadingTickets} />
                )}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedItem(null)}>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold">Resolve {selectedItem.type === 'dispute' ? 'Dispute' : 'Ticket'}</h3>
                        <textarea
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            placeholder="Enter resolution notes..."
                            rows={4}
                            className="mt-4 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500"
                        />
                        <div className="flex gap-2 justify-end mt-4">
                            <button onClick={() => setSelectedItem(null)}
                                className="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold">Cancel</button>
                            <button onClick={() => handleResolve(selectedItem.id, selectedItem.type)}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Resolve</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisputesPage;