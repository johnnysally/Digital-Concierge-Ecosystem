import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/customer/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login({ email, password });
    navigate("/customer");
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-2 py-3 text-slate-100 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[20px] border border-slate-800 bg-slate-900/85 shadow-[0_30px_90px_-25px_rgba(2,6,23,0.95)] backdrop-blur-xl sm:rounded-[32px] lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 p-4 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between lg:hidden">
            <Link to="/" className="text-sm font-semibold text-cyan-300">← Home</Link>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Secure sign in</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1.5 text-sm font-medium text-slate-200">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-semibold text-white">DS</span>
              DigitalSafaris Concierge
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:mt-8 sm:text-4xl">Welcome back to your travel command center</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-7">Access accommodation, dining, transport, wallet, and support in one refined experience built for modern travel.</p>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300 sm:mt-8">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Live itinerary updates
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              Instant concierge assistance
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Secure payments and loyalty rewards
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">Continue your journey with a secure, seamless login.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 sm:mt-8">
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Continue to dashboard
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              New here? <Link to="/customer/register" className="font-semibold text-cyan-300 hover:text-cyan-200">Create your account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
