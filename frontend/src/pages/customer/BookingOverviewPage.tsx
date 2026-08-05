import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import BookingCard from '../../components/customer/ui/BookingCard';
import { useBookingContext } from '../../context/customer/BookingContext';
import { cancelBooking } from '../../api/customer/bookingApi';
import { api } from '../../api/axios';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const BookingOverviewPage = () => {
    const { bookings } = useBookingContext();
    const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'rides'>('bookings');
    const [orders, setOrders] = useState<any[]>([]);
    const [rides, setRides] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingRides, setLoadingRides] = useState(false);

    useEffect(() => {
        if (activeTab === 'orders') {
            setLoadingOrders(true);
            api.get('/customer/orders')
                .then((res) => setOrders(res.data.orders || []))
                .catch(() => setOrders([]))
                .finally(() => setLoadingOrders(false));
        }
        if (activeTab === 'rides') {
            setLoadingRides(true);
            api.get('/customer/rides')
                .then((res) => setRides(res.data.rides || []))
                .catch(() => setRides([]))
                .finally(() => setLoadingRides(false));
        }
    }, [activeTab]);

    const handleCancel = async (id: string) => {
        if (confirm('Cancel this booking?')) {
            try { await cancelBooking(id); window.location.reload(); } catch {}
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-amber-500/15 text-amber-300', confirmed: 'bg-emerald-500/15 text-emerald-300',
            preparing: 'bg-sky-500/15 text-sky-300', ready: 'bg-violet-500/15 text-violet-300',
            out_for_delivery: 'bg-orange-500/15 text-orange-300', delivered: 'bg-emerald-500/15 text-emerald-300',
            cancelled: 'bg-rose-500/15 text-rose-300', completed: 'bg-emerald-500/15 text-emerald-300',
            requested: 'bg-amber-500/15 text-amber-300', accepted: 'bg-sky-500/15 text-sky-300',
            in_progress: 'bg-orange-500/15 text-orange-300', checked_in: 'bg-sky-500/15 text-sky-300',
            checked_out: 'bg-violet-500/15 text-violet-300',
        };
        return colors[status] || 'bg-slate-500/15 text-slate-400';
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Your bookings" subtitle="Manage your stays, orders, and rides across Digital Safaris." />

            <div className="flex gap-2 flex-wrap">
                {[
                    { key: 'bookings', label: '🏨 Stays', count: bookings.length },
                    { key: 'orders', label: '🍽️ Orders', count: orders.length },
                    { key: 'rides', label: '🚗 Rides', count: rides.length },
                ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {activeTab === 'bookings' && (
                bookings.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-white">No bookings yet</h3>
                        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">Start planning your next trip. Browse accommodations and book your stay.</p>
                        <Link to="/search" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">🔍 Find Accommodation</Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking: any) => (
                            <div key={booking._id}>
                                <BookingCard booking={booking} />
                                <div className="flex gap-3 mt-2">
                                    {booking.status !== 'cancelled' && booking.status !== 'completed' && booking.status !== 'checked_out' && (
                                        <button onClick={() => handleCancel(booking._id)} className="text-xs text-rose-400 hover:text-rose-300">Cancel Booking</button>
                                    )}
                                    {(booking.status === 'completed' || booking.status === 'checked_out') && (
                                        <Link to={`/reviews?bookingId=${booking._id}&propertyId=${booking.property?._id}&name=${encodeURIComponent(booking.property?.name || '')}`}
                                            className="text-xs text-amber-400 hover:text-amber-300">⭐ Leave a Review</Link>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <span className="text-xs text-sky-400">✓ Confirmed</span>
                                    )}
                                    {booking.status === 'pending' && (
                                        <span className="text-xs text-amber-400">⏳ Awaiting confirmation</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === 'orders' && (
                loadingOrders ? <div className="text-slate-400 py-8 text-center">Loading orders...</div> :
                orders.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-white">No orders yet</h3>
                        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">Browse restaurants and place your first order.</p>
                        <Link to="/food" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500">🍽️ Order Food</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <div key={order._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-lg font-semibold text-white">{order.partner?.businessName || 'Restaurant'}</p>
                                        <p className="text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                        {(order.status || 'pending').replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {order.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-slate-300">{item.name} x{item.quantity}</span>
                                            <span className="text-slate-400">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 pt-4 border-t border-slate-800">
                                    <span className="text-sm text-slate-400">Total</span>
                                    <span className="text-lg font-bold text-white">{formatCurrency(order.total)}</span>
                                </div>
                                {order.deliveryAddress?.street && (
                                    <p className="text-xs text-slate-500 mt-2">📍 {order.deliveryAddress.street}{order.deliveryAddress.city ? ', ' + order.deliveryAddress.city : ''}</p>
                                )}
                                <div className="flex gap-3 mt-3">
                                    {order.status === 'delivered' && (
                                        <Link to={`/reviews?orderId=${order._id}&restaurantId=${order.partner?._id}&name=${encodeURIComponent(order.partner?.businessName || '')}`}
                                            className="text-xs text-amber-400 hover:text-amber-300">⭐ Leave Review</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === 'rides' && (
                loadingRides ? <div className="text-slate-400 py-8 text-center">Loading rides...</div> :
                rides.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-white">No rides yet</h3>
                        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">Book your first ride and track it here.</p>
                        <Link to="/transport" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">🚗 Book a Ride</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rides.map((ride: any) => (
                            <div key={ride._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-lg font-semibold text-white capitalize">{ride.vehicle?.make} {ride.vehicle?.model}</p>
                                        <p className="text-xs text-slate-400">{ride.vehicle?.plateNumber} · {ride.vehicle?.type}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(ride.status)}`}>
                                        {(ride.status || 'requested').replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                                    <div><p className="text-slate-400">Pickup</p><p className="text-white mt-1">{ride.pickup?.address || 'N/A'}</p></div>
                                    <div><p className="text-slate-400">Dropoff</p><p className="text-white mt-1">{ride.dropoff?.address || 'N/A'}</p></div>
                                </div>
                                <div className="flex justify-between mt-4 pt-4 border-t border-slate-800">
                                    <span className="text-sm text-slate-400">Fare</span>
                                    <span className="text-lg font-bold text-white">{formatCurrency(ride.fare?.total || ride.totalAmount)}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">{formatDate(ride.createdAt)}</p>
                                <div className="flex gap-3 mt-3">
                                    {ride.status === 'completed' && (
                                        <Link to={`/reviews?rideId=${ride._id}&vehicleId=${ride.vehicle?._id}&name=${encodeURIComponent((ride.vehicle?.make + ' ' + ride.vehicle?.model) || '')}`}
                                            className="text-xs text-amber-400 hover:text-amber-300">⭐ Leave Review</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default BookingOverviewPage;