import { useEffect, useState } from 'react';
import { getProfile, updateProfile, changePassword } from '../../api/transport/authApi';

const ProfilePage = () => {
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', businessName: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getProfile()
            .then((res) => {
                const u = res.user;
                setForm({ firstName: u.firstName || '', lastName: u.lastName || '', phone: u.phone || '', businessName: u.businessName || '' });
            })
            .catch(() => setError('Failed to load profile'))
            .finally(() => setLoading(false));
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');
        try {
            await updateProfile(form);
            setMessage('Profile updated');
        } catch {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');
        try {
            await changePassword(passwordForm);
            setMessage('Password changed');
            setPasswordForm({ currentPassword: '', newPassword: '' });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400 py-12 text-center">Loading...</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Account</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Profile</h2>
            </div>

            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">{message}</div>}
            {error && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">{error}</div>}

            <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Personal Info</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                </div>
                <button type="submit" disabled={saving} className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            <form onSubmit={handleChangePassword} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <input value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} type="password" placeholder="Current password" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                    <input value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} type="password" placeholder="New password" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                </div>
                <button type="submit" disabled={saving} className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                    {saving ? 'Changing...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;