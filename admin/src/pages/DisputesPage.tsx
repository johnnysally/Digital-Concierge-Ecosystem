import { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { timeAgo } from '../utils/formatDate';
import { api } from '../api/axios';

const priorityColor: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
    urgent: 'danger', high: 'warning', medium: 'info', low: 'neutral',
};

const statusColor: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    open: 'warning', investigating: 'info', resolved: 'success', closed: 'neutral',
};

const DisputesPage = () => {
    const [activeTab, setActiveTab] = useState<'disputes' | 'tickets'>('disputes');
    const [disputes, setDisputes] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loadingDisputes, setLoadingDisputes] = useState(true);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedDispute, setSelectedDispute] = useState<any>(null);
    const [resolution, setResolution] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [sendEmail, setSendEmail] = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/admin/disputes')
            .then((res) => setDisputes(res.data.disputes || []))
            .finally(() => setLoadingDisputes(false));
    }, []);

    useEffect(() => {
        if (activeTab === 'tickets') {
            api.get('/admin/support')
                .then((res) => setTickets(res.data.tickets || []))
                .finally(() => setLoadingTickets(false));
        }
    }, [activeTab]);

    const handleView = async (id: string) => {
        try {
            const res = await api.get(`/admin/disputes/${id}`);
            setSelectedDispute(res.data.dispute);
            setNewStatus(res.data.dispute.status);
            setResolution(res.data.dispute.resolution || '');
            setReplyMessage('');
        } catch {}
    };

    const handleResolve = async () => {
        if (!selectedDispute) return;
        setSaving(true);
        try {
            await api.put(`/admin/disputes/${selectedDispute._id}`, {
                status: newStatus,
                resolution: newStatus === 'resolved' || newStatus === 'closed' ? resolution : undefined,
                sendEmail,
            });
            setMessage('Dispute updated.');
            setSelectedDispute(null);
            setDisputes(disputes.map(d => d._id === selectedDispute._id ? { ...d, status: newStatus, resolution } : d));
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to update.'); }
        finally { setSaving(false); }
    };

    const handleReply = async () => {
        if (!selectedDispute || !replyMessage.trim()) return;
        setSaving(true);
        try {
            await api.post(`/admin/disputes/${selectedDispute._id}/reply`, {
                message: replyMessage,
                sendEmail,
            });
            setMessage('Reply sent.');
            setReplyMessage('');
            const res = await api.get(`/admin/disputes/${selectedDispute._id}`);
            setSelectedDispute(res.data.dispute);
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to send reply.'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this dispute?')) return;
        try {
            await api.delete(`/admin/disputes/${id}`);
            setDisputes(disputes.filter(d => d._id !== id));
            setMessage('Dispute deleted.');
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to delete.'); }
    };

    const disputeColumns = [
        { key: 'subject', label: 'Subject' },
        { key: 'raisedBy', label: 'From', render: (val: string, row: any) => (
            <div>
                <span className="capitalize text-xs font-medium">{val}</span>
                {row.metadata?.customerName && <p className="text-xs text-slate-400">{row.metadata.customerName}</p>}
            </div>
        )},
        { key: 'priority', label: 'Priority', render: (val: string) => <StatusBadge status={val} type={priorityColor[val] || 'neutral'} /> },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={statusColor[val] || 'neutral'} /> },
        { key: 'createdAt', label: 'Created', render: (val: string) => timeAgo(val) },
        {
            key: '_id', label: 'Actions',
            render: (val: string) => (
                <div className="flex gap-2">
                    <button onClick={() => handleView(val)} className="text-xs text-primary-500 hover:underline font-semibold">View</button>
                    <button onClick={() => handleDelete(val)} className="text-xs text-rose-500 hover:underline font-semibold">Delete</button>
                </div>
            ),
        },
    ];

    const ticketColumns = [
        { key: 'subject', label: 'Subject' },
        { key: 'customer', label: 'Customer', render: (_: any, row: any) => row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : 'N/A' },
        { key: 'priority', label: 'Priority', render: (val: string) => <StatusBadge status={val || 'medium'} type={priorityColor[val] || 'info'} /> },
        { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} type={statusColor[val] || 'neutral'} /> },
        { key: 'createdAt', label: 'Created', render: (val: string) => timeAgo(val) },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader title="Support & Disputes" subtitle="Manage customer tickets and partner disputes" />
            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            <div className="flex gap-2">
                <button onClick={() => setActiveTab('disputes')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'disputes' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    ⚖️ Disputes ({disputes.length})
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

            {selectedDispute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedDispute(null)}>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Dispute Details</h3>
                            <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Subject</span><span className="font-medium">{selectedDispute.subject}</span></div>
                            <div className="flex justify-between py-2 border-b"><span className="text-slate-500">From</span><span className="font-medium capitalize">{selectedDispute.raisedBy} · {selectedDispute.metadata?.customerName || 'N/A'}</span></div>
                            <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Partner</span><span className="font-medium">{selectedDispute.metadata?.partnerName || 'N/A'}</span></div>
                            <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Priority</span><StatusBadge status={selectedDispute.priority} type={priorityColor[selectedDispute.priority] || 'neutral'} /></div>
                            <div className="flex justify-between py-2 border-b"><span className="text-slate-500">Status</span><StatusBadge status={selectedDispute.status} type={statusColor[selectedDispute.status] || 'neutral'} /></div>
                            <div className="py-2"><span className="text-slate-500">Description</span><p className="mt-1 text-slate-300">{selectedDispute.description || 'No description'}</p></div>

                            {selectedDispute.metadata?.type === 'order' && selectedDispute.metadata.order && (
                                <div className="py-2 border-t">
                                    <span className="text-slate-500 font-medium">Order Details</span>
                                    <div className="mt-2 space-y-1 text-xs">
                                        <p>Restaurant: {selectedDispute.metadata.order.restaurantName}</p>
                                        <p>Items: {selectedDispute.metadata.order.items?.length || 0}</p>
                                        <p>Total: KES {selectedDispute.metadata.order.total?.toLocaleString()}</p>
                                        <p>Status: {selectedDispute.metadata.order.status}</p>
                                    </div>
                                </div>
                            )}

                            {selectedDispute.metadata?.replies?.length > 0 && (
                                <div className="py-2 border-t">
                                    <span className="text-slate-500 font-medium">Replies</span>
                                    <div className="mt-2 space-y-2">
                                        {selectedDispute.metadata.replies.map((reply: any, i: number) => (
                                            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                                <p className="text-xs text-slate-400">{reply.from} · {reply.by} · {new Date(reply.date).toLocaleString()}</p>
                                                <p className="mt-1 text-sm">{reply.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm text-slate-500 mb-1">Update Status</label>
                                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm">
                                        <option value="open">Open</option>
                                        <option value="investigating">Investigating</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="rounded" />
                                        <span className="text-slate-500">Send email notification</span>
                                    </label>
                                </div>
                            </div>

                            {(newStatus === 'resolved' || newStatus === 'closed') && (
                                <div>
                                    <label className="block text-sm text-slate-500 mb-1">Resolution Notes</label>
                                    <textarea value={resolution} onChange={(e) => setResolution(e.target.value)}
                                        placeholder="Describe the resolution..."
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm resize-none" />
                                </div>
                            )}

                            <button onClick={handleResolve} disabled={saving}
                                className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Update Dispute'}
                            </button>
                        </div>

                        <div className="border-t pt-4 mt-4 space-y-3">
                            <h4 className="text-sm font-semibold">Reply to Customer</h4>
                            <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your reply..."
                                rows={3}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm resize-none" />
                            <button onClick={handleReply} disabled={saving || !replyMessage.trim()}
                                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                                {saving ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisputesPage;