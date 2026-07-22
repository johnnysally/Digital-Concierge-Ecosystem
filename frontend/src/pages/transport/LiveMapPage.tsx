import { useCallback, useEffect, useMemo, useState } from 'react';
import { getActiveTrips, getActiveVehicles, getTripRoute, getVehicleLocation } from '../../api/transport/mapApi';

type VehicleSummary = {
    _id: string;
    plateNumber?: string;
    type?: string;
    status?: string;
    dispatchStatus?: string;
    location?: { coordinates?: [number, number] };
    driver?: { firstName?: string; lastName?: string; phone?: string };
};

type TripSummary = {
    _id: string;
    status?: string;
    pickup?: { address?: string };
    dropoff?: { address?: string };
    vehicle?: { plateNumber?: string };
    driver?: { firstName?: string; lastName?: string };
    customer?: { firstName?: string; lastName?: string };
};

type VehicleDetails = VehicleSummary & {
    currentTrip?: string;
};

type TripDetails = TripSummary & {
    fare?: { total?: number; currency?: string };
    pickup?: { address?: string; coordinates?: [number, number] };
    dropoff?: { address?: string; coordinates?: [number, number] };
};

const formatStatus = (value?: string) => (value ? value.replace(/_/g, ' ') : 'Unknown');

const formatCoordinates = (coordinates?: [number, number]) => {
    if (!coordinates?.length) return 'Coordinates unavailable';
    return `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`;
};

const LiveMapPage = () => {
    const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
    const [trips, setTrips] = useState<TripSummary[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<VehicleDetails | null>(null);
    const [selectedTripDetails, setSelectedTripDetails] = useState<TripDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const loadMapData = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        try {
            const [vehicleResponse, tripResponse] = await Promise.all([
                getActiveVehicles(),
                getActiveTrips(),
            ]);

            const activeVehicles = vehicleResponse?.vehicles || [];
            const activeTrips = tripResponse?.rides || [];

            setVehicles(activeVehicles);
            setTrips(activeTrips);
            setError('');

            if (!selectedVehicleId && activeVehicles.length) {
                setSelectedVehicleId(activeVehicles[0]._id);
            }
            if (!selectedTripId && activeTrips.length) {
                setSelectedTripId(activeTrips[0]._id);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Unable to load live map data right now.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedTripId, selectedVehicleId]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isMounted) return;
            await loadMapData(true);
        };

        loadData();

        const interval = window.setInterval(() => {
            loadMapData(false);
        }, 15000);

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, [loadMapData]);

    useEffect(() => {
        if (!selectedVehicleId) return;
        let isActive = true;

        const loadVehicleDetails = async () => {
            try {
                const response = await getVehicleLocation(selectedVehicleId);
                if (isActive) {
                    setSelectedVehicleDetails(response?.vehicle || null);
                }
            } catch {
                if (isActive) {
                    setSelectedVehicleDetails(null);
                }
            }
        };

        loadVehicleDetails();
        return () => {
            isActive = false;
        };
    }, [selectedVehicleId]);

    useEffect(() => {
        if (!selectedTripId) return;
        let isActive = true;

        const loadTripDetails = async () => {
            try {
                const response = await getTripRoute(selectedTripId);
                if (isActive) {
                    setSelectedTripDetails(response?.ride || null);
                }
            } catch {
                if (isActive) {
                    setSelectedTripDetails(null);
                }
            }
        };

        loadTripDetails();
        return () => {
            isActive = false;
        };
    }, [selectedTripId]);

    useEffect(() => {
        if (!vehicles.length) return;
        if (!selectedVehicleId || !vehicles.some((vehicle) => vehicle._id === selectedVehicleId)) {
            setSelectedVehicleId(vehicles[0]._id);
        }
    }, [selectedVehicleId, vehicles]);

    useEffect(() => {
        if (!trips.length) return;
        if (!selectedTripId || !trips.some((trip) => trip._id === selectedTripId)) {
            setSelectedTripId(trips[0]._id);
        }
    }, [selectedTripId, trips]);

    const selectedVehicle = useMemo(() => {
        return vehicles.find((vehicle) => vehicle._id === selectedVehicleId) || vehicles[0] || null;
    }, [selectedVehicleId, vehicles]);

    const selectedTrip = useMemo(() => {
        return trips.find((trip) => trip._id === selectedTripId) || trips[0] || null;
    }, [selectedTripId, trips]);

    const summaryCards = [
        { label: 'Active vehicles', value: vehicles.length, hint: 'Available or on trip' },
        { label: 'Active trips', value: trips.length, hint: 'Currently moving' },
        { label: 'Selected vehicle', value: selectedVehicle?.plateNumber || '—', hint: selectedVehicle ? formatStatus(selectedVehicle.dispatchStatus) : 'Waiting for data' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Live Map</p>
                    <h1 className="mt-3 text-3xl font-semibold text-white">Real-time fleet map</h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-400">Monitor vehicle locations, active rides, and dispatch activity from one live transport view.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => loadMapData(false)}
                        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-500/40 hover:text-white"
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh now'}
                    </button>
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                        {loading ? 'Syncing live data...' : 'Fleet data refreshed'}
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
                {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                        <p className="mt-2 text-sm text-slate-400">{card.hint}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-white">Fleet live view</p>
                            <p className="mt-1 text-sm text-slate-400">Vehicle markers and trip details are loaded directly from the transport backend endpoints.</p>
                        </div>
                        <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                            Live feed
                        </div>
                    </div>

                    <div className="mt-6 relative h-[420px] overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a)]">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        <div className="absolute inset-x-6 top-6 h-24 rounded-full border border-emerald-500/20 bg-emerald-500/10" />
                        <div className="absolute bottom-10 left-10 right-10 h-24 rounded-full border border-slate-700/60 bg-slate-950/30" />

                        {vehicles.map((vehicle, index) => {
                            const coordinates = vehicle.location?.coordinates;
                            const left = coordinates?.[0] !== undefined ? `${Math.max(8, Math.min(92, 50 + coordinates[0] * 2))}%` : `${20 + index * 12}%`;
                            const top = coordinates?.[1] !== undefined ? `${Math.max(8, Math.min(92, 50 - coordinates[1] * 2))}%` : `${20 + index * 12}%`;

                            return (
                                <button
                                    key={vehicle._id}
                                    type="button"
                                    onClick={() => setSelectedVehicleId(vehicle._id)}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${selectedVehicleId === vehicle._id ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 bg-slate-900/80 text-slate-300'}`}
                                    style={{ left, top }}
                                >
                                    {vehicle.plateNumber || 'Vehicle'}
                                </button>
                            );
                        })}

                        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Selected vehicle</p>
                                    <p className="mt-1 font-semibold text-white">{selectedVehicle?.plateNumber || 'No vehicle selected'}</p>
                                    <p className="mt-1 text-slate-400">{selectedVehicle ? `${formatStatus(selectedVehicle.status)} • ${formatStatus(selectedVehicle.dispatchStatus)}` : 'Waiting for API response'}</p>
                                </div>
                                <div className="text-right text-xs text-slate-400">
                                    <p>Location</p>
                                    <p className="mt-1 font-medium text-slate-200">{selectedVehicleDetails ? formatCoordinates(selectedVehicleDetails.location?.coordinates) : 'Pending lookup'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">Fleet overview</p>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                                {vehicles.length ? 'Online' : 'Idle'}
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {loading ? (
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading vehicles...</div>
                            ) : vehicles.length ? (
                                vehicles.map((vehicle) => (
                                    <button
                                        key={vehicle._id}
                                        type="button"
                                        onClick={() => setSelectedVehicleId(vehicle._id)}
                                        className={`w-full rounded-2xl border p-3 text-left transition ${selectedVehicleId === vehicle._id ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/70'}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-white">{vehicle.plateNumber || 'Vehicle'}</p>
                                            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{formatStatus(vehicle.status)}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-400">{vehicle.driver ? `${vehicle.driver.firstName || ''} ${vehicle.driver.lastName || ''}`.trim() : 'No driver assigned'}</p>
                                        <p className="mt-1 text-xs text-slate-500">{vehicle.type || 'Vehicle'} • {vehicle.dispatchStatus ? formatStatus(vehicle.dispatchStatus) : 'Pending'}</p>
                                    </button>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No vehicles available from the API yet.</div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">Active trips</p>
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                                {trips.length ? 'In motion' : 'Idle'}
                            </span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {loading ? (
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Loading trips...</div>
                            ) : trips.length ? (
                                trips.map((trip) => (
                                    <button
                                        key={trip._id}
                                        type="button"
                                        onClick={() => setSelectedTripId(trip._id)}
                                        className={`w-full rounded-2xl border p-3 text-left transition ${selectedTripId === trip._id ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/70'}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-white">{trip.vehicle?.plateNumber || 'Trip'}</p>
                                            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{formatStatus(trip.status)}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-400">{trip.customer ? `${trip.customer.firstName || ''} ${trip.customer.lastName || ''}`.trim() : 'Customer unavailable'}</p>
                                        <p className="mt-1 text-xs text-slate-500">{trip.pickup?.address || 'Pickup unavailable'} → {trip.dropoff?.address || 'Dropoff unavailable'}</p>
                                    </button>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">No active trips right now.</div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
                        <p className="text-sm font-semibold text-white">Trip detail</p>
                        {selectedTripDetails ? (
                            <div className="mt-4 space-y-3 text-sm text-slate-400">
                                <p><span className="font-semibold text-slate-200">Vehicle:</span> {selectedTripDetails.vehicle?.plateNumber || 'Unknown'}</p>
                                <p><span className="font-semibold text-slate-200">Driver:</span> {selectedTripDetails.driver ? `${selectedTripDetails.driver.firstName || ''} ${selectedTripDetails.driver.lastName || ''}`.trim() : 'Unavailable'}</p>
                                <p><span className="font-semibold text-slate-200">Pickup:</span> {selectedTripDetails.pickup?.address || 'Unavailable'}</p>
                                <p><span className="font-semibold text-slate-200">Dropoff:</span> {selectedTripDetails.dropoff?.address || 'Unavailable'}</p>
                                <p><span className="font-semibold text-slate-200">Fare:</span> {selectedTripDetails.fare?.total ? `${selectedTripDetails.fare.total} ${selectedTripDetails.fare.currency || 'KES'}` : 'Pending'}</p>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-400">Select an active trip to load route details from the transport API.</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LiveMapPage;