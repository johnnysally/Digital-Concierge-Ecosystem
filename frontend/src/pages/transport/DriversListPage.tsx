import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteDriver, getDrivers } from '../../api/transport/driverApi';

const DriversListPage = () => {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState<string | null>(null);

    const loadDrivers = () => {
        setLoading(true);
        getDrivers()
            .then((data) => setDrivers(Array.isArray(data) ? data : data.drivers ?? []))
            .catch(() => setDrivers([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDrivers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this driver?')) return;
        setBusyId(id);

        try {
            await deleteDriver(id);
            setDrivers((current) => current.filter((driver) => driver._id !== id && driver.id !== id));
        } catch {
            window.alert('Unable to delete driver. Try again later.');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Drivers</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">Manage your transport drivers</h2>
                    <p className="mt-2 text-sm text-slate-400">Track driver availability, contact details, and fleet assignments.</p>
                </div>
                <Link
                    to="/transport-admin/drivers/new"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    Add driver
                </Link>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-sm">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
                    <thead className="bg-slate-900 text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading drivers...</td>
                            </tr>
                        ) : drivers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No drivers found.</td>
                            </tr>
                        ) : (
                            drivers.map((driver) => {
                                const driverId = driver._id || driver.id;
                                return (
                                    <tr key={driverId} className="border-t border-slate-800 hover:bg-slate-900">
                                        <td className="px-4 py-3 text-slate-100">{driver.firstName} {driver.lastName}</td>
                                        <td className="px-4 py-3 text-slate-300">{driver.phone || 'N/A'}</td>
                                        <td className="px-4 py-3 text-slate-300">{driver.status || 'Unknown'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <Link
                                                    to={`/transport-admin/drivers/${driverId}/edit`}
                                                    className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(driverId)}
                                                    disabled={busyId === driverId}
                                                    className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {busyId === driverId ? 'Deleting…' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DriversListPage;
