import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getProperty } from '../../api/customer/propertyApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../context/customer/ThemeContext';
import { useAuth } from '../../context/customer/AuthContext';
import PaymentModal from '../../components/customer/ui/PaymentModal';

const PropertyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { isAuthenticated } = useAuth();
    const [property, setProperty] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [viewingPhotos, setViewingPhotos] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        if (!id) return;
        getProperty(id)
            .then((res) => { setProperty(res.property); setRooms(res.rooms || []); })
            .catch(() => setError('Unable to load property.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handlePayNow = () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        if (!selectedRoom) { setError('Please select a room.'); return; }
        if (!checkIn || !checkOut) { setError('Please select dates.'); return; }
        if (new Date(checkOut) <= new Date(checkIn)) { setError('Check-out must be after check-in.'); return; }
        if (new Date(checkIn) < new Date(new Date().setHours(0, 0, 0, 0))) { setError('Check-in cannot be in the past.'); return; }
        setError('');
        const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
        setPaymentAmount(selectedRoom.price * nights);
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setSelectedRoom(null);
        setCheckIn(''); setCheckOut(''); setSpecialRequests(''); setGuests(1);
        setMessage('Booking confirmed! View it in your bookings.');
    };

    const cardClass = isDark ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-gray-200 bg-white p-6 shadow-sm';
    const inputClass = isDark ? 'rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500' : 'rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500';

    if (loading) return <div className="p-8 text-center text-slate-400">Loading property...</div>;
    if (!property) return <div className="p-8 text-center text-slate-400">Property not found.</div>;

    return (
        <div className="space-y-8">
            <SectionHeader title={property.name} subtitle={`${property.type} · ${property.address?.city}, ${property.address?.country}`} />

            {(message || error) && (
                <div className={`rounded-xl p-4 text-sm ${message ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                    {message || error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {property.photos?.length > 0 && (
                        <div className={cardClass}>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {property.photos.slice(0, 4).map((photo: string, index: number) => (
                                    <img key={index} src={photo} alt={`${property.name} ${index + 1}`} className="h-48 w-full rounded-2xl object-cover cursor-pointer" onClick={() => setViewingPhotos(photo)} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={cardClass}>
                        <h3 className="text-lg font-semibold text-white">About</h3>
                        <p className="mt-3 text-sm text-slate-400">{property.description || 'A wonderful place to stay.'}</p>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {property.amenities?.map((a: string) => <span key={a} className={`rounded-full px-3 py-1 text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-slate-600'}`}>{a}</span>)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                            <div><p className="text-slate-400">Check-in</p><p className="text-white font-medium">{property.checkInTime || '14:00'}</p></div>
                            <div><p className="text-slate-400">Check-out</p><p className="text-white font-medium">{property.checkOutTime || '11:00'}</p></div>
                        </div>
                    </div>
                    <div className={cardClass}>
                        <h3 className="text-lg font-semibold text-white">Available Rooms ({rooms.length})</h3>
                        <div className="mt-4 space-y-4">
                            {rooms.length === 0 ? <p className="text-sm text-slate-400">No rooms available.</p> : rooms.map((room) => (
                                <div key={room._id} onClick={() => setSelectedRoom(room)}
                                    className={`rounded-xl cursor-pointer border-2 transition-all overflow-hidden ${selectedRoom?._id === room._id ? 'border-sky-500 bg-sky-500/10' : isDark ? 'border-slate-800 bg-slate-950' : 'border-gray-200 bg-gray-50'}`}>
                                    {room.photos?.length > 0 && <div className="relative h-44 overflow-hidden"><img src={room.photos[0]} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover" /></div>}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-white text-lg">{room.type} Room</p>
                                                <p className="text-sm text-slate-400">Room {room.roomNumber} · {room.capacity} guest{room.capacity > 1 ? 's' : ''}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-2xl font-bold text-white">{formatCurrency(room.price)}</p>
                                                <p className="text-xs text-slate-400">per night</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedRoom(selectedRoom?._id === room._id ? null : room)}
                                            className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold ${selectedRoom?._id === room._id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                            {selectedRoom?._id === room._id ? '✓ Selected' : 'Select This Room'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className={`${cardClass} sticky top-24`}>
                        <h3 className="text-lg font-semibold text-white">Book This Property</h3>
                        {!isAuthenticated ? (
                            <div className="mt-4"><p className="text-sm text-slate-400 mb-4">Please log in to book.</p><Link to="/login" className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white block text-center">Login to Book</Link></div>
                        ) : (
                            <div className="mt-4 space-y-4">
                                <div><label className="block text-sm text-slate-400 mb-2">Selected Room</label><div className={inputClass}>{selectedRoom ? `${selectedRoom.type} - Room ${selectedRoom.roomNumber}` : 'Select a room'}</div></div>
                                <div><label className="block text-sm text-slate-400 mb-2">Check-in *</label><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={inputClass} /></div>
                                <div><label className="block text-sm text-slate-400 mb-2">Check-out *</label><input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={inputClass} /></div>
                                <div><label className="block text-sm text-slate-400 mb-2">Guests</label><select value={guests} onChange={(e) => setGuests(+e.target.value)} className={inputClass}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                                <div><label className="block text-sm text-slate-400 mb-2">Special Requests</label><textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} className={inputClass + ' resize-none'} /></div>
                                {selectedRoom && checkIn && checkOut && (
                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">{formatCurrency(selectedRoom.price)} × {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))} nights</span>
                                            <span className="text-white font-bold">{formatCurrency(selectedRoom.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))))}</span>
                                        </div>
                                    </div>
                                )}
                                <button onClick={handlePayNow} disabled={!selectedRoom || !checkIn || !checkOut}
                                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                                    Pay Now - {selectedRoom && checkIn && checkOut ? formatCurrency(selectedRoom.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))) : formatCurrency(0)}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {viewingPhotos && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setViewingPhotos(null)}>
                    <div className="relative max-w-3xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <img src={viewingPhotos} alt="Photo" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
                        <button onClick={() => setViewingPhotos(null)} className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl">×</button>
                    </div>
                </div>
            )}

            {showPayment && (
                <PaymentModal
                    amount={paymentAmount}
                    bookingData={{
                        propertyId: property._id,
                        roomId: selectedRoom._id,
                        checkIn, checkOut, guests, specialRequests,
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                />
            )}
        </div>
    );
};

export default PropertyDetailPage;