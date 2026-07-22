import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getProperty } from '../../api/customer/propertyApi';
import { createBooking } from '../../api/customer/bookingApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../context/customer/ThemeContext';
import { useAuth } from '../../context/customer/AuthContext';

const PropertyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { isAuthenticated } = useAuth();
    const [property, setProperty] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        getProperty(id)
            .then((res) => {
                setProperty(res.property);
                setRooms(res.rooms || []);
            })
            .catch(() => setError('Unable to load property.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleBook = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        if (!selectedRoom) { setError('Please select a room.'); return; }
        if (!checkIn || !checkOut) { setError('Please select check-in and check-out dates.'); return; }
        if (new Date(checkOut) <= new Date(checkIn)) { setError('Check-out must be after check-in.'); return; }
        if (new Date(checkIn) < new Date(new Date().setHours(0, 0, 0, 0))) { setError('Check-in date cannot be in the past.'); return; }
        setBooking(true);
        setError('');
        setMessage('');
        try {
            await createBooking({
                propertyId: property._id,
                roomId: selectedRoom._id,
                checkIn,
                checkOut,
                guests,
                specialRequests,
            });
            setMessage('Booking confirmed! View it in your bookings page.');
            setSelectedRoom(null);
            setCheckIn('');
            setCheckOut('');
            setSpecialRequests('');
            setGuests(1);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    const cardClass = isDark ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-gray-200 bg-white p-6 shadow-sm';
    const inputClass = isDark ? 'rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500' : 'rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500';

    if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading property...</div>;
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
                                    <img key={index} src={photo} alt={`${property.name} ${index + 1}`}
                                        className="h-48 w-full rounded-2xl object-cover" />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={cardClass}>
                        <h3 className="text-lg font-semibold text-white">About</h3>
                        <p className="mt-3 text-sm text-slate-400">{property.description || 'A wonderful place to stay.'}</p>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {property.amenities?.map((a: string) => (
                                <span key={a} className={`rounded-full px-3 py-1 text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-slate-600'}`}>{a}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                            <div><p className="text-slate-400">Check-in</p><p className="text-white font-medium">{property.checkInTime || '14:00'}</p></div>
                            <div><p className="text-slate-400">Check-out</p><p className="text-white font-medium">{property.checkOutTime || '11:00'}</p></div>
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h3 className="text-lg font-semibold text-white">Available Rooms ({rooms.length})</h3>
                        <div className="mt-4 space-y-3">
                            {rooms.length === 0 ? (
                                <p className="text-sm text-slate-400">No rooms available at the moment.</p>
                            ) : (
                                rooms.map((room) => (
                                    <div key={room._id} onClick={() => setSelectedRoom(room)}
                                        className={`p-4 rounded-xl cursor-pointer border-2 transition-colors ${selectedRoom?._id === room._id ? 'border-sky-500 bg-sky-500/10' : isDark ? 'border-slate-800 bg-slate-950 hover:border-sky-700' : 'border-gray-200 bg-gray-50 hover:border-sky-300'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-white capitalize">{room.type} - Room {room.roomNumber}</p>
                                                <p className="text-xs text-slate-400 mt-1">Capacity: {room.capacity} guests</p>
                                                <div className="flex gap-2 mt-2">
                                                    {room.amenities?.slice(0, 3).map((a: string) => (
                                                        <span key={a} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-200 text-slate-500'}`}>{a}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white">{formatCurrency(room.price)}</p>
                                                <p className="text-xs text-slate-400">per night</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`${cardClass} sticky top-24`}>
                        <h3 className="text-lg font-semibold text-white">Book This Property</h3>
                        {!isAuthenticated ? (
                            <div className="mt-4">
                                <p className="text-sm text-slate-400 mb-4">Please log in to book.</p>
                                <Link to="/login" className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 block text-center">Login to Book</Link>
                            </div>
                        ) : (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Selected Room</label>
                                    <div className={inputClass}>{selectedRoom ? `${selectedRoom.type} - Room ${selectedRoom.roomNumber}` : 'Select a room above'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Check-in *</label>
                                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Check-out *</label>
                                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Guests</label>
                                    <select value={guests} onChange={(e) => setGuests(+e.target.value)} className={inputClass}>
                                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Special Requests</label>
                                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}
                                        placeholder="Any special requests, late check-in, etc."
                                        rows={2}
                                        className={inputClass + ' resize-none'} />
                                </div>
                                {selectedRoom && checkIn && checkOut && (
                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">{formatCurrency(selectedRoom.price)} × {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))} nights</span>
                                            <span className="text-white font-bold">{formatCurrency(selectedRoom.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))))}</span>
                                        </div>
                                    </div>
                                )}
                                <button onClick={handleBook} disabled={booking || !selectedRoom || !checkIn || !checkOut}
                                    className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    {booking ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailPage;