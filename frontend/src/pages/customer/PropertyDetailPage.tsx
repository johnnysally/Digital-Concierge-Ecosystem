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
    const [viewingPhotos, setViewingPhotos] = useState<string | null>(null);
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
            .then((res) => { setProperty(res.property); setRooms(res.rooms || []); })
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
            await createBooking({ propertyId: property._id, roomId: selectedRoom._id, checkIn, checkOut, guests, specialRequests });
            setMessage('Booking request sent! Awaiting partner confirmation.');
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
                                        className="h-48 w-full rounded-2xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setViewingPhotos(photo)} />
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
                        <div className="mt-4 space-y-4">
                            {rooms.length === 0 ? (
                                <p className="text-sm text-slate-400">No rooms available at the moment.</p>
                            ) : (
                                rooms.map((room) => (
                                    <div key={room._id} className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                                        selectedRoom?._id === room._id
                                            ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10'
                                            : isDark ? 'border-slate-800 bg-slate-950 hover:border-slate-700' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                    }`}>
                                        {room.photos?.length > 0 && (
                                            <div className="relative h-44 overflow-hidden cursor-pointer group"
                                                onClick={() => setSelectedRoom(selectedRoom?._id === room._id ? null : room)}>
                                                <img src={room.photos[0]} alt={`Room ${room.roomNumber}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                {room.photos.length > 1 && (
                                                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                        📷 {room.photos.length} photos
                                                    </span>
                                                )}
                                                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    Click to {selectedRoom?._id === room._id ? 'deselect' : 'select'}
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-white capitalize text-lg">{room.type} Room</p>
                                                    <p className="text-sm text-slate-400 mt-0.5">Room {room.roomNumber} · {room.capacity} guest{room.capacity > 1 ? 's' : ''}{room.floor ? ` · Floor ${room.floor}` : ''}</p>
                                                    <div className="flex gap-2 mt-3 flex-wrap">
                                                        {room.amenities?.slice(0, 4).map((a: string) => (
                                                            <span key={a} className={`text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-200 text-slate-600'}`}>{a}</span>
                                                        ))}
                                                        {(room.amenities?.length || 0) > 4 && (
                                                            <span className={`text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-200 text-slate-500'}`}>+{room.amenities.length - 4} more</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-2xl font-bold text-white">{formatCurrency(room.price)}</p>
                                                    <p className="text-xs text-slate-400">per night</p>
                                                    {room.status !== 'available' && (
                                                        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 capitalize">{room.status}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => setSelectedRoom(selectedRoom?._id === room._id ? null : room)}
                                                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                                        selectedRoom?._id === room._id
                                                            ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25'
                                                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-200 text-slate-600 hover:bg-gray-300'
                                                    }`}>
                                                    {selectedRoom?._id === room._id ? '✓ Selected' : 'Select This Room'}
                                                </button>
                                                {room.photos?.length > 0 && (
                                                    <button
                                                        onClick={() => setViewingPhotos(room.photos[0])}
                                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors bg-slate-800 text-slate-300 hover:bg-slate-700">
                                                        📷 View Photos
                                                    </button>
                                                )}
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
                                    <div className={inputClass}>
                                        {selectedRoom ? (
                                            <div className="flex items-center justify-between">
                                                <span>{selectedRoom.type} - Room {selectedRoom.roomNumber}</span>
                                                <button onClick={() => setSelectedRoom(null)} className="text-xs text-slate-500 hover:text-red-400">Clear</button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500">Select a room below</span>
                                        )}
                                    </div>
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
                                        rows={2} className={inputClass + ' resize-none'} />
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
                                    {booking ? 'Booking...' : 'Request Booking'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {viewingPhotos && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setViewingPhotos(null)}>
                    <div className="relative max-w-3xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <img src={viewingPhotos} alt="Room photo" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
                        <button onClick={() => setViewingPhotos(null)}
                            className="absolute top-4 right-4 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-black/80 transition-colors">
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetailPage;