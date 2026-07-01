import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-10 shadow-xl ring-1 ring-slate-200">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">New customer</p>
        <h1 className="text-4xl font-semibold text-slate-900">Create your concierge account</h1>
        <p className="text-sm text-slate-500">Register once and access every travel service in the Digital Concierge Ecosystem.</p>
      </div>

      <form className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">First name</label>
            <input type="text" placeholder="Victoria" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Last name</label>
            <input type="text" placeholder="Summers" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input type="email" placeholder="you@example.com" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" placeholder="Create password" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
            <input type="password" placeholder="Confirm password" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-900" />
          </div>
        </div>
        <button type="submit" className="w-full rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700">
          Register
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-slate-900 underline underline-offset-4 hover:text-slate-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}
