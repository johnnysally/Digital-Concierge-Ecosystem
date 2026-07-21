import { useEffect, useState } from 'react';
import { changePassword, getProfile, updateProfile } from '../../api/transport/authApi';

const SettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [savingPreferences, setSavingPreferences] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        getProfile()
            .then((profile) => {
                setEmailNotif(profile.preferences?.notifications?.email ?? true);
                setSmsNotif(profile.preferences?.notifications?.sms ?? true);
                setPushNotif(profile.preferences?.notifications?.push ?? true);
            })
            .catch(() => setMessage('Unable to load settings.'))
            .finally(() => setLoading(false));
    }, []);

    const handleSavePreferences = async () => {
        setSavingPreferences(true);
        setMessage('');

        try {
            await updateProfile({ preferences: { notifications: { email: emailNotif, sms: smsNotif, push: pushNotif } } });
            const profile = await getProfile();
            setEmailNotif(profile.preferences?.notifications?.email ?? true);
            setSmsNotif(profile.preferences?.notifications?.sms ?? true);
            setPushNotif(profile.preferences?.notifications?.push ?? true);
            setMessage('Preferences saved successfully.');
        } catch {
            setMessage('Unable to save preferences. Please try again.');
        } finally {
            setSavingPreferences(false);
        }
    };

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setChangingPassword(true);
        setMessage('');

        try {
            await changePassword({ currentPassword, newPassword });
            setCurrentPassword('');
            setNewPassword('');
            setMessage('Password updated successfully.');
        } catch {
            setMessage('Unable to update password. Check your current password.');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Settings</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Transport portal preferences</h2>
                <p className="mt-2 text-sm text-slate-400">Manage your account preferences and security settings in the transport portal.</p>
            </div>

            {message ? (
                <div className={`rounded-2xl px-4 py-3 text-sm ${message.includes('Unable') ? 'bg-rose-500/10 border border-rose-500/20 text-rose-200' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200'}`}>
                    {message}
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading settings...</div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                        <h3 className="text-lg font-semibold text-white">Notification preferences</h3>
                        <div className="mt-5 space-y-4">
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
                                <div>
                                    <p className="text-sm font-medium text-white">Email notifications</p>
                                    <p className="mt-1 text-sm text-slate-400">Receive booking updates and transport alerts by email.</p>
                                </div>
                                <input type="checkbox" checked={emailNotif} onChange={(event) => setEmailNotif(event.target.checked)} className="h-5 w-5 rounded accent-emerald-500" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
                                <div>
                                    <p className="text-sm font-medium text-white">SMS notifications</p>
                                    <p className="mt-1 text-sm text-slate-400">Receive urgent transport updates via SMS.</p>
                                </div>
                                <input type="checkbox" checked={smsNotif} onChange={(event) => setSmsNotif(event.target.checked)} className="h-5 w-5 rounded accent-emerald-500" />
                            </label>
                            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
                                <div>
                                    <p className="text-sm font-medium text-white">Push notifications</p>
                                    <p className="mt-1 text-sm text-slate-400">Receive browser alerts for new transport activity.</p>
                                </div>
                                <input type="checkbox" checked={pushNotif} onChange={(event) => setPushNotif(event.target.checked)} className="h-5 w-5 rounded accent-emerald-500" />
                            </label>
                        </div>
                        <button onClick={handleSavePreferences} disabled={savingPreferences} className="mt-6 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
                            {savingPreferences ? 'Saving...' : 'Save preferences'}
                        </button>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                        <h3 className="text-lg font-semibold text-white">Change password</h3>
                        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
                            <label className="block text-sm text-slate-400">
                                Current password
                                <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
                            </label>
                            <label className="block text-sm text-slate-400">
                                New password
                                <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={6} className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
                            </label>
                            <button type="submit" disabled={changingPassword} className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                                {changingPassword ? 'Updating...' : 'Update password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
