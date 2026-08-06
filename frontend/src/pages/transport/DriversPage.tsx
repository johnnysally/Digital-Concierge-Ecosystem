import { useEffect, useState } from 'react';
import { getDrivers, createDriver, updateDriver, deleteDriver, toggleDriverStatus } from '../../api/transport/driverApi';
import { getVehicles } from '../../api/transport/vehicleApi';

const DriversPage = () => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', licenseExpiry: '', assignedVehicle: '', status: 'offline' });

    const load = () => {
        setLoading(true);
        Promise.all([getDrivers(), getVehicles()])
            .then(([dRes, vRes]) => {
                setDrivers(dRes.drivers || []);
                setVehicles(vRes.vehicles || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        const data = { ...form, assignedVehicle: form.assignedVehicle || undefined, licenseExpiry: form.licenseExpiry || undefined };
        if (editing) await updateDriver(editing._id, data);
        else await createDriver(data);
        setShowForm(false);
        setEditing(null);
        setForm({ firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', licenseExpiry: '', assignedVehicle: '', status: 'offline' });
        load();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete?')) return;
        await deleteDriver(id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Fleet</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Drivers</h2>
            </div>

            <div className="flex justify-end">
                <button onClick={() => { setEditing(null); setForm({ firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', licenseExpiry: '', assignedVehicle: '', status: 'offline' }); setShowForm(true); }} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">+ Add Driver</button>
            </div>

            {showForm && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Driver</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="License number" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <input value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} type="date" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white" />
                        <select value={form.assignedVehicle} onChange={(e) => setForm({ ...form, assignedVehicle: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="">No vehicle</option>
                            {vehicles.map((v) => <option key={v._id} value={v._id}>{v.make} {v.model} - {v.plateNumber}</option>)}
                        </select>
                        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                            <option value="offline">Offline</option>
                            <option value="available">Available</option>
                            <option value="on_trip">On Trip</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Save</button>
                        <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-xl bg-slate-700 px-6 py-2 text-sm text-white hover:bg-slate-600">Cancel</button>
                    </div>
                </div>
            )}

            {loading ? <div className="text-slate-400 py-8 text-center">Loading...</div> : drivers.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">No drivers.</div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
                    <table className="min-w-full divide-y divide-slate-800 text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-left">Vehicle</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {drivers.map((d) => (
                                <tr key={d._id} className="hover:bg-slate-900">
                                    <td className="px-4 py-3 text-white">{d.firstName} {d.lastName}</td>
                                    <td className="px-4 py-3 text-slate-300">{d.email}</td>
                                    <td className="px-4 py-3 text-slate-300">{d.phone}</td>
                                    <td className="px-4 py-3 text-slate-300">{d.assignedVehicle ? `${d.assignedVehicle.make} ${d.assignedVehicle.model}` : '—'}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={async () => { await toggleDriverStatus(d._id); load(); }} className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'available' ? 'bg-emerald-500/10 text-emerald-300' : d.status === 'on_trip' ? 'bg-sky-500/10 text-sky-300' : 'bg-slate-500/10 text-slate-400'}`}>{d.status}</button>
                                    </td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button onClick={() => { setEditing(d); setForm({ firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone, licenseNumber: d.licenseNumber, licenseExpiry: d.licenseExpiry ? d.licenseExpiry.split('T')[0] : '', assignedVehicle: d.assignedVehicle?._id || '', status: d.status }); setShowForm(true); }} className="text-sky-400 hover:underline text-xs">Edit</button>
                                        <button onClick={() => handleDelete(d._id)} className="text-red-400 hover:underline text-xs">Delete</button>
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

export default DriversPage;