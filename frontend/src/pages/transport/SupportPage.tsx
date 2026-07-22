import React, { useEffect, useState } from 'react';
import { getSupportInfo, createTicket, getMyTickets } from '../../api/transport/supportApi';

const SupportPage = () => {
    const [info, setInfo] = useState<any>({ partner: {}, platform: {} });
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        Promise.all([getSupportInfo(), getMyTickets()])
            .then(([infoRes, ticketRes]) => {
                setInfo(infoRes.support || { partner: {}, platform: {} });
                setTickets(ticketRes.tickets || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTicket({ subject, description });
            setSubmitted(true);
            setSubject('');
            setDescription('');
            const res = await getMyTickets();
            setTickets(res.tickets || []);
            setTimeout(() => setSubmitted(false), 3000);
        } catch { setMessage('Failed to submit ticket.'); }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading support...</div>;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Support</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Support center</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Get help with transport operations, account issues, and partner support.</p>
            </div>

            {submitted && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">Ticket submitted successfully!</div>}
            {message && <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-400">{message}</div>}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Submit a Ticket</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail" required rows={4}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
                            <button type="submit" className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Submit Ticket</button>
                        </form>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Ticket History ({tickets.length})</h3>
                        {tickets.length === 0 ? (
                            <p className="text-sm text-slate-400">No tickets submitted yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {tickets.map((ticket) => (
                                    <div key={ticket._id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-white text-sm">{ticket.subject}</p>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                                                ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                                            }`}>{ticket.status}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">📞 Platform Support</h3>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-slate-400">Email</p><p className="text-white font-medium">{info.platform?.email || 'N/A'}</p></div>
                            <div><p className="text-slate-400">Phone</p><p className="text-white font-medium">{info.platform?.phone || 'N/A'}</p></div>
                            <div><p className="text-slate-400">Hours</p><p className="text-white font-medium">{info.platform?.hours || 'N/A'}</p></div>
                            <div><p className="text-slate-400">Emergency</p><p className="text-white font-medium text-rose-400">{info.platform?.emergency || 'N/A'}</p></div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">🏢 Your Contact</h3>
                        <div className="space-y-2 text-sm">
                            <div><p className="text-slate-400">Email</p><p className="text-white font-medium">{info.partner?.email || 'N/A'}</p></div>
                            <div><p className="text-slate-400">Phone</p><p className="text-white font-medium">{info.partner?.phone || 'N/A'}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;