import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
                    <p className="mt-2 text-sm text-slate-500">Enter your email to receive reset instructions</p>
                </div>
                {sent ? (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-600 dark:text-emerald-400 text-center">
                        If an account exists, instructions have been sent.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm outline-none focus:border-primary-500" />
                        </div>
                        <button type="submit" className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700">Send Reset Link</button>
                    </form>
                )}
                <div className="mt-6 text-center text-sm">
                    <Link to="/admin/login" className="text-primary-500 hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;