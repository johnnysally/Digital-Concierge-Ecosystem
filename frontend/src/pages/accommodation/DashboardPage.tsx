import { useEffect, useState } from 'react';
import { getMyProperties } from '../../api/accommodation/propertyApi';
import { getReservations } from '../../api/accommodation/reservationApi';
import StatsCharts from '../../components/accommodation/dashboard/StatsCharts';

interface PropertySummary {
    _id: string;
    name: string;
    city?: string;
    published?: boolean;
}

interface ReservationSummary {
    _id: string;
    guestName?: string;
    status?: string;
    totalAmount?: number;
}

const DashboardPage = () => {
    const [properties, setProperties] = useState<PropertySummary[]>([]);
    const [reservations, setReservations] = useState<ReservationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertyResponse, reservationResponse] = await Promise.all([
                    getMyProperties(),
                    getReservations({ limit: 5 }),
                ]);
                setProperties(propertyResponse.properties || []);
                setReservations(reservationResponse.reservations || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Accommodation operations</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back to your hospitality hub</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                    Track live property activity, review recent reservations, and keep your team aligned with one streamlined portal.
                </p>
            </div>

            <StatsCharts />


            {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Properties</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{loading ? '...' : properties.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Reservations</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{loading ? '...' : reservations.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-300">Live</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Your properties</h3>
                        <span className="text-sm text-slate-400">Connected to backend</span>
                    </div>
                    {loading ? (
                        <p className="text-sm text-slate-400">Loading your properties...</p>
                    ) : properties.length === 0 ? (
                        <p className="text-sm text-slate-400">No properties yet. Create one to get started.</p>
                    ) : (
                        <div className="space-y-3">
                            {properties.map((property) => (
                                <div key={property._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-white">{property.name}</p>
                                            <p className="text-sm text-slate-400">{property.city || 'Location pending'}</p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs ${property.published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                                            {property.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Recent reservations</h3>
                        <span className="text-sm text-slate-400">Latest activity</span>
                    </div>
                    {loading ? (
                        <p className="text-sm text-slate-400">Loading recent reservations...</p>
                    ) : reservations.length === 0 ? (
                        <p className="text-sm text-slate-400">No reservations yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {reservations.map((reservation) => (
                                <div key={reservation._id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-white">{reservation.guestName || 'Guest'}</p>
                                            <p className="text-sm text-slate-400">{reservation.status || 'Pending'}</p>
                                        </div>
                                        <span className="text-sm text-emerald-300">{reservation.totalAmount ? `$${reservation.totalAmount}` : '—'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
