import { useEffect, useState } from 'react';
import { getRides, updateRideStatus } from '../../api/transport/rideApi';
import { formatCurrency } from '../../utils/formatCurrency';

const statusOptions = ['', 'requested', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'];

const statusColors: Record<string, string> = {
    requested: 'bg-amber-500/10 text-amber-300',
    accepted: 'bg-sky-500/10 text-sky-300',
    arrived: 'bg-violet-500/10 text-violet-300',
    in_progress: 'bg-blue-500/10 text-blue-300',
    completed: 'bg-emerald-500/10 text-emerald-300',
    cancelled: 'bg-red-500/10 text-red-300',
};

const LongRidesPage = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRide, setSelectedRide] = useState<any>(null);

    const load = (pageNum: number) => {
        setLoading(true);
        const params: any = { isLongDistance: true, page: pageNum, limit: 20 };
        if (statusFilter) params.status = statusFilter;
        getRides(params)
            .then((res) => {
                setRides(res.rides || []);
                setTotalPages(res.pages || 1);
            })
            .catch(() => setRides([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(page); }, [page, statusFilter]);

    const handleStatusUpdate = async (id: string, status: string) => {
        await updateRideStatus(id, status);
        load(page);
        if (selectedRide?._id === id) setSelectedRide(null);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Operations</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Shuttle Rides</h2>
                <p className="mt-2 text-sm text-slate-400">Manage shuttle bookings, seat assignments, and trip status.</p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {statusOptions.map((s) => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${statusFilter === s ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {selectedRide && (
                <div className="rounded-3xl border border-sky-500/30 bg-slate-950/80 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Booking Detail</h3>
                        <button onClick={() => setSelectedRide(null)} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div><span className="text-slate-400">Customer:</span> <span className="text-white">{selectedRide.customer?.firstName} {selectedRide.customer?.lastName}</span></div>
                        <div><span className="text-slate-400">Vehicle:</span> <span className="text-white">{selectedRide.vehicle?.make} {selectedRide.vehicle?.model} ({selectedRide.vehicle?.plateNumber})</span></div>
                        <div><span className="text-slate-400">Pickup:</span> <span className="text-white">{selectedRide.pickup?.address}</span></div>
                        <div><span className="text-slate-400">Dropoff:</span> <span className="text-white">{selectedRide.dropoff?.address}</span></div>
                        <div><span className="text-slate-400">Seats:</span> <span className="text-white">{selectedRide.seats} {selectedRide.seatNumbers?.length > 0 && `(${selectedRide.seatNumbers.join(', ')})`}</span></div>
                        <div><span className="text-slate-400">Fare:</span> <span className="text-emerald-400 font-semibold">{formatCurrency(selectedRide.fare?.total)}</span></div>
                        <div><span className="text-slate-400">Distance:</span> <span className="text-white">{selectedRide.distance ? `${selectedRide.distance} km` : 'N/A'}</span></div>
                        <div><span className="text-slate-400">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedRide.status]}`}>{selectedRide.status}</span></div>
                        <div><span className="text-slate-400">Payment:</span> <span className="text-white">{selectedRide.paymentStatus}</span></div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {selectedRide.status === 'requested' && (
                            <button onClick={() => handleStatusUpdate(selectedRide._id, 'accepted')} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500">Accept</button>
                        )}
                        {selectedRide.status === 'accepted' && (
                            <button onClick={() => handleStatusUpdate(selectedRide._id, 'arrived')} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">Arrived</button>
                        )}
                        {selectedRide.status === 'arrived' && (
                            <button onClick={() => handleStatusUpdate(selectedRide._id, 'in_progress')} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Start Trip</button>
                        )}
                        {(selectedRide.status === 'in_progress' || selectedRide.status === 'accepted' || selectedRide.status === 'arrived') && (
                            <button onClick={() => handleStatusUpdate(selectedRide._id, 'completed')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Complete</button>
                        )}
                        {selectedRide.status !== 'completed' && selectedRide.status !== 'cancelled' && (
                            <button onClick={() => handleStatusUpdate(selectedRide._id, 'cancelled')} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">Cancel</button>
                        )}
                    </div>
                </div>
            )}

            {loading ? <div className="text-slate-400 py-8 text-center">Loading...</div> : rides.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 text-center text-slate-400">No bookings found.</div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80">
                    <table className="min-w-full divide-y divide-slate-800 text-sm">
                        <thead className="bg-slate-900 text-slate-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left">Route</th>
                                <th className="px-4 py-3 text-left">Vehicle</th>
                                <th className="px-4 py-3 text-left">Seats</th>
                                <th className="px-4 py-3 text-left">Fare</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {rides.map((r) => (
                                <tr key={r._id} onClick={() => setSelectedRide(r)} className="hover:bg-slate-900 cursor-pointer">
                                    <td className="px-4 py-3 text-white">{r.customer?.firstName} {r.customer?.lastName}</td>
                                    <td className="px-4 py-3 text-slate-300 text-xs">
                                        <p className="truncate max-w-[100px]">{r.pickup?.address}</p>
                                        <p className="truncate max-w-[100px] text-slate-500">→ {r.dropoff?.address}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{r.vehicle?.make} {r.vehicle?.model}</td>
                                    <td className="px-4 py-3 text-slate-300">{r.seats || 1}{r.seatNumbers?.length > 0 && <span className="text-xs text-slate-500"> ({r.seatNumbers.join(',')})</span>}</td>
                                    <td className="px-4 py-3 text-emerald-400 font-semibold">{formatCurrency(r.fare?.total)}</td>
                                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span></td>
                                    <td className="px-4 py-3 text-slate-400 text-xs">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50">Previous</button>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LongRidesPage;