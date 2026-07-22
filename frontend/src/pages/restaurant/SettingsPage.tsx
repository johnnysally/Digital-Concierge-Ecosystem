import { useEffect, useState } from 'react';
import { changePassword, getProfile, updateProfile } from '../../api/restaurant/authApi';
import { getStoredRestaurantTheme, setStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

type RestaurantSettingsState = {
    businessName: string;
    cuisine: string;
    phone: string;
    isOpen: boolean;
    deliveryEnabled: boolean;
    deliveryFee: number;
    minOrder: number;
    openingHours: {
        open: string;
        close: string;
    };
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    password: string;
    confirmPassword: string;
};

const defaultSettingsState = (): RestaurantSettingsState => ({
    businessName: '',
    cuisine: 'other',
    phone: '',
    isOpen: true,
    deliveryEnabled: true,
    deliveryFee: 0,
    minOrder: 0,
    openingHours: { open: '08:00', close: '22:00' },
    notifications: { email: true, sms: true, push: true },
    password: '',
    confirmPassword: '',
});

const SettingsPage = () => {
    const [form, setForm] = useState<RestaurantSettingsState>(defaultSettingsState());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>(getStoredRestaurantTheme());
    const isLight = theme === 'light';

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const profile = await getProfile();
                setForm({
                    businessName: profile.businessName || '',
                    cuisine: profile.cuisine || 'other',
                    phone: profile.phone || '',
                    isOpen: profile.isOpen ?? true,
                    deliveryEnabled: profile.deliveryEnabled ?? true,
                    deliveryFee: profile.deliveryFee ?? 0,
                    minOrder: profile.minOrder ?? 0,
                    openingHours: profile.openingHours || { open: '08:00', close: '22:00' },
                    notifications: profile.preferences?.notifications || { email: true, sms: true, push: true },
                    password: '',
                    confirmPassword: '',
                });
            } catch (err: any) {
                setMessage(err?.response?.data?.message || 'Unable to load settings.');
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
        setTheme(getStoredRestaurantTheme());
    }, []);

    useEffect(() => {
        const syncTheme = () => setTheme(getStoredRestaurantTheme());
        window.addEventListener('restaurant-theme-changed', syncTheme);
        return () => window.removeEventListener('restaurant-theme-changed', syncTheme);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            await updateProfile({
                businessName: form.businessName,
                cuisine: form.cuisine,
                phone: form.phone,
                isOpen: form.isOpen,
                deliveryEnabled: form.deliveryEnabled,
                deliveryFee: form.deliveryFee,
                minOrder: form.minOrder,
                openingHours: form.openingHours,
                preferences: { notifications: form.notifications },
            });
            setMessage('Settings updated successfully.');
        } catch (err: any) {
            setMessage(err?.response?.data?.message || 'Unable to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();
        if (form.password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            await changePassword({ currentPassword: form.password, newPassword: form.password });
            setMessage('Password updated successfully.');
            setForm((current) => ({ ...current, password: '', confirmPassword: '' }));
        } catch (err: any) {
            setMessage(err?.response?.data?.message || 'Unable to update password.');
        }
    };

    const handleThemeToggle = () => {
        const nextTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        setStoredRestaurantTheme(nextTheme);
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
                <p className={`mt-2 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>These settings are saved straight to your restaurant profile in the backend.</p>
            </div>

            <div className={`rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Appearance</h2>
                        <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Switch between the light and dark restaurant portal theme.</p>
                    </div>
                    <button type="button" onClick={handleThemeToggle} className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>
                        {theme === 'light' ? '☀️ Switch to dark theme' : '🌙 Switch to light theme'}
                    </button>
                </div>
            </div>

            {message ? <div className={`rounded-2xl border px-4 py-3 text-sm ${message.includes('updated') || message.includes('successfully') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'}`}>{message}</div> : null}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className={`rounded-[24px] border p-6 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/80'}`}>
                    <h2 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Profile & availability</h2>
                    <div className="mt-5 space-y-4">
                        <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                            <span className="mb-2 block">Business name</span>
                            <input value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                        </label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Cuisine</span>
                                <select value={form.cuisine} onChange={(event) => updateField('cuisine', event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`}>
                                    <option value="african">African</option>
                                    <option value="italian">Italian</option>
                                    <option value="chinese">Chinese</option>
                                    <option value="indian">Indian</option>
                                    <option value="fast_food">Fast food</option>
                                    <option value="seafood">Seafood</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Phone</span>
                                <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                        </div>
                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Open for business</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Let guests see that your kitchen is accepting orders.</p>
                            </div>
                            <input type="checkbox" checked={form.isOpen} onChange={(event) => updateField('isOpen', event.target.checked)} className="h-5 w-5 rounded accent-amber-500" />
                        </label>
                        <label className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/70'}`}>
                            <div>
                                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>Delivery enabled</p>
                                <p className={`mt-1 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Allow delivery orders to be routed to your kitchen.</p>
                            </div>
                            <input type="checkbox" checked={form.deliveryEnabled} onChange={(event) => updateField('deliveryEnabled', event.target.checked)} className="h-5 w-5 rounded accent-amber-500" />
                        </label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Delivery fee</span>
                                <input type="number" value={form.deliveryFee} onChange={(event) => updateField('deliveryFee', Number(event.target.value))} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Minimum order</span>
                                <input type="number" value={form.minOrder} onChange={(event) => updateField('minOrder', Number(event.target.value))} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Opening time</span>
                                <input type="time" value={form.openingHours.open} onChange={(event) => updateField('openingHours', { ...form.openingHours, open: event.target.value })} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                            <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                                <span className="mb-2 block">Closing time</span>
                                <input type="time" value={form.openingHours.close} onChange={(event) => updateField('openingHours', { ...form.openingHours, close: event.target.value })} className={`w-full rounded-2xl border px-3 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-900 text-white'}`} />
                            </label>
                        </div>
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
