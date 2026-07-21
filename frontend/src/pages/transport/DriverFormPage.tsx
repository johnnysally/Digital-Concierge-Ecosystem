import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDriver, getDriver, updateDriver } from '../../api/transport/driverApi';

const DriverFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiry: '',
        status: 'available',
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getDriver(id)
            .then((data) => {
                const driver = data.driver || data;
                setForm({
                    firstName: driver.firstName || '',
                    lastName: driver.lastName || '',
                    email: driver.email || '',
                    phone: driver.phone || '',
                    licenseNumber: driver.licenseNumber || '',
                    licenseExpiry: driver.licenseExpiry ? driver.licenseExpiry.split('T')[0] : '',
                    status: driver.status || 'available',
                });
            })
            .catch(() => setError('Unable to load driver details.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...form,
                licenseExpiry: form.licenseExpiry || undefined,
            };

            if (id) {
                await updateDriver(id, payload);
            } else {
                await createDriver(payload);
            }
            navigate('/transport-admin/drivers', { replace: true });
        } catch {
            setError('Unable to save driver. Please check the form and try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">{id ? 'Edit driver' : 'Add driver'}</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{id ? 'Update driver profile' : 'Create a new driver'}</h2>
                <p className="mt-2 text-sm text-slate-400">{id ? 'Update the driver profile.' : 'Create a new driver profile for the transport fleet.'}</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading driver details...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
                    {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600">{error}</div>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            First name
                            <input
                                value={form.firstName}
                                onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Last name
                            <input
                                value={form.lastName}
                                onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            Email
                            <input
                                value={form.email}
                                onChange={(event) => setForm({ ...form, email: event.target.value })}
                                type="email"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Phone
                            <input
                                value={form.phone}
                                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                                type="tel"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            License number
                            <input
                                value={form.licenseNumber}
                                onChange={(event) => setForm({ ...form, licenseNumber: event.target.value })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            License expiry
                            <input
                                value={form.licenseExpiry}
                                onChange={(event) => setForm({ ...form, licenseExpiry: event.target.value })}
                                type="date"
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <label className="block text-sm text-slate-400">
                        Status
                        <select
                            value={form.status}
                            onChange={(event) => setForm({ ...form, status: event.target.value })}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                        >
                            <option value="available">Available</option>
                            <option value="on_trip">On trip</option>
                            <option value="offline">Offline</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : id ? 'Update driver' : 'Create driver'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default DriverFormPage;
