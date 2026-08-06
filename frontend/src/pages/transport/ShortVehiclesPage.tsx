import { useEffect, useState } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, toggleAvailability, uploadImages } from '../../api/transport/vehicleApi';
import { getDrivers } from '../../api/transport/driverApi';
import { formatCurrency } from '../../utils/formatCurrency';

const vehicleTypes = ['sedan', 'suv', 'bike', 'tuk_tuk'];

const ShortVehiclesPage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [form, setForm] = useState({
        type: 'sedan', make: '', model: '', year: '', plateNumber: '',
        capacity: '4', pricePerKm: '', baseFare: '0', currency: 'KES',
        availability: 'online', status: 'idle', driver: '',
    });

    const load = () => {
        setLoading(true);
        Promise.all([getVehicles({ isLongDistance: false }), getDrivers()])
            .then(([vRes, dRes]) => {
                setVehicles(vRes.vehicles || []);
                setDrivers(dRes.drivers || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        let imageUrl = editing?.image || '';
        if (imageFile) {
            const formData = new FormData();
            formData.append('images', imageFile);
            const res = await uploadImages(formData);
            imageUrl = res.images?.[0] || '';
        }
        const data = {
            ...form,
            year: form.year ? Number(form.year) : undefined,
            capacity: Number(form.capacity),
            pricePerKm: Number(form.pricePerKm),
            baseFare: Number(form.baseFare),
            driver: form.driver || undefined,
            image: imageUrl || undefined,
        };
        if (editing) await updateVehicle(editing._id, data);
        else await createVehicle(data);
        setShowForm(false);
        setEditing(null);
        setImageFile(null);
        setImagePreview('');
        setForm({ type: 'sedan', make: '', model: '', year: '', plateNumber: '', capacity: '4', pricePerKm: '', baseFare: '0', currency: 'KES', availability: 'online', status: 'idle', driver: '' });
        load();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this vehicle?')) return;
        await deleteVehicle(id);
        load();
    };

    const handleToggle = async (id: string) => {
        await toggleAvailability(id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Fleet</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Vehicles</h2>
                <p className="mt-2 text-sm text-slate-400">Manage your ride-hailing fleet.</p>
            </div>

            <div className="flex justify-end">
                <button onClick={() => { setEditing(null); setImageFile(null); setImagePreview(''); setForm({ type: 'sedan', make: '', model: '', year: '', plateNumber: '', capacity: '4', pricePerKm: '', baseFare: '0', currency: 'KES', availability: 'online', status: 'idle', driver: '' }); setShowForm(true); }}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">+ Add Vehicle</button>
            </div>

            {showForm && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Vehicle</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="Make" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Model" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} placeholder="Plate number" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} type="number" placeholder="Year" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} type="number" placeholder="Capacity" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.pricePerKm} onChange={(e) => setForm({ ...form, pricePerKm: e.target.value })} type="number" step="0.01" placeholder="Price/km" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.baseFare} onChange={(e) => setForm({ ...form, baseFare: e.target.value })} type="number" step="0.01" placeholder="Base fare" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="idle">Idle</option>
                            <option value="on_trip">On Trip</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                        <select value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="">No driver</option>
                            {drivers.map((d) => <option key={d._id} value={d._id}>{d.firstName} {d.lastName}</option>)}
                        </select>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Vehicle image</label>
                            <input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                            }} className="w-full text-sm text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700" />
                            {imagePreview && <img src={imagePreview} className="mt-2 h-24 rounded-xl object-cover" />}
                            {editing?.image && !imagePreview && <img src={editing.image} className="mt-2 h-24 rounded-xl object-cover" />}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Save</button>
                        <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-700 px-6 py-2 text-sm text-white hover:bg-slate-600">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <div className="text-slate-400 py-8 text-center">Loading...</div> : vehicles.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">No vehicles.</div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
                    <table className="min-w-full divide-y divide-slate-800 text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Photo</th>
                                <th className="px-4 py-3 text-left">Vehicle</th>
                                <th className="px-4 py-3 text-left">Type</th>
                                <th className="px-4 py-3 text-left">Plate</th>
                                <th className="px-4 py-3 text-left">Price/km</th>
                                <th className="px-4 py-3 text-left">Driver</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {vehicles.map((v) => (
                                <tr key={v._id} className="hover:bg-slate-900">
                                    <td className="px-4 py-3">
                                        {v.image ? (
                                            <img src={v.image} className="w-12 h-12 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-500">N/A</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-white">{v.make} {v.model} <span className="text-xs text-slate-500">({v.year})</span></td>
                                    <td className="px-4 py-3 text-slate-300 capitalize">{v.type}</td>
                                    <td className="px-4 py-3 text-slate-300">{v.plateNumber}</td>
                                    <td className="px-4 py-3 text-emerald-400">{formatCurrency(v.pricePerKm)}{v.baseFare > 0 && <span className="text-xs text-slate-500"> +{formatCurrency(v.baseFare)}</span>}</td>
                                    <td className="px-4 py-3 text-slate-300">{v.driver ? `${v.driver.firstName} ${v.driver.lastName}` : '—'}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleToggle(v._id)} className={`px-2 py-1 rounded-full text-xs font-medium ${v.availability === 'online' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-500/10 text-slate-400'}`}>
                                            {v.availability} · {v.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => { setEditing(v); setForm({ type: v.type, make: v.make, model: v.model, year: v.year ? String(v.year) : '', plateNumber: v.plateNumber, capacity: String(v.capacity), pricePerKm: String(v.pricePerKm), baseFare: String(v.baseFare || 0), currency: v.currency, availability: v.availability, status: v.status, driver: v.driver?._id || '' }); setImagePreview(''); setImageFile(null); setShowForm(true); }} className="text-sky-400 hover:underline text-xs">Edit</button>
                                        <button onClick={() => handleDelete(v._id)} className="text-red-400 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShortVehiclesPage;