import React, { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { useAccommodationTheme } from '../../context/accommodation/ThemeContext';

const SupportPage = () => {
    const { isDark } = useAccommodationTheme();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [sent, setSent] = useState(false);
    const [tickets, setTickets] = useState<any[]>([]);
    const [config, setConfig] = useState({ support_email: '', support_phone: '', support_hours: '' });

    useEffect(() => {
        api.get('/public/config')
            .then((res) => setConfig(res.data.config || {}))
            .catch(() => {});

        api.get('/customer/support/tickets')
            .then((res) => setTickets(res.data.tickets || []))
            .catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/customer/support', { subject, description });
            setSent(true);
            setSubject('');
            setDescription('');
            setTickets([{ _id: Date.now(), subject, status: 'open', createdAt: new Date().toISOString() }, ...tickets]);
            setTimeout(() => setSent(false), 3000);
        } catch {}
    };

    const cardClass = isDark
        ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors'
        : 'rounded-3xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors shadow-sm';

    const inputClass = isDark
        ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500'
        : 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500';

    const titleClass = isDark ? 'text-white' : 'text-slate-900';
    const subtitleClass = isDark ? 'text-slate-400' : 'text-slate-500';
    const textClass = isDark ? 'text-slate-300' : 'text-slate-600';

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-2xl font-semibold ${titleClass}`}>Support & Help</h1>
                <p className={`mt-1 text-sm ${subtitleClass}`}>Submit tickets, view history, or contact support directly.</p>
            </div>

            {sent && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">Your ticket has been submitted.</div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className={cardClass}>
                        <h3 className={`text-lg font-semibold ${titleClass}`}>Submit a Ticket</h3>
                        <p className={`mt-1 text-sm ${subtitleClass}`}>Describe the issue and our team will respond.</p>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required className={inputClass} />
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail" required rows={6} className={inputClass} />
                            <button type="submit" className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors">Submit Ticket</button>
                        </form>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className={cardClass}>
                        <h3 className={`text-lg font-semibold ${titleClass}`}>📞 Contact</h3>
                        <div className="mt-4 space-y-3 text-sm">
                            {config.support_email && (
                                <div>
                                    <p className={subtitleClass}>Email</p>
                                    <p className={`font-medium ${textClass}`}>{config.support_email}</p>
                                </div>
                            )}
                            {config.support_phone && (
                                <div>
                                    <p className={subtitleClass}>Phone</p>
                                    <p className={`font-medium ${textClass}`}>{config.support_phone}</p>
                                </div>
                            )}
                            {config.support_hours && (
                                <div>
                                    <p className={subtitleClass}>Hours</p>
                                    <p className={`font-medium ${textClass}`}>{config.support_hours}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h3 className={`text-lg font-semibold ${titleClass}`}>Your Tickets</h3>
                        <div className="mt-4 space-y-3 text-sm">
                            {tickets.length === 0 ? (
                                <p className={subtitleClass}>No tickets yet.</p>
                            ) : (
                                tickets.slice(0, 6).map((t) => (
                                    <div key={t._id} className={`flex items-center justify-between p-3 rounded-md ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
                                        <div>
                                            <p className={`font-medium text-sm ${titleClass}`}>{t.subject}</p>
                                            <p className={`text-xs mt-1 ${subtitleClass}`}>{new Date(t.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.status === 'open' ? 'bg-amber-500/20 text-amber-400' : t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{t.status}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
