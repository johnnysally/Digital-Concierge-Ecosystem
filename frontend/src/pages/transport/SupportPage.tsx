import { useEffect, useState } from 'react';
import { getSupportInfo, getTickets, createTicket } from '../../api/transport/supportApi';

const SupportPage = () => {
    const [info, setInfo] = useState<any>({ partner: {}, platform: {} });
    const [tickets, setTickets] = useState<any[]>([]);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [tab, setTab] = useState<'new' | 'history'>('new');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getSupportInfo(), getTickets()])
            .then(([infoRes, ticketsRes]) => {
                setInfo(infoRes.support || { partner: {}, platform: {} });
                setTickets(ticketsRes.tickets || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTicket({ subject, description });
            setSent(true);
            setSubject('');
            setDescription('');
            const res = await getTickets();
            setTickets(res.tickets || []);
            setTimeout(() => setSent(false), 3000);
        } catch {}
    };

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Help</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Support</h2>
            </div>

            {sent && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">Ticket submitted.</div>}

            <div className="flex gap-2">
                <button onClick={() => setTab('new')} className={`rounded-xl px-4 py-2 text-sm font-medium ${tab === 'new' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>New Ticket</button>
                <button onClick={() => setTab('history')} className={`rounded-xl px-4 py-2 text-sm font-medium ${tab === 'history' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>History ({tickets.length})</button>
            </div>

            {tab === 'new' ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    <form onSubmit={handleSubmit} className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Submit Ticket</h3>
                        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <button type="submit" className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">Submit</button>
                    </form>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact</h3>
                        <div className="text-sm text-slate-400 space-y-2">
                            <p><span className="text-slate-500">Email:</span> {info.platform.email}</p>
                            <p><span className="text-slate-500">Phone:</span> {info.platform.phone}</p>
                            <p><span className="text-slate-500">Hours:</span> {info.platform.hours}</p>
                            <p><span className="text-slate-500">Emergency:</span> {info.platform.emergency}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                    {tickets.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No tickets.</p>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((t) => (
                                <div key={t._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900">
                                    <div>
                                        <p className="text-white text-sm font-medium">{t.subject}</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(t.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupportPage;