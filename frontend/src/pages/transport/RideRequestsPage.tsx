import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRides } from '../../api/transport/rideApi';

const rideTypeLabels: Record<string, string> = {
    immediate: 'Immediate',
    scheduled: 'Scheduled',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-200',
    paid: 'bg-emerald-500/10 text-emerald-200',
    refunded: 'bg-slate-500/10 text-slate-200',
};

const RideRequestsPage = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadRides = (pageNum: number) => {
        setLoading(true);
        setError('');

        getRides({ status: 'requested', page: pageNum, limit: 20 })
            .then((data) => {
                const requestRides = Array.isArray(data) ? data : data?.rides ?? [];
                setRides(requestRides);
                if (data?.pages) setTotalPages(data.pages);
            })
            .catch(() => {
                setError('Unable to load ride requests. Please refresh the page.');
                setRides([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRides(page);
    }, [page]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Ride requests</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Incoming customer ride requests</h2>
                <p className="mt-2 text-sm text-slate-400">These are the latest requests submitted from the customer portal. Review them and assign a driver or update status.</p>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Open requests</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{loading ? '—' : rides.length}</p>
                    <p className="mt-2 text-sm text-slate-500">Customer ride requests waiting for action</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                    <p className="mt-3 text-lg font-semibold text-white">Requested</p>
                    <p className="mt-2 text-sm text-slate-500">Showing only requests from the customer portal.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Source</p>
                    <p className="mt-3 text-lg font-semibold text-white">Customer portal</p>
                    <p className="mt-2 text-sm text-slate-500">Requests are pulled from the existing transport ride endpoint.</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-sm">
                <div className="hidden sm:block">
                    <table className="min-w-[1200px] divide-y divide-slate-800 text-left text-xs text-slate-200 sm:text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-3 py-3 sm:px-4">Request ID</th>
                                <th className="px-3 py-3 sm:px-4">Customer</th>
                                <th className="px-3 py-3 sm:px-4">Pickup</th>
                                <th className="px-3 py-3 sm:px-4">Dropoff</th>
                                <th className="px-3 py-3 sm:px-4">Vehicle</th>
                                <th className="px-3 py-3 sm:px-4">Fare</th>
                                <th className="px-3 py-3 sm:px-4">Type</th>
                                <th className="px-3 py-3 sm:px-4">Dist/Dur</th>
                                <th className="px-3 py-3 sm:px-4">Payment</th>
                                <th className="px-3 py-3 sm:px-4">Requested</th>
                                <th className="px-3 py-3 sm:px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="px-3 py-6 sm:px-4 text-center text-slate-400">Loading ride requests...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={11} className="px-3 py-6 sm:px-4 text-center text-rose-400">{error}</td>
                                </tr>
                            ) : rides.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-3 py-6 sm:px-4 text-center text-slate-400">No ride requests found.</td>
                                </tr>
                            ) : (
                                rides.map((ride) => (
                                    <tr key={ride._id || ride.id} className="border-t border-slate-800 hover:bg-slate-900 transition">
                                        <td className="px-3 py-3 sm:px-4 text-slate-100 truncate">{(ride._id || ride.id)?.slice(-8)}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300">{ride.customer?.firstName ? `${ride.customer.firstName} ${ride.customer.lastName}` : ride.customerName || 'N/A'}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300 text-xs truncate">{ride.pickup?.address || 'N/A'}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300 text-xs truncate">{ride.dropoff?.address || 'N/A'}</td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-300 truncate">
                                            {ride.vehicle ? `${ride.vehicle.make} ${ride.vehicle.model}` : 'Not assigned'}
                                        </td>
                                        <td className="px-3 py-3 sm:px-4 font-semibold text-emerald-400 whitespace-nowrap">
                                            {ride.fare?.total ? `${ride.fare.currency || 'KES'} ${ride.fare.total}` : 'N/A'}
                                        </td>
                                        <td className="px-3 py-3 sm:px-4">
                                            <span className="inline-flex rounded-full bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300">
                                                {rideTypeLabels[ride.rideType] || 'Immediate'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 sm:px-4 text-xs text-slate-400 whitespace-nowrap">
                                            {ride.distance || 'N/A'}{ride.distance ? ' km' : ''} {ride.duration && `/ ${ride.duration} min`}
                                        </td>
                                        <td className="px-3 py-3 sm:px-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${paymentStatusColors[ride.paymentStatus] || 'bg-slate-700/50 text-slate-300'}`}>
                                                {ride.paymentStatus || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 sm:px-4 text-slate-400 text-xs whitespace-nowrap">{ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-3 py-3 sm:px-4">
                                            <Link
                                                to={`/transport-admin/rides/${ride._id || ride.id}`}
                                                className="text-sky-500 hover:underline"
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
                <div className="sm:hidden space-y-4 px-3 py-4">
                    {loading ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-center text-slate-400">Loading ride requests...</div>
                    ) : error ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-center text-rose-400">{error}</div>
                    ) : rides.length === 0 ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-center text-slate-400">No ride requests found.</div>
                    ) : (
                        rides.map((ride) => (
                            <div key={ride._id || ride.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Request</p>
                                        <p className="mt-1 truncate text-sm font-semibold text-white">{(ride._id || ride.id)?.slice(-8)}</p>
                                    </div>
                                    <Link
                                        to={`/transport-admin/rides/${ride._id || ride.id}`}
                                        className="whitespace-nowrap text-sky-500 hover:underline"
                                    >
                                        View
                                    </Link>
                                </div>
                                <div className="mt-4 space-y-3 text-sm text-slate-300">
                                    <div className="grid gap-2">
                                        <span className="text-slate-400">Customer</span>
                                        <span className="truncate font-medium text-white">{ride.customer?.firstName ? `${ride.customer.firstName} ${ride.customer.lastName}` : ride.customerName || 'N/A'}</span>
                                    </div>
                                    <div className="grid gap-2">
                                        <span className="text-slate-400">Pickup</span>
                                        <span className="truncate">{ride.pickup?.address || 'N/A'}</span>
                                    </div>
                                    <div className="grid gap-2">
                                        <span className="text-slate-400">Dropoff</span>
                                        <span className="truncate">{ride.dropoff?.address || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                                        <div>
                                            <p>Fare</p>
                                            <p className="mt-1 font-semibold text-white">{ride.fare?.total ? `${ride.fare.currency || 'KES'} ${ride.fare.total}` : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p>Type</p>
                                            <p className="mt-1 inline-flex rounded-full bg-sky-500/10 px-2 py-1 font-medium text-sky-300">{rideTypeLabels[ride.rideType] || 'Immediate'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                                        <div>
                                            <p>Distance</p>
                                            <p className="mt-1 text-white">{ride.distance || 'N/A'}{ride.distance ? ' km' : ''}</p>
                                        </div>
                                        <div>
                                            <p>Payment</p>
                                            <p className={`mt-1 inline-flex rounded-full px-2 py-1 font-medium ${paymentStatusColors[ride.paymentStatus] || 'bg-slate-700/50 text-slate-300'}`}>{ride.paymentStatus || 'Pending'}</p>
                                        </div>
                                    </div>
                                    <div className="grid gap-2 text-xs text-slate-400">
                                        <span>Requested</span>
                                        <span className="text-white">{ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideRequestsPage;
