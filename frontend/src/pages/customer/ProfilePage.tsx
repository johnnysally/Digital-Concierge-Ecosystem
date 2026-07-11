import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { useAuth } from '../../context/customer/AuthContext';
import { updateProfile, getProfile, changePassword } from '../../api/customer/authApi';
import { api } from '../../api/axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, refreshSession, logout } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        if (user) {
            setForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await updateProfile(form);
            await refreshSession();
            setEditMode(false);
            setMessage('Profile updated successfully.');
        } catch {
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await changePassword(passwordForm);
            setPasswordForm({ currentPassword: '', newPassword: '' });
            setShowPasswordForm(false);
            setMessage('Password changed successfully.');
        } catch {
            setMessage('Failed to change password. Check your current password.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        try {
            await api.delete('/customer/auth/account');
            logout();
            navigate('/customer/login');
        } catch {
            setMessage('Failed to delete account.');
            setShowDeleteConfirm(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/customer/login');
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Your profile" subtitle="Manage your account, security, and preferences." />
            {message && (
                <div className={`rounded-xl p-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Account details</h3>
                        <button onClick={() => setEditMode(!editMode)} className="text-sm text-sky-400 hover:text-sky-300">
                            {editMode ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                    {editMode ? (
                        <form onSubmit={handleSave} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">First Name</label>
                                <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Last Name</label>
                                <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                            </div>
                            <button type="submit" disabled={saving}
                                className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    ) : (
                        <div className="mt-5 space-y-3 text-sm text-slate-300">
                            <p><span className="text-slate-500">Name:</span> {user?.firstName} {user?.lastName}</p>
                            <p><span className="text-slate-500">Email:</span> {user?.email}</p>
                            <p><span className="text-slate-500">Phone:</span> {user?.phone || 'Not set'}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="text-lg font-semibold text-white">Security</h3>
                        {showPasswordForm ? (
                            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    placeholder="Current password"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                                />
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    placeholder="New password (min 6 chars)"
                                    required
                                    minLength={6}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                                />
                                <div className="flex gap-2">
                                    <button type="submit" disabled={saving}
                                        className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button type="button" onClick={() => setShowPasswordForm(false)}
                                        className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => setShowPasswordForm(true)}
                                className="mt-4 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                                Change Password
                            </button>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="text-lg font-semibold text-white">Actions</h3>
                        <div className="mt-4 space-y-3">
                            <button onClick={handleLogout}
                                className="w-full rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600 transition-colors">
                                Logout
                            </button>
                            {!showDeleteConfirm ? (
                                <button onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full rounded-xl bg-red-600/20 border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-600/30 transition-colors">
                                    Delete Account Permanently
                                </button>
                            ) : (
                                <div className="space-y-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm text-red-400">This action is irreversible. All your data will be permanently deleted.</p>
                                    <input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        placeholder="Type DELETE to confirm"
                                        className="w-full rounded-xl border border-red-500/30 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleDeleteAccount}
                                            disabled={deleteConfirmText !== 'DELETE'}
                                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">
                                            Confirm Delete
                                        </button>
                                        <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {user?.savedAddresses?.length > 0 && (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Saved Addresses</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {user.savedAddresses.map((addr: any, i: number) => (
                            <div key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                                <p className="font-medium">{addr.label}</p>
                                <p className="text-slate-500 mt-1">{addr.street}, {addr.city}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;