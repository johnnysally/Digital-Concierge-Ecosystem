import { useEffect, useState } from 'react';
import { getProfile } from '../../api/accommodation/authApi';
import { getAccommodationSettings, updateAccommodationSettings } from '../../api/accommodation/settingsApi';
import { useAccommodationTheme } from '../../context/accommodation/ThemeContext';

type SettingsState = {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    timezone: string;
    currency: string;
    language: string;
    portalName: string;
    portalTagline: string;
    accentColor: string;
    secondaryColor: string;
    defaultView: string;
    allowInstantBooking: boolean;
    requireApproval: boolean;
    autoConfirmReservations: boolean;
    sendArrivalReminders: boolean;
    sendCheckoutReminders: boolean;
    sendHousekeepingAlerts: boolean;
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    enableGuestMessaging: boolean;
    enableReviewRequests: boolean;
    paymentProvider: string;
    calendarSync: boolean;
    cloudStorage: boolean;
    supportEmail: string;
    supportPhone: string;
    termsUrl: string;
    privacyUrl: string;
    maintenanceMode: boolean;
    themeMode: 'light' | 'dark' | 'system';
    themePreset: 'professional' | 'emerald' | 'ocean' | 'midnight';
};

const defaultSettings: SettingsState = {
    businessName: 'Digital Safaris Partner',
    contactEmail: '',
    contactPhone: '',
    address: '',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    language: 'en',
    portalName: 'Digital Safaris Accommodation',
    portalTagline: 'Manage stays, reservations, and guest operations',
    accentColor: '#10b981',
    secondaryColor: '#0f766e',
    defaultView: 'dashboard',
    allowInstantBooking: true,
    requireApproval: false,
    autoConfirmReservations: true,
    sendArrivalReminders: true,
    sendCheckoutReminders: true,
    sendHousekeepingAlerts: true,
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enableGuestMessaging: true,
    enableReviewRequests: true,
    paymentProvider: 'stripe',
    calendarSync: true,
    cloudStorage: true,
    supportEmail: '',
    supportPhone: '',
    termsUrl: '/terms',
    privacyUrl: '/privacy',
    maintenanceMode: false,
    themeMode: 'dark',
    themePreset: 'professional',
};

const SettingsPage = () => {
    const { toggleTheme } = useAccommodationTheme();
    const [profile, setProfile] = useState<any>(null);
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            try {
                const [profileResponse, remoteSettings] = await Promise.all([
                    getProfile(),
                    getAccommodationSettings(),
                ]);

                if (!isMounted) return;

                setProfile(profileResponse);
                setSettings((current) => ({
                    ...current,
                    ...remoteSettings,
                    businessName: profileResponse?.businessName || remoteSettings?.businessName || current.businessName,
                    contactEmail: profileResponse?.email || remoteSettings?.contactEmail || current.contactEmail,
                    supportEmail: profileResponse?.email || remoteSettings?.supportEmail || current.supportEmail,
                }));
            } catch (err: any) {
                if (!isMounted) return;
                setError(err?.response?.data?.message || 'Unable to load account settings');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = (field: keyof SettingsState, value: string | boolean) => {
        setSettings((current) => ({ ...current, [field]: value }));
    };

    const syncThemePreferences = (nextSettings: SettingsState) => {
        if (typeof window === 'undefined') return;
        const resolvedTheme = nextSettings.themeMode === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : nextSettings.themeMode;

        localStorage.setItem('accommodation-dashboard-theme', resolvedTheme);
        localStorage.setItem('accommodation-dashboard-theme-mode', nextSettings.themeMode);
        localStorage.setItem('accommodation-dashboard-theme-preset', nextSettings.themePreset);
        localStorage.setItem('accommodation-dashboard-accent-color', nextSettings.accentColor);
        localStorage.setItem('accommodation-dashboard-secondary-color', nextSettings.secondaryColor);
        window.dispatchEvent(new Event('accommodation-theme-updated'));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const nextSettings = await updateAccommodationSettings(settings);
            setSettings(nextSettings);
            syncThemePreferences(nextSettings);
            setSuccess('Portal settings saved successfully.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to save your settings right now.');
        } finally {
            setSaving(false);
        }
    };

    const resetDefaults = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const nextSettings = await updateAccommodationSettings(defaultSettings);
            setSettings(nextSettings);
            syncThemePreferences(nextSettings);
            setSuccess('Settings reset to the default accommodation configuration.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to reset settings right now.');
        } finally {
            setSaving(false);
        }
    };

    const renderSection = (title: string, description: string, children: React.ReactNode) => (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">{children}</div>
        </section>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Settings</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Accommodation portal configuration</h2>
                    <p className="mt-2 text-sm text-slate-400">Control the core business, guest experience, operations, and communication settings for your Digital Safaris workspace.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={resetDefaults}
                        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Save settings'}
                    </button>
                </div>
            </div>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
            {success ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{success}</div> : null}

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">Loading account and portal settings...</div>
            ) : (
                <div className="space-y-6">
                    {renderSection('Business profile', 'Set the account identity and contact details used across the portal.', (
                        <>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Business name</span>
                                <input value={settings.businessName} onChange={(e) => handleChange('businessName', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Primary contact email</span>
                                <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Phone number</span>
                                <input value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Business address</span>
                                <textarea value={settings.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Timezone</span>
                                <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                                    <option value="UTC">UTC</option>
                                    <option value="Europe/London">Europe/London</option>
                                    <option value="America/New_York">America/New_York</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Currency</span>
                                <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="KES">KES</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Language</span>
                                <select value={settings.language} onChange={(e) => handleChange('language', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="en">English</option>
                                    <option value="sw">Swahili</option>
                                    <option value="fr">French</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Support email</span>
                                <input type="email" value={settings.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                        </>
                    ))}

                    {renderSection('UI theme and appearance', 'Choose the visual theme, preset, and accent palette that keeps the workspace polished and professional.', (
                        <>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Theme mode</span>
                                <select value={settings.themeMode} onChange={(e) => handleChange('themeMode', e.target.value as SettingsState['themeMode'])} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white lg:max-w-xs">
                                    <option value="dark">Dark professional</option>
                                    <option value="light">Light professional</option>
                                    <option value="system">Follow system</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Theme preset</span>
                                <select value={settings.themePreset} onChange={(e) => handleChange('themePreset', e.target.value as SettingsState['themePreset'])} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="professional">Professional</option>
                                    <option value="emerald">Emerald</option>
                                    <option value="ocean">Ocean</option>
                                    <option value="midnight">Midnight</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Primary accent</span>
                                <input type="color" value={settings.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 p-1" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Secondary accent</span>
                                <input type="color" value={settings.secondaryColor} onChange={(e) => handleChange('secondaryColor', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 p-1" />
                            </label>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 lg:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Preview</p>
                                <div className="mt-4 rounded-3xl border border-slate-800 p-4" style={{ background: `linear-gradient(135deg, ${settings.secondaryColor}16 0%, ${settings.accentColor}10 100%)` }}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Digital Safaris Workspace</p>
                                            <p className="text-sm text-slate-400">A premium partner experience with consistent visual identity.</p>
                                        </div>
                                        <div className="rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white" style={{ backgroundColor: settings.accentColor }}>
                                            {settings.themePreset}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}

                    {renderSection('Portal branding and experience', 'Adjust the visible portal identity and default workspace behavior.', (
                        <>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Portal name</span>
                                <input value={settings.portalName} onChange={(e) => handleChange('portalName', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Portal tagline</span>
                                <input value={settings.portalTagline} onChange={(e) => handleChange('portalTagline', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Primary accent color</span>
                                <input type="color" value={settings.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 p-1" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Secondary color</span>
                                <input type="color" value={settings.secondaryColor} onChange={(e) => handleChange('secondaryColor', e.target.value)} className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-950 p-1" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Default landing view</span>
                                <select value={settings.defaultView} onChange={(e) => handleChange('defaultView', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="dashboard">Dashboard</option>
                                    <option value="reservations">Reservations</option>
                                    <option value="analytics">Analytics</option>
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Support phone</span>
                                <input value={settings.supportPhone} onChange={(e) => handleChange('supportPhone', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                        </>
                    ))}

                    {renderSection('Reservations and operations', 'Fine-tune booking flow, reminders, and operational safeguards.', (
                        <>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Allow instant booking</span>
                                <input type="checkbox" checked={settings.allowInstantBooking} onChange={(e) => handleChange('allowInstantBooking', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Require approval for new reservations</span>
                                <input type="checkbox" checked={settings.requireApproval} onChange={(e) => handleChange('requireApproval', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Auto-confirm reservations</span>
                                <input type="checkbox" checked={settings.autoConfirmReservations} onChange={(e) => handleChange('autoConfirmReservations', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Send arrival reminders</span>
                                <input type="checkbox" checked={settings.sendArrivalReminders} onChange={(e) => handleChange('sendArrivalReminders', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Send checkout reminders</span>
                                <input type="checkbox" checked={settings.sendCheckoutReminders} onChange={(e) => handleChange('sendCheckoutReminders', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Send housekeeping alerts</span>
                                <input type="checkbox" checked={settings.sendHousekeepingAlerts} onChange={(e) => handleChange('sendHousekeepingAlerts', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                        </>
                    ))}

                    {renderSection('Communication and guest experience', 'Enable the messaging and notification features guests and staff rely on.', (
                        <>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Email notifications</span>
                                <input type="checkbox" checked={settings.enableEmailNotifications} onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>SMS notifications</span>
                                <input type="checkbox" checked={settings.enableSmsNotifications} onChange={(e) => handleChange('enableSmsNotifications', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Guest messaging</span>
                                <input type="checkbox" checked={settings.enableGuestMessaging} onChange={(e) => handleChange('enableGuestMessaging', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Review requests</span>
                                <input type="checkbox" checked={settings.enableReviewRequests} onChange={(e) => handleChange('enableReviewRequests', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Terms URL</span>
                                <input value={settings.termsUrl} onChange={(e) => handleChange('termsUrl', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Privacy URL</span>
                                <input value={settings.privacyUrl} onChange={(e) => handleChange('privacyUrl', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                            </label>
                        </>
                    ))}

                    {renderSection('Integrations and availability', 'Connect the portal to the tools and services required to keep operations running smoothly.', (
                        <>
                            <label className="space-y-2 text-sm text-slate-300">
                                <span>Payment provider</span>
                                <select value={settings.paymentProvider} onChange={(e) => handleChange('paymentProvider', e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                                    <option value="stripe">Stripe</option>
                                    <option value="mpesa">M-Pesa</option>
                                    <option value="wallet">Wallet</option>
                                </select>
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Calendar sync</span>
                                <input type="checkbox" checked={settings.calendarSync} onChange={(e) => handleChange('calendarSync', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Cloud storage sync</span>
                                <input type="checkbox" checked={settings.cloudStorage} onChange={(e) => handleChange('cloudStorage', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                                <span>Maintenance mode</span>
                                <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-950" />
                            </label>
                        </>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
