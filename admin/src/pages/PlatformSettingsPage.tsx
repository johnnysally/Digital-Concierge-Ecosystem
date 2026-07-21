import { useEffect, useState } from 'react';
import { getAllSettings, updateSetting, getCommissions, updateCommission } from '../api/settingsApi';
import SectionHeader from '../components/ui/SectionHeader';

const dropdownFields: Record<string, string[]> = {
    ai_provider: ['keyword', 'openai', 'hdm'],
    email_provider: ['brevo', 'hdm'],
    sms_provider: ['twilio', 'africas_talking'],
    default_currency: ['KES', 'USD', 'EUR', 'GBP'],
    default_language: ['en', 'sw', 'fr'],
    backup_frequency: ['daily', 'weekly', 'monthly'],
    payout_schedule: ['daily', 'weekly', 'biweekly', 'monthly'],
    timezone: ['Africa/Nairobi', 'Africa/Lagos', 'Africa/Johannesburg', 'UTC'],
    date_format: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
};

const toggleFields = [
    'ai_enabled', 'ai_suggestions_enabled', 'welcome_email_enabled', 'booking_confirmation_enabled',
    'two_factor_required', 'maintenance_mode', 'backup_auto_enabled', 'backup_email_enabled',
    'push_enabled', 'sms_enabled', 'email_notifications_enabled', 'order_updates_enabled', 'booking_reminders_enabled',
    'cloudinary_enabled',
];

const categories = [
    { key: 'general', label: 'General', icon: '⚙️' },
    { key: 'contact', label: 'Contact', icon: '📞' },
    { key: 'localization', label: 'Localization', icon: '🌍' },
    { key: 'email', label: 'Email', icon: '📧' },
    { key: 'payment', label: 'Payment', icon: '💳' },
    { key: 'security', label: 'Security', icon: '🔒' },
    { key: 'ai', label: 'AI', icon: '🤖' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'integrations', label: 'Integrations', icon: '🔗' },
    { key: 'legal', label: 'Legal', icon: '⚖️' },
];

const PlatformSettingsPage = () => {
    const [settings, setSettings] = useState<Record<string, any[]>>({});
    const [commissions, setCommissions] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('general');
    const [editing, setEditing] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<any>('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [s, c] = await Promise.all([getAllSettings(), getCommissions()]);
            setSettings(s.settings || {});
            setCommissions(c.commissions || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (key: string) => {
        try {
            await updateSetting(key, editValue);
            setSettings((prev) => {
                const updated = { ...prev };
                if (updated[activeCategory]) {
                    updated[activeCategory] = updated[activeCategory].map((s: any) =>
                        s.key === key ? { ...s, value: editValue } : s
                    );
                }
                return updated;
            });
            setEditing(null);
            setMessage('Setting updated.');
            setTimeout(() => setMessage(''), 2000);
        } catch {
            setMessage('Failed to update.');
        }
    };

    const handleCommissionUpdate = async (type: string, data: any) => {
        try {
            await updateCommission(type, data);
            const res = await getCommissions();
            setCommissions(res.commissions || []);
            setMessage('Commission updated.');
            setTimeout(() => setMessage(''), 2000);
        } catch {
            setMessage('Failed to update.');
        }
    };

    const startEdit = (setting: any) => {
        setEditing(setting.key);
        setEditValue(setting.value);
    };

    const renderEditField = (setting: any) => {
        if (dropdownFields[setting.key]) {
            return (
                <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary-500/20 outline-none"
                >
                    {dropdownFields[setting.key].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        }

        if (toggleFields.includes(setting.key)) {
            return (
                <select
                    value={String(editValue)}
                    onChange={(e) => setEditValue(e.target.value === 'true')}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-primary-500/20 outline-none"
                >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
            );
        }

        if (Array.isArray(setting.value)) {
            return (
                <input
                    value={editValue.join(', ')}
                    onChange={(e) => setEditValue(e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-xs w-56 focus:ring-2 focus:ring-primary-500/20 outline-none"
                />
            );
        }

        return (
            <input
                type={typeof setting.value === 'number' ? 'number' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(typeof setting.value === 'number' ? +e.target.value : e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-3 py-2 text-xs w-48 focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
        );
    };

    const renderValue = (setting: any) => {
        if (toggleFields.includes(setting.key)) {
            return (
                <span className={`text-xs font-mono px-2 py-1 rounded-lg ${setting.value ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}>
                    {setting.value ? 'Enabled' : 'Disabled'}
                </span>
            );
        }

        return (
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                {Array.isArray(setting.value) ? setting.value.join(', ') : String(setting.value)}
            </span>
        );
    };

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-slate-400 text-lg animate-pulse">Loading settings...</div>
        </div>
    );

    const currentSettings = settings[activeCategory] || [];

    return (
        <div className="space-y-6">
            <SectionHeader title="Platform Settings" subtitle="Master control center for the entire ecosystem" />

            {message && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400 animate-in fade-in">
                    {message}
                </div>
            )}

            <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            activeCategory === cat.key
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="text-lg font-semibold capitalize mb-1">{activeCategory} Settings</h2>
                <p className="text-sm text-slate-500 mb-6">Manage all {activeCategory} related configurations</p>

                <div className="space-y-2">
                    {currentSettings.length === 0 ? (
                        <p className="text-slate-400 text-sm py-8 text-center">No settings in this category.</p>
                    ) : (
                        currentSettings.map((setting: any) => (
                            <div
                                key={setting.key}
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <p className="font-medium text-sm capitalize text-slate-900 dark:text-white">
                                        {setting.key.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">{setting.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {editing === setting.key ? (
                                        <>
                                            {renderEditField(setting)}
                                            <button
                                                onClick={() => handleSave(setting.key)}
                                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditing(null)}
                                                className="rounded-lg bg-slate-200 dark:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {renderValue(setting)}
                                            <button
                                                onClick={() => startEdit(setting)}
                                                className="rounded-lg px-3 py-2 text-xs font-semibold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="text-lg font-semibold mb-1">Commission Rates</h2>
                <p className="text-sm text-slate-500 mb-6">Revenue share per partner type</p>
                <div className="grid gap-3 sm:grid-cols-3">
                    {commissions.map((c: any) => (
                        <div key={c.partnerType} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <p className="font-semibold capitalize text-slate-900 dark:text-white">{c.partnerType}</p>
                            <p className="text-2xl font-bold text-primary-500 mt-2">{c.percentage}%</p>
                            <p className="text-xs text-slate-500 mt-1">+ ${c.flatFee} flat fee</p>
                            <p className="text-xs text-slate-400 mt-1">Payout: {c.payoutSchedule}</p>
                            <button
                                onClick={() => handleCommissionUpdate(c.partnerType, { percentage: c.percentage })}
                                className="mt-3 text-xs text-primary-500 hover:underline"
                            >
                                Configure
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlatformSettingsPage;