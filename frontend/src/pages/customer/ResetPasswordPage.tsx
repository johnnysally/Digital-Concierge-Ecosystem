import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../api/customer/authApi';

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
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] px-3 py-4 text-slate-800 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-8 text-center">
                    <div className="mx-auto inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Digital Safaris</div>
                    <div className="mt-4 flex justify-center text-4xl">🔒</div>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-600">Choose a new password for your customer account.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</div> : null}
                {success ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">Password updated successfully. Redirecting to sign in…</div> : null}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="block text-sm text-slate-700">
                            New password
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                                placeholder="Enter new password"
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                            />
                        </label>
                        <label className="block text-sm text-slate-700">
                            Confirm password
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                                required
                                placeholder="Confirm new password"
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loading || tokenInvalid}
                            className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'Updating...' : 'Update password'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-500">
                    <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-500">← Back to sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
