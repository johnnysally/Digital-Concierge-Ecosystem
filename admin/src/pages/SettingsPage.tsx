import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/authApi';
import SectionHeader from '../components/ui/SectionHeader';

const SettingsPage = () => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changePassword({ currentPassword, newPassword });
            setMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
        } catch {
            setMessage('Failed to update password.');
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Settings" subtitle="Manage your account" />
            <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Account Overview</h2>
                    <dl className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex flex-col gap-1 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                            <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Name</dt>
                            <dd className="font-semibold text-slate-900 dark:text-white">{user?.firstName} {user?.lastName}</dd>
                        </div>
                        <div className="flex flex-col gap-1 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                            <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Email</dt>
                            <dd className="font-semibold text-slate-900 dark:text-white">{user?.email || 'N/A'}</dd>
                        </div>
                        <div className="flex flex-col gap-1 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                            <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Role</dt>
                            <dd className="font-semibold text-slate-900 dark:text-white">{user?.role || 'Admin'}</dd>
                        </div>
                        <div className="flex flex-col gap-1 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                            <dt className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</dt>
                            <dd className="font-semibold text-slate-900 dark:text-white">{user?.isActive ? 'Active' : 'Inactive'}</dd>
                        </div>
                    </dl>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Update Password</h2>
                    {message && <div className="mb-4 rounded-2xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">{message}</div>}
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-primary-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-200">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-primary-400"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 sm:w-auto"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;