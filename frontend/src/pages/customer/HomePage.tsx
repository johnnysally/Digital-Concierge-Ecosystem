import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/customer/ui/MetricCard';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { useAuth } from '../../context/customer/AuthContext';
import { useBookingContext } from '../../context/customer/BookingContext';
import { useWalletContext } from '../../context/customer/WalletContext';
import { useTheme } from '../../context/customer/ThemeContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';

const HomePage = () => {
    const { user } = useAuth();
    const { bookings } = useBookingContext();
    const { balance, currency } = useWalletContext();
    const { isDark } = useTheme();
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

    return (
        <div className="space-y-8">
            <section className={`relative overflow-hidden rounded-[32px] border p-6 shadow-[0_24px_70px_-32px_rgba(14,116,144,0.55)] sm:p-8 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-white bg-white/85'}`}>
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
                <div className="absolute -bottom-28 right-28 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${isDark ? 'border-sky-400/20 bg-sky-400/10 text-sky-200' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Your travel desk
                        </p>
                        <SectionHeader
                            title={`Welcome back, ${user?.firstName ?? 'traveler'}`}
                            subtitle="Everything for a seamless stay, great food, and effortless rides—organized in one place."
                        />
                        <div className="flex flex-wrap gap-3">
                            <Link to="/search" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400">
                                Find a stay <span aria-hidden="true">→</span>
                            </Link>
                            <Link to="/transport" className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50'}`}>
                                Plan a ride <span aria-hidden="true">↗</span>
                            </Link>
                        </div>
                    </div>
                    <div className={`grid min-w-[220px] grid-cols-2 gap-3 rounded-3xl border p-4 backdrop-blur ${isDark ? 'border-slate-700 bg-slate-950/50' : 'border-white bg-white/60'}`}>
                        <div>
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Next up</p>
                            <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{bookings.length ? 'Your stay' : 'Explore Kenya'}</p>
                        </div>
                        <div className="border-l border-slate-200/70 pl-3 dark:border-slate-700">
                            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rewards</p>
                            <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{user?.loyaltyPoints || stats.points || 0} pts</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    label="Active Trips"
                    value={bookings.length || stats.trips}
                    icon="🧳"
                    className={`border ${isDark ? 'border-slate-800 bg-slate-900/95 shadow-slate-950/20' : 'border-slate-200 bg-white shadow-slate-200/70'}`}
                    isDark={isDark}
                />
                <MetricCard
                    label="Loyalty Points"
                    value={user?.loyaltyPoints || stats.points || 0}
                    icon="🏅"
                    className={`border ${isDark ? 'border-amber-500/20 bg-slate-900/95 shadow-amber-950/15' : 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-amber-100/80'}`}
                    isDark={isDark}
                />
                <MetricCard
                    label="Wallet"
                    value={formatCurrency(balance, currency)}
                    icon="💰"
                    className={`border ${isDark ? 'border-emerald-500/20 bg-slate-900/95 shadow-emerald-950/15' : 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-emerald-100/80'}`}
                    isDark={isDark}
                />
                <MetricCard
                    label="Recommendations"
                    value={recommendations.length || 'New'}
                    icon="💡"
                    className={`border ${isDark ? 'border-sky-500/20 bg-slate-900/95 shadow-sky-950/15' : 'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-50 shadow-sky-100/80'}`}
                    isDark={isDark}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm ${isDark ? 'border-sky-500/20 bg-gradient-to-br from-slate-900 to-slate-900' : 'border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white'}`}>
                    <div className="absolute right-5 top-4 text-5xl opacity-10">✦</div>
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span>🤖</span> AI Concierge
                    </h3>
                    <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Plan your next adventure, get personalized accommodations, dining and transport recommendations.
                    </p>
                    <Link to="/chat"
                        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-500">
                        Start chat <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span>👤</span> Your Profile
                    </h3>
                    <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Manage your bookings, wallet, payment methods, and travel preferences in one place.
                    </p>
                    <Link to="/profile"
                        className={`mt-6 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold transition ${isDark ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        View profile
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Link to="/search"
                    className={`rounded-3xl border p-6 transition-all duration-300 group shadow-sm hover:-translate-y-1 hover:shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/95 hover:border-emerald-700' : 'border-slate-200 bg-white hover:border-emerald-300'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>🏨 Discover Stays</h3>
                    <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Explore hotels, BnBs, and apartments across the DigitalSafaris network.</p>
                    <span className={`mt-4 inline-flex items-center text-sm font-semibold ${isDark ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-500'}`}>
                        Search now →
                    </span>
                </Link>

                <Link to="/food"
                    className={`rounded-3xl border p-6 transition-all duration-300 group shadow-sm hover:-translate-y-1 hover:shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/95 hover:border-orange-700' : 'border-slate-200 bg-white hover:border-orange-300'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>🍽️ Food Delivery</h3>
                    <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Browse restaurant menus and order from partner kitchens in real time.</p>
                    <span className={`mt-4 inline-flex items-center text-sm font-semibold ${isDark ? 'text-orange-400 group-hover:text-orange-300' : 'text-orange-600 group-hover:text-orange-500'}`}>
                        Order food →
                    </span>
                </Link>

                <Link to="/transport"
                    className={`rounded-3xl border p-6 transition-all duration-300 group shadow-sm hover:-translate-y-1 hover:shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/95 hover:border-sky-700' : 'border-slate-200 bg-white hover:border-sky-300'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>🚗 Transport</h3>
                    <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Request a ride, manage transfers and track drivers on DigitalSafaris.</p>
                    <span className={`mt-4 inline-flex items-center text-sm font-semibold ${isDark ? 'text-sky-400 group-hover:text-sky-300' : 'text-sky-600 group-hover:text-sky-500'}`}>
                        Book transport →
                    </span>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
                        <Link to="/notifications" className={`text-xs ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'}`}>View all</Link>
                    </div>
                    <div className="mt-4 space-y-3">
                        {recentActivity.length > 0 ? recentActivity.slice(0, 3).map((activity: any, i: number) => (
                            <div key={i} className={`flex items-center gap-3 rounded-xl p-3 text-sm ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <span className="text-lg">{activity.icon || '📌'}</span>
                                <div className="flex-1">
                                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{activity.title}</p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{activity.time}</p>
                                </div>
                            </div>
                        )) : (
                            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>No recent activity.</p>
                        )}
                    </div>
                </div>

                <div className={`rounded-3xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming Stays</h3>
                        <Link to="/bookings" className={`text-xs ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'}`}>View all</Link>
                    </div>
                    <div className="mt-4 space-y-3">
                        {bookings.length > 0 ? bookings.slice(0, 3).map((b: any) => (
                            <div key={b.id || b._id} className={`rounded-xl p-3 text-sm ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{b.propertyName || 'Upcoming stay'}</p>
                                <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{b.checkIn} - {b.checkOut}</p>
                                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${b.status === 'confirmed' ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700')}`}>
                                    {b.status}
                                </span>
                            </div>
                        )) : (
                            <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>No upcoming stays</p>
                                <Link to="/search" className={`mt-2 inline-block text-xs ${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'}`}>Book your first trip</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
