import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { api } from '../../api/axios';
import { useTheme } from '../../context/customer/ThemeContext';

const SupportCenterPage = () => {
    const { isDark } = useTheme();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [sent, setSent] = useState(false);
    const [tickets, setTickets] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    const [config, setConfig] = useState({ support_email: '', support_phone: '', support_hours: '' });

    useEffect(() => {
        api.get('/public/config')
            .then((res) => setConfig(res.data.config || config))
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
        <div className="space-y-8">
            <SectionHeader title="Help Center" subtitle="Get support, access emergency contacts, and report issues." />

            {sent && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">
                    Your ticket has been submitted. We'll respond shortly.
                </div>
            )}

            <div className="flex gap-2">
                <button onClick={() => setActiveTab('new')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'new' ? 'bg-sky-500 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-slate-600'}`}>
                    New Ticket
                </button>
                <button onClick={() => setActiveTab('history')}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-sky-500 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-slate-600'}`}>
                    Ticket History ({tickets.length})
                </button>
            </div>

            {activeTab === 'new' ? (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className={cardClass}>
                            <h3 className={`text-lg font-semibold ${titleClass}`}>Submit a Ticket</h3>
                            <p className={`mt-1 text-sm ${subtitleClass}`}>Describe your issue and we'll get back to you within 24 hours.</p>
                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required className={inputClass} />
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue in detail" required rows={5} className={inputClass} />
                                <button type="submit" className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors">
                                    Submit Ticket
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className={cardClass}>
                            <h3 className={`text-lg font-semibold ${titleClass}`}>📞 Contact Us</h3>
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
                            <h3 className={`text-lg font-semibold ${titleClass}`}>🚨 Emergency</h3>
                            <p className={`mt-3 text-sm ${subtitleClass}`}>For urgent matters, call our 24/7 emergency line or use the AI concierge for immediate assistance.</p>
                            <button onClick={() => window.location.href = '/chat'} className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                                Chat with AI Concierge
                            </button>
                        </div>
                        <div className={cardClass}>
                            <h3 className={`text-lg font-semibold ${titleClass}`}>❓ FAQs</h3>
                            <div className="mt-4 space-y-3 text-sm">
                                <div>
                                    <p className={`font-medium ${textClass}`}>How do I cancel a booking?</p>
                                    <p className={subtitleClass}>Go to Bookings → select booking → Cancel.</p>
                                </div>
                                <div>
                                    <p className={`font-medium ${textClass}`}>How do refunds work?</p>
                                    <p className={subtitleClass}>Refunds are processed within 5-7 business days.</p>
                                </div>
                                <div>
                                    <p className={`font-medium ${textClass}`}>How do I change my password?</p>
                                    <p className={subtitleClass}>Go to Settings → Change Password.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cardClass}>
                    <h3 className={`text-lg font-semibold ${titleClass} mb-4`}>Your Tickets</h3>
                    {tickets.length === 0 ? (
                        <p className={`text-sm ${subtitleClass}`}>No tickets submitted yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => (
                                <div key={ticket._id} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
                                    <div>
                                        <p className={`font-medium text-sm ${titleClass}`}>{ticket.subject}</p>
                                        <p className={`text-xs mt-1 ${subtitleClass}`}>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' :
                                        ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SupportCenterPage;