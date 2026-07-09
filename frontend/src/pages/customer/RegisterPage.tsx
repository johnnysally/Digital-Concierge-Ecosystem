import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/customer/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login({ email, password });
    navigate("/customer");
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-2 py-3 text-slate-100 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[20px] border border-slate-800 bg-slate-900/85 shadow-[0_30px_90px_-25px_rgba(2,6,23,0.95)] backdrop-blur-xl sm:rounded-[32px] lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-emerald-950/90 via-slate-900/90 to-slate-800/80 p-4 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between lg:hidden">
            <Link to="/" className="text-sm font-semibold text-emerald-300">← Home</Link>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Create account</span>
          </div>

          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-700/60 bg-emerald-900/60 px-3 py-1.5 text-sm font-medium text-emerald-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-400 text-sm font-semibold text-slate-950">DS</span>
              DigitalSafaris Membership
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:mt-8 sm:text-4xl">Create your premium travel account</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-7">Join a unified platform for booking stays, ordering dining, arranging transport, and managing rewards effortlessly.</p>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300 sm:mt-8">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Personalized recommendations
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              Seamless booking management
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Reward points and premium offers
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Create account</h2>
            <p className="mt-2 text-sm text-slate-400">Set up your account and start planning smarter travel.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 sm:mt-8">
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Full name
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </label>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Create account
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account? <Link to="/customer/login" className="font-semibold text-emerald-300 hover:text-emerald-200">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
