import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

const ResetPasswordPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (!token) { setError('Invalid reset token.'); return; }
        setLoading(true); setError('');
        try {
            await api.post('/admin/auth/reset-password', { token, newPassword: password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch {
            setError('Invalid or expired reset token.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center mb-8">
                    <span className="text-4xl">🔐</span>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-500">Enter your new admin password.</p>
                </div>
                {error && <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
                {success && <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-600 dark:text-emerald-400">Password reset! Redirecting...</div>}
                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500" />
                        </label>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500" />
                        </label>
                        <button type="submit" disabled={loading}
                            className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-primary-500 hover:underline">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;