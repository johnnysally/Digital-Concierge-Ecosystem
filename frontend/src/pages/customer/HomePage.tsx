import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/customer/ui/MetricCard';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { useAuth } from '../../context/customer/AuthContext';
import { useBookingContext } from '../../context/customer/BookingContext';
import { useWalletContext } from '../../context/customer/WalletContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';

const HomePage = () => {
    const { user } = useAuth();
    const { bookings } = useBookingContext();
    const { balance, currency } = useWalletContext();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [stats, setStats] = useState({ trips: 0, points: 0, recommendations: 0 });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('digitalsafaris_customer');
        if (!stored) return;

        api.get('/customer/dashboard')
            .then((res) => {
                setStats(res.data.stats || stats);
                setRecommendations(res.data.recommendations || []);
                setRecentActivity(res.data.recentActivity || []);
            })
            .catch(() => {});
    }, []);

    const nextBooking = bookings?.[0] || null;

    return (
        <div className="space-y-8">
            <SectionHeader
                title={`Welcome back, ${user?.firstName ?? 'traveler'}`}
                subtitle="Your DigitalSafaris travel hub is ready for your next journey."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Active Trips"
                    value={bookings.length || stats.trips}
                    icon="🧳"
                    className="border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-lg shadow-slate-950/30"
                />
                <MetricCard
                    label="Loyalty Points"
                    value={user?.loyaltyPoints || stats.points || 0}
                    icon="🏅"
                    className="border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-lg shadow-amber-950/20"
                />
                <MetricCard
                    label="Wallet"
                    value={formatCurrency(balance, currency)}
                    icon="💰"
                    className="border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-lg shadow-emerald-950/20"
                />
                <MetricCard
                    label="Recommendations"
                    value={recommendations.length || 'New'}
                    icon="💡"
                    className="border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-lg shadow-sky-950/20"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>🤖</span> AI Concierge
                    </h3>
                    <p className="mt-3 text-sm text-slate-400">
                        Plan your next adventure, get personalized accommodations, dining and transport recommendations.
                    </p>
                    <Link to="/chat"
                        className="mt-6 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
                        Start chat
                    </Link>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>👤</span> Your Profile
                    </h3>
                    <p className="mt-3 text-sm text-slate-400">
                        Manage your bookings, wallet, payment methods, and travel preferences in one place.
                    </p>
                    <Link to="/profile"
                        className="mt-6 inline-flex rounded-2xl bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600">
                        View profile
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Link to="/search"
                    className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-emerald-700 transition-colors group">
                    <h3 className="text-lg font-semibold text-white">🏨 Discover Stays</h3>
                    <p className="mt-3 text-sm text-slate-400">Explore hotels, BnBs, and apartments across the DigitalSafaris network.</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
                        Search now →
                    </span>
                </Link>

                <Link to="/food"
                    className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-orange-700 transition-colors group">
                    <h3 className="text-lg font-semibold text-white">🍽️ Food Delivery</h3>
                    <p className="mt-3 text-sm text-slate-400">Browse restaurant menus and order from partner kitchens in real time.</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-orange-400 group-hover:text-orange-300">
                        Order food →
                    </span>
                </Link>

                <Link to="/transport"
                    className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 hover:border-sky-700 transition-colors group">
                    <h3 className="text-lg font-semibold text-white">🚗 Transport</h3>
                    <p className="mt-3 text-sm text-slate-400">Request a ride, manage transfers and track drivers on DigitalSafaris.</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-sky-400 group-hover:text-sky-300">
                        Book transport →
                    </span>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                        <Link to="/notifications" className="text-xs text-sky-400 hover:text-sky-300">View all</Link>
                    </div>
                    <div className="mt-4 space-y-3">
                        {recentActivity.length > 0 ? recentActivity.slice(0, 3).map((activity: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 text-sm">
                                <span className="text-lg">{activity.icon || '📌'}</span>
                                <div className="flex-1">
                                    <p className="text-slate-300">{activity.title}</p>
                                    <p className="text-xs text-slate-500">{activity.time}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500">No recent activity.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Upcoming Stays</h3>
                        <Link to="/bookings" className="text-xs text-sky-400 hover:text-sky-300">View all</Link>
                    </div>
                    <div className="mt-4 space-y-3">
                        {bookings.length > 0 ? bookings.slice(0, 3).map((b: any) => (
                            <div key={b.id || b._id} className="p-3 rounded-xl bg-slate-950 text-sm">
                                <p className="text-slate-300 font-medium">{b.propertyName || 'Upcoming stay'}</p>
                                <p className="text-xs text-slate-500 mt-1">{b.checkIn} - {b.checkOut}</p>
                                <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {b.status}
                                </span>
                            </div>
                        )) : (
                            <div className="p-4 rounded-xl bg-slate-950 text-center">
                                <p className="text-sm text-slate-500">No upcoming stays</p>
                                <Link to="/search" className="mt-2 inline-block text-xs text-sky-400 hover:text-sky-300">Book your first trip</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;