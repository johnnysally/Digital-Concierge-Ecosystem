import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRides } from '../../api/transport/rideApi';

const RidesListPage = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRides()
            .then((data) => setRides(Array.isArray(data) ? data : data?.rides ?? []))
            .catch(() => setRides([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Rides</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Review ride activity</h2>
                <p className="mt-2 text-sm text-slate-400">Monitor ride requests, status updates, and customer journeys.</p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-sm">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
                    <thead className="bg-slate-900 text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Ride ID</th>
                            <th className="px-4 py-3">Pickup</th>
                            <th className="px-4 py-3">Dropoff</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading rides...</td>
                            </tr>
                        ) : rides.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No rides found.</td>
                            </tr>
                        ) : (
                            rides.map((ride) => (
                                <tr key={ride._id || ride.id} className="border-t border-slate-800 hover:bg-slate-900">
                                    <td className="px-4 py-3 text-slate-100">{ride._id || ride.id}</td>
                                    <td className="px-4 py-3 text-slate-300">{ride.pickup?.address || 'N/A'}</td>
                                    <td className="px-4 py-3 text-slate-300">{ride.dropoff?.address || 'N/A'}</td>
                                    <td className="px-4 py-3 text-slate-300">{ride.status || 'Unknown'}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/transport-admin/rides/${ride._id || ride.id}`}
                                            className="text-sky-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RidesListPage;
