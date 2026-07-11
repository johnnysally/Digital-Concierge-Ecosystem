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
            await forgotPassword({ email });
            setSubmitted(true);
        } catch {
            setError('Failed to send reset instructions. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-900/40">
                <div className="text-center mb-8">
                    <span className="text-4xl">🔐</span>
                    <h1 className="mt-4 text-2xl font-bold text-white">Forgot Password</h1>
                    <p className="mt-2 text-sm text-slate-400">Enter your email and we'll send reset instructions.</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
                )}

                {submitted ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
                        <p className="text-emerald-400 text-sm">Instructions have been sent to <strong>{email}</strong> if an account exists.</p>
                        <Link to="/customer/login" className="mt-4 inline-block text-sm text-sky-400 hover:text-sky-300">← Back to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <label className="block text-sm text-slate-300">
                            Email address
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Instructions'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-500">
                    Remember your password? <Link to="/customer/login" className="font-semibold text-white hover:text-sky-300">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;