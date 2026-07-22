import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/customer/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to sign in right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] px-3 py-4 text-slate-800 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:rounded-[32px] lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(135deg,_#fff7ed,_#fef3c7)] p-4 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between lg:hidden">
            <Link to="/" className="text-sm font-semibold text-amber-600">← Home</Link>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Secure sign in</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-slate-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-400 to-rose-400 text-sm font-semibold text-white">DS</span>
              Digital Safaris
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:mt-8 sm:text-4xl">Welcome back to your travel command center</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">Access accommodation, dining, transport, wallet, and support in one refined experience built for modern travel.</p>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-amber-200 bg-white/80 p-4 text-sm text-slate-700 sm:mt-8">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Live itinerary updates
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Instant concierge assistance
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Secure payments and loyalty rewards
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Continue your journey with a secure, seamless login.</p>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-600">{error}</div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 sm:mt-8">
              <div className="space-y-4">
                <label className="block text-sm text-slate-700">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                </label>
                <label className="block text-sm text-slate-700">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                </label>
              </div>
              <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? 'Signing in...' : 'Continue to dashboard'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              New here? <Link to="/register" className="font-semibold text-amber-600 hover:text-amber-500">Create your account</Link>
            </div>
            <div className="mt-3 text-center text-sm text-slate-500">
              <Link to="/forgot-password" className="font-semibold text-slate-700 hover:text-amber-600">Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
