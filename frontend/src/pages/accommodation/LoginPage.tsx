import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/accommodation/authApi';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(form);
            localStorage.setItem('digitalsafaris_accommodation', JSON.stringify({ token: response.token, user: response.user }));
            navigate('/accommodation/dashboard', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_55%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] px-4 py-10 text-slate-700">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-200/80">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-500">Digital Safaris</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Sign in to your workspace</h1>
                    <p className="mt-2 text-sm text-slate-600">Use your accommodation partner credentials to manage properties and reservations.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-700">Email</label>
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm text-slate-700">Password</label>
                        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 grid gap-3 text-center text-sm text-slate-600">
                    <Link to="/accommodation/forgot-password" className="text-emerald-600 hover:text-emerald-700">
                        Forgot your password?
                    </Link>
                    <div>
                        Need an account? <Link to="/accommodation/register" className="text-emerald-600">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
