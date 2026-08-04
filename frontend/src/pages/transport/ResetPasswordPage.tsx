import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/transport/authApi';

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
            await resetPassword({ token, newPassword: password });
            setSuccess(true);
            setTimeout(() => navigate('/transport-admin/login'), 3000);
        } catch {
            setError('Invalid or expired reset token.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold mx-auto">T</div>
                    <h1 className="mt-4 text-2xl font-bold text-white">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-400">Enter your new password.</p>
                </div>
                {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>}
                {success && <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">Password reset! Redirecting...</div>}
                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <label className="block text-sm text-slate-300">New Password
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                        </label>
                        <label className="block text-sm text-slate-300">Confirm Password
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500" />
                        </label>
                        <button type="submit" disabled={loading}
                            className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <Link to="/transport-admin/login" className="font-semibold text-sky-400 hover:text-sky-300">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;