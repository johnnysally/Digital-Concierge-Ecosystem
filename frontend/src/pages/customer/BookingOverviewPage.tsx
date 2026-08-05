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
    const [message, setMessage] = useState('');
    const [reportModal, setReportModal] = useState<any>(null);
    const [reportSubject, setReportSubject] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reporting, setReporting] = useState(false);
    const [reportedItems, setReportedItems] = useState<Set<string>>(new Set());
    const [myDisputes, setMyDisputes] = useState<any[]>([]);
    const [viewingDispute, setViewingDispute] = useState<any>(null);

    const fetchOrders = () => {
        setLoadingOrders(true);
        api.get('/customer/orders').then((res) => setOrders(res.data.orders || [])).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
    };

    const fetchRides = () => {
        setLoadingRides(true);
        api.get('/customer/rides').then((res) => setRides(res.data.rides || [])).catch(() => setRides([])).finally(() => setLoadingRides(false));
    };

    const fetchDisputes = () => {
        api.get('/customer/disputes/my').then((res) => {
            setMyDisputes(res.data.disputes || []);
            const reported = new Set<string>();
            res.data.disputes?.forEach((d: any) => {
                if (d.booking) reported.add(d.booking.toString());
                if (d.metadata?.type === 'order' && d.metadata.order?._id) reported.add(d.metadata.order._id.toString());
                if (d.metadata?.type === 'ride' && d.metadata.ride?._id) reported.add(d.metadata.ride._id.toString());
            });
            setReportedItems(reported);
        }).catch(() => {});
    };

    useEffect(() => { if (activeTab === 'orders') fetchOrders(); if (activeTab === 'rides') fetchRides(); }, [activeTab]);
    useEffect(() => { fetchDisputes(); }, []);

    const handleCancel = async (id: string) => {
        if (confirm('Cancel this booking?')) { try { await cancelBooking(id); window.location.reload(); } catch {} }
    };

    const handleConfirmReceipt = async (type: string, id: string) => {
        setMessage('');
        try { await api.put(`/customer/${type}/${id}/confirm-receipt`); setMessage('Receipt confirmed!'); if (type === 'orders') fetchOrders(); if (type === 'rides') fetchRides(); setTimeout(() => setMessage(''), 3000); }
        catch { setMessage('Failed to confirm.'); }
    };

    const handleReportIssue = (item: any, type: string) => { setReportModal({ ...item, type }); setReportSubject(''); setReportDescription(''); };

    const submitReport = async () => {
        if (!reportModal || !reportSubject.trim()) return;
        setReporting(true);
        try {
            await api.post('/customer/disputes', {
                subject: reportSubject, description: reportDescription,
                bookingId: reportModal.type === 'bookings' ? reportModal._id : undefined,
                orderId: reportModal.type === 'orders' ? reportModal._id : undefined,
                rideId: reportModal.type === 'rides' ? reportModal._id : undefined,
                partnerId: reportModal.property?.partner || reportModal.partner?._id || reportModal.vehicle?.partner,
                partnerModel: reportModal.type === 'bookings' ? 'AccommodationPartner' : reportModal.type === 'orders' ? 'RestaurantPartner' : 'TransportPartner',
            });
            setMessage('Issue reported. Admin will review.');
            fetchDisputes();
            setReportModal(null);
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('Failed to report.'); }
        finally { setReporting(false); }
    };

    const viewDispute = (itemId: string) => {
        const dispute = myDisputes.find(d =>
            d.booking?.toString() === itemId ||
            d.metadata?.order?._id?.toString() === itemId ||
            d.metadata?.ride?._id?.toString() === itemId
        );
        if (dispute) setViewingDispute(dispute);
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

    const tabs = [
        { key: 'bookings', label: '🏨 Stays', count: bookings.length },
        { key: 'orders', label: '🍽️ Orders', count: orders.length },
        { key: 'rides', label: '🚗 Rides', count: rides.length },
    ];

    return (
        <div className="space-y-8">
            <SectionHeader title="Your bookings" subtitle="Manage your stays, orders, and rides." />
            {message && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-400">{message}</div>}

            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {activeTab === 'bookings' && (bookings.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-6xl mb-4">📅</div><h3 className="text-xl font-semibold text-white">No bookings yet</h3><Link to="/search" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">🔍 Find Accommodation</Link></div>
            ) : (
                <div className="grid gap-6">{bookings.map((booking: any) => (
                    <div key={booking._id}><BookingCard booking={booking} />
                        <div className="flex gap-3 mt-2 flex-wrap">
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && booking.status !== 'checked_out' && <button onClick={() => handleCancel(booking._id)} className="text-xs text-rose-400 hover:text-rose-300">Cancel</button>}
                            {booking.status === 'checked_out' && <button onClick={() => handleConfirmReceipt('bookings', booking._id)} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">✓ Confirm Stay Complete</button>}
                            {(booking.status === 'completed' || booking.status === 'checked_out') && <Link to={`/reviews?bookingId=${booking._id}&propertyId=${booking.property?._id}&name=${encodeURIComponent(booking.property?.name || '')}`} className="text-xs text-amber-400 hover:text-amber-300">⭐ Leave Review</Link>}
                            {reportedItems.has(booking._id) ? <button onClick={() => viewDispute(booking._id)} className="text-xs text-orange-400 hover:text-orange-300 font-medium">🔍 View Dispute</button> : <button onClick={() => handleReportIssue(booking, 'bookings')} className="text-xs text-orange-400 hover:text-orange-300">🚩 Report Issue</button>}
                            {booking.status === 'confirmed' && <span className="text-xs text-sky-400">✓ Confirmed</span>}
                        </div>
                    </div>
                ))}</div>
            ))}

            {activeTab === 'orders' && (loadingOrders ? <div className="text-slate-400 py-8 text-center">Loading orders...</div> : orders.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-6xl mb-4">🍽️</div><h3 className="text-xl font-semibold text-white">No orders yet</h3><Link to="/food" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500">🍽️ Order Food</Link></div>
            ) : (
                <div className="space-y-4">{orders.map((order: any) => (
                    <div key={order._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <div className="flex items-center justify-between mb-3"><div><p className="text-lg font-semibold text-white">{order.partner?.businessName || 'Restaurant'}</p><p className="text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{(order.status || 'pending').replace('_', ' ')}</span></div>
                        <div className="space-y-2">{order.items?.map((item: any, i: number) => (<div key={i} className="flex justify-between text-sm"><span className="text-slate-300">{item.name} x{item.quantity}</span><span className="text-slate-400">{formatCurrency(item.price * item.quantity)}</span></div>))}</div>
                        <div className="flex justify-between mt-4 pt-4 border-t border-slate-800"><span className="text-sm text-slate-400">Total</span><span className="text-lg font-bold text-white">{formatCurrency(order.total)}</span></div>
                        {order.deliveryAddress?.street && <p className="text-xs text-slate-500 mt-2">📍 {order.deliveryAddress.street}{order.deliveryAddress.city ? ', ' + order.deliveryAddress.city : ''}</p>}
                        <div className="flex gap-3 mt-3 flex-wrap">
                            {order.status === 'delivered' && <button onClick={() => handleConfirmReceipt('orders', order._id)} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">✓ Confirm Receipt</button>}
                            {order.status === 'completed' && <Link to={`/reviews?orderId=${order._id}&restaurantId=${order.partner?._id}&name=${encodeURIComponent(order.partner?.businessName || '')}`} className="text-xs text-amber-400 hover:text-amber-300">⭐ Leave Review</Link>}
                            {reportedItems.has(order._id) ? <button onClick={() => viewDispute(order._id)} className="text-xs text-orange-400 hover:text-orange-300 font-medium">🔍 View Dispute</button> : <button onClick={() => handleReportIssue(order, 'orders')} className="text-xs text-orange-400 hover:text-orange-300">🚩 Report Issue</button>}
                        </div>
                    </div>
                ))}</div>
            ))}

            {activeTab === 'rides' && (loadingRides ? <div className="text-slate-400 py-8 text-center">Loading rides...</div> : rides.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-6xl mb-4">🚗</div><h3 className="text-xl font-semibold text-white">No rides yet</h3><Link to="/transport" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500">🚗 Book a Ride</Link></div>
            ) : (
                <div className="space-y-4">{rides.map((ride: any) => (
                    <div key={ride._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <div className="flex items-center justify-between mb-3"><div><p className="text-lg font-semibold text-white capitalize">{ride.vehicle?.make} {ride.vehicle?.model}</p><p className="text-xs text-slate-400">{ride.vehicle?.plateNumber} · {ride.vehicle?.type}</p></div><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(ride.status)}`}>{(ride.status || 'requested').replace('_', ' ')}</span></div>
                        <div className="grid gap-3 sm:grid-cols-2 text-sm"><div><p className="text-slate-400">Pickup</p><p className="text-white mt-1">{ride.pickup?.address || 'N/A'}</p></div><div><p className="text-slate-400">Dropoff</p><p className="text-white mt-1">{ride.dropoff?.address || 'N/A'}</p></div></div>
                        <div className="flex justify-between mt-4 pt-4 border-t border-slate-800"><span className="text-sm text-slate-400">Fare</span><span className="text-lg font-bold text-white">{formatCurrency(ride.fare?.total || ride.totalAmount)}</span></div>
                        <p className="text-xs text-slate-500 mt-2">{formatDate(ride.createdAt)}</p>
                        <div className="flex gap-3 mt-3 flex-wrap">
                            {(ride.status === 'completed' || ride.status === 'delivered') && <button onClick={() => handleConfirmReceipt('rides', ride._id)} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">✓ Confirm Ride Complete</button>}
                            {ride.status === 'completed' && <Link to={`/reviews?rideId=${ride._id}&vehicleId=${ride.vehicle?._id}&name=${encodeURIComponent((ride.vehicle?.make + ' ' + ride.vehicle?.model) || '')}`} className="text-xs text-amber-400 hover:text-amber-300">⭐ Leave Review</Link>}
                            {reportedItems.has(ride._id) ? <button onClick={() => viewDispute(ride._id)} className="text-xs text-orange-400 hover:text-orange-300 font-medium">🔍 View Dispute</button> : <button onClick={() => handleReportIssue(ride, 'rides')} className="text-xs text-orange-400 hover:text-orange-300">🚩 Report Issue</button>}
                        </div>
                    </div>
                ))}</div>
            ))}

            {reportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setReportModal(null)}>
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-white mb-4">🚩 Report an Issue</h3>
                        <div className="space-y-4">
                            <input value={reportSubject} onChange={(e) => setReportSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-orange-500" />
                            <textarea value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} placeholder="Describe what happened..." rows={4} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 resize-none" />
                            <div className="flex gap-3">
                                <button onClick={submitReport} disabled={reporting || !reportSubject.trim()} className="flex-1 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50">{reporting ? 'Submitting...' : 'Submit Report'}</button>
                                <button onClick={() => setReportModal(null)} className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-600">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewingDispute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setViewingDispute(null)}>
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Dispute Details</h3><button onClick={() => setViewingDispute(null)} className="text-slate-400 hover:text-white text-xl">×</button></div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-400">Subject</span><span className="text-white">{viewingDispute.subject}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-400">Status</span><span className={`px-2 py-0.5 rounded-full text-xs ${viewingDispute.status === 'open' ? 'bg-amber-500/20 text-amber-400' : viewingDispute.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : viewingDispute.status === 'closed' ? 'bg-slate-500/20 text-slate-400' : 'bg-sky-500/20 text-sky-400'}`}>{viewingDispute.status}</span></div>
                            <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-400">Priority</span><span className="text-white capitalize">{viewingDispute.priority}</span></div>
                            <div className="py-2"><span className="text-slate-400">Description</span><p className="mt-1 text-slate-300">{viewingDispute.description || 'No description'}</p></div>
                            {viewingDispute.resolution && <div className="py-2 border-t border-slate-800"><span className="text-slate-400">Resolution</span><p className="mt-1 text-emerald-400">{viewingDispute.resolution}</p></div>}
                            {viewingDispute.metadata?.replies?.length > 0 && (
                                <div className="py-2 border-t border-slate-800"><span className="text-slate-400 font-medium">Replies</span>
                                    <div className="mt-2 space-y-2">{viewingDispute.metadata.replies.map((reply: any, i: number) => (
                                        <div key={i} className="bg-slate-800 rounded-xl p-3"><p className="text-xs text-slate-400">{reply.from} · {reply.by} · {new Date(reply.date).toLocaleString()}</p><p className="mt-1 text-sm text-slate-200">{reply.message}</p></div>
                                    ))}</div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setViewingDispute(null)} className="mt-4 w-full rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-600">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingOverviewPage;