import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import { getTransportPath } from '../../utils/transportRoutes';

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
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_28%),#020617] px-4 py-10 text-slate-100">
            <div className="w-full max-w-md rounded-[32px] border border-slate-800/80 bg-slate-900/70 p-8 shadow-[0_25px_70px_-20px_rgba(2,6,23,0.85)] backdrop-blur-xl">
                <div className="mb-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-violet-600 text-lg font-semibold text-white shadow-lg">
                        DS
                    </div>
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
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Remembered your password? <Link to={getTransportPath('/login')} className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
