import React from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

interface BookingCardProps {
    booking: any;
}

const BookingCard = ({ booking }: BookingCardProps) => {
    const propertyName = booking.property?.name || 'Property';
    const location = booking.property?.address
        ? `${booking.property.address.city || ''}, ${booking.property.address.country || ''}`
        : 'Location not available';
    const checkIn = booking.checkIn || '';
    const checkOut = booking.checkOut || '';
    const nights = checkIn && checkOut
        ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
        : 0;
    const total = booking.totalAmount || 0;
    const status = booking.status || 'pending';
    const room = booking.room?.type && booking.room?.roomNumber
        ? `${booking.room.type} - Room ${booking.room.roomNumber}`
        : '';

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-slate-900/20 sm:p-5">
            {booking.property?.photos?.[0] && (
                <img src={booking.property.photos[0]} alt={propertyName}
                    className="mb-4 h-40 w-full rounded-2xl object-cover sm:h-48" />
            )}
            <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white">{propertyName}</h3>
                        <p className="mt-1 text-sm text-slate-400">{location}</p>
                        {room && <p className="mt-1 text-xs text-slate-500">{room}</p>}
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                        status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-300' :
                        status === 'cancelled' ? 'bg-rose-500/15 text-rose-300' :
                        status === 'completed' ? 'bg-sky-500/15 text-sky-300' :
                        'bg-amber-500/15 text-amber-300'
                    }`}>
                        {status}
                    </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stay</p>
                        <p className="mt-1 text-sm text-slate-300">{formatDate(checkIn)} – {formatDate(checkOut)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nights</p>
                        <p className="mt-1 text-sm text-slate-300">{nights}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                        <p className="mt-1 text-sm text-slate-100">{formatCurrency(total)}</p>
                    </div>
                </div>
                {booking.specialRequests && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-xs text-slate-500">Special Requests:</p>
                        <p className="mt-1 text-sm text-slate-400">{booking.specialRequests}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCard;