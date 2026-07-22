import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/customer/authApi';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            await forgotPassword({ email: email.trim() });
            setSubmitted(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to send reset instructions. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] px-3 py-4 text-slate-800 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-8 text-center">
                    <div className="mx-auto inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Digital Safaris</div>
                    <div className="mt-4 flex justify-center text-4xl">🔐</div>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900">Forgot Password</h1>
                    <p className="mt-2 text-sm text-slate-600">Enter your email and we’ll send reset instructions.</p>
                </div>

                {error ? (
                    <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</div>
                ) : null}

                {submitted ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                        <p className="text-sm text-emerald-700">Instructions have been sent to <strong>{email}</strong> if an account exists.</p>
                        <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-amber-600 hover:text-amber-500">← Back to sign in</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <label className="block text-sm text-slate-700">
                            Email address
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'Sending...' : 'Send reset instructions'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-500">
                    Remember your password? <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-500">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;