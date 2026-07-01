import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-10 shadow-xl ring-1 ring-slate-200">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Password recovery</p>
        <h1 className="text-4xl font-semibold text-slate-900">Reset your account password</h1>
        <p className="text-sm text-slate-500">Enter your email and we’ll send a secure reset link to your inbox.</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input type="email" placeholder="you@example.com" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
        </div>
        <button type="submit" className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">
          Send reset link
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{' '}
        <Link to="/login" className="text-slate-900 underline underline-offset-4 hover:text-slate-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}
