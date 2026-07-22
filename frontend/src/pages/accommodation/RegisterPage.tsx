import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/accommodation/authApi';
import { useAccommodationTheme } from '../../context/accommodation/ThemeContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isDark } = useAccommodationTheme();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', businessName: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await register(form);
            localStorage.setItem('digitalsafaris_accommodation', JSON.stringify({ token: response.token, user: response.user }));
            navigate('/accommodation/login', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex min-h-screen items-center justify-center px-4 py-10 ${isDark ? 'bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_60%),linear-gradient(135deg,_#020617,_#0f172a)] text-slate-100' : 'bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_55%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] text-slate-700'}`}>
            <div className={`w-full max-w-lg rounded-3xl border p-8 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/95 shadow-slate-950/60' : 'border-slate-200 bg-white/95 shadow-slate-200/80'}`}>
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-500">Digital Safaris</p>
                    <h1 className={`mt-2 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create your partner account</h1>
                    <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Register your property business and start managing reservations.</p>
                </div>

                {error ? <div className={`mb-4 rounded-2xl border p-3 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'}`}>{error}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>First name</label>
                            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`} />
                        </div>
                        <div>
                            <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Last name</label>
                            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`} />
                        </div>
                    </div>
                    <div>
                        <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`} />
                    </div>
                    <div>
                        <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone</label>
                            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`} />
                        </div>
                        <div>
                            <label className={`mb-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Business name</label>
                            <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required className={`w-full rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-slate-700 bg-slate-950/80 text-slate-100' : 'border-slate-300 bg-white text-slate-900'}`} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className={`mt-6 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <div>
                        Already have an account? <Link to="/accommodation/login" className="text-emerald-500 hover:text-emerald-400">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
