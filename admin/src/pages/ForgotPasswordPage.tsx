import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';

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
            await api.post('/admin/auth/forgot-password', { email });
            setSubmitted(true);
        } catch {
            setError('Failed to send reset instructions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center mb-8">
                    <span className="text-4xl">🛡️</span>
                    <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
                    <p className="mt-2 text-sm text-slate-500">Enter your admin email for reset instructions.</p>
                </div>

                {error && <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

                {submitted ? (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center">
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm">Instructions sent to <strong>{email}</strong>.</p>
                        <Link to="/login" className="mt-4 inline-block text-sm text-primary-500 hover:underline">← Back to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com"
                                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500" />
                        </label>
                        <button type="submit" disabled={loading}
                            className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPasswordPage;