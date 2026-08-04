import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/axios';

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
            await api.post('/restaurant/auth/reset-password', { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/restaurant-admin/login'), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] px-4 py-10 text-slate-800">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Digital Safaris</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Reset password</h1>
                <p className="mt-3 text-sm text-slate-600">Create a new password for your restaurant account.</p>

                {error ? <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</div> : null}
                {success ? <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">Password updated successfully. Redirecting to sign in…</div> : null}

                {!success && (
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <label className="block text-sm text-slate-700">
                            New password
                            <input type="password" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </label>
                        <label className="block text-sm text-slate-700">
                            Confirm password
                            <input type="password" required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </label>
                        <button type="submit" disabled={loading || tokenInvalid} className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                            {loading ? 'Updating...' : 'Update password'}
                        </button>
                    </form>
                )}

                <div className="mt-5 text-sm text-slate-500">
                    <Link to="/restaurant-admin/login" className="font-semibold text-amber-600 hover:text-amber-500">← Back to sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
