import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-10 shadow-xl ring-1 ring-slate-200">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Customer Access</p>
        <h1 className="text-4xl font-semibold text-slate-900">Sign in to your travel dashboard</h1>
        <p className="text-sm text-slate-500">Securely access bookings, wallet, transport and AI concierge services from one portal.</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input type="email" placeholder="you@example.com" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" placeholder="Enter your password" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
        </div>
        <button type="submit" className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">
          Sign in
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:justify-between">
        <Link to="/register" className="text-slate-900 underline underline-offset-4 hover:text-slate-700">
          Create an account
        </Link>
        <Link to="/forgot-password" className="text-slate-900 underline underline-offset-4 hover:text-slate-700">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
