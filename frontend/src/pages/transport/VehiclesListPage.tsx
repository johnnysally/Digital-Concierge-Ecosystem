import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteVehicle, getVehicles } from '../../api/transport/vehicleApi';

const VehiclesListPage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);

    const loadVehicles = () => {
        setLoading(true);
        getVehicles()
            .then((data) => setVehicles(Array.isArray(data) ? data : data.vehicles ?? []))
            .catch(() => setVehicles([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this vehicle?')) return;
        setBusyId(id);

        try {
            await deleteVehicle(id);
            setVehicles((current) => current.filter((vehicle) => vehicle._id !== id && vehicle.id !== id));
        } catch {
            window.alert('Unable to delete vehicle. Try again later.');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Vehicles</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">View and manage fleet vehicles</h2>
                    <p className="mt-2 text-sm text-slate-400">Inspect status, capacity, and availability for each vehicle.</p>
                </div>
                <Link
                    to="/transport-admin/vehicles/new"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    Add vehicle
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">Loading vehicles...</div>
                ) : vehicles.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">No vehicles found.</div>
                ) : (
                    vehicles.map((vehicle) => {
                        const vehicleId = vehicle._id || vehicle.id;
                        return (
                            <div key={vehicleId} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{vehicle.make} {vehicle.model}</h3>
                                    <p className="mt-2 text-sm text-slate-400">Type: {vehicle.type || 'N/A'}</p>
                                    <p className="text-sm text-slate-400">Plate: {vehicle.plateNumber || 'N/A'}</p>
                                    <p className="mt-3 text-sm font-medium text-slate-200">Capacity: {vehicle.capacity || '—'}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to={`/transport-admin/vehicles/${vehicleId}/edit`}
                                        className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        disabled={busyId === vehicleId}
                                        onClick={() => handleDelete(vehicleId)}
                                        className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {busyId === vehicleId ? 'Deleting…' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default VehiclesListPage;
