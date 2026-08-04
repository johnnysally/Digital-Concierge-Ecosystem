import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/accommodation/authApi';

const ResetPasswordPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const tokenInvalid = useMemo(() => !token, [token]);

    useEffect(() => {
        if (tokenInvalid) {
            setError('The reset link is invalid or has expired.');
        }
    }, [tokenInvalid]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess(false);

        if (!token) {
            setError('The reset link is invalid or has expired.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/accommodation/login'), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_30%),linear-gradient(135deg,_#020617,_#111827)] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_60px_-25px_rgba(2,6,23,0.75)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-8 text-center">
                    <div className="mx-auto inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">Digital Safaris</div>
                    <div className="mt-4 flex justify-center text-4xl">🔐</div>
                    <h1 className="mt-4 text-2xl font-bold text-white">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-400">Choose a new password for your accommodation account.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div> : null}
                {success ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">Password updated successfully. Redirecting to sign in…</div> : null}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="block text-sm text-slate-300">
                            New password
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                                placeholder="Enter new password"
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
                            />
                        </label>
                        <label className="block text-sm text-slate-300">
                            Confirm password
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                                placeholder="Confirm new password"
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loading || tokenInvalid}
                            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'Updating...' : 'Update password'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-400">
                    <Link to="/accommodation/login" className="font-semibold text-emerald-400 hover:text-emerald-300">← Back to sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
