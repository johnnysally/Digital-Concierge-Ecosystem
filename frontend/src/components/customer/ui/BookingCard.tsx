import React from "react";
import { Booking } from "../../../types/customer";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-slate-900/20">
      <img src={booking.thumbnail} alt={booking.propertyName} className="mb-4 h-48 w-full rounded-2xl object-cover" />
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{booking.propertyName}</h3>
            <p className="text-sm text-slate-400">{booking.location}</p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">
            {booking.status}
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stay</p>
            <p className="mt-1 text-sm text-slate-300">{formatDate(booking.checkIn)} � {formatDate(booking.checkOut)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nights</p>
            <p className="mt-1 text-sm text-slate-300">{booking.nights}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
            <p className="mt-1 text-sm text-slate-100">{formatCurrency(booking.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
