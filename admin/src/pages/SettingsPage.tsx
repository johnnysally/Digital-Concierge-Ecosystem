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
            <div className="max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                {message && <div className="mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-sm">{message}</div>}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500" />
                    </div>
                    <button type="submit" className="rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;