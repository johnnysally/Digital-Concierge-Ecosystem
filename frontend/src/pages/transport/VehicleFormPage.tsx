import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createVehicle, getVehicle, updateVehicle } from '../../api/transport/vehicleApi';
import { getTransportPath } from '../../utils/transportRoutes';

const VehicleFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        type: 'sedan',
        make: '',
        model: '',
        year: '',
        plateNumber: '',
        capacity: '4',
        pricePerKm: '',
        currency: 'KES',
        status: 'available',
    });
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getVehicle(id)
            .then((data) => {
                const vehicle = data.vehicle || data;
                setForm({
                    type: vehicle.type || 'sedan',
                    make: vehicle.make || '',
                    model: vehicle.model || '',
                    year: vehicle.year ? String(vehicle.year) : '',
                    plateNumber: vehicle.plateNumber || '',
                    capacity: vehicle.capacity ? String(vehicle.capacity) : '4',
                    pricePerKm: vehicle.pricePerKm ? String(vehicle.pricePerKm) : '',
                    currency: vehicle.currency || 'KES',
                    status: vehicle.status || 'available',
                });
            })
            .catch(() => setError('Unable to load vehicle details.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...form,
                year: form.year ? Number(form.year) : undefined,
                capacity: form.capacity ? Number(form.capacity) : undefined,
                pricePerKm: Number(form.pricePerKm),
            };

            if (id) {
                await updateVehicle(id, payload);
            } else {
                await createVehicle(payload);
            }
            navigate(getTransportPath('/vehicles'), { replace: true });
        } catch {
            setError('Unable to save vehicle. Please check the form and try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">{id ? 'Edit vehicle' : 'Add vehicle'}</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{id ? 'Update vehicle details' : 'Add a new vehicle to the fleet'}</h2>
                <p className="mt-2 text-sm text-slate-400">{id ? 'Update vehicle details.' : 'Add a new vehicle to the transport fleet inventory.'}</p>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading vehicle details...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-sm">
                    {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600">{error}</div>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            Make
                            <input
                                value={form.make}
                                onChange={(event) => setForm({ ...form, make: event.target.value })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Model
                            <input
                                value={form.model}
                                onChange={(event) => setForm({ ...form, model: event.target.value })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            Type
                            <select
                                value={form.type}
                                onChange={(event) => setForm({ ...form, type: event.target.value })}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            >
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="van">Van</option>
                                <option value="bus">Bus</option>
                                <option value="bike">Bike</option>
                                <option value="tuk_tuk">Tuk Tuk</option>
                            </select>
                        </label>
                        <label className="block text-sm text-slate-400">
                            Plate number
                            <input
                                value={form.plateNumber}
                                onChange={(event) => setForm({ ...form, plateNumber: event.target.value })}
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block text-sm text-slate-400">
                            Year
                            <input
                                value={form.year}
                                onChange={(event) => setForm({ ...form, year: event.target.value })}
                                type="number"
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Capacity
                            <input
                                value={form.capacity}
                                onChange={(event) => setForm({ ...form, capacity: event.target.value })}
                                type="number"
                                min={1}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Currency
                            <input
                                value={form.currency}
                                onChange={(event) => setForm({ ...form, currency: event.target.value })}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-400">
                            Price / km
                            <input
                                value={form.pricePerKm}
                                onChange={(event) => setForm({ ...form, pricePerKm: event.target.value })}
                                type="number"
                                step="0.01"
                                required
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </label>
                        <label className="block text-sm text-slate-400">
                            Status
                            <select
                                value={form.status}
                                onChange={(event) => setForm({ ...form, status: event.target.value })}
                                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                            >
                                <option value="available">Available</option>
                                <option value="on_trip">On trip</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="offline">Offline</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : id ? 'Update vehicle' : 'Create vehicle'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default VehicleFormPage;
