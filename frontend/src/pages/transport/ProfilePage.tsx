import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api/transport/authApi';

const ProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', businessName: '' });
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getProfile()
            .then((data) => {
                setProfile(data);
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    phone: data.phone || '',
                    businessName: data.businessName || '',
                });
            })
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const result = await updateProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                businessName: form.businessName,
            });

            setProfile(result.user || profile);
            setMessage('Profile updated successfully.');
            setEditMode(false);
        } catch {
            setMessage('Unable to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Profile</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Your transport account</h2>
                <p className="mt-2 text-sm text-slate-400">Review and manage the details connected to your transport profile.</p>
            </div>

            {message ? (
                <div className={`rounded-2xl px-4 py-3 text-sm ${message.includes('Unable') ? 'bg-rose-500/10 border border-rose-500/20 text-rose-200' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200'}`}>
                    {message}
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading profile...</div>
            ) : !profile ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Unable to load profile.</div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Account</p>
                                <h3 className="mt-2 text-xl font-semibold text-white">Transport partner details</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditMode(!editMode)}
                                className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                            >
                                {editMode ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {editMode ? (
                            <form onSubmit={handleSave} className="mt-6 space-y-4">
                                <label className="block text-sm text-slate-400">
                                    First name
                                    <input
                                        value={form.firstName}
                                        onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                                        required
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                    />
                                </label>
                                <label className="block text-sm text-slate-400">
                                    Last name
                                    <input
                                        value={form.lastName}
                                        onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                                        required
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                    />
                                </label>
                                <label className="block text-sm text-slate-400">
                                    Phone
                                    <input
                                        value={form.phone}
                                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                    />
                                </label>
                                <label className="block text-sm text-slate-400">
                                    Business name
                                    <input
                                        value={form.businessName}
                                        onChange={(event) => setForm({ ...form, businessName: event.target.value })}
                                        required
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save changes'}
                                </button>
                            </form>
                        ) : (
                            <div className="mt-6 space-y-4 text-sm text-slate-300">
                                <div>
                                    <p className="text-slate-500">Name</p>
                                    <p className="mt-1 text-white">{profile.firstName} {profile.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Email</p>
                                    <p className="mt-1 text-white">{profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Phone</p>
                                    <p className="mt-1 text-white">{profile.phone || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Business</p>
                                    <p className="mt-1 text-white">{profile.businessName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Business type</p>
                                    <p className="mt-1 text-white">{profile.businessType || 'Ride hailing'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Status</p>
                                    <p className="mt-1 text-white">{profile.isActive ? 'Active' : 'Pending approval'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Notifications</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">Alert preferences</h3>
                        <div className="mt-5 space-y-4 text-sm text-slate-300">
                            <div>
                                <p className="text-slate-500">Email alerts</p>
                                <p className="mt-1">{profile.preferences?.notifications?.email ? 'Enabled' : 'Disabled'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">SMS alerts</p>
                                <p className="mt-1">{profile.preferences?.notifications?.sms ? 'Enabled' : 'Disabled'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Push alerts</p>
                                <p className="mt-1">{profile.preferences?.notifications?.push ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Account activity</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">Recent login</h3>
                        <p className="mt-4 text-sm text-slate-300">{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Not available'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
