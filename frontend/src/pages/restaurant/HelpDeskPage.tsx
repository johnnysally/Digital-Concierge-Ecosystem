import { FormEvent, useState } from 'react';
import { useRestaurantTheme } from '../../components/restaurant/layout/theme';

const helpTopics = [
    {
        title: 'Order management',
        description: 'Get help with order updates, delivery statuses and cancellations within the restaurant portal.',
    },
    {
        title: 'Menu publishing',
        description: 'Questions about creating or editing menu items, categories, and pricing for guests.',
    },
    {
        title: 'Payment reconciliation',
        description: 'Support for payment settles, payout records, and terminal status checks.',
    },
    {
        title: 'Account access',
        description: 'Help with login, profile updates, or restaurant administrator settings.',
    },
];

const HelpDeskPage = () => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Order management');
    const [priority, setPriority] = useState('Medium');
    const [reference, setReference] = useState('');
    const [contact, setContact] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const theme = useRestaurantTheme();
    const isLight = theme === 'light';

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!subject || !message || !contact) {
            setStatus('Please provide a subject, contact details, and a detailed issue description.');
            return;
        }
        setStatus('Your support request has been recorded. For urgent issues, please call +254 700 000 000.');
        setSubject('');
        setCategory('Order management');
        setPriority('Medium');
        setReference('');
        setContact('');
        setMessage('');
    };

    return (
        <div className="space-y-6">
            <div className={`rounded-[28px] border border-amber-500/20 p-6 shadow-[0_18px_60px_-20px_rgba(245,158,11,0.35)] ${isLight ? 'bg-white/90' : 'bg-slate-950/90'}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Help desk</p>
                        <h1 className="mt-3 text-3xl font-semibold text-white">Restaurant support center</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400">Find the right support path for kitchen operations, account questions, and portal guidance.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                        <p className="font-semibold">Support hours</p>
                        <p className="mt-1 text-slate-400">Mon–Fri · 08:00 to 18:00 EAT</p>
                    </div>
                </div>
            </div>

            {status ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{status}</div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</p>
                            <p className="mt-3 text-white">support@digitalsafaris.com</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Phone</p>
                            <p className="mt-3 text-white">+254 700 000 000</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Documentation</p>
                            <p className="mt-3 text-white">Portal guides, policies, and operations checklists.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Priority</p>
                            <p className="mt-3 text-white">Critical incidents are escalated immediately.</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/80 p-6">
                        <h2 className="text-xl font-semibold text-white">Quick help topics</h2>
                        <div className="mt-4 space-y-3">
                            {helpTopics.map((topic) => (
                                <div key={topic.title} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                                    <p className="font-semibold text-white">{topic.title}</p>
                                    <p className="mt-1 text-sm text-slate-400">{topic.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                        <h2 className="text-xl font-semibold text-white">Send a request</h2>
                        <p className="mt-2 text-sm text-slate-400">Use this form to summarize your issue. A support specialist will follow up via email.</p>
                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <input
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                                placeholder="Support subject"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500"
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="text-sm text-slate-300">Category</span>
                                    <select
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500"
                                    >
                                        {helpTopics.map((topic) => (
                                            <option key={topic.title} value={topic.title}>{topic.title}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm text-slate-300">Priority</span>
                                    <select
                                        value={priority}
                                        onChange={(event) => setPriority(event.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </label>
                            </div>
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Describe the issue, error, or question"
                                rows={6}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950/95 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500"
                            />
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                                <p className="font-semibold text-white">Need help raising a concern?</p>
                                <p className="mt-2">Include the affected page, error message, order or reservation ID, the impact on operations, and whether customers are blocked.</p>
                                <p className="mt-2 text-xs text-slate-400">Priority helps us escalate issues faster: use Critical for broken checkout, High for service interruptions, Medium for functional concerns, and Low for general guidance.</p>
                            </div>
                            <button
                                type="submit"
                                className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                            >
                                Request help
                            </button>
                        </form>
                    </div>

                    <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                        <h2 className="text-xl font-semibold text-white">Need urgent assistance?</h2>
                        <p className="mt-2 text-sm text-slate-400">Call the line below for critical order or payment incidents.</p>
                        <div className="mt-4 space-y-3 text-sm text-slate-200">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                <p className="font-medium">Emergency support</p>
                                <p className="mt-1 text-amber-400">+254 700 000 000</p>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                                <p className="font-medium">Email support</p>
                                <p className="mt-1 text-cyan-300">support@digitalsafaris.com</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HelpDeskPage;
