import React, { useState } from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-900/40">
        <SectionHeader title="Forgot password" subtitle="Enter your email and we’ll send reset instructions." />
        {submitted ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-300">
            <p>Instructions have been sent to {email} if it is associated with an account.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm text-slate-300">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
              Send instructions
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
