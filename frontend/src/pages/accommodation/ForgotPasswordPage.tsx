import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/accommodation/authApi';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await forgotPassword({ email });
            setMessage(response.message || 'If this email is registered, instructions have been sent.');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to send password reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_55%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] px-4 py-10 text-slate-700">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/80">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-500">Digital Safaris</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reset your password</h1>
                    <p className="mt-2 text-sm text-slate-600">Enter the email address associated with your account and we'll send reset instructions.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</div> : null}
                {message ? <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">{message}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-700">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Remembered your password? <Link to="/accommodation/login" className="text-emerald-600">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
