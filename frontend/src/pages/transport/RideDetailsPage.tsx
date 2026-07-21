import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRide, updateRideStatus } from '../../api/transport/rideApi';

const statusLabels: Record<string, string> = {
    requested: 'Requested',
    accepted: 'Accepted',
    arrived: 'Arrived',
    in_progress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const RideDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ride, setRide] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        getRide(id)
            .then((data) => {
                const currentRide = data.ride || data;
                setRide(currentRide);
                setStatus(currentRide.status || 'pending');
            })
            .catch(() => setRide(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdateStatus = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id) return;

        setSaving(true);
        setError('');

        try {
            const response = await updateRideStatus(id, status);
            const updatedRide = response.ride || response;
            setRide(updatedRide);
            setStatus(updatedRide.status || status);
        } catch {
            setError('Unable to update ride status. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Ride details</p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">Ride reference {id || 'unknown'}</h2>
                        <p className="mt-2 text-sm text-slate-400">Review the ride status, vehicle, driver and customer details.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/transport-admin/rides')}
                        className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                    >
                        Back to rides
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Loading ride details...</div>
            ) : !ride ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-slate-400">Ride not found.</div>
            ) : (
                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Driver</p>
                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {ride.driver?.firstName ? `${ride.driver.firstName} ${ride.driver.lastName}` : ride.driverName || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Vehicle</p>
                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {ride.vehicle?.make ? `${ride.vehicle.make} ${ride.vehicle.model}` : ride.vehicle?.plateNumber || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Customer</p>
                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {ride.customer?.firstName ? `${ride.customer.firstName} ${ride.customer.lastName}` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Fare</p>
                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {ride.fare?.total !== undefined ? `${ride.fare.currency || 'KES'} ${ride.fare.total}` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pickup location</p>
                                <p className="mt-3 text-base text-white">{ride.pickup?.address || 'N/A'}</p>
                                {ride.pickup?.notes && <p className="mt-3 text-sm text-slate-400">{ride.pickup.notes}</p>}
                            </div>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Dropoff location</p>
                                <p className="mt-3 text-base text-white">{ride.dropoff?.address || 'N/A'}</p>
                                {ride.dropoff?.notes && <p className="mt-3 text-sm text-slate-400">{ride.dropoff.notes}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Requested at</p>
                                <p className="mt-3 text-base text-white">{ride.createdAt ? new Date(ride.createdAt).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ride type</p>
                                <p className="mt-3 text-base text-white">{ride.rideType ? (ride.rideType === 'scheduled' ? 'Scheduled' : 'Immediate') : 'Immediate'}</p>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current status</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">{statusLabels[ride.status] || ride.status || 'Unknown'}</span>
                                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">{ride.paymentStatus || 'Payment not available'}</span>
                            </div>

                            <form onSubmit={handleUpdateStatus} className="mt-5 space-y-4">
                                {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700">{error}</div>}
                                <label className="block text-sm text-slate-400">
                                    Update status
                                    <select
                                        value={status}
                                        onChange={(event) => setStatus(event.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                                    >
                                        {Object.entries(statusLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </label>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? 'Updating...' : 'Update status'}
                                </button>
                            </form>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
                            <p className="text-sm font-medium text-slate-200">Quick facts</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-400">
                                <p><span className="font-semibold text-slate-200">Ride ID:</span> {ride._id || ride.id}</p>
                                <p><span className="font-semibold text-slate-200">Payment status:</span> {ride.paymentStatus || 'N/A'}</p>
                                <p><span className="font-semibold text-slate-200">Distance:</span> {ride.distance ? `${ride.distance} km` : 'N/A'}</p>
                                <p><span className="font-semibold text-slate-200">Duration:</span> {ride.duration ? `${ride.duration} mins` : 'N/A'}</p>
                                <p><span className="font-semibold text-slate-200">Ride rating:</span> {ride.rating || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideDetailsPage;
