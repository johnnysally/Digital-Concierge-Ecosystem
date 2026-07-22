import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/accommodation/authApi';
import { useAccommodationTheme } from '../../context/accommodation/ThemeContext';

const ForgotPasswordPage = () => {
    const { isDark } = useAccommodationTheme();
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
        <div className={`flex min-h-screen items-center justify-center px-4 py-10 ${isDark ? 'bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_60%),linear-gradient(135deg,_#020617,_#0f172a)] text-slate-100' : 'bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_55%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] text-slate-700'}`}>
            <div className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/95 shadow-slate-950/60' : 'border-slate-200 bg-white/95 shadow-slate-200/80'}`}>
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-500">Digital Safaris</p>
                    <h1 className={`mt-2 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Reset your password</h1>
                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Enter the email address associated with your account and we'll send reset instructions.</p>
                </div>

                {error ? <div className={`mb-4 rounded-2xl border p-3 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'}`}>{error}</div> : null}
                {message ? <div className={`mb-4 rounded-2xl border p-3 text-sm ${isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'}`}>{message}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ring-0 ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100 placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-900'}`}
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

                <div className={`mt-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Remembered your password? <Link to="/accommodation/login" className="text-emerald-500 hover:text-emerald-400">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
