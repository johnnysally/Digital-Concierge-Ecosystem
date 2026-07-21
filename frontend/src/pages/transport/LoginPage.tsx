import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/transport/authApi';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login({ email, password });
            localStorage.setItem('digitalsafaris_transport', JSON.stringify(data));
            navigate('/transport-admin', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/50">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Digital Safaris</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to your transport workspace</h1>
                    <p className="mt-2 text-sm text-slate-400">Sign in to manage drivers, vehicles, rides, promotions and transport operations.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}

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
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">Password</label>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            required
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 grid gap-3 text-center text-sm text-slate-400">
                    <Link to="/transport-admin/forgot-password" className="text-emerald-400 hover:text-emerald-300">
                        Forgot your password?
                    </Link>
                    <div>
                        Need an account? <Link to="/transport-admin/register" className="text-emerald-400 hover:text-emerald-300">Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
