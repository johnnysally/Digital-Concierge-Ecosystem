import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const isLight = getStoredRestaurantTheme() === 'light';

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/restaurant/auth/forgot-password', { email });
            setMessage('If the email is registered, a reset link has been sent.');
        } catch {
            setMessage('If the email is registered, a reset link has been sent.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`restaurant-theme-${isLight ? 'light' : 'dark'} flex min-h-screen items-center justify-center px-4 py-10 ${isLight ? 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] text-slate-800' : 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#020617,_#111827)] text-slate-100'}`}>
            <div className={`w-full max-w-md rounded-[28px] border p-8 shadow-2xl ${isLight ? 'border-slate-200 bg-white/95' : 'border-slate-800 bg-slate-900/90'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Digital Safaris</p>
                <h1 className={`mt-3 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Recover your account</h1>
                <p className={`mt-3 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Enter the email tied to your restaurant account and we’ll send recovery instructions.</p>

                {message ? <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</div> : null}

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Email</span>
                        <input type="email" required className={`w-full rounded-2xl border px-4 py-3 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <button type="submit" disabled={loading} className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>

                <div className="mt-5 text-sm text-slate-400">
                    <Link to="/restaurant-admin/login" className="text-amber-300">Back to sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
