import { useEffect, useState } from 'react';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';
import { getRestaurantProfile, getRestaurantSettings, setRestaurantProfile, setRestaurantSettings } from './mockData';

type RestaurantSettingsState = {
    openForBusiness: boolean;
    deliveryEnabled: boolean;
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    operations: {
        autoAcceptOrders: boolean;
        allowPickup: boolean;
        showBusyStatus: boolean;
        defaultPrepTime: number;
    };
    password: string;
    confirmPassword: string;
};

const defaultSettingsState = (): RestaurantSettingsState => ({
    openForBusiness: true,
    deliveryEnabled: true,
    notifications: { email: true, sms: true, push: true },
    operations: { autoAcceptOrders: true, allowPickup: true, showBusyStatus: true, defaultPrepTime: 25 },
    password: '',
    confirmPassword: '',
});

const SettingsPage = () => {
    const [form, setForm] = useState<RestaurantSettingsState>(defaultSettingsState());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const isLight = getStoredRestaurantTheme() === 'light';

    useEffect(() => {
        const profile = getRestaurantProfile();
        const settings = getRestaurantSettings();
        setForm({
            openForBusiness: profile.isOpen,
            deliveryEnabled: profile.deliveryEnabled,
            notifications: settings.notifications,
            operations: settings.operations,
            password: '',
            confirmPassword: '',
        });
        setLoading(false);
    }, []);

    const handleSave = () => {
        setSaving(true);
        setMessage('');

        const nextProfile = {
            ...getRestaurantProfile(),
            isOpen: form.openForBusiness,
            deliveryEnabled: form.deliveryEnabled,
        };

        setRestaurantProfile(nextProfile);
        setRestaurantSettings({
            notifications: form.notifications,
            operations: form.operations,
        });

        setTimeout(() => {
            setMessage('Settings updated successfully.');
            setSaving(false);
        }, 250);
    };

    const handlePasswordChange = (event: React.FormEvent) => {
        event.preventDefault();
        if (form.password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setMessage('Password updated locally for this demo experience.');
        setForm((current) => ({ ...current, password: '', confirmPassword: '' }));
    };

    const updateField = <K extends keyof RestaurantSettingsState>(key: K, value: RestaurantSettingsState[K]) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    if (loading) {
        return <div className={`rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90 text-slate-600' : 'border-slate-800 bg-slate-900/80 text-slate-400'}`}>Loading settings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className={`rounded-[28px] border p-6 shadow-sm ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Settings</p>
                <h1 className={`mt-2 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Restaurant settings</h1>
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Configure service availability, communication preferences, and account security for your restaurant workspace.</p>
            </div>

            {message ? <div className={`rounded-2xl border px-4 py-3 text-sm ${message.includes('updated') || message.includes('successfully') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'}`}>{message}</div> : null}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className={`rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                    <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Service availability</h2>
                    <div className="mt-5 space-y-4">
                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Open for business</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Let guests see that your kitchen is accepting orders.</p>
                            </div>
                            <input type="checkbox" checked={form.openForBusiness} onChange={(event) => updateField('openForBusiness', event.target.checked)} className="h-5 w-5 rounded accent-amber-500" />
                        </label>

                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Delivery enabled</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Allow delivery orders to be routed to your kitchen.</p>
                            </div>
                            <input type="checkbox" checked={form.deliveryEnabled} onChange={(event) => updateField('deliveryEnabled', event.target.checked)} className="h-5 w-5 rounded accent-amber-500" />
                        </label>

                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Auto-accept incoming orders</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Automatically confirm orders as soon as they arrive.</p>
                            </div>
                            <input type="checkbox" checked={form.operations.autoAcceptOrders} onChange={(event) => updateField('operations', { ...form.operations, autoAcceptOrders: event.target.checked })} className="h-5 w-5 rounded accent-amber-500" />
                        </label>

                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Pickup orders enabled</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Let customers collect meals directly from your location.</p>
                            </div>
                            <input type="checkbox" checked={form.operations.allowPickup} onChange={(event) => updateField('operations', { ...form.operations, allowPickup: event.target.checked })} className="h-5 w-5 rounded accent-amber-500" />
                        </label>

                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Show kitchen busy status</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Display a live busy indicator to customers during peak hours.</p>
                            </div>
                            <input type="checkbox" checked={form.operations.showBusyStatus} onChange={(event) => updateField('operations', { ...form.operations, showBusyStatus: event.target.checked })} className="h-5 w-5 rounded accent-amber-500" />
                        </label>

                        <label className={`block rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <span className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Default prep time (minutes)</span>
                            <input type="number" min="5" max="90" value={form.operations.defaultPrepTime} onChange={(event) => updateField('operations', { ...form.operations, defaultPrepTime: Number(event.target.value) })} className={`mt-3 w-full rounded-2xl border px-3 py-2 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                        </label>
                    </div>

                    <button type="button" onClick={handleSave} disabled={saving} className="mt-6 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                        {saving ? 'Saving...' : 'Save settings'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className={`rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Notifications</h2>
                        <div className="mt-5 space-y-4">
                            <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                                <div>
                                    <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Email alerts</p>
                                    <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Receive order confirmations and updates by email.</p>
                                </div>
                                <input type="checkbox" checked={form.notifications.email} onChange={(event) => updateField('notifications', { ...form.notifications, email: event.target.checked })} className="h-5 w-5 rounded accent-amber-500" />
                            </label>
                            <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                                <div>
                                    <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>SMS alerts</p>
                                    <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Get urgent kitchen updates on your phone.</p>
                                </div>
                                <input type="checkbox" checked={form.notifications.sms} onChange={(event) => updateField('notifications', { ...form.notifications, sms: event.target.checked })} className="h-5 w-5 rounded accent-amber-500" />
                            </label>
                            <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                                <div>
                                    <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Push notifications</p>
                                    <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Show browser notifications when orders change status.</p>
                                </div>
                                <input type="checkbox" checked={form.notifications.push} onChange={(event) => updateField('notifications', { ...form.notifications, push: event.target.checked })} className="h-5 w-5 rounded accent-amber-500" />
                            </label>
                        </div>
                    </div>

                    <div className={`rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                        <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Security</h2>
                        <form className="mt-5 space-y-4" onSubmit={handlePasswordChange}>
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">New password</span>
                                <input type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Confirm password</span>
                                <input type="password" value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                            <button type="submit" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-600 transition hover:bg-amber-500/20">
                                Update password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
