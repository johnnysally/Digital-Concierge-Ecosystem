import { useEffect, useState } from 'react';
import { getLegalPage, updateLegalPage } from '../api/legalApi';
import SectionHeader from '../components/ui/SectionHeader';

const tabs = [
    { key: 'terms', label: 'Terms & Conditions', icon: '📋' },
    { key: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { key: 'cookies', label: 'Cookie Policy', icon: '🍪' },
];

const LegalPage = () => {
    const [activeTab, setActiveTab] = useState('terms');
    const [content, setContent] = useState('');
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        getLegalPage(activeTab)
            .then((res) => {
                setContent(res.content || '');
                setLastUpdated(res.lastUpdated);
            })
            .finally(() => setLoading(false));
    }, [activeTab]);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await updateLegalPage(activeTab, content);
            setMessage('Saved successfully.');
            setLastUpdated(new Date().toISOString());
        } catch {
            setMessage('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <SectionHeader title="Legal Pages" subtitle="Manage Terms & Conditions, Privacy Policy and Cookie Policy" />
            {message && (
                <div className={`rounded-xl p-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {message}
                </div>
            )}
            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">{tabs.find(t => t.key === activeTab)?.label}</h2>
                        {lastUpdated && <p className="text-xs text-slate-500 mt-1">Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50 transition-colors">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
                {loading ? (
                    <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[500px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-primary-500 resize-y"
                        placeholder="Enter HTML content..."
                    />
                )}
            </div>
        </div>
    );
};

export default LegalPage;