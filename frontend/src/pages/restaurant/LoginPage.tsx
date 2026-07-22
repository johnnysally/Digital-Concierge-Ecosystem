import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/restaurant/authApi';
import { getStoredRestaurantTheme } from '../../components/restaurant/layout/theme';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const isLight = getStoredRestaurantTheme() === 'light';

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(form);
            localStorage.setItem('digitalsafaris_restaurant', JSON.stringify({ token: response.token, user: response.user }));
            navigate('/restaurant-admin', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`restaurant-theme-${isLight ? 'light' : 'dark'} flex min-h-screen items-center justify-center px-4 py-10 ${isLight ? 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] text-slate-800' : 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#020617,_#111827)] text-slate-100'}`}>
            <div className={`w-full max-w-md rounded-[28px] border p-8 shadow-2xl ${isLight ? 'border-slate-200 bg-white/95' : 'border-slate-800 bg-slate-900/90'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Digital Safaris</p>
                <h1 className={`mt-3 text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Welcome back</h1>
                <p className={`mt-3 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Sign in with your restaurant partner credentials.</p>

                {error ? <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div> : null}

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Email</span>
                        <input type="email" required className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </label>
                    <label className={`block text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <span className="mb-2 block">Password</span>
                        <input type="password" required className={`w-full rounded-2xl border px-4 py-3 outline-none ring-0 ${isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-700 bg-slate-950/70 text-white'}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    </label>
                    <button type="submit" disabled={loading} className="w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-70">
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className={`mt-5 flex items-center justify-between text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <Link to="/restaurant-admin/register" className="text-amber-300">Create account</Link>
                    <Link to="/restaurant-admin/forgot-password" className={`${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Forgot password?</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
