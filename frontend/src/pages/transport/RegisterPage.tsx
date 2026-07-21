import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/transport/authApi';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('ride_hailing');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register({ firstName, lastName, email, password, phone, businessName, businessType });
            navigate('/transport-admin/login', { replace: true });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to register. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
            <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/50">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Digital Safaris</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">Create your transport workspace</h1>
                    <p className="mt-2 text-sm text-slate-400">Register and start managing transport operations in the portal.</p>
                </div>

                {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">First name</label>
                            <input
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Last name</label>
                            <input
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                            />
                        </div>
                    </div>
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
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Phone</label>
                            <input
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm text-slate-400">Business name</label>
                            <input
                                value={businessName}
                                onChange={(event) => setBusinessName(event.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm text-slate-400">Business type</label>
                        <select
                            value={businessType}
                            onChange={(event) => setBusinessType(event.target.value)}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none ring-0 focus:border-emerald-500"
                        >
                            <option value="ride_hailing">Ride hailing</option>
                            <option value="taxi">Taxi</option>
                            <option value="shuttle">Shuttle</option>
                            <option value="bus">Bus</option>
                            <option value="car_rental">Car rental</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/transport-admin/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
