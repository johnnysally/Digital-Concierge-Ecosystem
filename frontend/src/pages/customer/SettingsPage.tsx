import React, { useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { changePassword, updateProfile } from '../../api/customer/authApi';
import { useAuth } from '../../context/customer/AuthContext';

const SettingsPage = () => {
    const { user, refreshSession } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [language, setLanguage] = useState(user?.language || 'en');
    const [currency, setCurrency] = useState(user?.currency || 'USD');
    const [emailNotif, setEmailNotif] = useState(user?.preferences?.notifications?.email ?? true);
    const [smsNotif, setSmsNotif] = useState(user?.preferences?.notifications?.sms ?? true);
    const [pushNotif, setPushNotif] = useState(user?.preferences?.notifications?.push ?? true);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            await changePassword({ currentPassword, newPassword });
            setMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
        } catch {
            setMessage('Failed to update password. Check your current password.');
        }
    };

    const handleSavePreferences = async () => {
        setMessage('');
        try {
            await updateProfile({
                language,
                currency,
                preferences: { notifications: { email: emailNotif, sms: smsNotif, push: pushNotif } },
            });
            await refreshSession();
            setMessage('Preferences saved.');
        } catch {
            setMessage('Failed to save preferences.');
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Settings" subtitle="Configure your DigitalSafaris account, preferences and security." />

            {message && (
                <div className={`rounded-xl p-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            required
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min 6 chars)"
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                        />
                        <button type="submit" className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                            Update Password
                        </button>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold text-white">Preferences</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500">
                                <option value="en">English</option>
                                <option value="sw">Swahili</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Currency</label>
                            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500">
                                <option value="USD">USD</option>
                                <option value="KES">KES</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                <div className="mt-4 space-y-4">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 cursor-pointer">
                        <div>
                            <p className="text-sm text-white">Email Notifications</p>
                            <p className="text-xs text-slate-500">Receive booking updates and promotions via email</p>
                        </div>
                        <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)}
                            className="w-5 h-5 rounded accent-sky-500" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 cursor-pointer">
                        <div>
                            <p className="text-sm text-white">SMS Notifications</p>
                            <p className="text-xs text-slate-500">Get urgent updates via text message</p>
                        </div>
                        <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)}
                            className="w-5 h-5 rounded accent-sky-500" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 cursor-pointer">
                        <div>
                            <p className="text-sm text-white">Push Notifications</p>
                            <p className="text-xs text-slate-500">Receive real-time alerts in browser</p>
                        </div>
                        <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)}
                            className="w-5 h-5 rounded accent-sky-500" />
                    </label>
                </div>
                <button onClick={handleSavePreferences}
                    className="mt-6 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;