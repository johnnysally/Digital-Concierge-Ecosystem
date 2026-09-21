import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/restaurant/authApi';
import AuthLogo from '../../components/ui/AuthLogo';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await login({ email, password });
            localStorage.setItem('digitalsafaris_restaurant', JSON.stringify({ user: response.user, token: response.token }));
            navigate('/restaurant-admin');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex justify-center">
                        <AuthLogo size="lg" textClassName="text-white" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-white">Restaurant Partner</h1>
                    <p className="mt-2 text-sm text-slate-400">Sign in to manage your restaurant</p>
                </div>
                {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-500" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm space-y-2">
                    <Link to="/restaurant-admin/forgot-password" className="block text-sky-400 hover:text-sky-300">Forgot password?</Link>
                    <p className="text-slate-500">
                        Don't have an account? <Link to="/restaurant-admin/register" className="text-amber-400 hover:text-amber-300">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;