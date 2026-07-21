import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.post('/transport/auth/forgot-password', { email });
            setMessage(response.data.message || 'Reset instructions have been sent to your email.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/50">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Digital Safaris</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Transport Portal</h1>
                    <p className="mt-2 text-sm text-slate-400">Enter the email associated with your transport account and we’ll send reset instructions.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
                {message ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">Email</label>
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            required
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Remembered your password? <Link to="/transport-admin/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
